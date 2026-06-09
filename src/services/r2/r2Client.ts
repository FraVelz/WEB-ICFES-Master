import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { SdkStreamMixin } from '@smithy/types';
import { buildR2ObjectKeyCandidates, getR2ServerConfig } from './r2Config';

let client: S3Client | null = null;

function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as { name?: string; Code?: string; $metadata?: { httpStatusCode?: number } };
  return (
    err.name === 'NoSuchKey' ||
    err.Code === 'NoSuchKey' ||
    err.name === 'NotFound' ||
    err.$metadata?.httpStatusCode === 404
  );
}

export function getR2Client(): S3Client | null {
  const config = getR2ServerConfig();
  if (!config) return null;

  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  return client;
}

export type R2ObjectResult = {
  key: string;
  body: SdkStreamMixin;
  contentType: string;
  contentLength?: number;
};

export class R2ObjectNotFoundError extends Error {
  readonly triedKeys: string[];

  constructor(filename: string, triedKeys: string[]) {
    super(`PDF no encontrado en R2: ${filename}`);
    this.name = 'R2ObjectNotFoundError';
    this.triedKeys = triedKeys;
  }
}

async function fetchR2ObjectByKey(
  s3: S3Client,
  bucket: string,
  key: string
): Promise<R2ObjectResult | null> {
  try {
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    if (!response.Body) return null;

    return {
      key,
      body: response.Body,
      contentType: response.ContentType ?? 'application/pdf',
      contentLength: response.ContentLength,
    };
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

async function fetchFirstAvailableKey(
  s3: S3Client,
  bucket: string,
  keys: string[],
  index = 0
): Promise<R2ObjectResult | null> {
  if (index >= keys.length) return null;

  const result = await fetchR2ObjectByKey(s3, bucket, keys[index]!);
  if (result) return result;

  return fetchFirstAvailableKey(s3, bucket, keys, index + 1);
}

export async function fetchR2Object(filename: string): Promise<R2ObjectResult> {
  const config = getR2ServerConfig();
  const s3 = getR2Client();
  if (!config || !s3) {
    throw new Error('R2 no configurado en el servidor');
  }

  const candidateKeys = buildR2ObjectKeyCandidates(filename);
  const result = await fetchFirstAvailableKey(s3, config.bucket, candidateKeys);
  if (result) return result;

  throw new R2ObjectNotFoundError(filename, candidateKeys);
}

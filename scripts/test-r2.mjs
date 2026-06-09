#!/usr/bin/env node
import { config } from 'dotenv';
import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../.env') });
config({ path: path.join(__dirname, '../.env.local') });

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME;

const client = new S3Client({
  region: 'auto',
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
});

const filename = '15-septiembre-infografia-generalidades-examen-saber-11.pdf';
const prefixes = [
  'acerca-de-icfes-11-pdfs',
  'acerca-deicfes-11-pdfs',
  'icfes-recursos/acerca-de-icfes-11-pdfs',
  '',
];

console.log('Bucket:', bucket);
console.log('Endpoint:', endpoint);
console.log('');

try {
  const list = await client.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 20 }));
  console.log('Objects in bucket (first 20):');
  for (const obj of list.Contents ?? []) {
    console.log(' -', obj.Key);
  }
  if (!list.Contents?.length) console.log(' (empty or no permission to list)');
} catch (e) {
  console.log('List error:', e.name, e.message);
}

console.log('');
for (const prefix of prefixes) {
  const key = prefix ? `${prefix}/${filename}` : filename;
  try {
    const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    console.log(`OK  ${key} (${res.ContentLength} bytes)`);
  } catch (e) {
    console.log(`ERR ${key} -> ${e.name}: ${e.message}`);
  }
}

const DEFAULT_PDF_PREFIX = 'acerca-de-icfes-11-pdfs';

function readEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function isR2ServerConfigured(): boolean {
  return Boolean(
    readEnv('R2_ENDPOINT', 'NEXT_PUBLIC_R2_ENDPOINT') &&
    readEnv('R2_ACCESS_KEY_ID', 'R2_ACCESS_KEY') &&
    readEnv('R2_SECRET_ACCESS_KEY', 'R2_SECRET_KEY') &&
    readEnv('R2_BUCKET_NAME')
  );
}

export function getR2ServerConfig() {
  const endpoint = readEnv('R2_ENDPOINT', 'NEXT_PUBLIC_R2_ENDPOINT');
  const accessKeyId = readEnv('R2_ACCESS_KEY_ID', 'R2_ACCESS_KEY');
  const secretAccessKey = readEnv('R2_SECRET_ACCESS_KEY', 'R2_SECRET_KEY');
  const bucket = readEnv('R2_BUCKET_NAME');
  const prefix = (readEnv('R2_PDF_PREFIX', 'NEXT_PUBLIC_R2_PDF_PREFIX') || DEFAULT_PDF_PREFIX).replace(
    /^\/+|\/+$/g,
    ''
  );

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }

  return { endpoint, accessKeyId, secretAccessKey, bucket, prefix };
}

/** Rutas posibles en el bucket (prefijo configurado + variantes habituales). */
export function buildR2ObjectKeyCandidates(filename: string): string[] {
  const config = getR2ServerConfig();
  const prefixes = [config?.prefix, DEFAULT_PDF_PREFIX, 'acerca-deicfes-11-pdfs', ''].filter(
    (value, index, list) => value !== undefined && list.indexOf(value) === index
  ) as string[];

  const keys = new Set<string>();
  for (const rawPrefix of prefixes) {
    const folder = rawPrefix.replace(/^\/+|\/+$/g, '');
    keys.add(folder ? `${folder}/${filename}` : filename);
  }

  return [...keys];
}

export function buildR2ObjectKey(filename: string, prefix?: string): string {
  return (
    buildR2ObjectKeyCandidates(filename).find((key) => {
      const folder = (prefix ?? getR2ServerConfig()?.prefix ?? DEFAULT_PDF_PREFIX).replace(/^\/+|\/+$/g, '');
      return key === (folder ? `${folder}/${filename}` : filename);
    }) ?? buildR2ObjectKeyCandidates(filename)[0]
  );
}

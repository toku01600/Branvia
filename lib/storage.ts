import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getCloudFrontSignedUrl } from '@aws-sdk/cloudfront-signer';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function uploadBuffer(key: string, buffer: Buffer, contentType='application/zip'){
  const Bucket = process.env.S3_BUCKET!;
  await s3.send(new PutObjectCommand({ Bucket, Key: key, Body: buffer, ContentType: contentType }));
}

export async function signDownloadUrl(key: string, ttlSec = 1800){
  const mode = process.env.DELIVERY_MODE || 'r2';
  if(mode === 'cloudfront'){
    const url = `${process.env.CLOUDFRONT_URL?.replace(/\/$/,'')}/${key}`;
    const signedUrl = getCloudFrontSignedUrl({
      url,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
      dateLessThan: new Date(Date.now() + ttlSec*1000)
    });
    return signedUrl;
  } else {
    const url = await getS3SignedUrl(s3, new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key
    }), { expiresIn: ttlSec });
    return url;
  }
}

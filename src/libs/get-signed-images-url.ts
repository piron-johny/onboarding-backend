import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const s3Client = new S3Client({ region: 'us-east-1' });
import { Image } from '@/types';

const getSignedUrlByImageKey = async (
  bucketName: string,
  imageKey: string,
  expiresIn: number,
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: imageKey,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
};

export const getSignedUrlsForImages = async (
  bucketName: string,
  images: Image[],
  expiresIn: number,
): Promise<Image[]> => {
  const signedUrlPromises = images.map(async (image) => {
    const signedUrl = await getSignedUrlByImageKey(
      bucketName,
      image.url,
      expiresIn,
    );
    return { ...image, url: signedUrl };
  });
  return Promise.all(signedUrlPromises);
};

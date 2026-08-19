// New function — Base44 handled file storage for you automatically
// (UploadFile integration); on AWS, the frontend uploads ad photos directly
// to S3 using a short-lived presigned URL generated here.
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { json, getUserFromEvent, newId } from '../_lib/common.mjs';

const s3 = new S3Client({});

export const handler = async (event) => {
  try {
    const user = await getUserFromEvent(event);
    if (!user) return json(401, { error: 'Unauthorized' });

    const { filename, contentType } = JSON.parse(event.body || '{}');
    if (!filename || !contentType) return json(400, { error: 'filename and contentType are required' });
    if (!contentType.startsWith('image/')) return json(400, { error: 'Only image uploads are allowed' });

    const ext = filename.split('.').pop().replace(/[^a-z0-9]/gi, '').slice(0, 10) || 'jpg';
    const key = `ads/${user.id}/${newId()}.${ext}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: process.env.PHOTOS_BUCKET, Key: key, ContentType: contentType }),
      { expiresIn: 300 }
    );

    const publicUrl = `https://${process.env.PHOTOS_CDN_DOMAIN}/${key}`;

    return json(200, { uploadUrl, publicUrl, key });
  } catch (error) {
    console.error('presignUpload error:', error);
    return json(500, { error: error.message });
  }
};

import * as z from 'zod';

const PNG_MIME_TYPE = 'image/png';
const JPEG_MIME_TYPE = 'image/jpeg';
const JPG_MIME_TYPE = 'image/jpg';
export const MIME_TYPES = [
  PNG_MIME_TYPE,
  JPEG_MIME_TYPE,
  JPG_MIME_TYPE,
] as const;

const imageDataSchema = z.object({
  imageBase64: z.string().min(1),
  fileType: z.enum(MIME_TYPES, {
    message: `Unsupported file type. Available types is ${MIME_TYPES.map((t) => t.replace('image/', '')).join(', ')}`,
  }),
});

export const uploadBodySchema = z.object({
  name: z
    .string({
      message: 'The name must not be an empty string.',
    })
    .min(1, 'Name must contain at least 1 character'),
  description: z
    .string({ message: 'The description must not be an empty string.' })
    .min(1, 'Description must contain at least 1 character'),
  imageData: imageDataSchema,
});

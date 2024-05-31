import { removeImageBodySchema } from '@/functions/remove-image/schema';
import { uploadBodySchema } from '@/functions/upload-image/schema';
import { z } from 'zod';

export interface Image {
  id: string;
  url: string;
  userId: string;
  name: string;
  description: string;
}

export type TUploadImageBody = z.infer<typeof uploadBodySchema>;
export type TRemoveImageBody = z.infer<typeof removeImageBodySchema>;

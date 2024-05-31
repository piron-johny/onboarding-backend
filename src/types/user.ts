import { loginBodySchema } from '@/functions/login/schema';
import { registrationBodySchema } from '@/functions/registration/schema';
import { z } from 'zod';

export interface User {
  id: string;
  name: string;
  password: string;
}

export interface AuthContext {
  userId: string;
}

export type TLoginBody = z.infer<typeof loginBodySchema>;
export type TRegistrationBody = z.infer<typeof registrationBodySchema>;

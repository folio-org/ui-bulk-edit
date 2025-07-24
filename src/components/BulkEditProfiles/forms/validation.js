import { boolean, object, string } from 'yup';

export const profilesValidationSchema = object({
  name: string().required(),
  description: string().nullable(),
  locked: boolean()
});

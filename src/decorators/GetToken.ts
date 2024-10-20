import { createParamDecorator } from 'next-api-decorators';
import { getToken, JWT } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export const GetToken = createParamDecorator<Promise<JWT | null>>(async (req) => {
  return await getToken({ req, secret });
});
import { NextApiRequest, NextApiResponse } from "next";
import { createMiddlewareDecorator, NextFunction, UnauthorizedException } from "next-api-decorators";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

declare module 'next' {
  interface NextApiRequest {
    user?: { name: string }
  }
}

export const NextAuthGuard = createMiddlewareDecorator(async (req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
  const token = await getToken({ req, secret });
  if (!token || !token.name) {
    throw new UnauthorizedException();
  }

  req.user = { name: token.name };
  next();
});
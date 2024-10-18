import { createParamDecorator } from 'next-api-decorators';

export const Authorization = createParamDecorator<string | undefined>(
  req => req.headers['authorization']
);
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  Body,
  HttpCode,
  NextFunction,
  NotFoundException,
  Param,
  ParseNumberPipe,
  Post,
  Put,
  UnauthorizedException,
  ValidationPipe,
  createHandler,
  createMiddlewareDecorator
} from 'next-api-decorators';
import { getToken } from 'next-auth/jwt';
import { Authorization } from '../../../app/decorators/Authorization';
import { CreateUserInput, LoginInput, UpdatePropertyOwnerInput } from '../../../app/dto';
import prisma from '../../../lib/prisma';

declare module 'next' {
  interface NextApiRequest {
    user?: { name: string }
  }
}

const secret = process.env.NEXTAUTH_SECRET;

const NextAuthGuard = createMiddlewareDecorator(async (req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
  const token = await getToken({ req, secret });
  if (!token || !token.name) {
    throw new UnauthorizedException();
  }

  req.user = { name: token.name };
  next();
});

@NextAuthGuard()
class UserRouter {
  private prisma = prisma;

  private async findUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`No user found with ID '${id}'.`);
    }
    return user;
  }

  // POST /api/users (create one)
  @Post()
  @HttpCode(201)
  public async createUser(@Body(ValidationPipe) body: CreateUserInput): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: await hash(body.password, 10)
      }
    });
    return newUser;
  }

  // PUT /api/users/:id (update one)
  @Put('/:id/property-owner')
  @HttpCode(201)
  public async updatePropertyOwner(
    @Param('id', ParseNumberPipe) id: number,
    @Body(ValidationPipe) body: UpdatePropertyOwnerInput,
    @Authorization() authorization?: string
  ): Promise<User> {
    console.log(authorization);

    // TODO: check if the user matches with the logged one
    const user = await this.findUserById(id);

    this.prisma.user.update({
      data: {
        profilePictureUrl: '',
        phone: body.phone,
        address: {
          create: {
            type: body.type,
            street: body.street,
            number: body.number,
            other: body.other,
            postalCode: body.postalCode.toUpperCase(),
            city: {
              connect: {
                id: body.cityId
              }
            }
          }
        }
      },
      where: {
        id: id
      }
    });
    return user;
  }

  // POST /api/users (create one)
  @Post()
  @HttpCode(200)
  public async login(@Body(ValidationPipe) body: LoginInput): Promise<boolean> {
    const newUser = await prisma.user.findUnique({
      where:
      {
        email: body.email
      }
    });
    if (newUser) {

    }
    return true;
  }
}

export default createHandler(UserRouter);

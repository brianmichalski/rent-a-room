import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import {
  Body,
  HttpCode,
  NotFoundException,
  Post,
  Put,
  ValidationPipe,
  createHandler
} from 'next-api-decorators';
import { CreateUserInput, UpdatePropertyOwnerInput } from '../../../app/dto';
import prisma from '../../../lib/prisma';
import { GetToken } from '../../../app/decorators/GetToken';
import { type JWT } from 'next-auth/jwt';
import NextAuthGuard from '../../../app/decorators/NextAuthGuard';

declare module 'next' {
  interface NextApiRequest {
    user?: { name: string }
  }
}

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
  @NextAuthGuard()
  @Put('/property-owner')
  @HttpCode(201)
  public async updatePropertyOwner(
    @Body(ValidationPipe) body: UpdatePropertyOwnerInput,
    @GetToken() token: JWT
  ): Promise<User> {
    await this.prisma.user.update({
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
        id: token.id
      }
    });
    return await this.findUserById(token.id);
  }
}

export default createHandler(UserRouter);

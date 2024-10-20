import { User } from '@prisma/client';
import {
  Body,
  HttpCode,
  Post,
  Put,
  ValidationPipe,
  createHandler
} from 'next-api-decorators';
import { type JWT } from 'next-auth/jwt';
import { GetToken, NextAuthGuard } from '../../../app/decorators';
import { CreateUserInput, UpdatePropertyOwnerInput } from '../../../app/dto';
import { UserService } from '../../../app/service/user.service';
import prisma from '../../../../prisma/client';


class UserRouter {
  protected userService: UserService;

  constructor() {
    this.userService = new UserService(prisma);
  }

  // POST /api/users (create one)
  @Post()
  @HttpCode(201)
  public async createUser(@Body(ValidationPipe) body: CreateUserInput): Promise<User> {
    return await this.userService.createUser(body);
  }

  // PUT /api/users/:id (update one)
  @NextAuthGuard()
  @Put('/property-owner')
  @HttpCode(201)
  public async updatePropertyOwner(
    @Body(ValidationPipe) body: UpdatePropertyOwnerInput,
    @GetToken() token: JWT
  ): Promise<User> {
    return await this.userService.updatePropertyOwner(token.id, body);
  }
}

export default createHandler(UserRouter);

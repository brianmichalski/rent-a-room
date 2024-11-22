import { User } from '@prisma/client';
import {
  Body,
  Get,
  HttpCode,
  Post,
  Put,
  ValidationPipe,
  createHandler
} from 'next-api-decorators';
import { type JWT } from 'next-auth/jwt';
import prisma from '../../../../prisma/client';
import { CreateUserInput, UpdatePropertyOwnerInput } from '../../../app/dto';
import { UserService } from '../../../app/service/user.service';
import { GetToken, NextAuthGuard } from '../../../decorators';


class UserRouter {
  protected userService: UserService;

  constructor() {
    this.userService = new UserService(prisma);
  }

  // POST /api/user (create one)
  @Post()
  @HttpCode(201)
  public async createUser(@Body(ValidationPipe) body: CreateUserInput): Promise<User> {
    return await this.userService.createUser(body);
  }

  // GET /api/user (get account data)
  @NextAuthGuard()
  @Get('/property-owner')
  @HttpCode(201)
  public async getUserData(
    @GetToken() token: JWT
  ): Promise<User | undefined> {
    return await this.userService.getById(token.id);
  }

  // PUT /api/user/property-owner (update account)
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

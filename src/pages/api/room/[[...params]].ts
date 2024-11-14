import { Room } from '@prisma/client';
import {
  Body,
  HttpCode,
  Post,
  ValidationPipe,
  createHandler
} from 'next-api-decorators';
import { type JWT } from 'next-auth/jwt';
import prisma from '../../../../prisma/client';
import { CreateRoomInput } from '../../../app/dto/room/createRoom.input';
import { RoomService } from '../../../app/service/room.service';
import { GetToken, NextAuthGuard } from '../../../decorators';

class RoomRouter {
  protected roomService: RoomService;

  constructor() {
    this.roomService = new RoomService(prisma);
  }

  // POST /api/room (create one)
  @NextAuthGuard()
  @Post()
  @HttpCode(201)
  public async createRoom(
    @Body(ValidationPipe) body: CreateRoomInput,
    @GetToken() token: JWT): Promise<Room> {
    return await this.roomService.createRoom(token.id, body);
  }
}

export default createHandler(RoomRouter);

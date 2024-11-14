import { Room } from '@prisma/client';
import {
  Body,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  ValidationPipe,
  createHandler
} from 'next-api-decorators';
import { type JWT } from 'next-auth/jwt';
import prisma from '../../../../prisma/client';
import { CreateRoomInput } from '../../../app/dto/room/createRoom.input';
import { UpdateRoomInput } from '../../../app/dto/room/updateRoom.input';
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

    body.ownerId = token.id;
    return await this.roomService.createRoom(body);
  }

  // PUT /api/room (update one)
  @NextAuthGuard()
  @Put()
  @HttpCode(201)
  public async updateRoom(
    @Body(ValidationPipe) body: UpdateRoomInput,
    @GetToken() token: JWT): Promise<Room> {

    body.ownerId = token.id;
    return await this.roomService.updateRoom(body);
  }

  // DELETE /api/room/:id (delete one)
  @NextAuthGuard()
  @Delete("/:id")
  @HttpCode(204)
  public async deleteRoom(
    @Param("id") roomId: number,
    @GetToken() token: JWT): Promise<boolean> {

    return await this.roomService.deleteRoom(Number(roomId), token.id);
  }
}

export default createHandler(RoomRouter);

import { Room, RoomPicture } from '@prisma/client';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
  createHandler
} from 'next-api-decorators';
import { type JWT } from 'next-auth/jwt';
import prisma from '../../../../prisma/client';
import { RoomInput } from '../../../app/dto/room/room.input';
import { RoomSearch } from '../../../app/dto/room/room.search';
import { RoomService } from '../../../app/service/room.service';
import { GetToken, NextAuthGuard } from '../../../decorators';
import { RoomResult } from '../../../types/results';
import { clearEmptyParams } from '../../../utils/api';

class RoomRouter {
  protected roomService: RoomService;

  constructor() {
    this.roomService = new RoomService(prisma);
  }

  // GET /api/room (get all from owner)
  @NextAuthGuard()
  @Get('/my-rooms')
  @HttpCode(200)
  public async getAll(@GetToken() token: JWT): Promise<Room[]> {
    return await this.roomService.getAllByOwnerId(token.id);
  }

  // GET /api/room/favorites (get user's favorite rooms)
  @NextAuthGuard()
  @Get('/my-favorites')
  @HttpCode(200)
  public async getFavorites(@GetToken() token: JWT): Promise<RoomResult[]> {
    return await this.roomService.getFavorites(token.id);
  }

  // GET /api/room/favorites (get user's favorite rooms' ids)
  @NextAuthGuard()
  @Get('/favorites')
  @HttpCode(200)
  public async getFavoritesIdList(@GetToken() token: JWT): Promise<number[]> {
    return await this.roomService.getFavoritesIdList(token.id);
  }

  // GET /api/room/:id/details (get one)
  @Get("/:id/details")
  @HttpCode(200)
  public async getDetails(
    @Param("id") roomId: number,
    @GetToken() token: JWT): Promise<RoomResult> {
    return await this.roomService.getDetails(Number(roomId), token.id);
  }

  // GET /api/room/:id (get one)
  @Get("/:id")
  @HttpCode(200)
  public async getById(
    @Param("id") roomId: number): Promise<Room> {
    return await this.roomService.getById(Number(roomId));
  }

  // GET /api/room/:id/cover (get room cover picture)
  @Get('/:id/cover')
  @HttpCode(200)
  public async getCoverPicture(@Param("id") roomId: number): Promise<string | undefined> {
    return await this.roomService.getCoverPictureUrl(Number(roomId));
  }

  // GET /api/room/:id/picture (get room pictures)
  @Get('/:id/picture')
  @HttpCode(200)
  public async getImages(@Param("id") roomId: number): Promise<RoomPicture[] | undefined> {
    return await this.roomService.getImages(Number(roomId));
  }

  // GET /api/room (get all)
  @Get()
  @HttpCode(200)
  public async getAllRooms(
    @Query() searchParams: RoomSearch
  ): Promise<RoomResult[]> {
    return await this.roomService.getAll(clearEmptyParams(searchParams));
  }

  // POST /api/room (create one)
  @NextAuthGuard()
  @Post()
  @HttpCode(201)
  public async createRoom(
    @Body(ValidationPipe) body: RoomInput,
    @GetToken() token: JWT): Promise<Room> {

    body.ownerId = token.id;
    return await this.roomService.createRoom(body);
  }

  // PUT /api/room (update one)
  @NextAuthGuard()
  @Put('/:id')
  @HttpCode(201)
  public async updateRoom(
    @Param("id") roomId: number,
    @Body(ValidationPipe) body: RoomInput,
    @GetToken() token: JWT): Promise<Room> {

    body.ownerId = token.id;
    return await this.roomService.updateRoom(Number(roomId), body);
  }

  // PUT /api/room (update one)
  @NextAuthGuard()
  @Put('/:id/availability')
  @HttpCode(201)
  public async updateRoomAvailability(
    @Param("id") roomId: number,
    @GetToken() token: JWT): Promise<Room | undefined> {

    return await this.roomService.updateRoomAvailability(Number(roomId), token.id);
  }

  // PUT /api/room/:id/favorite (update one)
  @NextAuthGuard()
  @Post('/:id/favorite')
  @HttpCode(201)
  public async addRoomToFavorites(
    @Param("id") roomId: number,
    @GetToken() token: JWT): Promise<void> {

    await this.roomService.addRoomToFavorites(Number(roomId), token.id);
  }

  // PUT /api/room/:id/favorite (update one)
  @NextAuthGuard()
  @Delete('/:id/favorite')
  @HttpCode(201)
  public async removeRoomFromFavorites(
    @Param("id") roomId: number,
    @GetToken() token: JWT): Promise<void> {

    await this.roomService.deleteRoomFromFavorites(Number(roomId), token.id);
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

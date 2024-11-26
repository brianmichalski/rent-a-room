import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { NextApiRequest } from 'next';
import {
  BadRequestException,
  Delete,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Request,
  createHandler
} from 'next-api-decorators';
import { type JWT } from 'next-auth/jwt';
import prisma from '../../../../prisma/client';
import { RoomPictureInput } from '../../../app/dto/room/roomPicture.input';
import { RoomPictureOrderInput } from '../../../app/dto/room/roomPictureOrder.input';
import { RoomService } from '../../../app/service/room.service';
import { GetToken, NextAuthGuard } from '../../../decorators';
import { parseForm, parseFormWithFile } from '../../../utils/api';

class RooomPictureRouter {
  protected roomService: RoomService;

  constructor() {
    this.roomService = new RoomService(prisma);
  }

  // POST /api/room-picture/ (create one)
  @NextAuthGuard()
  @Post()
  @HttpCode(201)
  public async createRoomPicture(
    @Request() req: NextApiRequest,
    @GetToken() token: JWT
  ) {

    // Parse form-data (fields and files)
    const outputDir = process.env.ROOM_IMAGES_OUTPUT_DIR;
    if (!outputDir) {
      throw new Error("Images output folder not found");
    }
    const { fields, files } = await parseFormWithFile(req, `/public/${outputDir}`);

    if (!files) {
      throw new BadRequestException("Image file not included in the request");
    }

    const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];

    // Convert the parsed fields (which are strings) into the DTO class instance
    const body = plainToClass(RoomPictureInput, {
      roomId: Number(fields.roomId)
    } as RoomPictureInput);

    try {
      // Validate the DTO instance
      await validateOrReject(body);
    } catch (error) {
      throw new HttpException(400, 'invalid inputs', error as string[]);
    }
    // Fill the internal fields
    body.urls = uploadedFiles.map(f => `${outputDir}/${f?.newFilename}`);
    body.ownerId = token.id;

    return this.roomService.createRoomPicture(body);
  }

  // PUT /api/room-picture/ (update order)
  @NextAuthGuard()
  @Put('/order')
  @HttpCode(201)
  public async swapOrder(
    @Request() req: NextApiRequest,
    @GetToken() token: JWT
  ) {

    const { fields } = await parseForm(req);
    const body = plainToClass(RoomPictureOrderInput, {
      ids: fields.ids?.map(id => Number(id)),
      ascending: fields.ascending
    });

    try {
      // Validate the DTO instance
      await validateOrReject(body);
    } catch (error) {
      throw new HttpException(400, 'invalid inputs', error as string[]);
    }

    body.ownerId = token.id;

    return this.roomService.swapRoomPictureOrder(body);
  }

  @NextAuthGuard()
  @Delete('/:id')
  @HttpCode(204)
  public async deletePicture(
    @Param("id") id: number,
    @GetToken() token: JWT
  ): Promise<void> {
    this.roomService.deleteRoomPicture(Number(id), token.id);
  }
}


// Disable the default Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default createHandler(RooomPictureRouter);

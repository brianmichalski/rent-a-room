import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { NextApiRequest } from 'next';
import {
  BadRequestException,
  HttpCode,
  Post,
  Request,
  createHandler
} from 'next-api-decorators';
import prisma from '../../../../prisma/client';
import { CreateRoomPictureInput } from '../../../app/dto/room/createRoomPicture.input';
import { RoomService } from '../../../app/service/room.service';
import { GetToken, NextAuthGuard } from '../../../decorators';
import { parseFormWithFile } from '../../../utils/api';
import { type JWT } from 'next-auth/jwt';

class RooomPictureRouter {
  protected roomService: RoomService;

  constructor() {
    this.roomService = new RoomService(prisma);
  }

  // POST /api/room/:id/picture (update one)
  @NextAuthGuard()
  @Post('/')
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
    const { fields, files } = await parseFormWithFile(req, outputDir);

    if (!files) {
      throw new BadRequestException("Image file not included in the request");
    }

    const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];

    // Convert the parsed fields (which are strings) into the DTO class instance
    const body = plainToClass(CreateRoomPictureInput, {
      roomId: Number(fields.roomId),
      isCover: Boolean(fields.isCover),
      order: Number(fields.order)
    } as CreateRoomPictureInput);

    // Validate the DTO instance
    await validateOrReject(body);

    // Fill the internal fields
    body.url = `${outputDir}/${uploadedFiles[0]?.newFilename}`;
    body.ownerId = token.id;

    return this.roomService.createRoomPicture(body);
  }
}

// Disable the default Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default createHandler(RooomPictureRouter);

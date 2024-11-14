import { AddressType, Room, RoomPicture } from "@prisma/client";
import prisma from "../../../prisma/client";
import { CreateRoomInput } from "../dto/room/createRoom.input";
import { CreateRoomPictureInput } from "../dto/room/createRoomPicture.input";
import { BadRequestException } from "next-api-decorators";

export class RoomService {
  private prisma;

  constructor(_prisma: typeof prisma) {
    this.prisma = _prisma;
  }

  public async createRoom(ownerUserId: number, data: CreateRoomInput): Promise<Room> {
    const user = await this.prisma.user.findFirst({ where: { id: ownerUserId } });
    if (!user?.isOwner) {
      throw new BadRequestException("User is not a property owner");
    }

    // TODO: check address duplicity
    const newRoom = await this.prisma.room.create({
      data: {
        bathroomType: data.bathroomType,
        description: data.description,
        gender: data.gender,
        numberOfRooms: data.numberOfRooms,
        rentPrice: data.rentPrice,
        roomType: data.roomType,
        size: data.size,
        owner: {
          connect: {
            id: ownerUserId
          }
        },
        address: {
          create: {
            type: AddressType.R,
            street: data.street,
            number: data.number,
            other: data.other,
            postalCode: data.postalCode.toUpperCase(),
            city: {
              connect: {
                id: data.cityId
              }
            }
          }
        }
      }
    });
    return newRoom;
  }

  public async createRoomPicture(data: CreateRoomPictureInput): Promise<RoomPicture> {
    const roomId = data.roomId;
    const createPicture = this.prisma.roomPicture.create({
      data: {
        order: data.order,
        url: data.url,
        isCover: data.isCover,
        room: {
          connect: {
            id: roomId
          }
        }
      }
    });
    // increment the order of pictures that should be 'after' the new picture
    const adjustPicturesOrder = this.prisma.roomPicture.updateMany({
      where: {
        roomId: roomId,
        order: { gte: data.order }
      },
      data: {
        order: { increment: 1 }
      },
    });

    // prepare the batch for the transaction
    const commands = [];
    if (data.isCover) {
      // if the picture is the new cover, unset the previous one
      const unsetPictureCover = this.prisma.roomPicture.updateMany({
        where: {
          roomId: roomId,
          isCover: true
        },
        data: {
          isCover: false
        },
      });
      commands.push(unsetPictureCover);
    }
    commands.push(adjustPicturesOrder);
    commands.push(createPicture);

    const result = await this.prisma.$transaction(
      commands
    );
    // if data.isCover, the transaction will return 3 results. Otherwise, it will return 2.
    const createdPicture = commands.length === 3 ? result[2] : result[1];
    return createdPicture as RoomPicture;
  }
}
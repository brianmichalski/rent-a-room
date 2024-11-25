import { AddressType, Room, RoomPicture } from "@prisma/client";
import { BadRequestException, NotFoundException } from "next-api-decorators";
import prisma from "../../../prisma/client";
import { RoomInput } from "../dto/room/room.input";
import { RoomPictureInput } from "../dto/room/roomPicture.input";

export class RoomService {
  private prisma;

  constructor(_prisma: typeof prisma) {
    this.prisma = _prisma;
  }

  public async getAllByOwnerId(ownerId: number) {
    return await this.prisma.room.findMany({
      include: {
        owner: true,
        address: {
          include: {
            city: {
              include: {
                province: true
              }
            }
          }
        }
      },
      where: {
        owner: {
          id: ownerId
        }
      },
    });
  }

  public async getById(id: number): Promise<Room> {
    const result = await this.prisma.room.findUnique({
      include: {
        owner: true,
        address: {
          include: {
            city: {
              include: {
                province: true
              }
            }
          }
        }
      },
      where: {
        id: id
      },
    });

    return result as Room;
  }

  public async getCoverPictureUrl(roomId: number) {
    const result = await this.prisma.roomPicture.findFirst(
      {
        where: {
          roomId: roomId,
          isCover: true
        }
      }
    );
    return result?.url;
  }

  public async createRoom(data: RoomInput): Promise<Room> {

    await this.checkOwnerPreconditions(data.ownerId);

    // TODO: check address duplicity
    const newRoom = await this.prisma.room.create({
      data: this.parseInputRoomCreate(data)
    });
    return newRoom;
  }

  public async updateRoom(id: number, data: RoomInput): Promise<Room> {

    await this.checkOwnerPreconditions(data.ownerId, id);

    // TODO: check address duplicity
    const updatedRoom = await this.prisma.room.update({
      where: {
        id: id
      },
      data: this.parseInputRoomUpdate(data)
    });
    return updatedRoom;
  }

  public async deleteRoom(roomId: number, ownerId: number): Promise<boolean> {
    await this.checkOwnerPreconditions(ownerId, roomId);
    const result = await this.prisma.room.delete({
      where: { id: roomId }
    });
    return (result != null);
  }

  public async createRoomPicture(data: RoomPictureInput): Promise<RoomPicture> {

    await this.checkOwnerPreconditions(data.ownerId, data.roomId);

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

  private async checkOwnerPreconditions(ownerId: number, roomId?: number) {
    const user = await this.prisma.user.findFirst({ where: { id: ownerId } });
    if (!user?.isOwner) {
      throw new BadRequestException("User is not a property owner");
    }
    if (!roomId) {
      return;
    }
    const room = await this.prisma.room.findFirst(
      {
        include: {
          owner: true
        },
        where: { id: roomId },
      }
    );
    if (!room) {
      throw new NotFoundException("Room not found");
    }
    if (room.owner?.id !== ownerId) {
      throw new BadRequestException("Room belongs to a different user");
    }
  }

  private parseInputRoomCreate(data: RoomInput): Room {
    return {
      bathroomType: data.bathroomType,
      description: data.description,
      gender: data.gender,
      numberOfRooms: data.numberOfRooms,
      rentPrice: data.rentPrice,
      roomType: data.roomType,
      size: data.size,
      owner: {
        connect: {
          id: data.ownerId
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
    } as unknown as Room;
  }

  private parseInputRoomUpdate(data: RoomInput): Room {
    return {
      bathroomType: data.bathroomType,
      description: data.description,
      gender: data.gender,
      numberOfRooms: data.numberOfRooms,
      rentPrice: data.rentPrice,
      roomType: data.roomType,
      size: data.size,
      address: {
        update: {
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
    } as unknown as Room;
  }
}
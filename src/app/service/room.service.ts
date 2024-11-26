import { AddressType, Room, RoomPicture } from "@prisma/client";
import { BadRequestException, NotFoundException } from "next-api-decorators";
import prisma from "../../../prisma/client";
import { RoomInput } from "../dto/room/room.input";
import { RoomPictureInput } from "../dto/room/roomPicture.input";
import { RoomPictureOrderInput } from "../dto/room/roomPictureOrder.input";

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
      orderBy: {
        createdAt: "desc"
      }
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

  public async getImages(roomId: number) {
    return await this.prisma.roomPicture.findMany(
      {
        where: {
          roomId: roomId
        },
        orderBy: {
          order: "asc"
        }
      }
    );
  }

  public async createRoom(data: RoomInput): Promise<Room> {

    await this.checkOwnerPreconditions(data.ownerId);

    // TODO: check address duplicity
    const newRoom = await this.prisma.room.create({
      data: this.parseInputRoomCreate(data)
    });
    return newRoom;
  }

  public async updateRoom(id: number, data: RoomInput | Room): Promise<Room> {

    await this.checkOwnerPreconditions(data.ownerId, id);

    // TODO: check address duplicity
    const updatedRoom = await this.prisma.room.update({
      where: {
        id: id
      },
      data: data instanceof RoomInput
        ? this.parseInputRoomUpdate(data)
        : data
    });
    return updatedRoom;
  }

  public async updateRoomAvailability(id: number, ownerId: number): Promise<Room | undefined> {
    const room = await this.prisma.room.findFirst({
      select: {
        isRented: true
      },
      where: {
        id: id
      }
    });
    if (!room) {
      return;
    }
    const data: Room = {
      isRented: !room.isRented,
      ownerId: ownerId
    } as Room;
    return await this.updateRoom(id, data);
  }

  public async deleteRoom(roomId: number, ownerId: number): Promise<boolean> {
    await this.checkOwnerPreconditions(ownerId, roomId);
    await this.prisma.roomPicture.deleteMany({
      where: { roomId: roomId }
    });
    const result = await this.prisma.room.delete({
      where: { id: roomId }
    });
    return (result != null);
  }

  public async createRoomPicture(data: RoomPictureInput): Promise<boolean> {
    const lastPicture = await this.prisma.roomPicture.findFirst({
      take: 1,
      select: {
        order: true
      },
      where: {
        roomId: data.roomId
      },
      orderBy: {
        order: "desc"
      }
    });

    await this.checkOwnerPreconditions(Number(data.ownerId), data.roomId);

    if (!data.urls?.length) {
      return false;
    }

    let firstPicture = true;
    let order = 1 + (lastPicture?.order ?? 0);
    const newPictures = data.urls?.map(url => {
      const result = {
        order: order++,
        url: String(url),
        isCover: (firstPicture && !lastPicture),
        roomId: data.roomId
      };
      firstPicture = false;
      return result;
    });

    const createPictures = await this.prisma.roomPicture.createMany({
      data: newPictures
    });

    // prevent changing the cover if a picture already exists
    if (lastPicture) {
      await this.setNewCoverPicture(data.roomId);
    }
    return createPictures.count > 0;
  }

  public async swapRoomPictureOrder(data: RoomPictureOrderInput): Promise<RoomPicture> {
    if (data.ids?.length != 2) {
      throw new BadRequestException('Invalid input for swapping pictures');
    }
    let coverImpacted = false;
    const pictureSource = await this.checkPicturePreconditions(data.ids[0], data.ownerId ?? 0);
    const pictureTarget = await this.checkPicturePreconditions(data.ids[1], data.ownerId ?? 0);
    let picturesInBetween: RoomPicture[] = [];
    let increment = 0;
    // update the pictures found between pictureA and pictureB
    if (data.ascending) {
      // for ascending swapping, 'moves' the pictures before downwards (-1)
      increment = -1;
      picturesInBetween = await this.prisma.roomPicture.findMany({
        where: {
          order: {
            gt: pictureSource.order,
            lte: pictureTarget.order
          }
        }
      });
    } else {
      // for descending swapping, 'moves' the pictures after upwards (+1)
      increment = 1;
      picturesInBetween = await this.prisma.roomPicture.findMany({
        where: {
          order: {
            lt: pictureSource.order,
            gte: pictureTarget.order
          }
        }
      });
    }
    // update pictures in between
    if (picturesInBetween.length) {
      coverImpacted = picturesInBetween.some(p => p.isCover);
      await this.prisma.roomPicture.updateMany({
        data: {
          order: {
            increment: increment
          }
        },
        where: {
          id: {
            in: picturesInBetween.map(p => p.id)
          }
        }
      });
    }
    // Finally, update the picture that was moved (swap source with target)
    const pictureSourceUpdated = await this.prisma.roomPicture.update({
      data: {
        order: pictureTarget.order
      },
      where: {
        id: pictureSource.id
      }
    });
    if (coverImpacted || pictureSourceUpdated.isCover) {
      await this.setNewCoverPicture(pictureSource.roomId);
    }
    return pictureSourceUpdated;
  }

  public async deleteRoomPicture(id: number, ownerId: number): Promise<void> {
    // TODO: delete the file from the system

    await this.checkPicturePreconditions(id, ownerId);
    const deletedPicture = await this.prisma.roomPicture.delete({
      where: { id: id }
    });
    if (!deletedPicture.isCover) {
      return;
    }
    await this.setNewCoverPicture(deletedPicture.roomId);
  }

  private async setNewCoverPicture(roomId: number) {
    // sets the new cover automatically
    const firstPicture = await this.prisma.roomPicture.findFirst({
      take: 1,
      select: {
        id: true
      },
      where: {
        roomId: roomId
      },
      orderBy: {
        order: "asc"
      }
    });
    if (!firstPicture) {
      return;
    }
    // unset current cover
    await this.prisma.roomPicture.updateMany({
      data: {
        isCover: false
      },
      where: {
        id: {
          not: firstPicture?.id
        },
        roomId: roomId,
        isCover: true
      }
    });
    // set new cover
    await this.prisma.roomPicture.update({
      data: {
        isCover: true
      },
      where: {
        id: firstPicture?.id
      }
    });
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

  private async checkPicturePreconditions(roomPictureId: number, ownerId: number) {
    if (!ownerId) {
      throw new BadRequestException('Owner ID not provided');
    }

    const picture = await this.prisma.roomPicture.findFirst({
      where: {
        id: roomPictureId
      }
    });

    if (!picture) {
      throw new NotFoundException('Picture not found');
    }

    await this.checkOwnerPreconditions(ownerId, picture?.roomId);

    return picture;
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
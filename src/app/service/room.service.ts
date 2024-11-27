import { AddressType, Prisma, Room, RoomPicture } from "@prisma/client";
import { BadRequestException, NotFoundException } from "next-api-decorators";
import prisma from "../../../prisma/client";
import { RoomResult } from "../../types/results";
import { RoomInput } from "../dto/room/room.input";
import { RoomSearch } from "../dto/room/room.search";
import { RoomPictureInput } from "../dto/room/roomPicture.input";
import { RoomPictureOrderInput } from "../dto/room/roomPictureOrder.input";

export class RoomService {
  private prisma;

  constructor(_prisma: typeof prisma) {
    this.prisma = _prisma;
  }

  private mapRoomToResult(room: any) {
    return {
      id: room.id,
      // room info
      bathroomType: room.bathroomType,
      description: room.description,
      gender: room.gender,
      isRented: room.isRented,
      numberOfRooms: room.numberOfRooms,
      number: room.address?.number,
      rentPrice: room.rentPrice,
      roomType: room.roomType,
      // address
      size: room.size,
      street: room.address?.street,
      postalCode: room.address?.postalCode,
      other: room.address?.other,
      city: `${room.address?.city.name}, ${room.address?.city.province.abbreviation}`,
      // pictures
      pictures: room.roomPictures.map((p: RoomPicture) => p.url),
      ownerName: room.owner?.firstName,
      ownerCity: room.owner ? `${room.owner?.address?.city?.name}, ${room.owner.address?.city?.province?.abbreviation}` : '',
      ownerPhone: room.owner?.phone,
    } as RoomResult
  }

  public async getAll(params: RoomSearch) {
    const [where, orderBy] = this.parseRoomSearchParams(params);
    // excludes the rented rooms
    where.isRented = false;
    const rooms = await this.prisma.room.findMany({
      include: {
        address: {
          include: {
            city: {
              include: {
                province: true
              }
            }
          }
        },
        roomPictures: {
          select: {
            url: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      },
      where: where,
      orderBy: orderBy
    });
    return rooms.map(room => (this.mapRoomToResult(room)) as RoomResult);
  }

  private parseRoomSearchParams(params: RoomSearch): [Prisma.RoomWhereInput, Prisma.RoomOrderByWithRelationInput] {
    const where: Prisma.RoomWhereInput = {};
    if (params.bathroomType) {
      where.bathroomType = params.bathroomType;
    }
    if (params.description) {
      where.description = { contains: params.description };
    }
    if (params.gender) {
      where.gender = params.gender;
    }
    // number of rooms
    if (params.numberOfRoomsMin) {
      where.numberOfRooms = { gte: Number(params.numberOfRoomsMin) };
    }
    if (params.numberOfRoomsMax) {
      where.numberOfRooms = { lte: Number(params.numberOfRoomsMax) };
    }
    // rent price
    if (params.rentPriceMin) {
      where.rentPrice = { gte: Number(params.rentPriceMin) };
    }
    if (params.rentPriceMax) {
      where.rentPrice = { lte: Number(params.rentPriceMax) };
    }
    if (params.roomType) {
      where.roomType = params.roomType;
    }
    // rent price
    if (params.sizeMin) {
      where.size = { gte: Number(params.sizeMin) };
    }
    if (params.sizeMax) {
      where.size = { lte: Number(params.sizeMax) };
    }
    if (params.cityId && String(params.cityId) !== 'undefined') {
      where.address = {
        cityId: Number(params.cityId)
      };
    }

    const orderBy: Prisma.RoomOrderByWithRelationInput = {};
    switch (params.sortBy) {
      case "price":
        orderBy.rentPrice = params.sortDir;
        break;
      case "size":
        orderBy.size = params.sortDir;
        break;
    }

    return [where, orderBy];
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

  public async getDetails(id: number): Promise<RoomResult> {
    const result = await this.prisma.room.findUnique({
      include: {
        owner: {
          include: {
            address: {
              include: {
                city: {
                  include: {
                    province: true
                  }
                }
              }
            }
          }
        },
        address: {
          include: {
            city: {
              include: {
                province: true
              }
            }
          }
        },
        roomPictures: {
          select: {
            url: true
          },
          orderBy: {
            order: 'asc'
          },
        },
      },
      where: {
        id: id
      },
    });

    return this.mapRoomToResult(result);
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

  public async getFavoritesIdList(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId: Number(userId)
      },
      orderBy: {
        roomId: 'asc'
      }
    });
    return favorites.map(f => f.roomId);
  }

  public async getFavorites(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      include: {
        room: {
          include: {
            address: {
              include: {
                city: {
                  include: {
                    province: true
                  }
                }
              }
            },
            roomPictures: true
          }
        }
      },
      where: {
        userId: Number(userId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return favorites.map(f => (this.mapRoomToResult(f.room)) as RoomResult);
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

  public async addRoomToFavorites(roomId: number, userId: number): Promise<void> {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId
      }
    });
    if (!room) {
      return;
    }
    await this.prisma.favorite.create({
      data: {
        roomId: roomId,
        userId: userId
      }
    });
  }

  public async deleteRoomFromFavorites(roomId: number, userId: number): Promise<void> {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId
      }
    });
    if (!room) {
      return;
    }
    await this.prisma.favorite.deleteMany({
      where: {
        roomId: roomId,
        userId: userId
      }
    });
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
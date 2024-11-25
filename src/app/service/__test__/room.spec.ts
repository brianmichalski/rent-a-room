import { AddressType, BathroomType, Gender, Room, RoomPicture, RoomType, User } from '@prisma/client';
import prisma from '../../../../prisma/client';
import { RoomInput } from '../../dto/room/room.input';
import { RoomPictureInput } from '../../dto/room/roomPicture.input';
import { RoomService } from '../room.service';

// Jest mock functions
jest.mock("../../../../prisma/client", () => ({
  room: {
    create: jest.fn(),
    findFirst: jest.fn()
  },
  roomPicture: {
    create: jest.fn(),
    updateMany: jest.fn(),
  },
  user: {
    findFirst: jest.fn()
  },
  $transaction: jest.fn()
}));

describe('RoomService', () => {
  let roomService: RoomService;
  const ownerUser = {
    id: 1,
    isOwner: true
  } as User;

  beforeEach(() => {
    jest.clearAllMocks();
    roomService = new RoomService(prisma);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(ownerUser);
  });

  describe('createRoom', () => {
    it('should create a new room with valid input', async () => {
      // Mock room creation response
      const mockRoom = { id: 1, description: 'A new room' } as Room;
      (prisma.room.create as jest.Mock).mockResolvedValue(mockRoom);

      // Prepare input data
      const createRoomInput: RoomInput = {
        bathroomType: BathroomType.E,
        description: 'Nice room',
        gender: Gender.F,
        numberOfRooms: 2,
        rentPrice: 500,
        roomType: RoomType.I,
        size: 20,
        street: 'Main St',
        number: 123,
        other: 'Near the park',
        postalCode: 'A1B2C3',
        cityId: 1,
        ownerId: ownerUser.id
      };

      const result = await roomService.createRoom(createRoomInput);

      expect(prisma.room.create).toHaveBeenCalledWith({
        data: {
          bathroomType: createRoomInput.bathroomType,
          description: createRoomInput.description,
          gender: createRoomInput.gender,
          numberOfRooms: createRoomInput.numberOfRooms,
          rentPrice: createRoomInput.rentPrice,
          roomType: createRoomInput.roomType,
          size: createRoomInput.size,
          owner: {
            connect: { id: ownerUser.id }
          },
          address: {
            create: {
              type: AddressType.R,
              street: createRoomInput.street,
              number: createRoomInput.number,
              other: createRoomInput.other,
              postalCode: createRoomInput.postalCode.toUpperCase(),
              city: { connect: { id: createRoomInput.cityId } }
            }
          }
        }
      });

      expect(result).toBe(mockRoom);
    });
  });

  describe('createRoomPicture', () => {
    it('should create a new room picture and adjust order if needed', async () => {
      // Mock responses for the transaction
      const mockPicture = { id: 1, url: 'example.jpg', isCover: true, createdAt: new Date(), order: 1, roomId: 9 } as RoomPicture;
      (prisma.roomPicture.create as jest.Mock).mockResolvedValue(mockPicture);
      (prisma.roomPicture.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.$transaction as jest.Mock).mockResolvedValue([{}, {}, mockPicture]);

      const roomId = 9;

      (prisma.room.findFirst as jest.Mock).mockResolvedValue({ id: roomId, owner: { id: ownerUser.id } });
      // Prepare input data
      const createRoomPictureInput: RoomPictureInput = {
        roomId: roomId,
        isCover: true,
        order: 1,
        url: 'public/img/rooms/image.jpg',
        ownerId: ownerUser.id
      };

      const result = await roomService.createRoomPicture(createRoomPictureInput);

      expect(prisma.roomPicture.create).toHaveBeenCalledWith({
        data: {
          order: createRoomPictureInput.order,
          url: createRoomPictureInput.url,
          isCover: createRoomPictureInput.isCover,
          room: {
            connect: { id: createRoomPictureInput.roomId }
          }
        }
      });

      expect(prisma.roomPicture.updateMany).toHaveBeenCalledWith({
        where: { roomId: createRoomPictureInput.roomId, order: { gte: createRoomPictureInput.order } },
        data: { order: { increment: 1 } }
      });

      expect(prisma.roomPicture.updateMany).toHaveBeenCalledWith({
        where: { roomId: createRoomPictureInput.roomId, isCover: true },
        data: { isCover: false }
      });

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toBe(mockPicture);
    });

    it('should skip cover unset if isCover is false', async () => {
      const mockPicture = { id: 1, url: 'example.jpg', isCover: false, createdAt: new Date(), order: 1, roomId: 9 } as RoomPicture;
      (prisma.roomPicture.create as jest.Mock).mockResolvedValue(mockPicture);
      (prisma.roomPicture.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prisma.$transaction as jest.Mock).mockResolvedValue([{}, mockPicture]);

      const roomId = 1;
      (prisma.room.findFirst as jest.Mock).mockResolvedValue({ id: roomId, owner: { id: ownerUser.id } });
      // Prepare input data
      const createRoomPictureInput: RoomPictureInput = {
        roomId: roomId,
        isCover: false,
        order: 2,
        url: 'public/img/rooms/image2.jpg',
        ownerId: ownerUser.id
      };

      const result = await roomService.createRoomPicture(createRoomPictureInput);

      expect(prisma.roomPicture.create).toHaveBeenCalled();
      // if the picture is not a cover, it shouldn't update the pictures twice
      expect(prisma.roomPicture.updateMany).toHaveBeenCalledTimes(1);
      expect(prisma.roomPicture.updateMany).toHaveBeenCalledWith({
        where: { roomId: createRoomPictureInput.roomId, order: { gte: createRoomPictureInput.order } },
        data: { order: { increment: 1 } }
      });

      // Check that unsetPictureCover was not added to the transaction
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toBe(mockPicture);
    });
  });

  it('should include cover unset if isCover is true', async () => {
    const mockPicture = { id: 1, url: 'example.jpg', isCover: true, createdAt: new Date(), order: 1, roomId: 9 } as RoomPicture;
    (prisma.roomPicture.create as jest.Mock).mockResolvedValue(mockPicture);
    (prisma.roomPicture.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (prisma.$transaction as jest.Mock).mockResolvedValue([{}, {}, mockPicture]);
    // Prepare input data
    const createRoomPictureInput: RoomPictureInput = {
      roomId: 1,
      isCover: true,
      order: 2,
      url: 'public/img/rooms/image2.jpg',
      ownerId: ownerUser.id
    };

    const result = await roomService.createRoomPicture(createRoomPictureInput);

    expect(prisma.roomPicture.create).toHaveBeenCalled();
    // if the picture is a cover, it should update the pictures twice
    expect(prisma.roomPicture.updateMany).toHaveBeenCalledTimes(2);
    expect(prisma.roomPicture.updateMany).toHaveBeenCalledWith({
      where: { roomId: createRoomPictureInput.roomId, order: { gte: createRoomPictureInput.order } },
      data: { order: { increment: 1 } }
    });

    // Check that unsetPictureCover was not added to the transaction
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toBe(mockPicture);
  });
});

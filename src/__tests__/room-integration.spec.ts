// room-integration.spec.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, JWT } from 'next-auth/jwt';
import { createMocks } from 'node-mocks-http';
import prisma from '../../prisma/client';
import RoomRouter from '../pages/api/room/[[...params]]';
import UserRouter from '../pages/api/user/[[...params]]';
import { User } from '@prisma/client';
import { CreateRoomInput } from '../app/dto/room/createRoom.input';

jest.mock('next-auth/jwt');
const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>;

describe("Room API - Authentication Required", () => {
  const validRoomData = {
    roomType: "S",
    bathroomType: "E",
    gender: "X",
    description: "A cozy single room with a private bathroom",
    rentPrice: 850.50,
    size: 15,
    numberOfRooms: 1,
    street: "Maple Street",
    number: 456,
    other: "Near the central park",
    postalCode: "A1B2C3",
    cityId: 0,
  };

  const validOwnerData = {
    type: "B",
    phone: "+15198003254",
    street: "King Street",
    number: 999,
    other: "Office",
    postalCode: "A1B2C9",
    cityId: 0,
  };

  let ownerUser: User | undefined = undefined;

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();

    const province = await prisma.province.create({
      data: { name: 'Ontario', abbreviation: 'ON' }
    });
    const city = await prisma.city.create({
      data: { name: 'Waterloo', provinceId: province.id }
    });
    validRoomData.cityId = city.id;
    validOwnerData.cityId = city.id;

    ownerUser = await prisma.user.create({
      data: {
        firstName: 'Jane',
        email: 'jane@example.com',
        lastName: 'Foster',
        password: 'StrongPass!1',
      }
    });
  });

  beforeEach(() => {
    mockedGetToken.mockReset();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Define test cases with `test.each`
  const roomFlowCases = [
    [
      "Successful room creation after upgrading to property owner",
      true, // token with user logged in
      validRoomData,
      201,
      validRoomData.description,
      true, // indicates that we should upgrade the user to property owner before room creation
    ],
    [
      "Fail to create room due to unauthorized access (without token)",
      false,
      validRoomData,
      401,
      "Unauthorized",
      false
    ],
    [
      "Fail to create room without property owner status",
      true, // token with user logged in
      validRoomData,
      400,
      "User is not a property owner",
      false
    ],
  ];

  test.each(roomFlowCases)(
    '%s',
    async (
      description,
      useToken,
      roomData,
      expectedStatus,
      expectedMessage,
      upgradeToOwner = false
    ) => {
      // Mock token
      let token = null;
      if (useToken) {
        token = {
          name: "Test User",
          id: (ownerUser as unknown as User).id
        } as JWT;
      }
      mockedGetToken.mockResolvedValue(token);

      if (upgradeToOwner) {
        const { req: reqUpgrade, res: resUpgrade } = createMocks<NextApiRequest, NextApiResponse>({
          method: 'PUT',
          url: '/api/user/property-owner',
          body: validOwnerData,
        });
        await UserRouter(reqUpgrade, resUpgrade);
        expect(resUpgrade._getStatusCode()).toBe(201);
      }

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        url: '/api/room',
        body: (roomData as CreateRoomInput),
      });

      await RoomRouter(req, res);

      expect(res._getStatusCode()).toBe(expectedStatus);
      if (expectedStatus === 201) {
        const responseData = res._getData();
        expect(responseData.description).toBe(expectedMessage);
      } else {
        const responseData = res._getData();
        expect(responseData).toContain(expectedMessage);
      }
    }
  );
});

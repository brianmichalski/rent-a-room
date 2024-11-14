import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, JWT } from 'next-auth/jwt';
import { createMocks, RequestMethod } from 'node-mocks-http';
import prisma from '../../prisma/client';
import { CreateRoomInput } from '../app/dto/room/createRoom.input';
import { UpdateRoomInput } from '../app/dto/room/updateRoom.input';
import RoomRouter from '../pages/api/room/[[...params]]';
import UserRouter from '../pages/api/user/[[...params]]';

jest.mock('next-auth/jwt');
const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>;

const apiBaseUrl = '/api/room';

// Shared data constants
const validRoomData: UpdateRoomInput | null = {
  roomType: "S",
  bathroomType: "E",
  gender: "X",
  description: faker.lorem.paragraph(1),
  rentPrice: faker.number.float({ min: 200, max: 1000, fractionDigits: 1 }),
  size: faker.number.int({ min: 10, max: 50 }),
  numberOfRooms: faker.number.int({ min: 1, max: 10 }),
  street: faker.location.street(),
  number: faker.number.int({ max: 3000 }),
  other: faker.lorem.paragraph(1),
  postalCode: "A1B2C3",
  cityId: 0,
  ownerId: 0,
  roomId: 0
};

const validOwnerData = {
  type: "B",
  phone: "+15198003254",
  street: faker.location.street(),
  number: faker.number.int({ max: 3000 }),
  other: faker.lorem.paragraph(1),
  postalCode: "A1B2C9",
  cityId: 0,
};

const newRoomDescription = faker.lorem.paragraph();

let actualOwnerUser: User | undefined = undefined;
let anotherOwnerUser: User | undefined = undefined;

async function createCityAndRoomData() {
  const province = await prisma.province.create({
    data: { name: 'Ontario', abbreviation: 'ON' }
  });
  const city = await prisma.city.create({
    data: { name: 'Waterloo', provinceId: province.id }
  });

  (validRoomData as UpdateRoomInput).cityId = city.id;
  validOwnerData.cityId = city.id;
}

async function createUsers() {
  actualOwnerUser = await prisma.user.create({
    data: {
      firstName: 'Actual',
      email: faker.internet.email(),
      lastName: 'Owner',
      password: 'StrongPass!1',
      isOwner: false
    }
  });

  anotherOwnerUser = await prisma.user.create({
    data: {
      firstName: 'Another',
      email: faker.internet.email(),
      lastName: 'Owner',
      password: 'StrongPass!1',
      isOwner: true
    }
  });
}

async function mockTokenForUser(user: User | null) {
  mockedGetToken.mockResolvedValue(user ? { name: user.firstName, id: user.id } as JWT : null);
}

beforeAll(async () => {
  await prisma.$connect();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();
  await createCityAndRoomData();
});

beforeEach(async () => {
  mockedGetToken.mockReset();
  await createUsers();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Room API - Room Creation Flow", () => {
  const createRoomFlowCases = [
    [
      "Successful room creation after upgrading to property owner",
      true, // token with user logged in
      validRoomData,
      201,
      validRoomData.description,
      true, // upgrade user to owner before creating room
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

  test.each(createRoomFlowCases)(
    '%s',
    async (description, useToken, roomData, expectedStatus, expectedMessage, upgradeToOwner = false) => {
      delete (roomData as UpdateRoomInput).roomId;

      // Mock token based on the test case
      await mockTokenForUser((useToken ? actualOwnerUser : null) as User);

      if (upgradeToOwner) {
        const { req: reqUpgradeUser, res: resUpgradeUser } = createMocks<NextApiRequest, NextApiResponse>({
          method: 'PUT',
          url: '/api/user/property-owner',
          body: validOwnerData,
        });
        await UserRouter(reqUpgradeUser, resUpgradeUser);
        expect(resUpgradeUser._getStatusCode()).toBe(201);
      }

      const { req: reqCreateRoom, res: resCreateRoom } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        url: apiBaseUrl,
        body: roomData as CreateRoomInput,
      });

      await RoomRouter(reqCreateRoom, resCreateRoom);

      expect(resCreateRoom._getStatusCode()).toBe(expectedStatus);
      const responseData = resCreateRoom._getData();
      if (expectedStatus === 201) {
        expect(responseData.description).toBe(expectedMessage);
      } else {
        expect(responseData).toContain(expectedMessage);
      }
    }
  );
});

describe("Room API - Room Update and Delete Flows", () => {
  const updateRoomFlowCases = [
    [
      "Successful UPDATE room by logging in with the property owner account",
      'PUT',
      true, // token with user logged in
      validRoomData,
      201,
      newRoomDescription,
      true
    ],
    [
      "Fail to UPDATE room due to unauthorized access (without token)",
      'PUT',
      false,
      validRoomData,
      401,
      "Unauthorized",
      true
    ],
    [
      "Fail to UPDATE room with a different user than the room's owner",
      'PUT',
      true, // token with user logged in
      validRoomData,
      400,
      "Room belongs to a different user",
      false
    ],
    [
      "Successful DELETE room by logging in with the property owner account",
      'DELETE',
      true, // token with user logged in
      validRoomData,
      204,
      'true',
      true
    ],
    [
      "Fail to DELETE room with a different user than the room's owner",
      'DELETE',
      true, // token with user logged in
      validRoomData,
      400,
      "Room belongs to a different user",
      false
    ],
  ];

  test.each(updateRoomFlowCases)(
    '%s',
    async (description, requestMethod, useToken, roomData, expectedStatus, expectedMessage, authenticateActualOwner) => {
      // Ensure that the user (actual owner) is set properly as isOwner
      await prisma.user.update({
        data: {
          isOwner: true
        },
        where: {
          id: actualOwnerUser?.id
        }
      });
      // Mock token based on the test case
      await mockTokenForUser((useToken ? actualOwnerUser : null) as User);

      // Create a room first
      const { req: reqCreateRoom, res: resCreateRoom } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        url: apiBaseUrl,
        body: roomData as CreateRoomInput,
      });
      await RoomRouter(reqCreateRoom, resCreateRoom);
      expect(resCreateRoom._getStatusCode()).toBe(useToken ? 201 : 401);

      // Switch token to another owner if needed
      if (!authenticateActualOwner) {
        await mockTokenForUser((useToken ? anotherOwnerUser : null) as User);
      }

      const newRoom = resCreateRoom._getData();
      (roomData as UpdateRoomInput).roomId = newRoom.id;
      (roomData as UpdateRoomInput).description = newRoomDescription;

      // Update/delete the room
      const method: RequestMethod = (requestMethod as RequestMethod);
      let httpParams;
      if (method === 'PUT') {
        httpParams = {
          method: method,
          url: apiBaseUrl,
          body: roomData as UpdateRoomInput,
        };
      } else if (method === 'DELETE') {
        httpParams = {
          method: method,
          url: `${apiBaseUrl}/${newRoom.id}`
        };
      }
      const { req: reqChangeRoom, res: resChangeRoom }
        = createMocks<NextApiRequest, NextApiResponse>(httpParams);

      await RoomRouter(reqChangeRoom, resChangeRoom);

      expect(resChangeRoom._getStatusCode()).toBe(expectedStatus);
      const responseData = resChangeRoom._getData();
      if (expectedStatus === 201) {
        expect(responseData.description).toBe(expectedMessage);
      } else {
        expect(responseData).toContain(expectedMessage);
      }
    }
  );
});

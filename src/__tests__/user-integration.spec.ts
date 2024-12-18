import { faker } from '@faker-js/faker/.';
import { UnauthorizedException } from 'next-api-decorators';
import { createMocks } from 'node-mocks-http';
import prisma from '../../prisma/client';
import { CreateUserInput } from '../app/dto';
import { authorizeUser } from '../pages/api/auth/[...nextauth]';
import createHandler from '../pages/api/user/[[...params]]';
import checkMissingFields from '../utils/test-utils';

const maxLoginAttempts = Number(process.env.USER_MAX_LOGIN_ATTEMPS);
const userIdsCache: number[] = [];

describe('User Registration and Login Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    // Clear user data before each test
    await prisma.room.deleteMany();
  });

  afterEach(async () => {
    // clear only the users created to avoid concurrency issues among test suites
    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIdsCache
        }
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Test cases for combined registration and login
  const userFlowCases = [
    [
      'Successful registration and login',
      {
        firstName: 'John',
        lastName: 'Doe',
        email: faker.internet.email(),
        password: 'StrongPass!1',
      } as CreateUserInput,
      [],
      201,
      true,
      1,
      'StrongPass!1'
    ],
    [
      'Failed login after unsuccessful registration (missing fields)',
      {
        firstName: 'Jane',
        email: faker.internet.email(),
        lastName: '',
        password: '1234',
      } as CreateUserInput,
      ['lastName', 'password'],
      400,
      false,
      1,
      'StrongPass!1'
    ],
    [
      'Block account after 3 failed login attemps',
      {
        firstName: 'Jane',
        email: faker.internet.email(),
        lastName: 'Foster',
        password: 'StrongPass!1',
      } as CreateUserInput,
      [],
      201,
      false,
      maxLoginAttempts + 1,
      'StrongPass!2'
    ],
  ];

  // Test suite
  test.each(userFlowCases)(
    '%s',
    async (
      description,
      registrationData,
      validationErrorFields,
      expectedRegistrationStatus,
      expectLoginSuccess,
      loginAttempts,
      loginPassword = (registrationData as CreateUserInput).password
    ) => {
      // Registration request and response
      const { req: reqCreate, res: resCreate } = createMocks({
        method: 'POST',
        url: '/api/user',
        body: registrationData as CreateUserInput,
      });

      // Perform the API request for user creation
      await createHandler(reqCreate, resCreate);

      // Check registration status
      expect(resCreate._getStatusCode()).toBe(expectedRegistrationStatus);

      // Proceed with login only if registration succeeded
      if (resCreate._getStatusCode() === 201) {
        userIdsCache.push(resCreate._getData().id);
      } else {
        const responseData = resCreate._getJSONData();
        // Check if the response contains errors
        expect(responseData).toHaveProperty('errors');
        // Check that each missing field has a validation error
        checkMissingFields(validationErrorFields as string[], responseData.errors);
      }
      const testThatUserIsBlocked = Number(loginAttempts) > maxLoginAttempts;

      const authParameters = {
        email: (registrationData as CreateUserInput).email,
        password: loginPassword as string,
      };
      for (let attemptNo = 1; attemptNo < Number(loginAttempts); attemptNo++) {
        const authResult = await authorizeUser(authParameters, prisma);

        if (expectLoginSuccess) {
          // Expect successful login
          expect(authResult?.email).toBe((registrationData as CreateUserInput).email);
        } else if (!testThatUserIsBlocked) {
          // Negative scenario: user should fail login
          // Expect null result if login fails
          expect(authResult).toBe(null);
        } else {
          // Negative scenario: user should fail login
          // Expect UnauthorizedException if user is blocked
          if (attemptNo === maxLoginAttempts) {
            await expect(authorizeUser(authParameters, prisma)).rejects.toThrow(UnauthorizedException);
          }
        }
      }
    }
  );
});
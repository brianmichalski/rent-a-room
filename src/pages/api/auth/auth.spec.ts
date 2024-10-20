import { User } from "@prisma/client";
import { hashSync } from "bcrypt";
import prisma from "../../../../prisma/client";
import { authorizeUser } from "./[...nextauth]";
import { UnauthorizedException } from "next-api-decorators";
import { subMinutes } from "date-fns";

// Mock the user type
const mockUser: User = {
  id: 1,
  firstName: "John",
  lastName: "Deacon",
  email: "john@example.com",
  password: hashSync("correctpassword", Number(process.env.SALT_ROUNDS)),
  lastLoginAttempt: null,
  failedLoginAttempts: 0
} as User;

const maxLoginAttempts = Number(process.env.USER_MAX_LOGIN_ATTEMPS);
const userBlockTime = Number(process.env.USER_BLOCK_TIME);

// Jest mock functions
jest.mock("../../../../prisma/client", () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

describe("authorizeUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("credentials not provided (should return null)", async () => {
    const result = await authorizeUser(undefined, prisma);
    expect(result).toBeNull();
  });

  it("user does not exist (should return null)", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const result = await authorizeUser({ email: "test@example.com", password: "correctpassword" }, prisma);
    expect(result).toBeNull();
  });

  it("password does not match (should return null)", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    const result = await authorizeUser({ email: "john@example.com", password: "wrongpassword" }, prisma);
    expect(result).toBeNull();
  });

  it("credentials are valid (should return user)", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    const result = await authorizeUser({ email: "john@example.com", password: "correctpassword" }, prisma);
    expect(result).toEqual({
      id: mockUser.id,
      name: `${mockUser.firstName} ${mockUser.lastName}`,
      email: mockUser.email
    });
  });

  it("user is blocked due to too many failed login attempts", async () => {
    // Simulate user has reached max login attempts
    const blockedUser = {
      ...mockUser,
      failedLoginAttempts: maxLoginAttempts,
      lastLoginAttempt: new Date(),
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(blockedUser);

    await expect(
      authorizeUser({ email: "john@example.com", password: "correctpassword" }, prisma)
    ).rejects.toThrow(UnauthorizedException);
  });

  it("user is blocked due to login attempt within block time", async () => {
    // Simulate user has failed logins, but block time has not passed
    const recentLoginAttempt = new Date(Date.now() - userBlockTime + 1000); // within block time
    const blockedUserWithinTime = {
      ...mockUser,
      failedLoginAttempts: maxLoginAttempts,
      lastLoginAttempt: recentLoginAttempt,
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(blockedUserWithinTime);

    await expect(
      authorizeUser({ email: "john@example.com", password: "correctpassword" }, prisma)
    ).rejects.toThrow(UnauthorizedException);
  });

  it("user is not blocked when block time has passed", async () => {
    // Simulate user has failed logins but block time has passed
    const oldLoginAttempt = subMinutes(new Date(), userBlockTime);
    const notBlockedUser = {
      ...mockUser,
      failedLoginAttempts: maxLoginAttempts,
      lastLoginAttempt: oldLoginAttempt,
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(notBlockedUser);

    const result = await authorizeUser({ email: "john@example.com", password: "correctpassword" }, prisma);
    expect(result).toEqual({
      id: mockUser.id,
      name: `${mockUser.firstName} ${mockUser.lastName}`,
      email: mockUser.email,
    });
  });
});

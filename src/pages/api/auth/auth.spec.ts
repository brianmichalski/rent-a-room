import { User } from "@prisma/client";
import { hashSync } from "bcrypt";
import prisma from "../../../../prisma/client";
import { authorizeUser } from "./[...nextauth]";

// Mock the user type
const mockUser: User & { password: string } = {
  id: 1,
  firstName: "John",
  lastName: "Deacon",
  email: "john@example.com",
  password: hashSync("correctpassword", Number(process.env.SALT_ROUNDS)),
} as unknown as User;

// Jest mock functions
jest.mock("../../../../prisma/client", () => ({
  user: {
    findUnique: jest.fn(),
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
});

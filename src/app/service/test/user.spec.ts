import { AddressType, User } from "@prisma/client";
import { hashSync } from "bcrypt";
import prisma from "../../../../prisma/client";
import { CreateUserInput, UpdatePropertyOwnerInput } from "../../dto";
import { UserService } from "../user.service";

// Mock data
const mockUser: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: hashSync("password123", Number(process.env.SALT_ROUNDS)),
  profilePictureUrl: "",
  phone: "1234567890",
  isOwner: true,
  addressId: 1
} as User;

// Jest mock functions
jest.mock("../../../../prisma/client", () => ({
  user: {
    create: jest.fn(),
    update: jest.fn(),
  }
}));

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(prisma);
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const createUserData: CreateUserInput = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        password: "securepassword"
      };

      const expectedUser: User = {
        id: 2,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        password: hashSync("securepassword", Number(process.env.SALT_ROUNDS)),
        profilePictureUrl: null,
        phone: null,
        isOwner: false,
        addressId: null
      } as User;

      (prisma.user.create as jest.Mock).mockResolvedValue(expectedUser);

      const result = await userService.createUser(createUserData);
      expect(result).toEqual(expectedUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          firstName: createUserData.firstName,
          lastName: createUserData.lastName,
          email: createUserData.email,
          password: expect.any(String), // We don't verify the exact bcrypt hash here
        }
      });
    });
  });

  describe("updatePropertyOwner", () => {
    it("should update the user as a property owner", async () => {
      const updateUserData: UpdatePropertyOwnerInput = {
        phone: "9876543210",
        type: AddressType.R,
        street: "Main Street",
        number: 123,
        other: "Apartment 4B",
        postalCode: "A1B2C3",
        cityId: 1
      };

      const updatedUser: User = {
        ...mockUser,
        phone: updateUserData.phone,
        isOwner: true
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userService.updatePropertyOwner(mockUser.id, updateUserData);

      expect(result).toEqual(updatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          profilePictureUrl: '',
          phone: updateUserData.phone,
          isOwner: true,
          address: {
            create: {
              type: updateUserData.type,
              street: updateUserData.street,
              number: updateUserData.number,
              other: updateUserData.other,
              postalCode: updateUserData.postalCode.toUpperCase(),
              city: {
                connect: {
                  id: updateUserData.cityId
                }
              }
            }
          }
        }
      });
    });
  });
});

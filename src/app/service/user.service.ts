import { User } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { differenceInMinutes } from "date-fns";
import { UnauthorizedException } from "next-api-decorators";
import prisma from "../../../prisma/client";
import { CreateUserInput, UpdatePropertyOwnerInput } from "../dto";

export class UserService {
  private prisma;

  constructor(_prisma: typeof prisma) {
    this.prisma = _prisma;
  }

  private checkIfUserIsBlocked(user: User) {
    const maxLoginAttempts = Number(process.env.USER_MAX_LOGIN_ATTEMPS);
    if ((user.failedLoginAttempts ?? 0) >= maxLoginAttempts) {
      const now = new Date();
      const userBlockTime = Number(process.env.USER_BLOCK_TIME);
      const lastAttemptInMinutes = differenceInMinutes(now, user.lastLoginAttempt ?? now);
      const remainingBlockTime = userBlockTime - lastAttemptInMinutes;
      if (remainingBlockTime > 0) {
        throw new UnauthorizedException(`User blocked for ${remainingBlockTime} minute(s)`);
      }
    }
  }

  private async updateLoginAttempData(user: User, failedAttemps: number) {
    const now = new Date();
    await this.prisma.user.update({
      data: {
        failedLoginAttempts: failedAttemps,
        lastLoginAttempt: now
      },
      where: {
        id: user.id
      }
    });
  }

  public async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }

    this.checkIfUserIsBlocked(user);

    // Compare the hashed password with the user's provided password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      await this.updateLoginAttempData(user, user.failedLoginAttempts + 1);
      return null;
    }

    await this.updateLoginAttempData(user, 0);
    return user;
  }

  public async createUser(data: CreateUserInput): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: await hash(data.password, Number(process.env.SALT_ROUNDS))
      }
    });
    return newUser;
  }

  public async updatePropertyOwner(id: number, data: UpdatePropertyOwnerInput): Promise<User> {
    return await this.prisma.user.update({
      data: {
        profilePictureUrl: '',
        phone: data.phone,
        isOwner: true,
        address: {
          create: {
            type: data.type,
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
      },
      where: {
        id: id
      }
    });
  }
}
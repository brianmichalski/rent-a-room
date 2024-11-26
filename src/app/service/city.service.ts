import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client";
import { CityResult } from "../../types/results";

export class CityService {
  private prisma;

  constructor(_prisma: typeof prisma) {
    this.prisma = _prisma;
  }

  public async getAll(query: string) {
    const where: Prisma.CityWhereInput = {};
    if (query.length < 4) {
      where.name = {
        startsWith: query,
        mode: 'insensitive'
      };
    } else {
      where.name = {
        contains: query,
        mode: 'insensitive'
      };
    }
    const cities = await this.prisma.city.findMany({
      include: {
        province: true
      },
      where: where,
      orderBy: {
        name: "asc"
      }
    });
    return cities.map(city => ({
      id: city.id,
      name: city.name,
      province: city.province.abbreviation
    }) as CityResult);
  }

  public async getAllByProvince(provinceId: number) {
    return await this.prisma.city.findMany({
      include: {
        province: true
      },
      where: {
        province: {
          id: provinceId
        }
      },
      orderBy: {
        name: "asc"
      }
    });
  }

  public async getAllProvinces() {
    return await this.prisma.province.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }
}
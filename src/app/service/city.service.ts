import prisma from "../../../prisma/client";

export class CityService {
  private prisma;

  constructor(_prisma: typeof prisma) {
    this.prisma = _prisma;
  }

  public async getAll(provinceId: number) {
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
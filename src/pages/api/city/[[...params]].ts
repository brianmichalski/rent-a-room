import { City, Province } from '@prisma/client';
import {
  Get,
  HttpCode,
  Param,
  createHandler
} from 'next-api-decorators';
import prisma from '../../../../prisma/client';
import { CityService } from '../../../app/service/city.service';

class CityRouter {
  protected service: CityService;

  constructor() {
    this.service = new CityService(prisma);
  }

  @Get('/provinces')
  @HttpCode(201)
  public async getAllProvinces(): Promise<Province[]> {
    return await this.service.getAllProvinces();
  }

  @Get('/:provinceId')
  @HttpCode(201)
  public async getAllCities(@Param("provinceId") provinceId: number): Promise<City[]> {
    return await this.service.getAll(Number(provinceId));
  }
}

export default createHandler(CityRouter);

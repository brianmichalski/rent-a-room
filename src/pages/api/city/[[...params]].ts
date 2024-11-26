import { City, Province } from '@prisma/client';
import {
  Get,
  HttpCode,
  Param,
  Query,
  createHandler
} from 'next-api-decorators';
import prisma from '../../../../prisma/client';
import { CityService } from '../../../app/service/city.service';
import { CityResult } from '../../../types/results';

class CityRouter {
  protected service: CityService;

  constructor() {
    this.service = new CityService(prisma);
  }

  @Get()
  @HttpCode(201)
  public async getAll(@Query('query') query: string): Promise<CityResult[]> {
    return await this.service.getAll(query);
  }

  @Get('/provinces')
  @HttpCode(201)
  public async getAllProvinces(): Promise<Province[]> {
    return await this.service.getAllProvinces();
  }

  @Get('/:provinceId')
  @HttpCode(201)
  public async getAllCities(@Param("provinceId") provinceId: number): Promise<City[]> {
    return await this.service.getAllByProvince(Number(provinceId));
  }
}

export default createHandler(CityRouter);

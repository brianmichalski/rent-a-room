import { IsArray, IsBoolean, IsEmpty } from 'class-validator';

export class RoomPictureOrderInput {
  @IsArray()
  public ids!: number[];

  @IsBoolean()
  public ascending!: boolean;

  @IsEmpty()
  public ownerId?: number;
}

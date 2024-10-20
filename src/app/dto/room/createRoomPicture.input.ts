import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class CreateRoomPictureInput {
  @IsOptional()
  @IsBoolean()
  public isCover?: boolean;

  @IsInt()
  @Min(1)
  public order!: number;

  public url!: string;
}

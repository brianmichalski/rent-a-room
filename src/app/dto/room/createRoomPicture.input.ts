import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateRoomPictureInput {
  @IsNotEmpty()
  public roomId!: number;

  @IsOptional()
  @IsBoolean()
  public isCover?: boolean;

  @IsInt()
  @Min(1)
  public order!: number;

  public url!: string;
}

import { IsBoolean, IsEmpty, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class RoomPictureInput {
  @IsNotEmpty()
  public roomId!: number;

  @IsOptional()
  @IsBoolean()
  public isCover?: boolean;

  @IsInt()
  @Min(1)
  public order!: number;

  @IsEmpty()
  public url!: string;

  @IsOptional()
  public ownerId!: number;
}

import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class RoomPictureInput {
  @IsNotEmpty()
  public roomId!: number;

  @IsEmpty()
  public urls?: string[];

  @IsOptional()
  public ownerId?: number;
}

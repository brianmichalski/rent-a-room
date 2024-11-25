import { IsEmpty, Min } from 'class-validator';

export class RoomPictureOrderInput {
  @Min(1)
  public order!: number;

  @IsEmpty()
  public ownerId?: number;
}

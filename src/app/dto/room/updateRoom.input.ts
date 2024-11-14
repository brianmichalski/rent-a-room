import {
  IsNumber,
  IsOptional
} from 'class-validator';
import { CreateRoomInput } from './createRoom.input';

export class UpdateRoomInput extends CreateRoomInput {

  @IsNumber()
  @IsOptional()
  public roomId!: number;

}
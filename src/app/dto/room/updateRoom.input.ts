import {
  IsNumber
} from 'class-validator';
import { CreateRoomInput } from './createRoom.input';

export class UpdateRoomInput extends CreateRoomInput {

  @IsNumber()
  public roomId?: number;

}
import { BathroomType, Gender, RoomType } from "@prisma/client";
import { RoomResult } from "../../types/results";

export interface RoomWithCover extends RoomResult {
  coverImageUrl: string;
}
export interface RoomWithCover {
  id: number;
  roomType: string;
  bathroomType: string;
  gender: string;
  rentPrice: number;
  size: number;
  numberOfRooms: number;
  isRented: boolean;
  coverImageUrl: string;
}
import { BathroomType, Gender, RoomType } from '@prisma/client';
import { validate } from 'class-validator'; // Adjust path if necessary
import { RoomInput } from '../room.input';

describe('CreateRoomInput Class Fields Validation', () => {
  let createRoomInput: RoomInput;

  beforeEach(() => {
    createRoomInput = new RoomInput();
    createRoomInput.roomType = RoomType.S;
    createRoomInput.bathroomType = BathroomType.E;
    createRoomInput.gender = Gender.F;
    createRoomInput.description = 'Spacious and cozy room.';
    createRoomInput.rentPrice = 1000;
    createRoomInput.size = 20;
    createRoomInput.numberOfRooms = 3;
    createRoomInput.street = '456 Elm St';
    createRoomInput.number = 123;
    createRoomInput.other = 'Apartment 2B';
    createRoomInput.postalCode = 'B2C3D4';
    createRoomInput.cityId = 567;
  });

  it('should validate successfully with correct data', async () => {
    const errors = await validate(createRoomInput);
    expect(errors.length).toBe(0);
  });

  it('should fail if roomType is invalid', async () => {
    createRoomInput.roomType = 'INVALID_ROOM_TYPE' as RoomType;
    const errors = await validate(createRoomInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should fail if bathroomType is invalid', async () => {
    createRoomInput.bathroomType = 'INVALID_BATHROOM_TYPE' as BathroomType;
    const errors = await validate(createRoomInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should fail if gender is invalid', async () => {
    createRoomInput.gender = 'INVALID_GENDER' as Gender;
    const errors = await validate(createRoomInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });

  it('should fail if description is empty', async () => {
    createRoomInput.description = '';
    const errors = await validate(createRoomInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if rentPrice is less than 1', async () => {
    createRoomInput.rentPrice = 0;
    const errors = await validate(createRoomInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  it('should fail if size is less than 1', async () => {
    createRoomInput.size = 0;
    const errors = await validate(createRoomInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  it('should fail if numberOfRooms is less than 1', async () => {
    createRoomInput.numberOfRooms = 0;
    const errors = await validate(createRoomInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.min).toBeDefined();
  });
});

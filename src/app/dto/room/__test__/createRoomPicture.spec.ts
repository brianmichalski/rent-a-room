import { validate } from 'class-validator';
import { CreateRoomPictureInput } from '../createRoomPicture.input';

describe('CreateRoomPictureInput Class Fields Validation', () => {
  let createRoomPictureInput: CreateRoomPictureInput;

  beforeEach(() => {
    createRoomPictureInput = new CreateRoomPictureInput();
    createRoomPictureInput.roomId = 1;
    createRoomPictureInput.isCover = true;
    createRoomPictureInput.order = 1;
    createRoomPictureInput.url = 'public/img/rooms/image.jpg';
  });

  it('should validate successfully with correct data', async () => {
    const errors = await validate(createRoomPictureInput);
    expect(errors.length).toBe(0);
  });

  it('should fail if roomId is empty', async () => {
    createRoomPictureInput.roomId = undefined as unknown as number;
    const errors = await validate(createRoomPictureInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should validate successfully with isCover being optional', async () => {
    createRoomPictureInput.isCover = undefined;
    const errors = await validate(createRoomPictureInput);
    expect(errors.length).toBe(0);
  });

  it('should fail if isCover is not a boolean', async () => {
    createRoomPictureInput.isCover = 'notABoolean' as unknown as boolean;
    const errors = await validate(createRoomPictureInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isBoolean).toBeDefined();
  });

  it('should fail if order is less than 1', async () => {
    createRoomPictureInput.order = 0;
    const errors = await validate(createRoomPictureInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  it('should fail if order is not an integer', async () => {
    createRoomPictureInput.order = 1.5;
    const errors = await validate(createRoomPictureInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isInt).toBeDefined();
  });

});

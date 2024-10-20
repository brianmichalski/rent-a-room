import { validate } from 'class-validator';
import { AddressType } from '@prisma/client';
import { UpdatePropertyOwnerInput } from '../updatePropertyOwner.input';

describe('UpdatePropertyOwnerInput', () => {
  let input: UpdatePropertyOwnerInput;

  beforeEach(() => {
    input = new UpdatePropertyOwnerInput();
  });

  it('should pass validation with correct data', async () => {
    input.type = AddressType.R;
    input.street = 'Main St';
    input.number = 123;
    input.other = 'Apt 1';
    input.postalCode = 'A1B2C3';
    input.cityId = 1;
    input.phone = '+14165555555';

    const errors = await validate(input);
    expect(errors.length).toBe(0);
  });

  it('should fail if postal code is not in correct format', async () => {
    input.type = AddressType.R;
    input.street = 'Main St';
    input.number = 123;
    input.postalCode = 'INVALID';
    input.cityId = 1;
    input.phone = '+14165555555';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.matches).toBeDefined();
  });

  it('should fail if phone number is not valid', async () => {
    input.type = AddressType.B;
    input.street = 'Main St';
    input.number = 123;
    input.postalCode = 'A1B2C3';
    input.cityId = 1;
    input.phone = '123';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isPhoneNumber).toBeDefined();
  });

  it('should fail if type is not in AddressType enum', async () => {
    input.type = 'NULL' as AddressType;
    input.street = 'Main St';
    input.number = 123;
    input.postalCode = 'A1B2C3';
    input.cityId = 1;
    input.phone = '+14165555555';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEnum).toBeDefined();
  });
});

import { validate } from 'class-validator'; // Adjust path if necessary
import { AddressInput } from '../address.input';

describe('AddressInput Validation', () => {
  let addressInput: AddressInput;

  beforeEach(() => {
    addressInput = new AddressInput();
    addressInput.street = '456 Elm St';
    addressInput.number = 123;
    addressInput.other = 'Apartment 2B';
    addressInput.postalCode = 'B2C3D4';
    addressInput.cityId = 567;
  });

  it('should validate successfully with correct data', async () => {
    const errors = await validate(addressInput);
    expect(errors.length).toBe(0);
  });

  it('should fail if street is empty', async () => {
    addressInput.street = '';
    const errors = await validate(addressInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if street exceeds max length', async () => {
    addressInput.street = 'A'.repeat(101);
    const errors = await validate(addressInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.maxLength).toBeDefined();
  });

  it('should fail if number is empty', async () => {
    addressInput.number = undefined as unknown as number;
    const errors = await validate(addressInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should pass if "other" field is empty (optional)', async () => {
    addressInput.other = undefined;
    const errors = await validate(addressInput);
    expect(errors.length).toBe(0);
  });

  it('should fail if postalCode does not match the pattern', async () => {
    addressInput.postalCode = '123456'; // Invalid pattern
    const errors = await validate(addressInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.matches).toBeDefined();
  });

  it('should fail if postalCode exceeds max length', async () => {
    addressInput.postalCode = 'A1B2C3D'; // Exceeds 6 characters
    const errors = await validate(addressInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.maxLength).toBeDefined();
  });

  it('should fail if cityId is empty', async () => {
    addressInput.cityId = undefined as unknown as number;
    const errors = await validate(addressInput);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });
});

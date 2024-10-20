import { validate } from 'class-validator';
import { CreateUserInput } from '../createUser.input';

describe('CreateUserInput', () => {
  let input: CreateUserInput;

  beforeEach(() => {
    input = new CreateUserInput();
    input.firstName = 'John';
    input.lastName = 'Doe';
    input.email = 'john.doe@example.com';
    input.password = 'StrongPass1!';
  });

  it('should pass validation with correct data', async () => {
    const errors = await validate(input);
    expect(errors.length).toBe(0);
  });

  it('should fail if firstName is empty', async () => {
    input.firstName = '';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if email is invalid', async () => {
    input.email = 'not-an-email';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });

  it('should fail if password length is less than 8 characters', async () => {
    input.password = 'smallpw';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.minLength).toBeDefined();
  });

  it('should fail if password is not strong enough', async () => {
    input.password = 'weakpass';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isStrongPassword).toBeDefined();
  });
});

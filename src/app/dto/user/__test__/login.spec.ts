import { validate } from 'class-validator';
import { LoginInput } from '../login.input';

describe('LoginInput', () => {
  let input: LoginInput;

  beforeEach(() => {
    input = new LoginInput();
  });

  it('should pass validation with correct data', async () => {
    input.email = 'john.doe@example.com';
    input.password = 'password123';

    const errors = await validate(input);
    expect(errors.length).toBe(0);
  });

  it('should fail if email is not valid', async () => {
    input.email = 'invalid-email';
    input.password = 'password123';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });

  it('should fail if email is empty', async () => {
    input.email = '';
    input.password = 'password123';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail if password is empty', async () => {
    input.email = 'john.doe@example.com';
    input.password = '';

    const errors = await validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });
});

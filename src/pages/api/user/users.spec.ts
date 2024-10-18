import { describe, expect, test } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handleUsers from './[[...params]]';
import { CreateUserInput } from '../../../app/dto';

describe('/api/users/[[...params]]', () => {

  test('Create a user', async () => {
    // const data = {
    //   firstName: 'Sample Kohn',
    //   lastName: 'Kohn',
    //   email: 'sample.khon@gmail.com',
    //   password: 'q1W@e3R$t5'
    // };
    // const userData: CreateUserInput = data;

    // const { req, res } = createMocks({
    //   method: 'POST',
    //   url: '/api/users',
    //   body: userData
    // });

    // await handleUsers(req, res);

    // expect(res._getStatusCode()).toBe(201);
    // expect(res._getData()).toEqual(
    //   expect.objectContaining(data)
    // );
  });
});
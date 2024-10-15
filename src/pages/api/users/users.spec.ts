import { describe, expect, test } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handleUsers from './[[...params]]';
import { CreateUserInput } from '../../../app/dto';

describe('/api/users/[[...params]]', () => {
    test('Fetches a user', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            url: '/api/users/101',
        });

        await handleUsers(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getData()).toEqual(
            expect.objectContaining({
                id: 101,
            }),
        );
    });

    test('Returns 404', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            url: '/api/users/101111',
        });

        await handleUsers(req, res);

        expect(res._getStatusCode()).toBe(404);
        expect(JSON.parse(res._getData())).toEqual(
            expect.objectContaining({
                message: "No user found with ID '101111'.",
            }),
        );
    });

    test('New user', async () => {
        const data = {
            email: 'sample.khon@gmail.com',
            name:  'Sample Kohn'
        }
        const userData : CreateUserInput = data;

        const { req, res } = createMocks({
            method: 'POST',
            url: '/api/users',
            body: userData
        });

        await handleUsers(req, res);

        expect(res._getStatusCode()).toBe(201);
        expect(res._getData()).toEqual(
            expect.objectContaining(data)
        );
    });

    test('Delete user', async () => {
        const { req, res } = createMocks({
            method: 'DELETE',
            url: '/api/users/101',
        });

        await handleUsers(req, res);

        console.log(res.body);
        
        expect(res._getStatusCode()).toBe(204);
    });
});
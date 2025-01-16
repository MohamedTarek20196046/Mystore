const request = require('supertest');
let authToken = '';
let oldToken = ""
const invalidToken = "askdandaklsdald"
const userEmail = "tester@test.com"
const username = "tester"
const pass = "test123"
const newEmail = "newtester@test.com"
const newUsername = "newtester"
const newPass = "newtest123"
describe('mock auth api tests', () => {
    // Register tests
    it('Testing register with missing attributes ', async () => {
        const User = {
            name: username,
            password: pass
        };
        const response = await request('http://localhost:3000')
            .post('/api/v1/users')
            .send(User);
        expect(response.status).toBe(400);
    });
    it('Testing register functionality', async () => {
        const User = {
            name: username,
            email: userEmail,
            password: pass
        };

        const response = await request('http://localhost:3000')
            .post('/api/v1/users')
            .send(User);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User registered with success');
        expect(response.body).toHaveProperty('token');

    });

    it('Testing register with a used email ', async () => {
        const User = {
            name: username,
            email: userEmail,
            password: pass
        };
        const response = await request('http://localhost:3000')
            .post('/api/v1/users')
            .send(User);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'User already registered');
    });
    // Login tests
    it('Testing Login with valid credentials', async () => {
        const User = {
            email: userEmail,
            password: pass
        };
        const response = await request('http://localhost:3000')
            .post('/api/v1/auth')
            .send(User);
        authToken = response.body.token
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
    it('Testing Login with invalid credentials', async () => {
        const User = {
            email: newEmail,
            password: newPass
        };
        const response = await request('http://localhost:3000')
            .post('/api/v1/auth')
            .send(User);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', "Incorrect email or password");
    });
    // get user info tests
    it('Testing get user data', async () => {
        const response = await request('http://localhost:3000')
            .get('/api/v1/users')
            .set('Authorization', ` ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', username);
        expect(response.body).toHaveProperty('email', userEmail);
        expect(response.body).toHaveProperty('password', pass);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('imageUrl');
    });
    it('Testing get user data without token', async () => {
        const response = await request('http://localhost:3000')
            .get('/api/v1/users')
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', "Unauthorized");
    });
    it('Testing get user data with wrong token', async () => {
        const response = await request('http://localhost:3000')
            .get('/api/v1/users')
            .set('Authorization', ` ${invalidToken}`);
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', "Unauthorized");
    });
    // user update tests
    it('Testing update functionality', async () => {
        const newUser = {
            name: newUsername,
            email: newEmail,
            password: newPass
        };
        const response = await request('http://localhost:3000')
            .patch('/api/v1/users')
            .set('Authorization', ` ${authToken}`)
            .send(newUser);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', "User updated with success!");
    });
    it('Testing update functionality without a token', async () => {
        const newUser = {
            name: newUsername,
            email: newEmail,
            password: newPass
        };
        const response = await request('http://localhost:3000')
            .patch('/api/v1/users')
            .send(newUser);
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', "jwt must be provided");
    });
    it('Testing update functionality without an invalid token', async () => {
        const newUser = {
            name: newUsername,
            email: newEmail,
            password: newPass
        };
        const response = await request('http://localhost:3000')
            .patch('/api/v1/users')
            .set('Authorization', ` ${invalidToken}`)
            .send(newUser);
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', "jwt malformed");
    });

    // login after update test
    it('Testing Login after update with new credentials', async () => {
        const User = {
            email: newEmail,
            password: newPass
        };
        oldToken = authToken;
        const response = await request('http://localhost:3000')
            .post('/api/v1/auth')
            .send(User);
        authToken = response.body.token
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
    it('Testing Login after update with old credentials', async () => {
        const User = {
            email: userEmail,
            password: pass
        };
        const response = await request('http://localhost:3000')
            .post('/api/v1/auth')
            .send(User);
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', "Incorrect email or password");
    });
    //delete single user tests
    it('Testing delete functionality with old token ', async () => {
        const response = await request('http://localhost:3000')
            .delete('/api/v1/users/')
            .set('Authorization', ` ${oldToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Unauthorized to delete');
    });
    it('Testing delete functionality without token ', async () => {
        const response = await request('http://localhost:3000')
            .delete('/api/v1/users/')
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Unauthorized to delete');
    });
    it('Testing delete functionality with new token ', async () => {
        const response = await request('http://localhost:3000')
            .delete('/api/v1/users/')
            .set('Authorization', ` ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User deleted with success!');
    });
    // delete all api tests
    it('deleting all with invalid keyadmin ', async () => {
        const body = {
            key_admin: "keyadmisadsdn123"
        }
        const response = await request('http://localhost:3000')
            .delete('/api/v1/all-users/')
            .send(body)
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', 'Unauthorized access');
    });
    it('create user to delete using delete all users api ', async () => {
        const User = {
            name: username,
            email: userEmail,
            password: pass
        };
        await request('http://localhost:3000')
            .post('/api/v1/users')
            .send(User);
        const body = {
            key_admin: "keyadmin123"
        }
        const response = await request('http://localhost:3000')
            .delete('/api/v1/all-users/')
            .send(body)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Users deleted with success');
    });
    it('check all users were deleted using delete all api', async () => {
        const User = {
            email: userEmail,
            password: pass
        };
        const response = await request('http://localhost:3000')
            .post('/api/v1/auth')
            .send(User);
        authToken = response.body.token
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', "Incorrect email or password");
    });
    
});

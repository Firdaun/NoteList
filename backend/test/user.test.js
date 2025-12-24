import supertest from "supertest"
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js"
import app from "../src/main.js"


describe('POST /api/users/register', () => {

    beforeEach(async () => {
        await removeTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can register new user', async () => {
        const result = await supertest(app)
        .post('/api/users/register')
        .send({
            username: "test",
            password: "rahasia",
            name: "test"
        })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("test")
        expect(result.body.data.password).toBeUndefined()
    })

    it('should reject if request is invalid', async () => {
        const result = await supertest(app)
            .post('/api/users/register')
            .send({
                username: "", // Username kosong (Error)
                password: "",
                name: ""
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already exists', async () => {
        await createTestUser()

        const result = await supertest(app)
        .post('/api/users/register')
        .send({
            username: "test",
            password: "rahasia",
            name: "test"
        })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBe("username already exists")
    })

})

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await removeTestUser()
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can login', async () => {
        const result = await supertest(app)
        .post('/api/users/login')
        .send({
            username: "test",
            password: "rahasia"
        })

        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
        expect(result.body.data.token).not.toBeNull()
    })
    
    it('should reject login if password wrong', async () => {
        const result = await supertest(app)
        .post('/api/users/login')
        .send({
            username: "test",
            password: "ngawur"
        })

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await removeTestUser()
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can get current user', async () => {
        const result = await supertest(app)
            .get('/api/users/current')
            .set('Authorization', 'test') // Kirim token

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("test")
    })

    it('should reject if token is invalid', async () => {
        const result = await supertest(app)
            .get('/api/users/current')
            .set('Authorization', 'salah') // Token salah

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await removeTestUser()
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can update user', async () => {
        const result = await supertest(app)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: "Fahrul",
                password: "passwordBaru"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("Fahrul")
        expect(result.body.data.username).toBe("test")
    })

    it('should can update username only', async () => {
        const result = await supertest(app)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: "Fahrul"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("Fahrul")
    })

    it('should can update user password only', async () => {
        const result = await supertest(app)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                password: "passwordBaru"
            })

        expect(result.status).toBe(200)
        
        const user = await getTestUser();
        expect(user.password).not.toBe("rahasia"); 
    })
})

describe('DELETE /api/users/logout', () => {
    beforeEach(async () => {
        await removeTestUser()
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can logout', async () => {
        const result = await supertest(app)
            .delete('/api/users/logout')
            .set('Authorization', 'test')

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        const user = await getTestUser()
        expect(user.token).toBeNull()
    })

    it('should reject logout if token is invalid', async () => {
        const result = await supertest(app)
            .delete('/api/users/logout')
            .set('Authorization', 'salah')

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})
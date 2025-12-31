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
        expect(result.body.data.token).toBeUndefined()
        expect(result.get('Set-Cookie')).toBeDefined()
        const cookies = result.get('Set-Cookie').toString();
        expect(cookies).toContain('token=')
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
            .set('Cookie', 'token=test')

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("test")
    })

    it('should reject if token is invalid', async () => {
        const result = await supertest(app)
            .get('/api/users/current')
            .set('Cookie', 'token=salah')

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
            .set('Cookie', 'token=test')
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
            .set('Cookie', 'token=test')
            .send({
                name: "Fahrul"
            })

        expect(result.status).toBe(200)
        expect(result.body.data.name).toBe("Fahrul")
    })

    it('should can update user password only', async () => {
        const result = await supertest(app)
            .patch('/api/users/current')
            .set('Cookie', 'token=test')
            .send({
                password: "passwordBaru"
            })

        expect(result.status).toBe(200)
        
        const user = await getTestUser();
        expect(user.password).not.toBe("rahasia"); 
    })

    it('should reject if new password is same as old password', async () => {
        const result = await supertest(app)
            .patch('/api/users/current')
            .set('Cookie', 'token=test')
            .send({
                password: "rahasia"
            })

        expect(result.status).toBe(400)
        expect(result.body.errors).toBe("Password kamu sama dengan yang sebelumnya")
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
            .set('Cookie', 'token=test')

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        const cookies = result.get('Set-Cookie').toString()
        expect(cookies).toContain('token=;')
        const user = await getTestUser()
        expect(user.token).toBeNull()
    })

    it('should reject logout if token is invalid', async () => {
        const result = await supertest(app)
            .delete('/api/users/logout')
            .set('Cookie', 'token=salah')

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
        await removeTestUser()
        await createTestUser()
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can delete current user', async () => {
        const result = await supertest(app)
            .delete('/api/users/current')
            .set('Cookie', 'token=test')

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        // Verifikasi: Coba cari user di database, harusnya null (hilang)
        const user = await getTestUser()
        expect(user).toBeNull()
    })

    it('should reject delete if token is invalid', async () => {
        const result = await supertest(app)
            .delete('/api/users/current')
            .set('Cookie', 'token=salah') // Token ngawur

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})
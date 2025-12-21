import supertest from "supertest"
import { createTestUser, removeTestUser } from "./test-util.js"
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
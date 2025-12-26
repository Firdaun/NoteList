import supertest from "supertest"
import { createManyTestCategories, createTestCategory, createTestUser, removeTestCategory, removeTestUser } from "./test-util"
import app from "../src/main"

describe('POST /api/categories', () => {
    beforeEach(async () => {
        await removeTestUser()
        await createTestUser()
        await removeTestCategory()
    })

    afterEach(async () => {
        await removeTestCategory()
        await removeTestUser()
    })

    it('should can create new category', async () => {
        const result = await supertest(app)
            .post('/api/categories')
            .set('Cookie', 'token=test')
            .send({
                name: 'Elektronik'
            })

        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe("Elektronik");
        expect(result.body.data.id).toBeDefined();
    })

    it('should reject if category name is invalid', async () => {
        const result = await supertest(app)
            .post('/api/categories')
            .set('Cookie', 'token=test')
            .send({
                name: ''
            })

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })

    it('should reject if user has reached limit (5 categories)', async () => {
        await createManyTestCategories();

        const result = await supertest(app)
            .post('/api/categories')
            .set('Cookie', 'token=test')
            .send({
                name: "Kategori Ke-6"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
        expect(result.body.errors).toContain("Category limit reached!");
    });
})

describe('GET /api/categories', function () {
    beforeEach(async () => {
        await removeTestCategory();
        await removeTestUser();
        await createTestUser();
        await createTestCategory();
    });

    afterEach(async () => {
        await removeTestCategory();
        await removeTestUser();
    });

    it('should can get list of categories', async () => {
        const result = await supertest(app)
            .get('/api/categories')
            .set('Cookie', 'token=test')

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
    });
});

describe('PUT /api/categories/:categoryId', function () {
    beforeEach(async () => {
        await removeTestCategory();
        await removeTestUser();
        await createTestUser();
        await createTestCategory();
    });

    afterEach(async () => {
        await removeTestCategory();
        await removeTestUser();
    });

    it('should can update/replace category', async () => {
        const testCategory = await supertest(app)
            .get('/api/categories')
            .set('Cookie', 'token=test')

        const categoryId = testCategory.body.data[0].id;

        const result = await supertest(app)
            .put('/api/categories/' + categoryId)
            .set('Cookie', 'token=test')
            .send({
                name: "Gadget" // Ganti dari Elektronik ke Gadget
            });

        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe("Gadget");
    });

    it('should reject if category is not found', async () => {
        const result = await supertest(app)
            .put('/api/categories/' + 9999) // ID Ngawur
            .set('Cookie', 'token=test')
            .send({
                name: "Gadget"
            });

        expect(result.status).toBe(404);
    });
});
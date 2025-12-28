import supertest from "supertest";
import { createTestCategory, createTestNote, createTestUser, removeTestCategory, removeTestNote, removeTestUser } from "./test-util.js";
import app from "../src/main.js"; // Pastikan import app benar

describe('POST /api/notes', () => {
    // Setup awal: Bersihkan semua, lalu buat User & Kategori
    beforeEach(async () => {
        await removeTestNote();
        await removeTestCategory();
        await removeTestUser();
        
        await createTestUser();
        await createTestCategory(); // Note butuh kategori
    });

    afterEach(async () => {
        await removeTestNote();
        await removeTestCategory();
        await removeTestUser();
    });

    it('should can create new note', async () => {
        // Ambil ID kategori dulu
        const responseCategory = await supertest(app)
            .get('/api/categories')
            .set('Cookie', 'token=test');
        const categoryId = responseCategory.body.data[0].id;

        const result = await supertest(app)
            .post('/api/notes')
            .set('Cookie', 'token=test')
            .send({
                title: "Catatan Penting",
                content: "Belajar Backend itu seru",
                categoryId: categoryId
            });

        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe("Catatan Penting");
        expect(result.body.data.categoryId).toBe(categoryId);
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(app)
            .post('/api/notes')
            .set('Cookie', 'token=test')
            .send({
                title: "", // Title kosong
                content: "",
                categoryId: ""
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if category is not found', async () => {
        const result = await supertest(app)
            .post('/api/notes')
            .set('Cookie', 'token=test')
            .send({
                title: "Catatan Penting",
                content: "Isi",
                categoryId: 99999 // ID Ngawur
            });

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/notes', () => {
    beforeEach(async () => {
        await removeTestNote();
        await removeTestCategory();
        await removeTestUser();
        
        await createTestUser();
        await createTestCategory();
        await createTestNote(); // Buat 1 dummy note
    });

    afterEach(async () => {
        await removeTestNote();
        await removeTestCategory();
        await removeTestUser();
    });

    it('should can get list of notes', async () => {
        const result = await supertest(app)
            .get('/api/notes')
            .set('Cookie', 'token=test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.total_item).toBe(1);
    });

    it('should can search notes', async () => {
        const result = await supertest(app)
            .get('/api/notes?search=Test') // Cari kata "Test" (sesuai dummy di test-util)
            .set('Cookie', 'token=test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.total_item).toBe(1);
    });

    it('should return empty if search not found', async () => {
        const result = await supertest(app)
            .get('/api/notes?search=Kucing') // Cari kata yg gak ada
            .set('Cookie', 'token=test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(0);
        expect(result.body.paging.total_item).toBe(0);
    });
});

describe('GET /api/notes/:noteId', () => {
    beforeEach(async () => {
        await removeTestNote();
        await removeTestCategory();
        await removeTestUser();
        
        await createTestUser();
        await createTestCategory();
        await createTestNote();
    });

    afterEach(async () => {
        await removeTestNote();
        await removeTestCategory();
        await removeTestUser();
    });

    it('should can get note by id', async () => {
        // Ambil dulu ID note yang ada
        const note = await supertest(app)
            .get('/api/notes')
            .set('Cookie', 'token=test');
        const noteId = note.body.data[0].id;

        const result = await supertest(app)
            .get('/api/notes/' + noteId)
            .set('Cookie', 'token=test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(noteId);
        expect(result.body.data.category).toBeDefined(); // Pastikan ada info category (join)
    });

    it('should return 404 if note id is not found', async () => {
        const result = await supertest(app)
            .get('/api/notes/' + 99999)
            .set('Cookie', 'token=test');

        expect(result.status).toBe(404);
    });
});

describe('PUT /api/notes/:noteId', () => {
    beforeEach(async () => {
        await removeTestNote();
        await removeTestCategory();
        await removeTestUser();
        
        await createTestUser();
        await createTestCategory();
        await createTestNote();
    });

    afterEach(async () => {
        await removeTestNote();
        await removeTestCategory();
        await removeTestUser();
    });

    it('should can update note', async () => {
        const note = await supertest(app)
            .get('/api/notes')
            .set('Cookie', 'token=test');
        const noteId = note.body.data[0].id;

        const result = await supertest(app)
            .put('/api/notes/' + noteId)
            .set('Cookie', 'token=test')
            .send({
                title: "Update Judul",
                content: "Update Konten"
                // categoryId tidak dikirim, berarti tidak berubah
            });

        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe("Update Judul");
        expect(result.body.data.content).toBe("Update Konten");
    });

    it('should return 404 if note id is not found', async () => {
        const result = await supertest(app)
            .put('/api/notes/' + 99999)
            .set('Cookie', 'token=test')
            .send({
                title: "Update",
                content: "Update"
            });

        expect(result.status).toBe(404);
    });
});

describe('DELETE /api/notes/:noteId', () => {
    beforeEach(async () => {
        await removeTestNote();
        await removeTestCategory();
        await removeTestUser();
        
        await createTestUser();
        await createTestCategory();
        await createTestNote();
    });

    afterEach(async () => {
        await removeTestNote();
        await removeTestCategory();
        await removeTestUser();
    });

    it('should can remove note', async () => {
        const note = await supertest(app)
            .get('/api/notes')
            .set('Cookie', 'token=test');
        const noteId = note.body.data[0].id;

        const result = await supertest(app)
            .delete('/api/notes/' + noteId)
            .set('Cookie', 'token=test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        // Cek apakah beneran hilang
        const cekLagi = await supertest(app)
            .get('/api/notes/' + noteId)
            .set('Cookie', 'token=test');
        expect(cekLagi.status).toBe(404);
    });
});
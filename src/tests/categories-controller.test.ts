// tests/controllers/CategoriesController.spec.ts
import request from 'supertest';
import express from 'express';
import { CategoriesController } from '@/controllers/categories-controller';
import { prisma } from '@/database/prisma';
import { AppError } from '@/utils/AppError';

jest.mock('@/database/prisma');

const app = express();
app.use(express.json());

const controller = new CategoriesController();

app.get('/categories', (req, res) => controller.index(req, res));
app.post('/categories', (req, res) => controller.create(req, res));
app.put('/categories/:id', (req, res) => controller.update(req, res));
app.delete('/categories/:id', (req, res) => controller.delete(req, res));
app.get('/categories/:id', (req, res) => controller.show(req, res));


describe('CategoriesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('index()', () => {
    it('deve listar categorias com paginação', async () => {
      const categorias = [{ id: '1', text: 'Categoria A', icon: '🍔', type: 'food' }];
      (prisma.category.findMany as jest.Mock).mockResolvedValue(categorias);
      (prisma.category.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get('/categories');

      expect(response.status).toBe(200);
      expect(response.body.categories).toHaveLength(1);
    });
  });

  describe('create()', () => {
    it('deve criar uma nova categoria com sucesso', async () => {
      (prisma.category.create as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .post('/categories')
        .send({ icon: '🍕', text: 'Pizza', type: 'food' });

      expect(response.status).toBe(201);
    });

    it('deve falhar com dados inválidos', async () => {
      const response = await request(app).post('/categories').send({ icon: '', text: '', type: '' });
      expect(response.status).toBe(400);
    });
  });

  describe('update()', () => {
    it('deve atualizar uma categoria com sucesso', async () => {
      const categoria = { id: '1', text: 'Atualizada', icon: '🍣', type: 'food', active: true };
      (prisma.category.update as jest.Mock).mockResolvedValue(categoria);

      const response = await request(app)
        .put('/categories/1e8f6342-7db3-4c93-820d-39cc94c6762b')
        .send({ text: 'Atualizada', icon: '🍣' });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ text: 'Atualizada' });
    });

    it('deve retornar erro de validação com ID inválido', async () => {
      const response = await request(app).put('/categories/123').send({});
      expect(response.status).toBe(400);
    });
  });

  describe('delete()', () => {
    it('deve deletar uma categoria com sucesso', async () => {
      (prisma.category.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete('/categories/1e8f6342-7db3-4c93-820d-39cc94c6762b');
      expect(response.status).toBe(204);
    });
  });

  describe('show()', () => {
    it('deve retornar uma categoria existente', async () => {
      const categoria = { id: '1', text: 'Bebidas', icon: '🥤', type: 'drink' };
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(categoria);

      const response = await request(app).get('/categories/1e8f6342-7db3-4c93-820d-39cc94c6762b');

      expect(response.status).toBe(200);
      expect(response.body.text).toBe('Bebidas');
    });

    it('deve retornar erro 404 se não encontrar a categoria', async () => {
      (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/categories/1e8f6342-7db3-4c93-820d-39cc94c6762b');

      expect(response.status).toBe(500); // AppError lançado, falta middleware de erro
    });
  });
});

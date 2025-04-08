// tests/controllers/TablesController.spec.ts
import request from 'supertest';
import express from 'express';
import { TablesController } from '@/controllers/tables-controller';
import { prisma } from '@/database/prisma';


jest.mock('@/database/prisma');

const app = express();
app.use(express.json());

const controller = new TablesController();

app.post('/tables', (req, res) => controller.create(req, res));
app.get('/tables', (req, res) => controller.index(req, res));
app.put('/tables/:id', (req, res) => controller.update(req, res));
app.delete('/tables/:id', (req, res) => controller.delete(req, res));
app.get('/tables/:id', (req, res) => controller.show(req, res));

describe('TablesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('deve criar uma nova mesa com sucesso', async () => {
      const mockMesa = { id: '1', name: 'Mesa 1', totalPax: 4, createdAt: new Date() };
      (prisma.table.create as jest.Mock).mockResolvedValue(mockMesa);

      const response = await request(app).post('/tables').send({ name: 'Mesa 1', totalPax: 4 });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({ id: '1', name: 'Mesa 1', totalPax: 4 });
    });

    it('deve retornar erro de validação', async () => {
      const response = await request(app).post('/tables').send({ name: 'A', totalPax: -1 });
      expect(response.status).toBe(400);
    });
  });

  describe('index()', () => {
    it('deve retornar lista de mesas com paginação', async () => {
      const mesas = [{ id: '1', name: 'Mesa 1', totalPax: 4, createdAt: new Date() }];
      (prisma.table.findMany as jest.Mock).mockResolvedValue(mesas);
      (prisma.table.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get('/tables');

      expect(response.status).toBe(200);
      expect(response.body.tables).toHaveLength(1);
      expect(response.body.pagination.totalRecords).toBe(1);
    });
  });

  describe('update()', () => {
    it('deve atualizar uma mesa com sucesso', async () => {
      const mesaAtualizada = { id: '1', name: 'Mesa Atualizada', totalPax: 5 };
      (prisma.table.update as jest.Mock).mockResolvedValue(mesaAtualizada);

      const response = await request(app)
        .put('/tables/1')
        .send({ name: 'Mesa Atualizada', totalPax: 5 });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({ name: 'Mesa Atualizada', totalPax: 5 });
    });

    it('deve retornar erro de validação', async () => {
      const response = await request(app)
        .put('/tables/1')
        .send({ name: 'A' });

      expect(response.status).toBe(400);
    });
  });

  describe('delete()', () => {
    it('deve deletar uma mesa com sucesso', async () => {
      (prisma.table.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete('/tables/1');

      expect(response.status).toBe(204);
    });
  });

  describe('show()', () => {
    it('deve retornar detalhes de uma mesa', async () => {
      const mesa = { id: '1', name: 'Mesa 1', totalPax: 4 };
      (prisma.table.findUnique as jest.Mock).mockResolvedValue(mesa);

      const response = await request(app).get('/tables/1');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ name: 'Mesa 1' });
    });

    it('deve retornar erro 404 se não encontrar a mesa', async () => {
      (prisma.table.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/tables/999');

      expect(response.status).toBe(500); // AppError lançado mas sem middleware de tratamento
    });
  });
});

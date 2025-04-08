import request from 'supertest'
import express from 'express'
import { SizeFoodController } from '@/controllers/size-food-controller'
import { prisma } from '@/database/prisma'


jest.mock('@/database/prisma')

const app = express()
app.use(express.json())

const controller = new SizeFoodController()

app.post('/size-foods', (req, res) => controller.create(req, res))
app.get('/size-foods', (req, res) => controller.index(req, res))
app.get('/size-foods/:id', (req, res) => controller.show(req, res))
app.put('/size-foods/:id', (req, res) => controller.update(req, res))
app.delete('/size-foods/:id', (req, res) => controller.delete(req, res))



describe('SizeFoodController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create()', () => {
    it('deve criar uma relação tamanho/alimento com sucesso', async () => {
      const mock = {
        sizeId: 'size-uuid',
        foodId: 'food-uuid',
        price: 25
      }

      ;(prisma.sizeFood.create as jest.Mock).mockResolvedValue(mock)

      const res = await request(app).post('/size-foods').send(mock)

      expect(res.status).toBe(201)
    })

    it('deve retornar erro se dados forem inválidos', async () => {
      const res = await request(app).post('/size-foods').send({
        sizeId: '',
        foodId: '',
        price: -10
      })

      expect(res.status).toBe(400)
    })
  })

  describe('index()', () => {
    it('deve listar os registros com paginação', async () => {
      const mockData = [{
        id: '1',
        price: 20,
        size: { text: 'Médio' },
        food: { title: 'Refrigerante' }
      }]

      ;(prisma.sizeFood.findMany as jest.Mock).mockResolvedValue(mockData)
      ;(prisma.sizeFood.count as jest.Mock).mockResolvedValue(1)

      const res = await request(app).get('/size-foods')

      expect(res.status).toBe(200)
      expect(res.body.sizefoods).toHaveLength(1)
      expect(res.body.pagination.totalRecords).toBe(1)
    })
  })

  describe('show()', () => {
    it('deve retornar um registro específico', async () => {
      const mock = {
        id: '1',
        price: 30,
        size: { text: 'Grande' },
        food: { title: 'Sumo' }
      }

      ;(prisma.sizeFood.findUnique as jest.Mock).mockResolvedValue(mock)

      const res = await request(app).get('/size-foods/1')

      expect(res.status).toBe(200)
      expect(res.body.price).toBe(30)
    })

    it('deve retornar 404 se não encontrado', async () => {
      ;(prisma.sizeFood.findUnique as jest.Mock).mockResolvedValue(null)

      const res = await request(app).get('/size-foods/999')

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Tamanho não encontrado')
    })
  })

  describe('update()', () => {
    it('deve atualizar um registro existente', async () => {
      const mock = {
        id: '1',
        price: 40
      }

      ;(prisma.sizeFood.update as jest.Mock).mockResolvedValue(mock)

      const res = await request(app).put('/size-foods/1').send({ price: 40 })

      expect(res.status).toBe(204)
    })

    it('deve retornar erro com dados inválidos', async () => {
      const res = await request(app).put('/size-foods/1').send({ price: -5 })

      expect(res.status).toBe(400)
    })
  })

  describe('delete()', () => {
    it('deve deletar um registro com sucesso', async () => {
      const mock = { id: '1' }

      ;(prisma.sizeFood.delete as jest.Mock).mockResolvedValue(mock)

      const res = await request(app).delete('/size-foods/1')

      expect(res.status).toBe(204)
    })
  })
})

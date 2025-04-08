import request from 'supertest'
import express from 'express'
import { AddonFoodsController } from '@/controllers/addon-foods-controller'
import { prisma } from '@/database/prisma'

jest.mock('@/database/prisma')

const app = express()
app.use(express.json())

const controller = new AddonFoodsController()

app.get('/addon-foods', (req, res) => controller.index(req, res))
app.post('/addon-foods', (req, res) => controller.create(req, res))
app.put('/addon-foods/:id', (req, res) => controller.update(req, res))
app.delete('/addon-foods/:id', (req, res) => controller.delete(req, res))
app.get('/addon-foods/:id', (req, res) => controller.show(req, res))

describe('AddonFoodsController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('index()', () => {
    it('deve listar addonFoods com paginação', async () => {
      const mockData = [{
        id: '1',
        addonId: 'a1',
        foodId: 'f1',
        price: 9.99,
        addon: { id: 'a1', text: 'Molho' },
        food: { id: 'f1', name: 'Pizza' }
      }]
      ;(prisma.addonFood.findMany as jest.Mock).mockResolvedValue(mockData)
      ;(prisma.addonFood.count as jest.Mock).mockResolvedValue(1)

      const response = await request(app).get('/addon-foods')

      expect(response.status).toBe(200)
      expect(response.body.addonFoods).toHaveLength(1)
      expect(response.body.pagination.totalRecords).toBe(1)
    })
  })

  describe('create()', () => {
    it('deve criar um novo addonFood com sucesso', async () => {
      const addonFood = { id: '1', addonId: 'a1', foodId: 'f1', price: 5.5 }
      ;(prisma.addonFood.create as jest.Mock).mockResolvedValue(addonFood)

      const response = await request(app).post('/addon-foods').send({
        addonId: 'a1',
        foodId: 'f1',
        price: 5.5
      })

      expect(response.status).toBe(201)
      expect(response.body).toMatchObject(addonFood)
    })

    it('deve falhar com dados inválidos', async () => {
      const response = await request(app).post('/addon-foods').send({
        addonId: '',
        foodId: '',
        price: -1
      })

      expect(response.status).toBe(400)
    })
  })

  describe('update()', () => {
    it('deve atualizar um addonFood com sucesso', async () => {
      const updated = { id: '1', addonId: 'a1', foodId: 'f1', price: 10.0 }
      ;(prisma.addonFood.update as jest.Mock).mockResolvedValue(updated)

      const response = await request(app).put('/addon-foods/1').send({
        price: 10.0
      })

      expect(response.status).toBe(204)
    })

    it('deve retornar erro de validação com price inválido', async () => {
      const response = await request(app).put('/addon-foods/1').send({
        price: -2
      })

      expect(response.status).toBe(400)
    })
  })

  describe('delete()', () => {
    it('deve deletar um addonFood com sucesso', async () => {
      ;(prisma.addonFood.delete as jest.Mock).mockResolvedValue({})

      const response = await request(app).delete('/addon-foods/1')

      expect(response.status).toBe(204)
    })
  })

  describe('show()', () => {
    it('deve retornar um addonFood existente', async () => {
      const addonFood = {
        id: '1',
        addonId: 'a1',
        foodId: 'f1',
        price: 7.5,
        addon: { id: 'a1', text: 'Ketchup' },
        food: { id: 'f1', name: 'Sanduíche' }
      }
      ;(prisma.addonFood.findUnique as jest.Mock).mockResolvedValue(addonFood)

      const response = await request(app).get('/addon-foods/1')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('addonId')
      expect(response.body).toHaveProperty('foodId')
    })

    it('deve retornar erro 500 se addonFood não for encontrado', async () => {
      ;(prisma.addonFood.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await request(app).get('/addon-foods/999')

      expect(response.status).toBe(500) // sem middleware de erro global
    })
  })
})

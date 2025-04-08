import request from 'supertest'
import express from 'express'
import { FoodController } from '@/controllers/foods-controller'
import { prisma } from '@/database/prisma'


jest.mock('@/database/prisma')

const app = express()
app.use(express.json())

const controller = new FoodController()

app.get('/foods', (req, res) => controller.index(req, res))
app.post('/foods', (req, res) => controller.create(req, res))
app.put('/foods/:id', (req, res) => controller.update(req, res))
app.delete('/foods/:id', (req, res) => controller.delete(req, res))
app.get('/foods/:id', (req, res) => controller.show(req, res))



describe('FoodController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('index()', () => {
    it('deve listar foods com paginação', async () => {
      const mockFoods = [{ id: '1', title: 'Pizza', price: 20 }]
      ;(prisma.food.findMany as jest.Mock).mockResolvedValue(mockFoods)
      ;(prisma.food.count as jest.Mock).mockResolvedValue(1)

      const res = await request(app).get('/foods')

      expect(res.status).toBe(200)
      expect(res.body.foods).toHaveLength(1)
    })
  })

  describe('create()', () => {
    it('deve criar um novo food com sucesso', async () => {
      ;(prisma.food.create as jest.Mock).mockResolvedValue({})

      const res = await request(app).post('/foods').send({
        title: 'Hambúrguer',
        description: 'Um delicioso hambúrguer artesanal',
        price: 30,
        image: 'hamburguer.jpg',
        type: 'meal'
      })

      expect(res.status).toBe(201)
    })

    it('deve retornar erro 400 com dados inválidos', async () => {
      const res = await request(app).post('/foods').send({
        title: 'A',
        description: '',
        price: -10,
        type: ''
      })

      expect(res.status).toBe(400)
    })
  })

  describe('update()', () => {
    it('deve atualizar um food com sucesso', async () => {
      ;(prisma.food.update as jest.Mock).mockResolvedValue({})

      const res = await request(app).put('/foods/1').send({
        title: 'Atualizado',
        price: 50
      })

      expect(res.status).toBe(204)
    })

    it('deve retornar erro 400 com dados inválidos', async () => {
      const res = await request(app).put('/foods/1').send({
        price: -1
      })

      expect(res.status).toBe(400)
    })
  })

  describe('delete()', () => {
    it('deve deletar um food com sucesso', async () => {
      ;(prisma.food.delete as jest.Mock).mockResolvedValue({})

      const res = await request(app).delete('/foods/1')

      expect(res.status).toBe(204)
    })
  })

  describe('show()', () => {
    it('deve retornar um food existente', async () => {
      const food = {
        id: '1',
        title: 'Coxinha',
        description: 'Coxinha de frango cremosa',
        price: 10,
        image: '',
        type: 'snack'
      }
      ;(prisma.food.findUnique as jest.Mock).mockResolvedValue(food)

      const res = await request(app).get('/foods/1')

      expect(res.status).toBe(200)
      expect(res.body.title).toBe('Coxinha')
    })

    it('deve retornar 404 se o food não for encontrado', async () => {
      ;(prisma.food.findUnique as jest.Mock).mockResolvedValue(null)

      const res = await request(app).get('/foods/999')

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Produto não encontrado')
    })
  })
})

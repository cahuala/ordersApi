import request from 'supertest'
import express from 'express'
import { OrdersController } from '@/controllers/orders-controller'
import { prisma } from '@/database/prisma'


jest.mock('@/database/prisma')

const app = express()
app.use(express.json())

const controller = new OrdersController()

app.post('/orders', (req, res) => controller.create(req, res))
app.get('/orders', (req, res) => controller.index(req, res))
app.get('/orders/:id', (req, res) => controller.show(req, res))
app.put('/orders/:id', (req, res) => controller.update(req, res))
app.delete('/orders/:id', (req, res) => controller.delete(req, res))



describe('OrdersController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create()', () => {
    it('deve criar um novo pedido', async () => {
      const mockOrder = { id: '1', foodId: 'food-uuid', quantity: 2, price: 30, tableSessionId: 'table-uuid' }
      ;(prisma.order.create as jest.Mock).mockResolvedValue(mockOrder)

      const res = await request(app).post('/orders').send(mockOrder)

      expect(res.status).toBe(201)
      expect(res.body).toEqual(mockOrder)
    })

    it('deve retornar erro 400 se os dados forem inválidos', async () => {
      const res = await request(app).post('/orders').send({
        foodId: 'invalid-id',
        quantity: -1,
        price: 0,
        tableSessionId: 'not-uuid'
      })

      expect(res.status).toBe(400)
    })
  })

  describe('index()', () => {
    it('deve listar todos os pedidos', async () => {
      const mockOrders = [
        {
          id: '1',
          food: { title: 'Pizza' },
          tableSession: { id: 'table-uuid' }
        }
      ]
      ;(prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders)

      const res = await request(app).get('/orders')

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
    })
  })

  describe('show()', () => {
    it('deve retornar um pedido existente', async () => {
      const mockOrder = {
        id: '1',
        food: { title: 'Pizza' },
        tableSession: { id: 'table-uuid' }
      }
      ;(prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder)

      const res = await request(app).get('/orders/1')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(mockOrder)
    })

    it('deve retornar 404 se o pedido não for encontrado', async () => {
      ;(prisma.order.findUnique as jest.Mock).mockResolvedValue(null)

      const res = await request(app).get('/orders/999')

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Pedido não encontrado')
    })
  })

  describe('update()', () => {
    it('deve atualizar um pedido', async () => {
      const updatedOrder = { id: '1', quantity: 5 }
      ;(prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder)

      const res = await request(app).put('/orders/1').send({ quantity: 5 })

      expect(res.status).toBe(200)
      expect(res.body.quantity).toBe(5)
    })

    it('deve retornar erro 400 com dados inválidos', async () => {
      const res = await request(app).put('/orders/1').send({ price: -5 })

      expect(res.status).toBe(400)
    })
  })

  describe('delete()', () => {
    it('deve deletar um pedido com sucesso', async () => {
      const deletedOrder = { id: '1' }
      ;(prisma.order.delete as jest.Mock).mockResolvedValue(deletedOrder)

      const res = await request(app).delete('/orders/1')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(deletedOrder)
    })
  })
})

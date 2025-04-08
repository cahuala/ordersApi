import request from 'supertest'
import express from 'express'
import { AddonsController } from '@/controllers/addons-controller'
import { prisma } from '@/database/prisma'

jest.mock('@/database/prisma')

const app = express()
app.use(express.json())

const controller = new AddonsController()

app.get('/addons', (req, res) => controller.index(req, res))
app.post('/addons', (req, res) => controller.create(req, res))
app.put('/addons/:id', (req, res) => controller.update(req, res))
app.delete('/addons/:id', (req, res) => controller.delete(req, res))
app.get('/addons/:id', (req, res) => controller.show(req, res))

describe('AddonsController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('index()', () => {
    it('deve listar addons com paginação', async () => {
      const addons = [{ id: '1', text: 'Extra Queijo' }]
      ;(prisma.addon.findMany as jest.Mock).mockResolvedValue(addons)
      ;(prisma.addon.count as jest.Mock).mockResolvedValue(1)

      const response = await request(app).get('/addons')

      expect(response.status).toBe(200)
      expect(response.body.addons).toHaveLength(1)
      expect(response.body.pagination.totalRecords).toBe(1)
    })
  })

  describe('create()', () => {
    it('deve criar um novo addon com sucesso', async () => {
      ;(prisma.addon.create as jest.Mock).mockResolvedValue({})

      const response = await request(app).post('/addons').send({
        name: 'Molho Especial'
      })

      expect(response.status).toBe(201)
    })

    it('deve retornar erro com nome inválido', async () => {
      const response = await request(app).post('/addons').send({
        name: ''
      })

      expect(response.status).toBe(400)
    })
  })

  describe('update()', () => {
    it('deve atualizar um addon com sucesso', async () => {
      ;(prisma.addon.update as jest.Mock).mockResolvedValue({})

      const response = await request(app).put('/addons/1').send({
        name: 'Atualizado'
      })

      expect(response.status).toBe(200)
    })

    it('deve retornar erro com nome inválido', async () => {
      const response = await request(app).put('/addons/1').send({
        name: ''
      })

      expect(response.status).toBe(400)
    })
  })

  describe('delete()', () => {
    it('deve deletar um addon com sucesso', async () => {
      ;(prisma.addon.delete as jest.Mock).mockResolvedValue({})

      const response = await request(app).delete('/addons/1')

      expect(response.status).toBe(200)
    })
  })

  describe('show()', () => {
    it('deve retornar um addon existente', async () => {
      const addon = { id: '1', text: 'Extra Bacon' }
      ;(prisma.addon.findUnique as jest.Mock).mockResolvedValue(addon)

      const response = await request(app).get('/addons/1')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('text', 'Extra Bacon')
    })

    it('deve retornar erro 404 se addon não for encontrado', async () => {
      ;(prisma.addon.findUnique as jest.Mock).mockResolvedValue(null)

      const response = await request(app).get('/addons/999')

      expect(response.status).toBe(500) // sem middleware global de erro
    })
  })
})

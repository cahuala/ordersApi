import request from 'supertest'
import express from 'express'
import { SizesController } from '@/controllers/sizes-controller'
import { prisma } from '@/database/prisma'


jest.mock('@/database/prisma')

const app = express()
app.use(express.json())

const controller = new SizesController()

app.post('/sizes', (req, res) => controller.create(req, res))
app.get('/sizes', (req, res) => controller.index(req, res))
app.get('/sizes/:id', (req, res) => controller.show(req, res))
app.put('/sizes/:id', (req, res) => controller.update(req, res))
app.delete('/sizes/:id', (req, res) => controller.delete(req, res))



describe('SizesController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create()', () => {
    it('deve criar um novo tamanho com sucesso', async () => {
      ;(prisma.size.create as jest.Mock).mockResolvedValue({ text: 'Grande' })

      const res = await request(app).post('/sizes').send({ text: 'Grande' })

      expect(res.status).toBe(201)
    })

    it('deve retornar erro de validação ao criar', async () => {
      const res = await request(app).post('/sizes').send({ text: '' })

      expect(res.status).toBe(400)
    })
  })

  describe('index()', () => {
    it('deve listar tamanhos com paginação', async () => {
      ;(prisma.size.findMany as jest.Mock).mockResolvedValue([{ id: '1', text: 'Pequeno' }])
      ;(prisma.size.count as jest.Mock).mockResolvedValue(1)

      const res = await request(app).get('/sizes')

      expect(res.status).toBe(200)
      expect(res.body.sizes).toHaveLength(1)
      expect(res.body.pagination.totalRecords).toBe(1)
    })
  })

  describe('show()', () => {
    it('deve retornar um tamanho específico', async () => {
      ;(prisma.size.findUnique as jest.Mock).mockResolvedValue({ id: '1', text: 'Médio' })

      const res = await request(app).get('/sizes/11111111-1111-1111-1111-111111111111')

      expect(res.status).toBe(200)
      expect(res.body.text).toBe('Médio')
    })

    it('deve retornar 404 se o tamanho não for encontrado', async () => {
      ;(prisma.size.findUnique as jest.Mock).mockResolvedValue(null)

      const res = await request(app).get('/sizes/11111111-1111-1111-1111-111111111111')

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Tamanho não encontrado')
    })
  })

  describe('update()', () => {
    it('deve atualizar o texto de um tamanho', async () => {
      ;(prisma.size.update as jest.Mock).mockResolvedValue({ id: '1', text: 'Extra Grande' })

      const res = await request(app)
        .put('/sizes/11111111-1111-1111-1111-111111111111')
        .send({ text: 'Extra Grande' })

      expect(res.status).toBe(204)
    })

    it('deve retornar erro de validação se UUID for inválido', async () => {
      const res = await request(app).put('/sizes/abc').send({ text: 'Grande' })

      expect(res.status).toBe(400)
    })
  })

  describe('delete()', () => {
    it('deve deletar um tamanho com sucesso', async () => {
      ;(prisma.size.delete as jest.Mock).mockResolvedValue({ id: '1' })

      const res = await request(app).delete('/sizes/11111111-1111-1111-1111-111111111111')

      expect(res.status).toBe(204)
    })

    it('deve retornar erro se UUID for inválido', async () => {
      const res = await request(app).delete('/sizes/invalid-uuid')

      expect(res.status).toBe(400)
    })
  })
})

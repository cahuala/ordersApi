import { TableSessionsController } from "@/controllers/table-sessions-controller"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"

jest.mock('@/database/prisma');

describe("TableSessionsController", () => {
  let controller: TableSessionsController
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    controller = new TableSessionsController()
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  describe("create", () => {
    it("should create a new table session", async () => {
      req.body = {
        tableNo: "7889-jhgjh",
        pax: 4,
        status: "unpaid",
        total: 100,
      }

      prisma.tableSession.create = jest.fn().mockResolvedValue(req.body)

      await controller.create(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(req.body)
    })

    it("should throw an error when invalid data is provided", async () => {
      req.body = {
        tableNo: "invalid-uuid",
        pax: -1, // invalid pax value
        status: "invalid-status",
        total: -50, // invalid total value
      }

      try {
        await controller.create(req as Request, res as Response)
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
      }
    })
  })

  describe("index", () => {
    it("should return a list of table sessions", async () => {
      req.query = {
        page: "1",
        perPage: "10",
      }

      prisma.tableSession.findMany = jest.fn().mockResolvedValue([{ tableNo: "some-uuid" }])
      prisma.tableSession.count = jest.fn().mockResolvedValue(1)

      await controller.index(req as Request, res as Response)

      expect(res.json).toHaveBeenCalledWith({
        tableSessions: [{ tableNo: "7889-jhgjh" }],
        pagination: {
          page: 1,
          perPage: 10,
          totalRecords: 1,
          totalPages: 1,
        },
      })
    })
  })

  describe("show", () => {
    it("should return a specific table session", async () => {
      req.params = { id: "some-uuid" }
      prisma.tableSession.findUnique = jest.fn().mockResolvedValue({ tableNo: "some-uuid" })

      await controller.show(req as Request, res as Response)

      expect(res.json).toHaveBeenCalledWith({ tableNo: "7889-jhgjh" })
    })

    it("should throw an error if table session is not found", async () => {
      req.params = { id: "invalid-uuid" }
      prisma.tableSession.findUnique = jest.fn().mockResolvedValue(null)

      try {
        await controller.show(req as Request, res as Response)
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
      }
    })
  })

  describe("delete", () => {
    it("should delete a table session", async () => {
      req.params = { id: "7889-jhgjh" }
      prisma.tableSession.delete = jest.fn().mockResolvedValue({ tableNo: "some-uuid" })

      await controller.delete(req as Request, res as Response)

      expect(res.json).toHaveBeenCalledWith({ tableNo: "7889-jhgjh" })
    })
  })

  describe("update", () => {
    it("should update a table session", async () => {
      req.params = { id: "896546-dg-hgf" }
      req.body = { tableNo: "56755-gtd-6", pax: 4, status: "paid", total: 120 }

      prisma.tableSession.update = jest.fn().mockResolvedValue(req.body)

      await controller.update(req as Request, res as Response)

      expect(res.json).toHaveBeenCalledWith(req.body)
    })
  })

  describe("close", () => {
    it("should close a table session", async () => {
      req.params = { id: "7889-jhgjh" }

      prisma.tableSession.update = jest.fn().mockResolvedValue({
        status: "paid",
      })

      await controller.close(req as Request, res as Response)

      expect(res.json).toHaveBeenCalledWith({
        status: "paid",
      })
    })
  })

  describe("open", () => {
    it("should open a table session", async () => {
      req.params = { id: "7889-jhgjh" }

      prisma.tableSession.update = jest.fn().mockResolvedValue({
        status: "unpaid",
      })

      await controller.open(req as Request, res as Response)

      expect(res.json).toHaveBeenCalledWith({
        status: "unpaid",
      })
    })
  })
})

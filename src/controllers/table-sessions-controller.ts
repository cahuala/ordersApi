import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
class TableSessionsController{
    async create(request: Request, response: Response){
        const createTableSessionBody = z.object({
            tableNo: z.string().uuid(),
            pax: z.number().int().positive({message: "O Lugar Ocupado deve ser um número inteiro positivo"}),
            status: z.enum(["unpaid", "paid"]),
            total: z.number().positive({message: "O total deve ser um número positivo"})
        })
    
        const { tableNo, pax, status,total } = createTableSessionBody.parse(request.body)
    
        const tableSession = await prisma.tableSession.create({
        data:{
            tableNo,
            pax,
            status,
            total
        }
        })
    
        return response.status(201).json(tableSession)
    } 
    async index(request: Request, response: Response){
        const querySchema = z.object({
            title: z.string().optional(),
            page: z.coerce.number().optional().default(1),
            perPage: z.coerce.number().optional().default(10)
        })
        const { title, page, perPage } = querySchema.parse(request.query)
        // Calcular os valores de skip
        const skip = (page - 1) * perPage
        const tableSessions = await prisma.tableSession.findMany({
            skip,
            take: perPage,
            where:{
                    tableNo:{
                        contains: title?.trim()
                    }
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
        // obter o total de registros para calcular o total de páginas
        const totalRecords = await prisma.tableSession.count({
            where:{
                    tableNo:{
                        contains: title?.trim()
                    }
            }
        })
        // Calcular o total de páginas
        const totalPages = Math.ceil(totalRecords / perPage)
        response.json({
            tableSessions,
            pagination:{
                page,
                perPage,
                totalRecords,
                totalPages: totalPages > 0 ? totalPages : 1
            }   
        })
    }
    async show(request: Request, response: Response){
        const { id } = request.params
    
        const tableSession = await prisma.tableSession.findUnique({
            where:{
                id
            },
            include:{
               table:true
            }
        })
    
        if(!tableSession){
            throw new AppError("Sessão não encontrada", 404)
        }
    
        return response.status(200).json(tableSession)
    }
    async delete(request: Request, response: Response){
        const { id } = request.params
    
        const tableSession = await prisma.tableSession.delete({
            where:{
                id
            }
        })
    
        return response.status(200).json(tableSession)
    }
    async update(request: Request, response: Response){
        const { id } = request.params
    
        const updateTableSessionBody = z.object({
            tableNo: z.string().uuid(),
            pax: z.number().int().positive({message: "O Lugar Ocupado deve ser um número inteiro positivo"}),
            status: z.enum(["unpaid", "paid"]),
            total: z.number().positive({message: "O total deve ser um número positivo"})
        })
    
        const { tableNo, pax, status,total } = updateTableSessionBody.parse(request.body)
    
        const tableSession = await prisma.tableSession.update({
            where:{
                id
            },
            data:{
                tableNo,
                pax,
                status,
                total
            }
        })
    
        return response.status(200).json(tableSession)
    }
    async close(request: Request, response: Response){
        const { id } = request.params
    
        const tableSession = await prisma.tableSession.update({
            where:{
                id
            },
            data:{
                status: "paid"
            }
        })
    
        return response.status(200).json(tableSession)
    }
    async open(request: Request, response: Response){
        const { id } = request.params
    
        const tableSession = await prisma.tableSession.update({
            where:{
                id
            },
            data:{
                status: "unpaid"
            }
        })
    
        return response.status(200).json(tableSession)
    }
}

export { TableSessionsController }
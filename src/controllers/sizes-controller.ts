import { Request, Response } from 'express'
import { prisma } from "@/database/prisma"
import { z } from 'zod'
import { AppError } from '@/utils/AppError'

class SizesController { 
  async  create(request: Request, response: Response) {
        const bodySchema = z.object({
            text: z.string(),
        })
        const { text } = bodySchema.parse(request.body)
       await prisma.size.create({
            data: {
                text
            }
        })
        return response.status(201).json()
    }
    async index(request: Request, response: Response) {
        const querySchema = z.object({
            text: z.string().optional(),
            page: z.coerce.number().optional().default(1),
            perPage: z.coerce.number().optional().default(10)
        })
        const { text, page, perPage } = querySchema.parse(request.query)
        // Calcular os valores de skip
        const skip = (page - 1) * perPage
        const sizes = await prisma.size.findMany({
            skip,
            take: perPage,
            where:{
                    text:{
                        contains: text?.trim()
                    }
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
        // obter o total de registros para calcular o total de páginas
        const totalRecords = await prisma.size.count({
            where:{
                    text:{
                        contains: text?.trim()
                    }
            }
        })
        // Calcular o total de páginas
        const totalPages = Math.ceil(totalRecords / perPage)
        response.json({
            sizes,
            pagination:{
                page,
                perPage,
                totalRecords,
                totalPages: totalPages > 0 ? totalPages : 1
            }   
        })
    }
    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })
        const { id } = paramsSchema.parse(request.params)
        const size = await prisma.size.findUnique({
            where:{
                id
            }
        })
        if(!size){
            throw new AppError("Tamanho não encontrado", 404)
        }
        return response.json(size)
    }
    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })
        const { id } = paramsSchema.parse(request.params)
        await prisma.size.delete({
            where:{
                id
            }
        })
        return response.status(204).json()
    }
    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })
        const bodySchema = z.object({
            text: z.string().optional(),
        })
        const { id } = paramsSchema.parse(request.params)
        const { text } = bodySchema.parse(request.body)
        await prisma.size.update({
            where:{
                id
            },
            data:{
                text
            }
        })
        return response.status(204).json()
    }
    
}

export { SizesController }
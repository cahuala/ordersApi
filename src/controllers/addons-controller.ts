import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { z } from "zod"
import { AppError } from "@/utils/AppError"

class AddonsController{
   async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string(),
        })
        const { name } = bodySchema.parse(request.body)
        await prisma.addon.create({
            data: {
                text:name,    
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
        const addons = await prisma.addon.findMany({
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
        const totalRecords = await prisma.addon.count({
            where:{
                    text:{
                        contains: text?.trim()
                    }
            }
        })
        // Calcular o total de páginas
        const totalPages = Math.ceil(totalRecords / perPage)
        response.json({
            addons,
            pagination:{
                page,
                perPage,
                totalRecords,
                totalPages: totalPages > 0 ? totalPages : 1
            }   
        })
    }
    async update(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string(),
        })
        const { name } = bodySchema.parse(request.body)
        const { id } = request.params
        await prisma.addon.update({
            where:{
                id
            },
            data:{
                text:name
            }
        })
        return response.status(200).json()
    }
    async delete(request: Request, response: Response) {
        const { id } = request.params
        await prisma.addon.delete({
            where:{
                id
            }
        })
        return response.status(200).json()
    }
    async show(request: Request, response: Response) {
        const { id } = request.params
        const addon = await prisma.addon.findUnique({
            where:{
                id
            }
        })
        if(!addon) {
            throw new AppError('Extra não encontrada', 404)
        }
       
        // Retorna o addon
        return response.json(addon)
    }
    
}

export { AddonsController }
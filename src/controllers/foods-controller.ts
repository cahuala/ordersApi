import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { z } from "zod"
import { AppError } from "@/utils/AppError"

class FoodController{
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            title: z.string().trim().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
            description: z.string().trim().min(10, { message: "Descrição deve ter no mínimo 10 caracteres" }),
            price: z.number().positive({ message: "Valor deve ser positivo" }),
            image: z.string().optional(),
            type:   z.string()
        
        })
        const { title, description, price, image,type } = bodySchema.parse(request.body)
        await prisma.food.create({
            data: {
                title,
                description,
                price,
                image: image ? image : "",
                type
            }
        })
        return response.status(201).json()
    }
    async index(request: Request, response: Response) {
        const querySchema = z.object({
            title: z.string().optional(),
            page: z.coerce.number().optional().default(1),
            perPage: z.coerce.number().optional().default(10)
        })
        const { title, page, perPage } = querySchema.parse(request.query)
        // Calcular os valores de skip
        const skip = (page - 1) * perPage
        const foods = await prisma.food.findMany({
            skip,
            take: perPage,
            where:{
                    title:{
                        contains: title?.trim()
                    }
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
        // obter o total de registros para calcular o total de páginas
        const totalRecords = await prisma.food.count({
            where:{
                    title:{
                        contains: title?.trim()
                    }
            }
        })
        // Calcular o total de páginas
        const totalPages = Math.ceil(totalRecords / perPage)
        response.json({
            foods,
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
            title: z.string().optional(),
            description: z.string().optional(),
            price: z.number().positive().optional(),
            image: z.string().optional(),
            type:   z.string().optional()
        })
        const { title, description, price, image,type } = bodySchema.parse(request.body)
        const { id } = request.params
        await prisma.food.update({
            where:{
                id
            },
            data:{
                title,
                description,
                price,
                image: image ? image : "",
                type
            }
        })
        return response.status(204).json()
    }
    async delete(request: Request, response: Response) {
        const { id } = request.params
        await prisma.food.delete({
            where:{
                id
            }
        })
        return response.status(204).json()
    }
    async show(request: Request, response: Response) {
        const { id } = request.params
        const food = await prisma.food.findUnique({
            where:{
                id
            }
        })
        if(!food){
            throw new AppError('Produto não encontrado', 404)
        }
        return response.json(food)
    }
}

export { FoodController }
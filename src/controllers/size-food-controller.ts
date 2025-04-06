import { Request, Response } from 'express'
import { prisma } from "@/database/prisma"
import { z } from "zod"
import { AppError } from '@/utils/AppError'

class SizeFoodController{
   async create(request:Request,response:Response){
        const bodySchema = z.object({
            sizeId: z.string({ message: "O tamanho é obrigatório" }),
            foodId: z.string({ message: "A Alimentação/Bebida é obrigatório" }),
            price: z.number().positive({ message: "Valor deve ser positivo" }),
        })
        const { sizeId, price, foodId } = bodySchema.parse(request.body)
        await prisma.sizeFood.create({
            data: {
                sizeId,
                foodId,
                price,
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
    const sizefoods = await prisma.sizeFood.findMany({
        skip,
        take: perPage,
        where:{
            size:{
                text:{
                    contains: title?.trim()
                }
            }
        },
        orderBy:{
            createdAt: 'desc'
        },
        include:{
            food:true,
            size:true
        }
    })
    // obter o total de registros para calcular o total de páginas
    const totalRecords = await prisma.sizeFood.count({
        where:{
            food:{
                title:{
                    contains: title?.trim()
                }
            }
        }
    })
    // Calcular o total de páginas
    const totalPages = Math.ceil(totalRecords / perPage)
    response.json({
        sizefoods,
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
            sizeId: z.string().optional(),
            foodId: z.string().optional(),
            price: z.number().positive().optional(),
        })
        const { sizeId, price, foodId } = bodySchema.parse(request.body)
        const { id } = request.params
        await prisma.sizeFood.update({
            where:{
                id
            },
            data:{
                sizeId,
                price,
                foodId
            }
        })
        return response.status(204).json()
    }
    async delete(request: Request, response: Response) {
        const { id } = request.params
        await prisma.sizeFood.delete({
            where:{
                id
            }
        })
        return response.status(204).json()
    }
    async show(request: Request, response: Response) {
        const { id } = request.params
        const sizeFood = await prisma.sizeFood.findUnique({
            where:{
                id
            },
            include:{
                food:true,
                size:true
            }
        })
        if(!sizeFood){
            throw new AppError("Tamanho não encontrado", 404)
        }
        return response.json(sizeFood)
    }
   
}
export { SizeFoodController }
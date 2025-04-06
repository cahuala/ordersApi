import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import {z} from "zod"
import { AppError } from "@/utils/AppError"

class AddonFoodsController{
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            addonId: z.string(),
            foodId: z.string(),
            price: z.number().positive(),
           
        })
        const { addonId, foodId, price } = bodySchema.parse(request.body)
        const food = await prisma.addonFood.create({
            data:{
                addonId,
                foodId,
                price
            }
        })
        return response.status(201).json(food)
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

        const addonFoods = await prisma.addonFood.findMany({
            skip,
            take: perPage,
            where:{
                addon:{
                    text:{
                        contains: title?.trim()
                    }
                }
            },
            include:{
                food:true,
                addon:true
            }
        })
        const totalRecords = await prisma.addonFood.count()
        // Calcular o total de páginas
        const totalPages = Math.ceil(totalRecords / perPage)
        response.json({
            addonFoods,
            pagination:{
                page,
                perPage,
                totalRecords,
                totalPages: totalPages > 0 ? totalPages : 1
            }   
        })
    }
    async delete(request: Request, response: Response) {
        const { id } = request.params
        await prisma.addonFood.delete({
            where:{
                id
            }
        })
        return response.status(204).json()
    }
    async update(request: Request, response: Response) {
        const bodySchema = z.object({
            addonId: z.string().optional(),
            foodId: z.string().optional(),
            price: z.number().positive().optional(),
           
        })
        const { addonId, foodId, price } = bodySchema.parse(request.body)
        const { id } = request.params
        await prisma.addonFood.update({
            where:{
                id
            },
            data:{
                addonId,
                foodId,
                price
            }
        })
        return response.status(204).json()
    }
    async show(request: Request, response: Response) {
        const { id } = request.params
        const addonFood = await prisma.addonFood.findUnique({
            where:{
                id
            },
            include:{
                food:true,
                addon:true
            }
        })
        if(!addonFood){
           throw new AppError("Adicional não encontrado", 404)
        }
        return response.json(addonFood)
    }
}
export { AddonFoodsController }
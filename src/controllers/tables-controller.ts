import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { z } from "zod"
import { AppError } from "@/utils/AppError"

class TablesController{
    async create(request:Request, response:Response){
        const bodySchema = z.object({
            name: z.string().trim().min(3,{ message: "O Nome deve ter no mínimo 3 caracteres" }),
            totalPax: z.number().positive({ message: "O número de pessoas deve ser maior que 0" }),
        })
        const { name, totalPax } = bodySchema.parse(request.body)
        const table = await prisma.table.create({
            data: {
                name,
                totalPax
            }
        })
        return response.status(201).json(table)
    }
    async index(request:Request, response:Response){
        const querySchema = z.object({
            text: z.string().optional(),
            page: z.coerce.number().optional().default(1),
            perPage: z.coerce.number().optional().default(10)
        })
        const { text, page, perPage } = querySchema.parse(request.query)
        // Calcular os valores de skip
        const skip = (page - 1) * perPage
        const tables = await prisma.table.findMany({
            skip,
            take: perPage,
            where:{
                    name:{
                        contains: text?.trim()
                    }
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
        // obter o total de registros para calcular o total de páginas
        const totalRecords = await prisma.table.count({
            where:{
                    name:{
                        contains: text?.trim()
                    }
            }
        })
        // Calcular o total de páginas
        const totalPages = Math.ceil(totalRecords / perPage)
        response.json({
            tables,
            pagination:{
                page,
                perPage,
                totalRecords,
                totalPages: totalPages > 0 ? totalPages : 1
            }   
        })
    }
    async update(request:Request, response:Response){
        const bodySchema = z.object({
            name: z.string().trim().min(3,{ message: "O Nome deve ter no mínimo 3 caracteres" }).optional(),
            totalPax: z.number().positive({ message: "O número de pessoas deve ser maior que 0" }).optional(),
        })
        const { name, totalPax } = bodySchema.parse(request.body)
        const { id } = request.params
        const table = await prisma.table.update({
            where:{
                id
            },
            data:{
                name,
                totalPax
            }
        })
        return response.status(201).json(table)
    }
    async delete(request:Request, response:Response){
        const { id } = request.params
        await prisma.table.delete({
            where:{
                id
            }
        })
        return response.status(204).json()
    }
    async show(request:Request, response:Response){
        const { id } = request.params
        const table = await prisma.table.findUnique({
            where:{
                id
            }
        })
        if(!table){
            throw new AppError("Mesa não encontrada", 404)
        }
        return response.status(200).json(table)
    }
}
export { TablesController }
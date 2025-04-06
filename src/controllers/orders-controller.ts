import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import { z } from "zod"

class OrdersController{
    async create(request:Request, response:Response){
        const bodySchema = z.object({
            foodId: z.string().uuid({ message: "O ID do alimento deve ser um UUID válido" }),
            quantity: z.number().positive({ message: "A quantidade deve ser maior que 0" }),
            price: z.number().positive({ message: "O preço deve ser maior que 0" }),
            tableSessionId: z.string().uuid({ message: "O ID da mesa deve ser um UUID válido" }),
            
        })
        const { foodId, quantity,price,tableSessionId } = bodySchema.parse(request.body)
        const table = await prisma.order.create({
            data: {
                foodId,
                quantity,
                price,
                tableSessionId
            }
        })
        return response.status(201).json(table)
    }
    async index(request:Request, response:Response){
        const orders = await prisma.order.findMany({
            include:{
                food:true,
                tableSession:true
            }
        })
        return response.json(orders)
    }
    async show(request:Request, response:Response){
        const { id } = request.params
        const order = await prisma.order.findUnique({
            where:{
                id
            },
            include:{
                food:true,
                tableSession:true
            }
        })
        if(!order){
            throw new AppError("Pedido não encontrado",404)
        }
        return response.json(order)
    }
    async delete(request:Request, response:Response){
        const { id } = request.params
        const order = await prisma.order.delete({
            where:{
                id
            }
        })
        return response.json(order)
    }
    async update(request:Request, response:Response){
        const { id } = request.params
        const bodySchema = z.object({
            foodId: z.string().uuid({ message: "O ID do alimento deve ser um UUID válido" }).optional(),
            quantity: z.number().positive({ message: "A quantidade deve ser maior que 0" }).optional(),
            price: z.number().positive({ message: "O preço deve ser maior que 0" }).optional(),
            tableSessionId: z.string().uuid({ message: "O ID da mesa deve ser um UUID válido" }).optional(),
            
        })
        const { foodId, quantity,price,tableSessionId } = bodySchema.parse(request.body)
        const order = await prisma.order.update({
            where:{
                id
            },
            data:{
                foodId,
                quantity,
                price,
                tableSessionId
            }
        })
        return response.json(order)
    }
}
export { OrdersController }
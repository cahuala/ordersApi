import { Request, Response } from 'express'
import { prisma } from "@/database/prisma"
import { z } from 'zod'
import { AppError } from '@/utils/AppError'

class CategoriesController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
        text: z.string().optional(),
        page: z.coerce.number().optional().default(1),
        perPage: z.coerce.number().optional().default(10)
    })
    const { text, page, perPage } = querySchema.parse(request.query)
    // Calcular os valores de skip
    const skip = (page - 1) * perPage
    const categories = await prisma.category.findMany({
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
    const totalRecords = await prisma.category.count({
        where:{
                text:{
                    contains: text?.trim()
                }
        }
    })
    // Calcular o total de páginas
    const totalPages = Math.ceil(totalRecords / perPage)
    response.json({
        categories,
        pagination:{
            page,
            perPage,
            totalRecords,
            totalPages: totalPages > 0 ? totalPages : 1
        }   
    })
  }
  async create(request:Request, response:Response){
      const bodySchema = z.object({
        icon:z.string(),
        text:z.string(),
        type:z.string(),
        active:z.boolean().optional()
    })
    const { text,icon,type,active } = bodySchema.parse(request.body)
    await prisma.category.create({
    data:{
        icon,
        text,
        type,
        active
    }   
    })
      return response.status(201).json()
}
    async update(request:Request, response:Response){
        const paramsSchema = z.object({
            id:z.string().uuid()
        })
        const bodySchema = z.object({
            icon:z.string().optional(),
            text:z.string().optional(),
            type:z.string().optional(),
            active:z.boolean().optional()
        })
        const { id } = paramsSchema.parse(request.params)
        const { text,icon,type,active } = bodySchema.parse(request.body)
        const category = await prisma.category.update({
            where:{
                id
            },
            data:{
                icon,
                text,
                type,
                active
            }
        })
        return response.json(category)
    }
  async delete(request:Request, response:Response){
    const paramsSchema = z.object({
        id:z.string().uuid()
    })
    const { id } = paramsSchema.parse(request.params)
    await prisma.category.delete({
        where:{
            id
        }
    })
    return response.status(204).json()
  }
  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
        id: z.string().uuid()
    })
    const { id } = paramsSchema.parse(request.params)
    
    const category = await prisma.category.findFirst({
        where:{
            id
        },
        
    })
    if(!category){
        throw new AppError('Categoria não encontrada', 404)
    }
    response.json(category)
    }
}
export { CategoriesController }
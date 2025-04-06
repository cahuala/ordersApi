import { Router } from 'express'
import { FoodController } from '@/controllers/foods-controller'

const foodRoutes = Router()
const foodsController = new FoodController()


foodRoutes.post("/", foodsController.create)
foodRoutes.get("/", foodsController.index)
foodRoutes.get("/:id", foodsController.show)
foodRoutes.delete("/:id", foodsController.delete)
foodRoutes.put("/:id", foodsController.update)


export { foodRoutes }
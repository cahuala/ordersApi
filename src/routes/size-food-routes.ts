import { Router } from "express"

import { SizeFoodController } from "@/controllers/size-food-controller"

const sizeFoodRoutes = Router()
const sizeFoodController = new SizeFoodController()


sizeFoodRoutes.post("/", sizeFoodController.create)
sizeFoodRoutes.get("/", sizeFoodController.index)
sizeFoodRoutes.get("/:id", sizeFoodController.show)
sizeFoodRoutes.delete("/:id", sizeFoodController.delete)
sizeFoodRoutes.put("/:id", sizeFoodController.update)


export { sizeFoodRoutes }
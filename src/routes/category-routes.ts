import { Router } from "express"

import { CategoriesController } from "@/controllers/categories-controller"

const categoryRoutes = Router()
const categoriesController = new CategoriesController()


categoryRoutes.post("/", categoriesController.create)
categoryRoutes.get("/", categoriesController.index)
categoryRoutes.get("/:id", categoriesController.show)
categoryRoutes.delete("/:id", categoriesController.delete)
categoryRoutes.put("/:id", categoriesController.update)


export { categoryRoutes }
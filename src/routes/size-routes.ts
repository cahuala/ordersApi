import { Router } from "express"

import { SizesController } from "@/controllers/sizes-controller"

const sizeRoutes = Router()
const sizeController = new SizesController()


sizeRoutes.post("/", sizeController.create)
sizeRoutes.get("/", sizeController.index)
sizeRoutes.get("/:id", sizeController.show)
sizeRoutes.delete("/:id", sizeController.delete)
sizeRoutes.put("/:id", sizeController.update)


export { sizeRoutes }
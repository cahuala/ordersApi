import { Router } from "express"

import { AddonFoodsController } from "@/controllers/addon-foods-controller"

const addonFoodsRoutes = Router()
const addonFoodsController = new AddonFoodsController()


addonFoodsRoutes.post("/", addonFoodsController.create)
addonFoodsRoutes.get("/", addonFoodsController.index)
addonFoodsRoutes.get("/:id", addonFoodsController.show)
addonFoodsRoutes.delete("/:id", addonFoodsController.delete)
addonFoodsRoutes.put("/:id", addonFoodsController.update)


export { addonFoodsRoutes }
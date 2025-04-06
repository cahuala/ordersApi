import { Router } from "express"

import { AddonsController } from "@/controllers/addons-controller"

const addonRoutes = Router()
const addonController = new AddonsController()


addonRoutes.post("/", addonController.create)
addonRoutes.get("/", addonController.index)
addonRoutes.get("/:id", addonController.show)
addonRoutes.delete("/:id", addonController.delete)
addonRoutes.put("/:id", addonController.update)


export { addonRoutes }
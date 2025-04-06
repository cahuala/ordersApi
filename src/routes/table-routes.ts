import { Router } from "express"

import { TablesController } from "@/controllers/tables-controller"

const tablesRoutes = Router()
const tablesController = new TablesController()


tablesRoutes.post("/", tablesController.create)
tablesRoutes.get("/", tablesController.index)
tablesRoutes.get("/:id", tablesController.show)
tablesRoutes.delete("/:id", tablesController.delete)
tablesRoutes.put("/:id", tablesController.update)


export { tablesRoutes }
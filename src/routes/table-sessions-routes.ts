import { Router } from "express"

import { TableSessionsController } from "@/controllers/table-sessions-controller"

const tableSessionsRoutes = Router()
const tableSessionsController = new TableSessionsController()


tableSessionsRoutes.post("/", tableSessionsController.create)
tableSessionsRoutes.get("/", tableSessionsController.index)
tableSessionsRoutes.get("/:id", tableSessionsController.show)
tableSessionsRoutes.delete("/:id", tableSessionsController.delete)
tableSessionsRoutes.put("/:id", tableSessionsController.update)
tableSessionsRoutes.post("/close/:id", tableSessionsController.close)
tableSessionsRoutes.post("/open/:id", tableSessionsController.open)


export { tableSessionsRoutes }
import { Router } from "express"

import { OrdersController } from "@/controllers/orders-controller"

const ordersRoutes = Router()
const ordersController = new OrdersController()


ordersRoutes.post("/", ordersController.create)
ordersRoutes.get("/", ordersController.index)
ordersRoutes.get("/:id", ordersController.show)
ordersRoutes.delete("/:id", ordersController.delete)
ordersRoutes.put("/:id", ordersController.update)


export { ordersRoutes }
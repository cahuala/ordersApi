import { Router } from 'express'

import { categoryRoutes } from './category-routes'
import { sizeRoutes } from './size-routes'
import { addonRoutes } from './addon-routes'
import { foodRoutes } from './food-routes'
import { uploadsRoutes } from './upload-routes'
import { sizeFoodRoutes } from './size-food-routes'
import { addonFoodsRoutes } from './addon-foods-routes'
import { tablesRoutes } from './table-routes'
import { ordersRoutes } from './order-routes'
import { tableSessionsRoutes } from './table-sessions-routes'
import { usersRoutes } from './user-routes'
import { sessionRoutes } from './sessions-routes'

const routes = Router()
// public routes
routes.use('/users', usersRoutes)
routes.use("/sessions",sessionRoutes)
// private routes
routes.use('/categories',categoryRoutes)
routes.use('/sizes',sizeRoutes)
routes.use('/addons', addonRoutes)
routes.use('/foods', foodRoutes)
routes.use("/uploads", uploadsRoutes)
routes.use("/size-foods", sizeFoodRoutes)
routes.use("/addon-foods", addonFoodsRoutes)
routes.use("/tables", tablesRoutes)
routes.use("/orders", ordersRoutes)
routes.use("/tables-sessions", tableSessionsRoutes)

export { routes }

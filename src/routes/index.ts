import { Router } from 'express'

import { categoryRoutes } from './category-routes'
import { sizeRoutes } from './size-routes'
import { addonRoutes } from './addon-routes'
import { foodRoutes } from './food-routes'
import { uploadsRoutes } from './upload-routes'
import { sizeFoodRoutes } from './size-food-routes'
import { addonFoodsRoutes } from './addon-foods-routes'

const routes = Router()

routes.use('/categories',categoryRoutes)
routes.use('/sizes',sizeRoutes)
routes.use('/addons', addonRoutes)
routes.use('/foods', foodRoutes)
routes.use("/uploads", uploadsRoutes)
routes.use("/size-foods", sizeFoodRoutes)
routes.use("/addon-foods", addonFoodsRoutes)

export { routes }

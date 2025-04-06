import { Router } from "express"
import multer from "multer"

import uploadConfig from "@/configs/upload"
import { UploadsController } from "@/controllers/upload-image-controller"

const uploadsRoutes = Router()
const uploadsController = new UploadsController()

const upload = multer(uploadConfig.MULTER)

uploadsRoutes.post("/",upload.single("file"), uploadsController.create)

export { uploadsRoutes }
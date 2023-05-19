import { Router } from "express"
import { getUrlById, shortenUrl } from "../controllers/urls.controller.js"
import { authValidate } from "../middlewares/auth.middleware.js"
import { urlSchema } from "../schemas/urls.schemas.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"

const urlsRouter = Router()

urlsRouter.post("/urls/shorten", authValidate, validateSchema(urlSchema), shortenUrl)
urlsRouter.get("/urls/:id", getUrlById)


export default urlsRouter
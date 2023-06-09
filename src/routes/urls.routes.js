import { Router } from "express"
import { deleteUrl, getUrlById, openShortUrl, shortenUrl, urlRanking, userUrls } from "../controllers/urls.controller.js"
import { authValidate } from "../middlewares/auth.middleware.js"
import { urlSchema } from "../schemas/urls.schemas.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"

const urlsRouter = Router()

urlsRouter.post("/urls/shorten", authValidate, validateSchema(urlSchema), shortenUrl)
urlsRouter.get("/urls/:id", getUrlById)
urlsRouter.get("/urls/open/:shortUrl", openShortUrl)
urlsRouter.delete("/urls/:id", authValidate, deleteUrl)
urlsRouter.get("/users/me", authValidate, userUrls)
urlsRouter.get("/ranking", urlRanking)


export default urlsRouter
import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import { db } from "../database/database.connection.js";

export async function authValidate(req, res, next) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.sendStatus(401)

    dotenv.config()
    const secretKey = process.env.SECRET_KEY

    try {
        const data = jwt.verify(token, secretKey)
        if (!data) return res.status(401).send("Token invalido")

        const session = await db.query(`SELECT * FROM sessions WHERE "userId"=$1`, [data.id])
        if (!session) return res.status(401).send("Sessao nao encontrada")
        res.locals.session = session

        next()

    } catch (err) {
        res.status(500).json(err.message);
    }
}
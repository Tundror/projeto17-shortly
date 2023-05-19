import { customAlphabet, nanoid } from "nanoid";
import { db } from "../database/database.connection.js";


export async function shortenUrl(req, res){
    const {url} = req.body
    try{
        const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8)
        const shortUrl = nanoid()
        const userId = res.locals.session.rows[0].userId
        await db.query(`INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3)`, [url, shortUrl, userId])
        const data = await db.query(`SELECT urls.id, urls."shortUrl" FROM urls WHERE "shortUrl"=$1 AND "userId"=$2`, [shortUrl, userId])

                

        res.status(201).send(data.rows[0])
        
    }catch(err){
        res.status(500).json(err.message);
    }
}
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

export async function getUrlById(req, res){
    const id = parseInt(req.params.id)
    try{
        const data = await db.query(`SELECT urls.id, urls."shortUrl", urls.url FROM urls WHERE id=$1`, [id])
        if(data.rows.length === 0) return res.status(404).send("id nao encontrado")
        res.status(200).send(data.rows[0])
    }catch(err){
        res.status(500).json(err.message);
    }
}

export async function openShortUrl(req, res){
    const {shortUrl} = req.params

    try{
        const data = await db.query(`SELECT urls.url, urls."visitCount" FROM urls WHERE "shortUrl"=$1`, [shortUrl])
        if(data.rows.length === 0) return res.status(404).send("url nao encontrada")

        const visitCountPlus = data.rows[0].visitCount + 1

        await db.query(`UPDATE urls SET "visitCount"=$1 WHERE "shortUrl"=$2`, [visitCountPlus, shortUrl])

        const originalUrl = data.rows[0].url
        res.redirect(originalUrl)
    }catch(err){
        res.status(500).json(err.message);
    }
}

export async function deleteUrl(req, res){
    const id = parseInt(req.params.id)
    const userId = res.locals.session.rows[0].userId

    try{
        const data = await db.query(`SELECT * FROM urls WHERE id=$1`, [id])
        if(data.rows.length === 0) return res.status(404).send("id nao encontrado")
        if (data.rows[0].userId !== userId) res.status(401).send("usuario nao autorizado")

        await db.query(`DELETE FROM urls WHERE id=$1`, [id])
        res.status(204).send("url excluida")
    }catch(err){
        res.status(500).json(err.message);
    }
}

export async function userUrls(req, res) {
    const userId = res.locals.session.rows[0].userId;
  
    try {
      const userData = await db.query(
        `
        SELECT u.id, u.name
        FROM users u
        WHERE u.id = $1
        `,
        [userId]
      );
  
      if (userData.rows.length === 0) {
        return res.status(404).send("User not found");
      }
  
      const user = userData.rows[0];
  
      const shortenedUrlsData = await db.query(
        `
        SELECT url.id, url."shortUrl", url.url, url."visitCount"
        FROM urls url
        WHERE url."userId" = $1
        `,
        [userId]
      );
  
      const shortenedUrls = shortenedUrlsData.rows.map(url => ({
        id: url.id,
        shortUrl: url.shortUrl,
        url: url.url,
        visitCount: url.visitCount
      }));
  
      const totalVisitsData = await db.query(
        `
        SELECT COALESCE(SUM(url."visitCount"), 0) AS totalVisits
        FROM urls url
        WHERE url."userId" = $1
        `,
        [userId]
      );
  
      const responseData = {
        id: user.id,
        name: user.name,
        totalVisits: totalVisitsData.rows[0].totalvisits,
        shortenedUrls: shortenedUrls || []
      };
      console.log(totalVisitsData.rows[0].totalvisits)
      res.status(200).json(responseData);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
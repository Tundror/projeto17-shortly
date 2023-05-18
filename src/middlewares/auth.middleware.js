import dotenv from "dotenv"

export async function authValidate(req, res, next){
    const {Authorization} = req.headers
    const token = Authorization?.replace("Bearer ", "")
    if (!token) return res.sendStatus(401)

    dotenv.config()
    const secretKey = process.env.SECRET_KEY

    try{
        const data = await jwt.verify(token, secretKey)
        if(!data) return res.sendStatus(401)
        const session = await db.query(`SELECT * FROM sessions WHERE `)

    }catch(err){
        res.status(500).json(err.message);
    }
}
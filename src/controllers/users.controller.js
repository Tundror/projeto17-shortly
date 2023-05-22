import bcrypt from "bcrypt";
import { db } from "../database/database.connection.js";
import dotenv from "dotenv"
import jwt from "jsonwebtoken";


export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);

    if(password !== confirmPassword) res.status(422).send("Senhas diferentes")

    try{
        const checkUser = await db.query(`SELECT * FROM users WHERE email=$1`, [email])
        if(checkUser.rows.length === 1) return res.sendStatus(409)

        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, hashPassword])

        res.sendStatus(201)
        
    }catch(err){
        res.status(500).json(err.message);
    }
}

export async function signIn(req, res) {
    const {email, password} = req.body;
    dotenv.config()
    const secretKey = process.env.SECRET_KEY
    try{
        const user =await db.query(`SELECT * FROM users WHERE email=$1`, [email])
        if (user.rows.length !== 1) return res.status(401).send("E-mail invalido")

        const correctPassword = bcrypt.compareSync(password, user.rows[0].password)
        if (!correctPassword) return res.status(401).send("Senha incorreta")

        const data = {id: user.rows[0].id}
        const token = jwt.sign(data, secretKey || 'mySecret')
        console.log(token)

        await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`, [token, user.rows[0].id])

        res.status(200).json({token: token})
    }catch(err){
        res.status(500).json(err.message);
    }


}
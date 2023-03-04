import { Router } from "express";
import User from "../dao/mongoDB/models/user.models.js";

const router = Router()

router.post('/', async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;

    if(!first_name || !last_name || !age || !email || !password) return res.status(400).json({error: 'Los datos ingresados no son correctos'});

    try {
        const newUserInfo = {
            first_name,
            last_name,
            age,
            email,
            password
        }
        
        const newUser = await User.create(newUserInfo);
    
        res.status(201).json({message: newUser})
    } catch (error) {
        console.log(error);
        if(error.code === 11000) return res.status(400).json({error: 'Ya existe un usuario con ese correo electrónico'});
        res.status(500).json({error: 'Error interno del servidor'});
    }
})
export default router;
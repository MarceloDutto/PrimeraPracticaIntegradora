import { Router } from "express";
import User from "../dao/mongoDB/models/user.models.js";

const router = Router();

router.post('/', async (req, res) => {
    const adminEmail = 'adminCoder@coder.com';
    let role = 'usuario'
    const { email, password } = req.body;

    if(!email || !password) return res.status(400).json({error: 'Los datos ingresados no son correctos.'});

    try {
        const user = await User.findOne({ email });

        if(!user) return res.status(400).json({error: 'El usuario y la contraseña no coinciden'});
        if(user.password !== password) return res.status(400).json({error: 'El usuario y la contraseña no coinciden.'});
        if(email === adminEmail) role = 'administrador';

        const { first_name, last_name } = user;

        req.session.user = {
            first_name,
            last_name,
            email: user.email,
            role
        }
    
        res.json({message: 'Sesión iniciada.'})
        
    } catch(error) {
        console.log(error);
        res.status(500).json({error: 'Error interno del servidor.'});
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.status(500).json({ error });
        res.redirect('/login');
    })
})

export default router;
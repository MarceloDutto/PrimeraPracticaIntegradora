import { Router } from "express";
import passport from "passport";

const router = Router();

router.post('/', passport.authenticate('login', {failureRedirect: '/api/auth/failLogin'}), async (req, res) => {
    const adminEmail = 'adminCoder@coder.com';
    let role = 'usuario'

    try {
        if(!req.user) return res.status(400).json({error: 'El usuario y la contraseña no coinciden'});
 
        const { first_name, last_name, email } = req.user;

        if(email === adminEmail) role = 'administrador';

        req.session.user = {
            first_name,
            last_name,
            email,
            role
        }
        res.status(401).json({message: 'Sesión iniciada.'})
    } catch(error) {
        console.log(error);
        res.status(500).json({error: 'Error interno del servidor.'});
    }
})

router.get('/failLogin', (req, res) => {
    res.status(400).json({message: 'Falló la autenticación'})
})

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req, res) => {});

router.get('/githubCallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    const adminEmail = 'adminCoder@coder.com';
    let role = 'usuario'

    req.session.user = req.user;

    if(req.session.user.email === adminEmail) role = 'administrador';
    req.session.user.role = role;

    res.redirect('/products');
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.status(500).json({ error });
        res.redirect('/login');
    })
})

export default router;
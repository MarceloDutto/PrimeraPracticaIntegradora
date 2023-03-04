function publicAccess (req, res, next) {
    if(req.session.user) return res.redirect('/products')

    next()
}

export default publicAccess;
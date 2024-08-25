exports.home = (req, res, next) => {
    
    res.render('home', {
        pageName: 'Home'
    })
}
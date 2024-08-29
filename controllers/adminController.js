exports.administrationPanel = (req, res, next) => {
    res.render('administration', {
        pageName: 'Administration Panel'
    })
}
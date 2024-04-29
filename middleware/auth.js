const Art = require('../models/art');

//check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user){
        return next();
    } else {
        req.flash('error', 'you are already logged in');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user){
        return next();
    } else {
        req.flash('error', 'you need to log in first');
        return res.redirect('/users/login');
    }
};

//check if user is the creator of the art
exports.isSeller = (req, res, next) =>{
    let id = req.params.id;
    Art.findById(id)
    .then (art=> {
        if(art){
            if(art.seller == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find an artwork with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};

exports.isNotSeller = (req, res, next) => {
    let id = req.params.id;
    Art.findById(id)
        .then(art => {
            if (art) {
                if (art.seller == req.session.user) {
                    let err = new Error('You cannot make an offer on your own item.');
                    err.status = 401;
                    return next(err);
                } else {
                    return next();
                }
            } else {
                let err = new Error('Cannot find an artwork with id ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};
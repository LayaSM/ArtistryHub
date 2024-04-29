const model = require('../models/user');
const Art = require('../models/art');
const Offer = require('../models/offer');

exports.new = (req, res)=>{
    return res.render('./user/new'); 
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    user.save()
    .then(user=> {
        if (user){
            req.flash('success', 'Registration Successful!')
            res.redirect('/users/login');
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }
        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
        next(err);
    }); 
};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                } else {
                    req.flash('error', 'wrong password, try again!');      
                    res.redirect('/users/login');
                }
            });      
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    console.log('User ID:', id);
    Promise.all([model.findById(id), Art.find({seller: id}), Offer.find({ user: id }).populate('item')])
    .then(results=>{
        const [user, artworks, offers] = results;
        res.render('./user/profile', {user, artworks, offers});
    })
    .catch(err=>next(err));
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) {
            return next(err);
        } else{
            res.redirect('/');  
        }   
    });
 };




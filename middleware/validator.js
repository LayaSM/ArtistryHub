const {body, validationResult} = require('express-validator');

// Middleware function to validate ObjectId route parameter
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid art id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [
    body('firstName', 'First Name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last Name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(), 
    body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(), 
    body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateArtwork = [
    body('title', 'title cannot be empty').notEmpty().trim().escape(), 
    body('condition').optional().custom(value => {
        return ['new', 'like_new', 'used', 'fair', 'poor'].includes(value);
    }),
    body('price').optional().isFloat({ gt: 0 }),
    body('details', 'Details should have minimum of 10 characters').isLength({min:10}).trim().escape()
];

exports.validateResults = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error =>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }
    else {
        return next();
    }
}
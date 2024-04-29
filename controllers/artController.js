// includes all the callback functions
const model = require('../models/art');
const offer = require('../models/offer');

//Get /artworks: send all artworks to the user
exports.index = (req, res, next)=>{
    let searchTerm = req.query.search;
    let filter = {};
    if (searchTerm) {
        filter.$or = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { details: { $regex: searchTerm, $options: 'i' } }
        ];
        filter.active = true;
    }

    model.find(filter)
    .then(artworks=>{
        console.log(artworks);
        res.render('./art/index', {artworks})})
    .catch(err=>next(err));
};

// GET /artworks/new: send html form for creating a new art
exports.new = (req, res)=>{
    res.render('./art/new');
};

//POST /artworks: create a new art
exports.create = (req, res, next)=>{
    let art = new model (req.body);
    art.seller = req.session.user;
    art.image = '/images/' + req.file.filename;
    art.save()
    .then(art => {
        if(art){
            req.flash('success', 'You have successfully created an artwork!');
            res.redirect('/artworks')
        }
        else {
            req.flash('error', 'The item was not created!'); 
            res.redirect('./art/new');
        }
    })
    .catch(err =>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};

//GET /artworks/:id send details of an art identified by id 
exports.show = (req,res, next)=>{
    let id = req.params.id;
    model.findById(id).populate('seller', 'firstName lastName')
    .then(art=>{
        console.log(art);
        if(art){
            res.render('./art/show', {art});
        } else {
            let err = new Error('Cannot find an art with id ' + id);
            err.status=404;
            next(err);
        }
    })
    .catch(err=>next(err));  
};

//GET /artworks/:id/edit send html form for editing an existing art
exports.edit = (req,res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(art=>{
        if(art){
            res.render('./art/edit', {art});
        } else {
            let err = new Error('Cannot find an art with id ' + id);
            err.status=404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//PUT /artworks/:id: update the art identified by id
exports.update = (req,res, next)=>{
    let art = req.body;
    let id = req.params.id;
    model.findByIdAndUpdate(id, art, {userFindAndModify: false, runValidators: true})
    .then(art=>{
        if (req.file) {
            art.image = '/images/' + req.file.filename;
        }
        if(model.findByIdAndUpdate(id, art)){
            req.flash('success', 'The item was successfully edited!');
            res.redirect('/artworks/'+id);
        } else {
            req.flash('error', 'The item was not edited!');
            let err = new Error('Cannot find an art with id ' + id);
            err.status=404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
}; 

//DELETE /artworks/:id delete the art identified by id 
exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.findByIdAndDelete(id, { useFindAndModify: false })
        .then(art => {
            if (art) {
                // Delete associated offers
                return offer.deleteMany({ item: id })
                    .then(() => {
                        req.flash('success', 'Item deleted successfully!');
                        res.redirect('/artworks');
                    });
            } else {
                let err = new Error('Cannot find an art with id ' + id);
                err.status = 404;
                throw err;
            }
        })
        .catch(err => next(err));
};


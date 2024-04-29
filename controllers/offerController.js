const User = require('../models/user');
const Offer = require('../models/offer');
const Art = require('../models/art');

exports.makeOffer = (req, res, next) => {
    let offer = new Offer(req.body);
    offer.user = req.session.user;
    const itemId = req.params.id;
    offer.item = itemId;
    offer.status = "pending"; 
    offer.save()
    .then(offer => {
        if(offer) {
            // return Art.findById(itemId);
            return Art.findById({ _id: itemId });
        } else {
            let err = new Error('Cannot find an artwork with id ' + itemId);
            err.status = 404;
            throw err;
        }
    }).then(item => {
        if (item) {
            item.totalOffers += 1;

            if (offer.amount > item.highestOffer) {
                item.highestOffer = offer.amount;
            }
            return item.save();
        } else {
            let err = new Error('Artwork not found or not active.');
            err.status = 404;
            throw err;
        }
    }).then(() => {
        req.flash('success', "You have sent a new offer!");
        res.redirect('/artworks/'+itemId);
    })
    .catch(err => next(err));
};

exports.viewAllOffers = (req, res, next) => {
    // Check if the user is logged in
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login page if not logged in
    }
    const userId = req.session.user;

    Art.findById(req.params.id) // Find the artwork by ID
        .then(art => {
            if (!art) {
                const err = new Error('Artwork not found');
                err.status = 404;
                throw err;
            }
            if (art.seller.toString() !== userId) {
                const err = new Error('You are not authorized to view offers for this item');
                err.status = 401;
                throw err;
            }
            // If the user is the seller, render the offers view
            Offer.find({ item: art._id }).populate('user').then(offers => {
                res.render('./offers/offers', { user: req.session.user, artworks: [art], offers: offers });
            });
        })
        .catch(err => next(err));
};


exports.acceptOffer = (req, res, next) => {
    const userId = req.session.user;
    const offerId = req.params.offerId; // Assuming the offer ID is passed as a route parameter
    const itemId = req.params.id;

    // Check if the user is logged in
    if (!userId) {
        req.flash('error', 'You must be logged in to accept an offer.');
        return res.redirect('/login');
    }
    console.log('Offer ID:', offerId); // Log the offer ID

    // Find the offer by ID and populate the related item
    Offer.findById(offerId).populate('item')
        .then(offer => {
            console.log('Offer found:', offer); // Log the offer
            // Check if the offer exists
            if (!offer) {
                req.flash('error', 'Offer not found.');
                return res.redirect('back');
            }
            // Check if the user is the seller of the item
            if (offer.item.seller.toString() !== userId) {
                req.flash('error', 'You are not authorized to accept this offer.');
                return res.redirect('back');
            }
            // Update the offer status to 'accepted'
            offer.status = 'accepted';
            console.log('Offer status:', offer.status); // Log the updated status

            // Update the status of all other offers on the same item to 'rejected'
            return Promise.all([
                offer.save(),
                Offer.updateMany(
                    { item: offer.item._id, _id: { $ne: offerId } },
                    { status: 'rejected' }
                ),
                Art.findByIdAndUpdate(itemId, { active: false }) // Update the active status of the artwork
            ]);
        })
        .then(() => {
            req.flash('success', 'Offer accepted successfully.');
            // Redirect to the offers view page
            res.redirect('/artworks/' + itemId + '/offers');
        })
        .catch(err => {
            console.error('Error accepting offer:', err); // Log any errors
            req.flash('error', 'An error occurred while accepting the offer.');
            next(err);
        });
};

'use strict'

const routes = (app) => {

    //404
    app.get('/*', function(req, res,next) {
    	if(req.hostname == 'lovestudio.com') return res.redirect(302, 'http://www.lovestudio.com/');
        next();
    })

}
module.exports = routes;

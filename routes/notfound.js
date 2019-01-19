'use strict'

const routes = (app) => {

    //404
    app.get('/*', function(req, res) {
    	
        console.log('404 handler..');
        let response = res;
        response.render('404', {
            status: 404,
            title: '404--您访问的页面不存在',
        });
        
    })

}
module.exports = routes;

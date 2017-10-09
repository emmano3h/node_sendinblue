module.exports= function( response ) {
    //console.log('welcome::::::',response);
    return result => {

        response.status(result.status);
        response.json( result );
    };
}
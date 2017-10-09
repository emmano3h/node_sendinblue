let promiseResponder= require( 'utils/promiseResponder');

module.exports= function( res, next, serviceClass, packet ) {
    let service;

    service = new serviceClass( packet );

    service.execute()
        .then( promiseResponder( res ) )
        .catch( next );
}
let _=require('lodash');
module.exports= class generalResponse {

    constructor(status=null,error=null,datakey='default',data=null,count=0 ) {
        //console.log("is it here",status);
        if(!status || !_.isObject(status))
        {
            status={code:500,text:"INTERNAL ERROR"};
        }
        /*console.log("is it here",{
            data:{err:error,[datakey]:data,count:count},
            status:status.code ,
            statusText:status.text
        });*/
        return {
            data:{err:error,[datakey]:data,count:count},
            status:status.code ,
            statusText:status.text
        };
    }
}
/**
 * Created by edouard on 11/05/2017.
 */
module.exports.ip = function (req) {
    const publicIp = require('public-ip');
    var ipv4 = publicIp.v4().then(function(ip){
        return ip;
    });
    var ipv6 = publicIp.v6().then(function(ip){
        return ip;
    });

    var client_ip = {
        v4: ipv4,
        v6: ipv6
    };

    return client_ip;
};
'use strict';

var i18n=require('i18n');

i18n.configure({
    locales:['es','en'],
    directory: __dirname + '/translations'
});


exports.translateMessage=(message) =>
 {   
        return i18n.__(message);
 }
 



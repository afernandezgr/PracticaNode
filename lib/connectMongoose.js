'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

//para quitar el depreaction warning

mongoose.Promise = global.Promise;

conn.on('error',err => {
    console.log('Error!',err);
    process.exit(1);
});

conn.once('open', () => {
    console.info(`Connected to mongodb en ${mongoose.connection.name}`);
})

mongoose.connect('mongodb://localhost/nodepop', {
    useMongoClient: true});

//añadimso este parametro del final para eliminar el warning que nos sale
//(node:4604) DeprecationWarning: `open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the `useMongoClient` option if using `connect()` or `createConnection()`. See http://mongoosejs.com/docs/connections.html#use-mongo-client

module.exports = conn;
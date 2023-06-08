const mongoose = require('mongoose');
const {MONGODB_CONNECTION_STRING} = require('../conifg/index');

const dbConnect = async()=>{
    try{
    const conn = await mongoose.connect(MONGODB_CONNECTION_STRING);
    console.log("database is connected to host"+conn.connection.host);
    }
    catch(error){
        console.log("Error: "+error)
    }
}
module.exports = dbConnect;

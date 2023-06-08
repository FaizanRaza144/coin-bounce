const express = require ('express');
const dbConnect = require('./database/index');
const app = express();
const {PORT}  = require('./conifg/index');
const router = require('./routers/index');
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser');


app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.use(cookieParser());

dbConnect();
app.use(express.json());
app.use(router);
app.use('/storage',express.static('storage'));


app.use(errorHandler);

app.listen (PORT, console.log("The Backend is running at PORT:" + PORT));
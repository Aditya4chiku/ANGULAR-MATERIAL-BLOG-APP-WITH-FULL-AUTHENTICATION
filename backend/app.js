const express = require('express');
const mongoose=require('mongoose');
const path=require('path');
const bodyParser=require('body-parser');
const PageRouter=require('../backend/routers/page.route');
const UserSchema=require('../backend/routers/user.route');
const cors=require('cors');
const app = express();


app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}));

app.use('/images',express.static(path.join('backend/images')))

var url = "mongodb://localhost:27017/BlockData";  
mongoose.connect(url, function(err) {  
if (err) throw err;  
console.log("Database created!");  
//db.close();  
});  



app.use((req, res, next) => {

       res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
                   'Access-Control-Allow-Headers',
                  'Origin,X-Request-With, Content-Type,Accept'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,PATCH', 'DELETE', 'OPTIONS'
    );
    next()

})
app.use('/api/posts',PageRouter);
app.use('/api/users',UserSchema);

//post Data





module.exports = app;
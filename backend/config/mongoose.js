const mongoose=require('mongoose')

var url = "mongodb://localhost:27017/BlockData";  
mongoose.connect(url, function(err) {  
if (err) throw err;  
console.log("Database created!");  
//db.close();  
});  
module.exports=mongoose

const express=require('express');
const app=require('./backend/app');
const port=3000;
app.get("",(req,res)=>{
  res.send("i am from back")
})
app.listen(port,()=>{
  console.log("Port started"+ port)
}
)
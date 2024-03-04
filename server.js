const express = require("express")
const app = express()
app.use(express.json())

//databaseConfiguration
const configDb = require("./config/db")
configDb()

//suraj






//sufal



//listening requests
app.listen(3060, ()=>{
    console.log('Server runnning on port 3060')
})



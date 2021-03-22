const express = require('express');
const path = require('path');

let products = require("./products.json");
let app = new express();

app.use('/', express.static (path.join(__dirname, 'public')));


app.listen(3000,()=>{
    console.info('Server listening on port 3000...');
});

app.get("/fetch", (req, res)=> {
    res.send(products);
});

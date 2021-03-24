// dependencies
const session = require('express-session');
const express = require('express');
const path = require('path');

// prequisites
let products = require("./products.json");

let app = new express();
app.use(express.json({
    type: "application/json"
}));

// session-setup
app.set('trust proxy', 1);
app.use(session({
    secret: 'oneisallallisone',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// SSR
app.use('/', express.static (path.join(__dirname, 'public')));

// Custom memory-store
let user = new Map();
let cart = new Map();

// Auth management: Login
app.post('/login', (req, res)=> {

    const {email, passwd} = req.body;
    // console.log(email, passwd);

    // first-time login
    if(user[email] === undefined) {
        user[email] = passwd;
        cart[req.session.id] = [];
    }

    // impostor
    else if(user[email] !== passwd) {
        req.session.loggedIn = false;
        res.status(401).send("[]");
        return;
    }

    // send cart data
    req.session.loggedIn = true;
    res.send(JSON.stringify(cart[req.session.id]));
});

// Auth management: Authenticate
app.get('/auth', (req,res)=> {

    if(req.session.loggedIn === true) {

        let data = "[]";

        if(cart[req.session.id] !== undefined)
            data = JSON.stringify(cart[req.session.id])

        res.send(data);
        return;
    }

    res.status(401).send("[]");
});

// Auth management: Logout
app.get('/logout', (req, res)=> {
    req.session.loggedIn = false;
    res.send("[]");
});

// Cart management: Sync
app.post('/sync', (req,res)=> {

    if(req.session.loggedIn === false) {
        res.status(401).send("[]");
        return;
    }

    const {userCart} = req.body;
    cart[req.session.id] = userCart;
    
    res.send("ok");
});

// initialization
app.listen(3000,()=>{
    console.info('Server listening on port 3000...');
});

// inventory
app.get("/fetch", (req, res)=> {
    res.send(products);
});

const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({
    type: 'application/json'
}));

let store = [];
let uid = 2;

// template task
store.push({
    id: 1,
    completed: false,
    description: "Task 1"
});

// Send page to client
app.get('/', async (req, res) => {
    const response = await fs.readFileSync("./index.html");
    res.end(response);
});

// fetch list
app.post("/list", async (req, res) => {
    res.send(JSON.stringify(store));
});

// add to list
app.post("/add", function (req, res) {

    const { data } = (req.body);

    store.push({
        id: uid, completed: false,
        description: data
    });

    uid++;
    // console.log(store);
    res.send(JSON.stringify(uid - 1));

});

// modify list
app.post("/change", async (req, res) => {

    let index = 0;
    const { data } = req.body;
    // console.log(data);

    store.forEach((el, it) => {
        if (el.id === data)
            index = it;
    });

    // console.log(index);
    if (index != -1)
        store[index].completed = !store[index].completed;
    else
        res.status(404).send(JSON.stringify("ERR"));

    res.send(JSON.stringify("OK"));
});

// delete from list
app.post("/remove", async (req, res) => {

    const { data } = req.body;
    store = await store.filter(el => {
        return el.id !== data;
    });

    res.send("OK");
});

app.listen(3000, () => {
    console.log("Server listening on port 3000!");
});

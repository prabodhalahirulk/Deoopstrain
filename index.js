const express = require('express');
const bodyParser = require('body-parser');
// const uuid = require("uuid");

//Loading environment variables
const PORT = process.env.PORT || 8070;

//creating an express app
const app = express();

//using bodyparser middleware
app.use(bodyParser.json());

//creating an array to store shopping items
const shopItems = [];

//getting a items
app.get("/api/items", (req, res) => {
    res.status(200).json(shopItems);
})

//getting item by it's id
app.get("/api/items/:itemId", (req, res) => {
    const itemId = req.params.itemId;
    const itemN = shopItems.findIndex((item) => item.id === itemId)
    if(!itemId) {
        return res.status(404).json({
            message: "item doesn't exist"
        })
    }
    res.status(200).json(shopItems[itemN]);
})

//Adding a route to add items
app.post("/api/items", (req, res) => {
    const item = req.body;

    //checking the required fields are present before adding
    if(!item.id || !item.name || !item.description || !item.price || !item.quantity){
        return res.status(400).json({
            message: "Required fields are missing",
        });
    }

    //Assigning ID to item
    // item.id = uuid.v4();

    //Adding item to the array
    shopItems.push(item);

    res.status(201).json(item);
})

//Updating Shopping Item
app.put("/api/items/:itemId", (req, res) => {
    const itemId = req.params.itemId;

    //checking the validity of itemid
    if(isNaN(itemId)) {
        return res.status(400).json({
            message: "Not a valid item id. You can use a number for id",
        })
    }

    //finding the correct item id
    const itemN = shopItems.findIndex((item) => item.id === itemId);

    //checking the item existence
    if(itemN === -1){
        return res.status(404).json({
            message: "Couldn't find the item",
        });
    }

    //Updating the item with new values 
    shopItems[itemN] = {...shopItems[itemN], ...req.body};

    res.status(200).json(shopItems[itemN]);

});

//Deleting an existing item
app.delete("/api/items/:itemId", (req, res) => {
    const itemId = req.params.itemId;
    const itemN = shopItems.findIndex((item) => item.id === itemId);

    //checking the validity of itemid
    if(isNaN(itemId)) {
        return res.status(400).json({
            message: "Not a valid item id. You can use a number for id",
        })
    }

    if(itemN === -1){
        return res.status(404).json({
            message: "Couldn't find the item",
        });
    }
    shopItems.splice(itemN, 1);
    res.status(200).json({
        message : "Item deleted successfully",
    });
})

app.listen(PORT, ()=>{
    console.log('⚡ Your app is running on :', PORT)
})
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

let shops = [];
let shopsinfo = []; 


app.use(express.static(path.join(__dirname, 'test')));


fs.readFile('shopinfo.json', (err, data) => {
    if (err) {
        console.error('Error reading shops file:', err);
    } else {
        shops = JSON.parse(data);
        console.log('Shops loaded from file');
    }
});
fs.readFile('shopmenu.json', (err, data) => {
    if (err) {
        console.error('Error reading shops file:', err);
    } else {
        shopsinfo = JSON.parse(data);
        console.log('Shops menu loaded from file');
    }
});

app.post('/donutshop', (req, res) => {
    const newShop = req.body;
    newShop.index = shops.length+1;
    console.log('New Shop Object:', newShop);
    shops.push(newShop);
    saveShopsToFile();
    console.log('Shops after adding new shop:', shops); 
    res.json(newShop); 
});


app.get('/donutshop/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const shop = shops.find(shop => shop.index === index);
    if (shop) {
        res.json(shop);
    } else {
        res.status(404).json({ error: 'Donut shop not found' });
    }
});


app.put('/donutshop/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const shopIndex = shops.findIndex(shop => shop.index === index);
    if (shopIndex !== -1) {
        shops[shopIndex] = req.body;
        shops[shopIndex].index = index; 
        saveShopsToFile();
        res.json({ message: 'Donut shop updated successfully' });
    } else {
        res.status(404).json({ error: 'Donut shop not found' });
    }
});


app.delete('/donutshop/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const shopIndex = shops.findIndex(shop => shop.index === index);
    if (shopIndex !== -1) {
        shops.splice(shopIndex, 1);
        

        fs.writeFile('shopinfo.json', JSON.stringify(shops), err => {
            if (err) {
                console.error('Error saving shops to file:', err);
                res.status(500).json({ error: 'Error deleting donut shop' });
            } else {
                console.log('Donut shop deleted successfully');
                res.json({ message: 'Donut shop deleted successfully' });
            }
        });
    } else {
        res.status(404).json({ error: 'Donut shop not found' });
    }
});


app.get('/donutmenu', (req, res) => {
    res.json(shopsinfo);
});
app.get('/donutshop', (req, res) => {
    res.json(shops);
});


function saveShopsToFile() {
    fs.writeFile('shopinfo.json', JSON.stringify(shops), err => {
        if (err) {
            console.error('Error saving shops to file:', err);
        } else {
            console.log('Shops saved to file');
        }
    });
}


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

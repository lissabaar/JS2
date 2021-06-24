const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

app.get('./catalog', (req, res) => {
  fs.readFile('catalog.json', 'utf8', (err, data) => {
    res.send(data);
  });
});

const getCart = app.get('./cart', (req, res) => {
  fs.readFile('cart.json', 'utf8', (err, data) => {
    res.send(data);
  });
});

app.post('/addToCart', (req, res) => {
  fs.readFile('cart.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      const cart = JSON.parse(data);
      const item = req.body;

      let isNew = true;
      if (cart.length > 0) {
        for (let i = 0; i < cart.length; i++) {
          if (item.id_product == cart[i].id_product) {
            cart[i].count++;
            isNew = false;
          }
        }
      }
      if (isNew) {
        cart.push({ ...item, 'count': 1 });
      }

      fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
        if (err) {
          res.send('{"result": 0}');
        } else {
          res.send('{"result": 1}');
          getCart;
        }
      });
    }
  });
});

app.post('/removeItem', (req, res) => {
  fs.readFile('cart.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
    } else {
      let cart = JSON.parse(data);
      const item = req.body;
      cart = cart.filter((el) => el.id_product != item.id_product)
      fs.writeFile('./cart.json', JSON.stringify(cart), (err) => {
        res.send('{"result": 0}');
      });
      getCart;
    }
  })
});

app.listen(3000, () => {
  console.log('server is running on port 3000!');
});
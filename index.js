const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Object = require('mongodb').ObjectID
require('dotenv').config()
const port = process.env.PORT || 4400;

// mongoString
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9cu5v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
const { ObjectID } = require('mongodb');
app.use(cors());
app.use(bodyParser.json());

// collectionArea
client.connect(err => {
  const ProductsCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const OrdersCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ORDER}`);

  // ProductCollection
  app.get('/allProducts', (req, res) => {
    ProductsCollection.find()
      .toArray((err, product) => {
        res.send(product)
      })
  });

  app.get('/manageProducts', (req, res) => {
    ProductsCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  });


  app.get('/checkProduct/:id', (req, res) => {
    const Id = ObjectID(req.params.id);
    ProductsCollection.find({ _id: Id })
      .toArray((err, product) => {
        res.send(product[0]);
      })
  });

  app.post('/addImages', (req, res) => {
    const NewImageUrl = req.body;
    ProductsCollection.insertOne(NewImageUrl)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  app.get('/editProduct/:id', (req, res) => {
    const Id = ObjectID(req.params.id);
    ProductsCollection.find({ _id: Id })
      .toArray((err,documents) => {
        res.send(documents[0]);
      })
  });

  app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    ProductsCollection.findOneAndDelete({ _id: id })
      .then(result => {
        res.send(result.deleteCount > 0)
      })
  });


  // OrderCollection
  app.post('/orderProduct', (req, res) => {
    const orders = req.body;
    console.log(orders, 'orderProduct')
    OrdersCollection.insertOne(orders)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });


  app.get('/readOrderProducts', (req, res) => {
    OrdersCollection.find({email: req.query.email})
      .toArray((err, documents) => {
        res.send(documents)
      })
  });


});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.ec8hxwt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const toysCollection = client.db('toyDB').collection('toy');

    const toygallery = require('./data/toygallery.json');

    app.get('/toygallery', (req, res) => {
      res.send(toygallery);
    });


    app.get('/addatoy', async (req, res) => {
      const result = await toysCollection.find().toArray();
      res.send(result);
    });

    app.get('/addatoy/:id', async (req, res) => {
      const { id } = req.params;
      const toy = await toysCollection.findOne({ _id: new ObjectId(id) });
      res.json(toy);
    });

    app.get('/addatoy/:id', async(req, res ) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.findOne(query);
      res.send(result);
    })


    app.get('/mytoys', async (req, res) => {
      const { email } = req.query;
      let query = {};
      if (email) {
        query = { sellerEmail: email };
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/addatoy', async (req, res) => {
      const newToy = req.body;
      const result = await toysCollection.insertOne(newToy);
      res.json({ insertedId: result.insertedId });
    });

    
    

    app.delete('/addatoy/:id' , async(req, res) => {

      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })

    

    app.put('/addatoy/:id' , async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedToy = req.body;
      const toys = {
        $set: {price: updatedToy.price,
        quantity: updatedToy.quantity,
        details: updatedToy.details
      } 
      }

      const result = await toysCollection.updateOne(filter, toys, options);
      res.send(result);

    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('SIMPLE CRUD IS RUNNING');
});

app.listen(port, () => {
  console.log(`SIMPLE CRUD is running on port ${port}`);
});

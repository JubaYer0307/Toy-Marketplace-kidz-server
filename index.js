const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

console.log(process.env.DB_Password);


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.ec8hxwt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const toysCollection = client.db('toyDB').collection('toy');

    const toygallery = require('./data/toygallery.json');


    app.get('/toygallery', (req, res) => {
        res.send(toygallery);
      });

    app.post('/addatoy', async(req, res) => {
        const newToy = req.body;
        console.log(newToy);
        const result = await toysCollection.insertOne(newToy);
        res.send(result);
    })

    app.get('/addatoy', async(req, res) => {
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/addatoy', async (req, res) => {
        console.log(req.query.email);
        let query = {};
        if (req.query?.email) {
            query = {email: req.query.email}
        }
        const result = await bookingCollection.find(query).toArray();
        res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => [
    res.send('SIMPLE CRUD IS RUNNING')
])

app.listen(port, () => {
    console.log(`SIMPLE CRUD is running on port, ${port}`);
})
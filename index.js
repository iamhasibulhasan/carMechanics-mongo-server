const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;



const app = express();
const port = 5000;

/**
 * Middleware
 */
app.use(cors());
app.use(express.json());

/**
 * Mongo DB Setup
 */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ctq5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });
        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;

            console.log('Post Api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });



    } finally {
        // await client.close();
    }
}



app.get('/', (req, res) => {
    res.send('Running genius server');
});

app.listen(port, () => {
    console.log('Running genius server on port ', port);
    // console.log(uri);
});

run().catch(console.dir);
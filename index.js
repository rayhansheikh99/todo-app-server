const express = require('express')
const cors = require("cors");
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ouksj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Todo-App');
        // console.log("connect")
        const taskCollection = database.collection('tasks');


        //GET Products API
        
        app.get('/alltask', async (req, res) => {
            const cursor = taskCollection.find({});
            const tasks = await cursor.toArray();
            res.send(tasks);
        });


        // POST API

        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.json(result);
          
        })
        //PUT API



        // DELETE API
        app.delete('/alltask/:id', async (req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await taskCollection.deleteOne(query);
            console.log('deleting user with id', result);
            res.json(result);
        })



    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Todo-App server ready to Start')
})

app.listen(port, () => {
    console.log(`Server is running`, port)
})

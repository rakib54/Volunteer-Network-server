const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID

const port = process.env.PORT || 5000;

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4bol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("Volunteer").collection("events");

  app.get('/events', (req , res) =>{
    collection.find()
    .toArray((err , events) =>{
      res.send(events)
    })
  })

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body
    console.log('new Event ', newEvent);
    collection.insertOne(newEvent)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0)

      })
  })

  app.delete('/deleteEvent/:id',(req , res) =>{
      const id = objectId(req.params.id)
      collection.findOneAndDelete({_id:id})
      .then(documents => {
        res.send(!!documents.value)
      })
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
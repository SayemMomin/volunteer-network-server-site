const express = require('express')
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
var cors = require('cors')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8hyt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})




client.connect(err => {
  const eventCollection = client.db(`${process.env.DB_NAME}`).collection("totalEvent");
 
  const selectedEventCollection = client.db(`${process.env.DB_NAME}`).collection("selectedEvent");
  // perform actions on the collection object
  app.post('/addEvent', (req, res) => {
    const event = req.body 
    console.log('conneted');
    eventCollection.insertOne(event)
    .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
        //res.redirect('/')
        
    })
})

app.get('/events', (req, res) => {
  eventCollection.find({})
  .toArray((err, documents) => {
      res.send(documents)
  })
})


app.post('/addSelectedEvent', (req, res) => {
  const selectedEvent = req.body 
  //console.log(product);
  selectedEventCollection.insertOne(selectedEvent)
  .then(result => {
      console.log(result.insertedCount)
      res.send(result.insertedCount > 0)
      //res.redirect('/')
      // console.log(result)
      // res.send(result)
  })
})

app.get('/volunteerRegList', (req, res) => {
  selectedEventCollection.find({})
  .toArray((err, documents) => {
      res.send(documents)
  })
})

app.delete('/delete/:id', (req, res) => {
  selectedEventCollection.deleteOne({key: req.params.key})
  .then(result => {
      console.log(result);
      res.send(result.modifiedCount > 0)
  })
})

app.get('/eventSelected', (req, res) => {
  console.log(req.query.email)
  selectedEventCollection.find({email: req.query.email})
  .toArray((err, documents) => {
      res.send(documents)
  })
})

app.post('/createEvent', (req, res) => {
  const createEvent = req.body 
  //console.log(product);
  eventCollection.insertOne(createEvent)
  .then(result => {
      console.log(result.insertedCount)
      res.send(result.insertedCount > 0)
      //res.redirect('/')
      // console.log(result)
      // res.send(result)
  })
})
  //client.close();
});



app.listen(process.env.PORT || port)
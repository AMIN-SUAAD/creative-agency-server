const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wub2s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



app.use(bodyParser.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

const port = 5000; 

app.get('/', (req, res) =>{
    res.send('working')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const orderCollection = client.db("creativeAgency").collection("orders");
  const reviewCollection = client.db("creativeAgency").collection("reviews");
  const adminCollection = client.db("creativeAgency").collection("admins");
  const serviceCollection = client.db("creativeAgency").collection("services");
  const messageCollection = client.db("creativeAgency").collection("clientMessages");


  app.post('/addOrder', (req, res) => {
      const order = req.body;
      orderCollection.insertOne(order)
      .then(response =>{
          res.send(response.insertedCount > 0)
      })
  })

  app.post('/addMessage', (req, res) => {
    const message = req.body;
    messageCollection.insertOne(message)
    .then(response =>{
        res.send(response.insertedCount > 0)
    })
})

app.post('/addReview', (req, res) =>{
    const file = req.files.file;
    const name = req.body.name;
    const company = req.body.company;
    const review = req.body.review;
    //const filePath = `${__dirname}/services/${file.name}`;
    console.log(name, company, review)
    
   

    /*file.mv(filePath, err => {
        if (err) {
            res.status(500).send(err);
        }*/
        var newImg = req.files.file.data;
        const encImg = newImg.toString('base64');

        var image ={
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };
        reviewCollection.insertOne({name: name, company: company, review: review, image:image})
        .then(result => {
            /*fs.remove(filePath, error => {
                if (error) {console.log(error);}
                res.send(result.insertedCount>0)
            })*/
            res.send(result.insertedCount>0) 
        })
        //return res.send({serviceName: serviceName, description: description, path:`/${file.name}`});


    //})


})

app.post('/orders', (req, res) => {
    const email = req.body.email;
    
    orderCollection.find({ email: email})
    .toArray((err, documents) => {
        res.send(documents)
        console.log(documents)
    })
    })


    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        
        adminCollection.find({ email: email})
        .toArray((err, documents) => {
            res.send(documents)
            console.log(documents)
        })
        })

        app.post('/serviceList', (req, res) => {
            const email = req.body.email;
            
            orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
                console.log(documents)
            })
            })  
            
app.post('/addAdmin', (req, res) => {
const admin = req.body;
 adminCollection.insertOne(admin)
 .then(response =>{
res.send(response.insertedCount > 0)
   })
 })
 
 app.post('/addService', (req, res) =>{
     const file = req.files.file;
     const serviceName = req.body.name;
     const description = req.body.description;
     //const filePath = `${__dirname}/services/${file.name}`;
     
     console.log(serviceName, description, file)

     /*file.mv(filePath, err => {
         if (err) {
             res.status(500).send(err);
         }*/
         var newImg =req.files.file.data;
         const encImg = newImg.toString('base64');

         var image ={
             contentType: req.files.file.mimetype,
             size: req.files.file.size,
             img: Buffer.from(encImg, 'base64')
         };
         serviceCollection.insertOne({serviceName: serviceName, description: description, image:image})
         .then(result => {
             /*fs.remove(filePath, error => {
                 if (error) {console.log(error);}
                 res.send(result.insertedCount>0)
             })*/
             res.send(result.insertedCount>0)
         })
         //return res.send({serviceName: serviceName, description: description, path:`/${file.name}`});


     //})


 })
 

 app.get('/services', (req, res) => {
     serviceCollection.find({}).limit(20)
     .toArray((err, documents) => {
         res.send(documents);
     })
 })

 app.get('/reviews', (req, res) => {
    reviewCollection.find({}).limit(20)
    .toArray((err, documents) => {
        res.send(documents);
    })
})

        
  
 
});

app.listen(process.env.PORT || port)
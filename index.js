const express = require('express')
const cors = require('cors')
const { MongoClient } = require("mongodb");
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.4ye73.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
  try {
    await client.connect();
    const database = client.db('sdc_eyeglass_store');
    const productsCollection = database.collection('products');

    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.json(result);
  });

  app.get('/products', async(req, res)=>{
    const result = await productsCollection.find({}).toArray();
    res.send(result)
  })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}



run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
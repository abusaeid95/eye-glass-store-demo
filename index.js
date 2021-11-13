const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.4ye73.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("sdc_eyeglass_store");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("allorders");
    const usersCollection = database.collection("users");

    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.json(result);
    });

    app.get("/products", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const find = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(find);
      res.send(result);
    });

    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const find = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(find);
      res.send(result);
    });
    //   app.get('/allorders/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const find = { _id: ObjectId(id) }
    //     const result = await ordersCollection.findOne(find);
    //     res.send(result)
    // })
    app.post("/allorders", async (req, res) => {
      const body = req.body;
      const result = await ordersCollection.insertOne(body);
      res.json(result);
    });

    app.get("/allorders", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
    });

    // my orders
    app.get("/myorders", async (req, res) => {
      const email = req.query.email;
      const find = { user_email: email };
      const result = await ordersCollection.find(find).toArray();
      res.send(result);
    });

    app.put("/allorders/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const find = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: body.upadteStatus,
        },
      };
      const result = await ordersCollection.updateOne(find, updateDoc, options);
      res.json(result);
    });

    // delete my order
    app.delete("/allorders/:id", async (req, res) => {
      const id = req.params.id;
      const find = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(find);
      res.json(result);
    });

    // save create usser with email pass
    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = await usersCollection.insertOne(body);
      res.json(result);
    });

    // save  google user
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // save  admin role
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // set admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const find = { email: email };
      const user = await usersCollection.findOne(find);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

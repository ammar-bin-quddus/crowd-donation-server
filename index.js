require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("crowd donation server running");
});

// mongodb connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c6oz5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const campaignCollection = client.db("campaignDB").collection("campaigns");
    const donatedCollection = client
      .db("campaignDB")
      .collection("donated-collection");
    const usersCollection = client.db("campaignDB").collection("users");

    app.get("/addCampaign", async (req, res) => {
      const cursor = campaignCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/campaigns/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campaignCollection.findOne(query);
      res.send(result);
    });

    app.get("/updateCampaign/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campaignCollection.findOne(query);
      res.send(result);
    });

    app.get("/myCampaign/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await campaignCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/addCampaign", async (req, res) => {
      const newCampaign = req.body;
      //console.log(newCampaign);
      const result = await campaignCollection.insertOne(newCampaign);
      res.send(result);
    });

    app.post("/campaigns/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const findResult = await campaignCollection.findOne(query);
      const result = await donatedCollection.insertOne(findResult);
      res.send(result);
    });

    app.get("/myDonations/:email", async(req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await donatedCollection.find(query).toArray();
      res.send(result);
    })

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    app.put("/updatedCampaign/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCampaign = req.body;

      const updatedData = {
        $set: {
          photoUrl: updateCampaign.photoUrl,
          title: updateCampaign.title,
          description: updateCampaign.description,
          amount: updateCampaign.amount,
          deadline: updateCampaign.deadline,
          type: updateCampaign.type,
        },
      };

      const result = await campaignCollection.updateOne(filter, updatedData, options);
      res.send(result);
    });

    app.delete("/addCampaign/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await campaignCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`server running on port: ${port}`);
});

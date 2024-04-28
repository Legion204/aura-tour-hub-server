const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.tba2ihq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const touristSpotCollection = client.db("tourSpotDB").collection("touristSpots");
    // for all tourist spots
    app.get("/tourist_spots", async (req, res) => {
      const curser = touristSpotCollection.find()
      const result = await curser.toArray()
      res.send(result);
    })

    app.post("/tourist_spots", async (req, res) => {
      const touristSpot = req.body
      const result = await touristSpotCollection.insertOne(touristSpot);
      res.send(result);
    })

    // for tourist spot details
    app.get("/tourist_spots/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await touristSpotCollection.findOne(query)
      res.send(result);
    })

    // for update tourist spot data
    app.put("/tourist_spots/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedTouristSpotData = req.body
      const doc = {
        $set: {
          touristSpotName: updatedTouristSpotData.touristSpotName,
          countryName: updatedTouristSpotData.countryName,
          location: updatedTouristSpotData.location,
          averageCost: updatedTouristSpotData.averageCost,
          seasonality: updatedTouristSpotData.seasonality,
          travelTime: updatedTouristSpotData.travelTime,
          shortDescription: updatedTouristSpotData.shortDescription,
          totalVisitorPerYear: updatedTouristSpotData.totalVisitorPerYear,
          imageUrl: updatedTouristSpotData.imageUrl
        }
      }

      const result=await touristSpotCollection.updateOne(query,doc,options);
      res.send(result);

    })

    // for my list
    app.get("/my_list/:email", async (req, res) => {
      const email = req.params.email
      const query = { userEmail: email }
      const curser = touristSpotCollection.find(query)
      const result = await curser.toArray()
      res.send(result);
    })

    // delete a tourist spot
    app.delete("/tourist_spots/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await touristSpotCollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Aura tour hub server is running")
});

app.listen(port, () => {
  console.log(`Aura tour hub server is running on port: ${port}`);
})
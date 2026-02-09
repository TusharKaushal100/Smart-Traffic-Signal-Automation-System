import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});


// ⭐ DIRECT connection string (temporary for testing)
const MONGO_URI =
  "mongodb+srv://kartikkaushal666:HyS7SuWUWM8BGulu@cluster0.0741gaq.mongodb.net/traffic";

mongoose.connect(MONGO_URI)
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// mongodb+srv://kartikkaushal666:<db_password>@cluster0.0741gaq.mongodb.net/

// OLYdFf3HzHkKjjW3

// mongodb+srv://<db_username>:<db_password>@cluster0.0741gaq.mongodb.net/
//import modules
const fs = require("fs");

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const OpenAI = require("openai");

require("dotenv").config();
env;

//OpenAI's API
const openai = new OpenAI({
  apiKey: process.env.AI_API,
});

// express app
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

// routes
app.use("/api/user", userRoutes);

// connect to db
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.post("/chat", async (req, res) => {
  try {
    // Read the JSON file containing messages
    fs.readFile("./messages.json", "utf8", async (err, data) => {
      if (err) {
        throw err;
      }

      // Parse the JSON data
      const messages = JSON.parse(data);

      try {
        // Call OpenAI API with messages from JSON file and request body
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: messages.concat(req.body.messages), // Concatenate JSON file messages with request messages
          temperature: 1,
          max_tokens: 4095,
          top_p: 1,
          frequency_penalty: 0.54,
          presence_penalty: 0.49,
        });

        // Send response from OpenAI API
        res.json(response.data);
      } catch (error) {
        // Handle OpenAI API call error
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    // Handle file read error
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

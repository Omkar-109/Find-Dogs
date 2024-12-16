import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const API_URL = "https://dog.ceo/api/breeds/image/random";
const BREED_API_URL = "https://dog.ceo/api/breed/";
const URL_END = "/images/random";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// GET route for the main page
app.get("/", (request, response) => {
  response.render("index.ejs", { content: "Waiting for data...", imageUrl: null });
});

// POST route to fetch random dog image
app.post("/get-dogs", async (request, response) => {
  try {
    const result = await axios.get(API_URL);
    if (result.data && result.data.status === "success") {
      // Render the page with the fetched image
      response.render("index.ejs", {
        content: "Here is your random dog image:",
        imageUrl: result.data.message,
      });
    } else {
      response.render("index.ejs", { content: "Failed to fetch dog image.", imageUrl: null });
    }
  } catch (error) {
    console.error("Error fetching the dog image:", error);
    response.render("index.ejs", { content: "Error occurred while fetching data.", imageUrl: null });
  }
});

// POST route to fetch dog image based on breed
app.post("/get-breed", async (request, response) => {
  try {
    const userInput = request.body["enter-breed-name"]; // Extract breed name from input
    const breedUrl = `${BREED_API_URL}${userInput.toLowerCase()}${URL_END}`;
    
    const result = await axios.get(breedUrl);
    if (result.data && result.data.status === "success") {
      // Render the page with the fetched image
      response.render("index.ejs", {
        content: `Here is a random ${userInput} dog image:`,
        imageUrl: result.data.message,
      });
    } else {
      response.render("index.ejs", { content: `Failed to fetch image for breed: ${userInput}.`, imageUrl: null });
    }
  } catch (error) {
    console.error("Error fetching the breed-specific dog image:", error);
    response.render("index.ejs", { content: "Error occurred while fetching data.", imageUrl: null });
  }
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is Listening on port 3000`);
});

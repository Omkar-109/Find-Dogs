import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const API_URL = "https://dog.ceo/api/breeds/image/random";
const BREED_API_URL = "https://dog.ceo/api/breed/";
const URL_END = "/images/random";
const ALL_BREED_LIST_API = "https://dog.ceo/api/breeds/list/all"
let breedList=[]

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set("view engine", "ejs");

async function fetchBreeds() {
  try {
    const response = await fetch(ALL_BREED_LIST_API);
    const data = await response.json();
    breedList = Object.keys(data.message); 
  } catch (error) {
    console.error('Error fetching breed list', error);
  }
}

// GET route for the main page
app.get("/", async (request, response) => {
  if (breedList.length === 0) {
    await fetchBreeds();
  }

  response.render("index.ejs", { content: "", imageUrl: null, breedList: breedList  });
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
        breedList: breedList
      });
    } else {
      response.render("index.ejs", { content: "Failed to fetch dog image.", imageUrl: null, breedList:breedList });
    }
  } catch (error) {
    console.error("Error fetching the dog image:", error);
    response.render("index.ejs", { content: "Error occurred while fetching data.", imageUrl: null, breedList });
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
        breedList: breedList
      });
    } else {
      response.render("index.ejs", { content: `Failed to fetch image for breed: ${userInput}.`, imageUrl: null, breedList:breedList });
    }
  } catch (error) {
    console.error("Error fetching the breed-specific dog image:", error);
    response.render("index.ejs", { content: "Specific dog breed not found.", imageUrl: null,breedList:breedList });
  }
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is Listening on port 3000`);
});

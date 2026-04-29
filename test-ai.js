// test-ai.js
require("dotenv").config();
const { analyseResume } = require("./src/services/ai.services");

analyseResume(
  "Backend developer with Node.js, Express, MongoDB experience",
  "Looking for Node.js backend developer with MongoDB and Docker experience"
)
  .then((result) => {
    console.log("AI Response ✅");
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed ❌", err.response?.data || err.message);
    process.exit(1);
  });
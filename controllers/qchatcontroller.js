const { default: OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

async function qchatcontroller(req, res) {
  try {
    let userQuestion = req.body.aiq;
    // userQuestion =
    //   "Provide me the information about the place situated in the coordinates -72.410953,42.275103 in the for the following points: About: , known for: , Main occupational industry(s):, Cuisine: . The information should be very short points, no sentences";
    // console.log("qchatcontroller User Question:", userQuestion);
    if (!userQuestion) {
      return res.status(400).json({
        success: false,
        error: "No question provided",
      });
    }

    const openai = new OpenAI({
      baseURL: process.env.QAPIURL,
      apiKey: process.env.QAPI,
    });

    if (!process.env.QAPI || !process.env.QAPIURL) {
      throw new Error("OpenAI API configuration is missing");
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userQuestion },
      ],
      model: "deepseek-chat",
    });

    if (!completion.choices || !completion.choices[0]) {
      throw new Error("Invalid response from OpenAI API");
    }
    const response = completion.choices[0].message.content;
    console.log("AI Response:", response);
    res.status(200).json({
      success: true,
      response: response,
    });
  } catch (error) {
    console.error("Error in qchatcontroller:", error);

    // Determine the appropriate error status code
    let statusCode = 500;
    if (error.response) {
      statusCode = error.response.status || 500;
    } else if (error.message.includes("API configuration")) {
      statusCode = 503; // Service Unavailable
    }

    // Send error response
    return res.status(statusCode).json({
      success: false,
      error: error.message || "An unexpected error occurred",
    });
  }
}

async function qchatcheck(qdata) {
  try {
    let userQuestion1 = qdata.toString().trim();
    if (!userQuestion1) {
      return "";
    }
    let userQuestion = "";
    if (userQuestion1.length > 100) {
      userQuestion = `In the following data (after the first full stop) please correct grammatical errors if any, correct any spelling mistakes and remove junk or unwanted characters if any, please strictly return only the corrected data.
      "${userQuestion1}"`;
    } else {
      userQuestion = userQuestion1;
      return userQuestion;
    }

    const openai = new OpenAI({
      baseURL: process.env.QAPIURL,
      apiKey: process.env.QAPI,
    });

    if (!process.env.QAPI || !process.env.QAPIURL) {
      throw new Error("OpenAI API configuration is missing");
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userQuestion },
      ],
      model: "deepseek-chat",
    });

    if (!completion.choices || !completion.choices[0]) {
      throw new Error("Invalid response from OpenAI API");
    }
    const response = completion.choices[0].message.content;
    console.log("AI Response:", response);
    return response;
  } catch (error) {
    console.error("Error in qchatcontroller:", error);

    // Determine the appropriate error status code
    let statusCode = 500;
    if (error.response) {
      statusCode = error.response.status || 500;
    } else if (error.message.includes("API configuration")) {
      statusCode = 503; // Service Unavailable
    }

    // Send error response
    return "";
  }
}

module.exports = {
  qchatcontroller,
  qchatcheck,
};

const { default: OpenAI } = require("openai");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
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

async function geminiChatController(req, res) {
  try {
    let userQuestion = req.body.aiq;
    const modelName = req.body.model || "gemini-pro"; // Default to gemini-pro if not specified

    if (!userQuestion) {
      return res.status(400).json({
        success: false,
        error: "No question provided",
      });
    }

    // Initialize the Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    // Configure the model
    const modelConfig = {
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    const model = genAI.getGenerativeModel(modelConfig);

    // Check if streaming is requested
    const streamResponse = req.query.stream === "true";

    if (streamResponse) {
      // Set up streaming response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Generate content with streaming
      const streamingResult = await model.generateContentStream(userQuestion);

      for await (const chunk of streamingResult.stream) {
        const chunkText = chunk.text();
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } else {
      // Standard non-streaming response
      const result = await model.generateContent(userQuestion);
      const response = await result.response;
      const text = response.text();

      return res.status(200).json({
        success: true,
        data: text,
        model: modelName,
      });
    }
  } catch (error) {
    console.error("Error in Gemini API:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Something went wrong with Gemini API",
    });
  }
}

async function geminiMultimodalController(req, res) {
  try {
    const { prompt, imageUrls } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "No prompt provided",
      });
    }

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one image URL is required",
      });
    }

    // Initialize the Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    // For multimodal input, use the gemini-pro-vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Prepare the multimodal content parts
    const parts = [
      { text: prompt },
      ...imageUrls.map((url) => ({
        inlineData: {
          mimeType: "image/jpeg", // Adjust based on your image type
          data: Buffer.from(url).toString("base64"),
        },
      })),
    ];

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      data: text,
    });
  } catch (error) {
    console.error("Error in Gemini Multimodal API:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Something went wrong with Gemini Multimodal API",
    });
  }
}

module.exports = {
  qchatcontroller,
  qchatcheck,
  geminiChatController,
  geminiMultimodalController,
};

import * as functions from "firebase-functions/v2";
import OpenAI from "openai";

export const queryGPTCompletion = functions.https.onCall(
  { secrets: ["OPENAI_API_KEY"] },
  async (request: functions.https.CallableRequest) => {
    const data = request.data;
    try {
      console.log("Function started");

      // Validate input
      if (!data || !data.prompt) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "The function must be called with a 'prompt' parameter."
        );
      }

      // Initialize OpenAI with the latest library
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Call OpenAI to generate a chat completion
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Replace with the desired model
        messages: [{ role: "user", content: data.prompt }],
      });

      // Extract the response content
      const completionText = chatCompletion.choices[0]?.message?.content || "";
      console.log("Function completed successfully");
      return { text: completionText };
    } catch (error) {
      console.error("Error in queryGPTCompletion:", error);

      // Handle errors gracefully
      throw new functions.https.HttpsError(
        "internal",
        "An error occurred while processing your request."
      );
    }
  }
);
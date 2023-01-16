import * as functions from "firebase-functions";

import {Configuration, OpenAIApi} from "openai";


// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// TODO: rate limit
export const queryGPT3Completion =
functions.runWith({secrets: ["OPENAI_API_KEY"]}).https.onCall(
    async (data)=>{
      console.log("started");
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: data.prompt,
        temperature: 0.7,
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log("finished");
      return {text: response.data.choices[0].text};
    }
);

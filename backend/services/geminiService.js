import axios from "axios";

/**
 * Reusable service for calling the Google Gemini API.
 */

/**
 * Generate content using Gemini 2.5 Flash.
 * @param {string} prompt - The text prompt to send
 * @returns {string} The generated text response
 */
export const generateContent = async (prompt) => {
  const resp = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }
  );

  return resp.data.candidates[0].content.parts[0].text;
};

import axios from "axios";

/**
 * Generate image URL using Pollinations.ai
 * @param {string} prompt - The image generation prompt
 * @returns {{ imageUrl: string, seed: number }}
 */
export const generateWithPollinations = (prompt) => {
  const cleanPrompt = prompt.trim();
  const seed = Math.floor(Math.random() * 100000);
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}`;

  return { imageUrl, seed };
};

/**
 * Generate image using HuggingFace Stable Diffusion XL Turbo.
 * @param {string} prompt - The image generation prompt
 * @returns {Buffer} The image data as a buffer
 */
export const generateWithHuggingFace = async (prompt) => {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo",
    {
      inputs: prompt,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    }
  );

  return response.data;
};

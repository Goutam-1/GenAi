import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { generateContent } from "../services/geminiService.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * POST /analyze-resume
 * Upload a PDF resume, extract text, and analyze with Gemini.
 */
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const userEmail = req.userEmail || 'guest';

    // Extract text from PDF
    const { PDFParse } = pdfParse;
    const parser = new PDFParse({ data: req.file.buffer });
    const pdfData = await parser.getText();
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: "Could not extract enough text from PDF. Please upload a valid resume." });
    }

    // Create conversation
    const title = `Resume Analysis - ${new Date().toLocaleDateString()}`;
    const conversation = await Conversation.create({
      userEmail,
      title,
      featureType: 'resume'
    });

    // Save user request as message
    await Message.create({
      conversationId: conversation._id,
      role: 'user',
      content: `Resume Analysis Request: ${req.file.originalname}`
    });

    // Send to Gemini for analysis
    const prompt = `You are a professional resume analyst and ATS (Applicant Tracking System) expert.

Analyze the following resume text and provide a comprehensive evaluation.

RESUME TEXT:
"""
${resumeText}
"""

Respond ONLY with a valid JSON object (no markdown, no code fences, no extra text) with this exact structure:
{
  "atsScore": <number between 0 and 100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", ...],
  "keywords": ["<missing important keyword 1>", "<missing keyword 2>", ...],
  "formatting": ["<formatting tip 1>", "<formatting tip 2>", ...]
}

Scoring criteria:
- Keyword optimization (relevant industry terms, skills, tools)
- Clear section headers (Experience, Education, Skills, etc.)
- Quantified achievements (numbers, percentages, metrics)
- Proper formatting for ATS parsing
- Contact information completeness
- Professional summary presence
- Action verbs usage
- Overall relevance and clarity

Provide at least 3 items for each array field. Be specific and actionable in your suggestions.`;

    const aiText = await generateContent(prompt);

    // Parse JSON from AI response (handle potential markdown fences)
    let cleanJson = aiText.trim();

    // Remove markdown code blocks if present
    if (cleanJson.includes("```")) {
      const match = cleanJson.match(/```(?:json)?([\s\S]*?)```/);
      if (match) {
        cleanJson = match[1].trim();
      } else {
        cleanJson = cleanJson.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      }
    }

    let analysis;
    try {
      analysis = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Failed to parse cleanJson:", cleanJson);
      throw new SyntaxError("Failed to parse AI JSON response: " + parseErr.message);
    }

    // Validate and ensure all fields exist
    const response = {
      atsScore: Math.min(100, Math.max(0, Number(analysis.atsScore) || 0)),
      summary: analysis.summary || "Analysis complete.",
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords : [],
      formatting: Array.isArray(analysis.formatting) ? analysis.formatting : [],
    };

    // Save analysis result as assistant message
    await Message.create({
      conversationId: conversation._id,
      role: 'assistant',
      content: JSON.stringify(response)
    });

    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversation._id, {
      updatedAt: new Date()
    });

    res.json({
      ...response,
      conversationId: conversation._id
    });

  } catch (error) {
    console.error("Resume analysis error detail:", error);

    // multer is imported in the route file, so check error name instead
    if (error.name === "MulterError") {
      return res.status(400).json({ error: `File upload error: ${error.message}` });
    }

    return res.status(500).json({
      error: error.message || "Failed to analyze resume. Please try again.",
      details: error.response?.data || null
    });
  }
};

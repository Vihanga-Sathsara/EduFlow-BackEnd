"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genaratePerfectAnswers = exports.generateNotes = exports.genarateAiContent = void 0;
const axios_1 = __importDefault(require("axios"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const highlight_js_1 = __importDefault(require("highlight.js"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const jsonc_parser_1 = require("jsonc-parser");
const genarateAiContent = async (req, res) => {
    const { userInput } = req.body;
    console.log("Received user input for AI content generation:", userInput);
    try {
        const aiResponse = await axios_1.default.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Extract ONLY the subject name from the user request. Return only one or two words. Example: 'Learn Maths' → 'Maths'."
                }, {
                    role: "user",
                    content: userInput
                }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        const language = aiResponse.data?.choices[0]?.message?.content || "unknown";
        const createLearningPathResponse = await axios_1.default.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: buildLeraningPath(language)
                }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        let learningPathRaw = createLearningPathResponse.data?.choices[0]?.message?.content || "No learning path available.";
        learningPathRaw = learningPathRaw.replace(/```json|```/g, '').trim();
        let learningPath;
        try {
            learningPath = (0, jsonc_parser_1.parse)(learningPathRaw);
            console.log("Learning path parsed successfully");
        }
        catch (parseError) {
            console.warn("Failed to parse AI JSON, sending raw string instead:", parseError);
            learningPath = learningPathRaw; // fallback to raw string
        }
        res.status(200).json({ message: "Ai Detect Language", aiContent: language, learningPath });
    }
    catch (error) {
        console.error("Error generating AI content:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.genarateAiContent = genarateAiContent;
const generateNotes = async (req, res) => {
    const { subject, topics } = req.body;
    try {
        const aiResponse = await axios_1.default.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: genarateNoteContent(subject, topics)
                }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        let notesContent = aiResponse.data?.choices[0]?.message?.content || "No notes available.";
        const pdf = await generatePDF(notesContent);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${subject}.pdf"`);
        res.send(pdf);
    }
    catch (error) {
        console.error("Error generating Notes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.generateNotes = generateNotes;
const genaratePerfectAnswers = async (req, res) => {
    const { subject, questions } = req.body;
    try {
        const aiResponse = await axios_1.default.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: genarateAnswers(subject, questions)
                }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        let answersContent = aiResponse.data?.choices[0]?.message?.content || "No answers available.";
        if (typeof answersContent === "string") {
            answersContent = JSON.parse(answersContent);
            console.log("Answers content parsed from string to JSON");
        }
        else {
            answersContent = JSON.parse(answersContent);
            console.log("Answers content is already JSON");
        }
        res.status(200).json({ message: "Answers generated successfully", answersContent });
    }
    catch (error) {
        console.error("Error generating Answers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.genaratePerfectAnswers = genaratePerfectAnswers;
function buildLeraningPath(subject) {
    return `
      You are an AI Learning Path Generator.

      Generate a fully structured learning plan in **strict JSON format only** for the subject: "${subject}".

      Rules:
      1. ALL keys must be **double-quoted**.
      2. ALL string values must be **double-quoted**.
      3. Do not include any markdown, code blocks, or explanations.
      4. Do not include null values; use empty arrays [] or empty objects {} instead.
      5. Only return JSON. No extra text before or after JSON.
      6. JSON must be parseable by standard JSON.parse().

      JSON structure:
      {
        "subject": "",
        "detectedLevel": "Beginner to Advanced",
        "totalDuration": "",
        "recommendedDailyTime": "",
        "prerequisites": [],
        "milestones": [],
        "weeklyRoadmap": [
          {
            "week": 1,
            "focus": "",
            "topics": [],
            "quizQuestions": []
          }
        ],
        "projects": {
          "beginner": [],
          "intermediate": [],
          "advanced": []
        },
        "resources": {
          "youtube": [],
          "websites": [],
          "books": []
        },
        "careerRoadmap": [
          {
            "stage": "",
            "skillsToLearn": [],
            "expectedTime": ""
          }
        ],
        "finalAssessment": ""
      }

      Additional Instructions:
      - The plan must cover the full path from Beginner foundations → Intermediate skills → Advanced mastery.
      - Weekly quizzes must be simple MCQ-style.
      - Projects must increase in difficulty (Beginner → Intermediate → Advanced).
      - Resources must include free materials whenever possible.
      - Weekly roadmap length should match the total duration you specify (example: 8, 10, 12, or 16 weeks).
      - If the subject is unclear, infer the closest valid subject.
      - **Do NOT include any text outside JSON.**
      - Generate the learning path now.
    `;
}
function genarateNoteContent(subject, topics) {
    return `
      You are an expert educator, instructional designer, and professional note-taker.
      I will provide a subject and a list of topics.
      Generate **high-quality, structured, and easy-to-study notes** for each topic.

      Instructions:
      1. Organize notes by topic with headings and subheadings.
      2. Include definitions, explanations, examples, and tips.
      3. Use bullet points or numbered lists for clarity.
      4. Highlight important terms in **bold**.
      5. For technical or coding topics, include small **code examples** if relevant.
      6. Include **simple diagrams, tables, or charts** in Markdown where appropriate to help visualize concepts.
        - Use Markdown tables for data comparisons.
        - Use Mermaid diagrams for processes or flows (if applicable).
      7. Include **example images** by embedding Markdown image syntax if a concept can be illustrated visually. Use placeholder image URLs like ![Alt Text](https://example.com/image.png)
      8. Keep the notes readable for learners from beginner to advanced.
      9. Output strictly in Markdown format.

      Subject: "${subject}"
      Topics:
      ${topics.join(", ")}

      Generate the notes now.
    `;
}
function genarateAnswers(subject, questions) {
    return `
    You are a senior subject-matter expert, professional instructor, and assessment evaluator.

    I will provide:
    - A subject
    - A list of questions related to that subject

    Your task:
    Generate high-quality, accurate, and easy-to-understand answers for EACH question.

    Rules:
    1. Answers must be correct, clear, and industry-standard.
    2. Use simple language suitable for beginners, but accurate enough for advanced learners.
    3. Keep answers concise (3–6 sentences each).
    4. Include practical examples when helpful.
    5. Avoid unnecessary theory or fluff.
    6. Do NOT mention AI, models, or assumptions.
    7. Output must be clean JSON ONLY.

    JSON Output Format:
    {
      "subject": "<subject>",
      "answers": [
        {
          "question": "<question>",
          "answer": "<clear professional answer>"
        }
      ]
    }

    Subject: "${subject}"
    Questions:
    ${questions.join(", ")}

    Generate the answers now.
`;
}
const md = new markdown_it_1.default({
    html: true,
    linkify: true,
    highlight(code, lang) {
        if (lang && highlight_js_1.default.getLanguage(lang)) {
            return `<pre class="hljs"><code>${highlight_js_1.default.highlight(code, { language: lang }).value}</code></pre>`;
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
    },
});
async function generatePDF(markdown) {
    const html = `
  <html>
    <head>
      <meta charset="UTF-8" />
      <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
      <style>
        body {
          font-family: Inter, system-ui, sans-serif;
          padding: 40px;
          line-height: 1.6;
        }
        h1, h2, h3 { page-break-after: avoid; }
        pre { page-break-inside: avoid; }
        code { font-size: 14px; }
        img { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>
      ${md.render(markdown)}
    </body>
  </html>
  `;
    const browser = await puppeteer_1.default.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "20mm",
            right: "20mm",
        },
    });
    await browser.close();
    return pdf;
}

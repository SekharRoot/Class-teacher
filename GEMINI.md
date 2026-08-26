# Gemini Integration

This project is prepared for Gemini AI integration.

## API Key Management & Security

- The Gemini API key must be stored in the `GEMINI_API_KEY` environment variable.
- **SECURITY**: Never expose the Gemini API key to the client. Always execute AI calls in server-side code (e.g., `server.ts` or a dedicated server-side API handler).

## Strict Scope & Data Integrity

- **No Unsolicited AI Execution**: Do not trigger automatic AI calls or synthetic generation unless explicitly requested by the user.
- **No Synthetic Hallucinations**: AI responses and summaries must be grounded strictly in authentic Firestore data; do not populate fake records or mock statistics.

## Potential Use Cases

- **Attendance Insights**: Analyze attendance patterns and identify students who may require academic support or leave reviews.
- **Smart Administrative Summaries**: Generate concise summaries of monthly or quarterly school attendance metrics.
- **Natural Language Querying**: Assist administrators in querying student records or attendance statistics.

## SDK Usage

Use the modern `@google/genai` SDK for server-side interactions:

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
});
```


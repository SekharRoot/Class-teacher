# Gemini Integration

This project is prepared for Gemini AI integration.

## API Key Management

- The Gemini API key should be stored in the `GEMINI_API_KEY` environment variable.
- **SECURITY**: Never expose the Gemini API key to the client. Always use it in server-side code (e.g., `server.ts` or a dedicated server-side module).

## Potential Use Cases

- **Attendance Insights**: Use Gemini to analyze attendance patterns and suggest interventions for students with low attendance.
- **Smart Reports**: Generate natural language summaries of school-wide attendance metrics for administrators.
- **Profile Matching**: Automatically categorize students based on historical data or natural language descriptions.

## SDK Usage

Use the `@google/genai` SDK for interactions:

```typescript
import { GoogleGenerAI } from "@google/genai";

const genAI = new GoogleGenerAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
```

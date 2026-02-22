# WoundWise — AI Wound Assessment Companion

WoundWise is an AI-powered wound assessment tool that provides preliminary guidance for injury evaluation and recovery planning running entirely on the web. It uses the Google Gemini Vision API to analyze wound images and provide clinical summaries, severity scoring, and care recommendations.

## Features

- **AI-Powered Analysis**: Upload images of wounds or injuries for analysis by Gemini Vision.
- **Severity Scoring**: Analyzes patient health data to adjust recovery timelines and severity.
- **Offline Fallback**: Displays estimated warnings if the API fails or is unavailable.
- **Privacy-First**: Operates client-side and transmits data only for direct AI analysis.

## Tech Stack

- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI**
- **Google Gemini API**

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:8080/`.

## Running the Application

The web app is configured to use the `gemini-2.5-flash-lite` model for high-speed, cost-effective vision analysis via Google's API. 

## Deployment

To deploy this application to GitHub pages, simply run:
```bash
npm run deploy
```

> **Medical Disclaimer**: This application provides preliminary guidance and does not replace professional medical advice. Always consult a qualified healthcare provider for proper diagnosis and treatment.

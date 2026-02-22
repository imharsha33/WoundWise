export interface PatientData {
    age: number;
    hasHighBP: boolean;
    hasDiabetes: boolean;
    medications: string;
}

export interface AssessmentResult {
    woundType: string;
    severity: number;
    severityLabel: string;
    recoveryMin: number;
    recoveryMax: number;
    hospitalRecommended: boolean;
    urgency: string;
    precautions: { title: string; items: string[] }[];
    riskFactors: { label: string; impact: "low" | "moderate" | "high"; description: string }[];
    aiSummary?: string;
    usedFallback?: boolean;
}

const GEMINI_API_KEY = "";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

// Compress image to max 512x512 and quality 0.7 to keep payload small
async function compressImage(dataUrl: string): Promise<{ mimeType: string; data: string }> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const maxSize = 512;
            let { width, height } = img;
            if (width > height) {
                if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
            } else {
                if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.75);
            const [header, b64data] = compressed.split(",");
            const mimeType = header.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
            resolve({ mimeType, data: b64data });
        };
        img.onerror = () => {
            // If image loading fails, try to parse the original
            const [header, b64data] = dataUrl.split(",");
            const mimeType = header.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
            resolve({ mimeType, data: b64data });
        };
        img.src = dataUrl;
    });
}

function buildPrompt(patient: PatientData): string {
    return `You are a clinical wound assessment AI. Carefully examine the wound in the image. Based on what you see AND the patient health data below, return a JSON assessment.

Patient Data:
- Age: ${patient.age}
- High Blood Pressure: ${patient.hasHighBP ? "Yes" : "No"}
- Diabetes: ${patient.hasDiabetes ? "Yes" : "No"}
- Medications: ${patient.medications.trim() || "None"}

IMPORTANT: Base your wound classification entirely on what is VISUALLY visible in the image. Different images must produce different results. The wound in the image determines woundType, severity, and recommendations.

Return ONLY valid JSON (no markdown fences, no explanation text). Use this exact structure:
{
  "woundType": "specific wound classification based on the image",
  "severity": integer_0_to_100,
  "severityLabel": "Mild or Mild-Moderate or Moderate or Severe",
  "recoveryMin": integer_days,
  "recoveryMax": integer_days,
  "hospitalRecommended": true_or_false,
  "urgency": "low or moderate or high or critical",
  "aiSummary": "2-3 sentence clinical summary describing exactly what you see in the image and the key clinical concerns",
  "precautions": [
    {"title": "group name", "items": ["instruction 1", "instruction 2", "instruction 3"]}
  ],
  "riskFactors": [
    {"label": "factor name", "impact": "low or moderate or high", "description": "1-2 sentence explanation"}
  ]
}

Wound classification guidance (match to what you see):
- Minor Cut/Laceration: clean skin break, low bleeding
- Deep Laceration: wide/deep cut needing stitches
- Abrasion/Scrape: skin scraped off, raw surface
- Burn (Minor/Moderate/Severe): redness, blistering, or charring
- Infected Wound: pus, redness spreading, warmth, odour signs
- Bruise/Contusion: discolouration without skin break
- Diabetic Ulcer: chronic open wound, feet area
- Pressure Ulcer/Bedsore: fixed pressure point wound
- Puncture Wound: small deep hole
- Cellulitis: diffuse skin redness/swelling

Severity thresholds: 1-30=Mild, 31-50=Mild-Moderate, 51-70=Moderate, 71-100=Severe
Adjust severity upward if patient has diabetes (+15%), high BP (+10%), or age>60 (+15%).
hospitalRecommended = true if severity>60 or urgency is high/critical.
Include 2-4 precaution groups and 3-5 risk factors.`;
}

function buildFallbackResult(patientData: PatientData, reason: string): AssessmentResult {
    const ageFactor = patientData.age > 60 ? 0.25 : patientData.age > 45 ? 0.1 : 0;
    const diabetesFactor = patientData.hasDiabetes ? 0.3 : 0;
    const bpFactor = patientData.hasHighBP ? 0.15 : 0;
    const riskMultiplier = 1 + ageFactor + diabetesFactor + bpFactor;
    const baseSeverity = 40;
    const severity = Math.min(98, Math.round(baseSeverity * riskMultiplier));

    let urgency = "low";
    if (severity > 85) urgency = "critical";
    else if (severity > 65) urgency = "high";
    else if (severity > 40) urgency = "moderate";

    let severityLabel = "Mild";
    if (severity > 80) severityLabel = "Severe";
    else if (severity > 60) severityLabel = "Moderate";
    else if (severity > 40) severityLabel = "Mild-Moderate";

    const riskFactors: AssessmentResult["riskFactors"] = [];
    if (patientData.age > 60)
        riskFactors.push({ label: "Age (>60)", impact: "high", description: "Advanced age significantly slows wound healing and increases infection risk." });
    else if (patientData.age > 45)
        riskFactors.push({ label: "Age (45-60)", impact: "moderate", description: "Middle age may moderately affect healing speed." });
    else
        riskFactors.push({ label: "Age", impact: "low", description: "Younger age supports faster wound healing." });

    riskFactors.push({
        label: "Blood Pressure",
        impact: patientData.hasHighBP ? "high" : "low",
        description: patientData.hasHighBP
            ? "High blood pressure impairs circulation and delays wound healing."
            : "Normal blood pressure supports healthy circulation for healing.",
    });
    riskFactors.push({
        label: "Diabetes",
        impact: patientData.hasDiabetes ? "high" : "low",
        description: patientData.hasDiabetes
            ? "Diabetes significantly increases infection risk and slows tissue repair."
            : "No diabetes — lower risk of complications.",
    });
    if (patientData.medications.trim())
        riskFactors.push({
            label: "Medications",
            impact: "moderate",
            description: `Current medications (${patientData.medications}) may interact with wound healing.`,
        });

    return {
        woundType: "Wound (Image Analysis Unavailable)",
        severity,
        severityLabel,
        recoveryMin: Math.round(5 * riskMultiplier),
        recoveryMax: Math.round(14 * riskMultiplier),
        hospitalRecommended: severity > 60 || (patientData.hasDiabetes && severity > 40),
        urgency,
        aiSummary: `⚠️ AI image analysis could not complete (${reason}). Results below are estimated from your health profile only. For accurate wound analysis, please ensure a stable internet connection and try again.`,
        precautions: [
            {
                title: "General Wound Care",
                items: [
                    "Wash hands thoroughly before touching the wound",
                    "Clean the wound gently with clean water or saline solution",
                    "Apply a sterile dressing and change it daily",
                    "Keep the wound area elevated when possible to reduce swelling",
                ],
            },
            {
                title: "Warning Signs — Seek Care Immediately",
                items: [
                    "Increasing redness, warmth, or swelling around the wound",
                    "Pus or unusual discharge from the wound",
                    "Fever above 38°C (100.4°F)",
                    "Red streaks spreading from the wound area",
                ],
            },
        ],
        riskFactors,
        usedFallback: true,
    };
}

export async function runGeminiAssessment(
    imageBase64: string,
    patientData: PatientData
): Promise<AssessmentResult> {
    console.log("[WoundWise] Starting Gemini assessment...");

    let imagePayload: { mimeType: string; data: string };
    try {
        imagePayload = await compressImage(imageBase64);
        console.log(`[WoundWise] Image compressed. MIME: ${imagePayload.mimeType}, base64 length: ${imagePayload.data.length}`);
    } catch (err) {
        console.error("[WoundWise] Image compression failed:", err);
        return buildFallbackResult(patientData, "image processing error");
    }

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        inline_data: {
                            mime_type: imagePayload.mimeType,
                            data: imagePayload.data,
                        },
                    },
                    {
                        text: buildPrompt(patientData),
                    },
                ],
            },
        ],
        generationConfig: {
            temperature: 0.1,
            topP: 0.95,
            maxOutputTokens: 2048,
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
    };

    let response: Response;
    try {
        response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });
    } catch (networkErr) {
        console.error("[WoundWise] Network error calling Gemini API:", networkErr);
        return buildFallbackResult(patientData, "network error — check internet connection");
    }

    if (!response.ok) {
        const errText = await response.text();
        console.error(`[WoundWise] Gemini API HTTP ${response.status}:`, errText);
        return buildFallbackResult(patientData, `API error ${response.status}`);
    }

    let json: unknown;
    try {
        json = await response.json();
    } catch (jsonErr) {
        console.error("[WoundWise] Failed to parse API response as JSON:", jsonErr);
        return buildFallbackResult(patientData, "invalid API response");
    }

    console.log("[WoundWise] Gemini raw response:", JSON.stringify(json).slice(0, 500));

    // Check for safety blocks or empty candidates
    const candidates = (json as Record<string, unknown>)?.candidates as unknown[] | undefined;
    if (!candidates || candidates.length === 0) {
        const promptFeedback = (json as Record<string, unknown>)?.promptFeedback;
        console.error("[WoundWise] No candidates in response. promptFeedback:", promptFeedback);
        return buildFallbackResult(patientData, "no response from AI (possible safety filter)");
    }

    const rawText: string = (() => {
        const candidate = candidates[0] as { content?: { parts?: { text?: string }[] } } | undefined;
        return candidate?.content?.parts?.[0]?.text ?? "";
    })();

    if (!rawText) {
        console.error("[WoundWise] Empty text in Gemini response candidate.");
        return buildFallbackResult(patientData, "empty AI response");
    }

    console.log("[WoundWise] Raw text from Gemini:", rawText.slice(0, 600));

    // Strip markdown code fences if present
    const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();

    let parsed: AssessmentResult;
    try {
        parsed = JSON.parse(cleaned);
    } catch (parseErr) {
        console.error("[WoundWise] JSON parse error. Raw text was:", rawText, "Parse error:", parseErr);
        return buildFallbackResult(patientData, "AI returned non-JSON response");
    }

    console.log("[WoundWise] Parsed result:", parsed);

    // Validate and sanitize
    const result: AssessmentResult = {
        woundType: (typeof parsed.woundType === "string" && parsed.woundType) ? parsed.woundType : "Undetermined Wound",
        severity: (typeof parsed.severity === "number" && parsed.severity >= 0 && parsed.severity <= 100) ? parsed.severity : 50,
        severityLabel: (typeof parsed.severityLabel === "string") ? parsed.severityLabel : "Moderate",
        recoveryMin: (typeof parsed.recoveryMin === "number" && parsed.recoveryMin > 0) ? parsed.recoveryMin : 7,
        recoveryMax: (typeof parsed.recoveryMax === "number" && parsed.recoveryMax > 0) ? parsed.recoveryMax : 14,
        hospitalRecommended: Boolean(parsed.hospitalRecommended),
        urgency: (["low", "moderate", "high", "critical"].includes(parsed.urgency)) ? parsed.urgency : "moderate",
        aiSummary: (typeof parsed.aiSummary === "string") ? parsed.aiSummary : "",
        precautions: Array.isArray(parsed.precautions) ? parsed.precautions : [],
        riskFactors: Array.isArray(parsed.riskFactors) ? parsed.riskFactors : [],
        usedFallback: false,
    };

    console.log("[WoundWise] Final sanitised result:", result);
    return result;
}

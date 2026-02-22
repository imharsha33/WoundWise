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
}

const woundScenarios = [
    {
        woundType: "Moderate Burn",
        baseSeverity: 68,
        baseRecoveryMin: 12,
        baseRecoveryMax: 16,
        baseHospital: true,
        baseUrgency: "high" as const,
        precautions: [
            {
                title: "Immediate Care",
                items: [
                    "Cool the burn under running water for at least 20 minutes",
                    "Do not apply ice directly to the burn",
                    "Remove jewelry or tight clothing near the burn area",
                    "Cover with a sterile, non-adhesive bandage",
                ],
            },
            {
                title: "Ongoing Treatment",
                items: [
                    "Apply prescribed burn ointment as directed",
                    "Change dressings daily or as instructed",
                    "Keep the area elevated when possible",
                    "Take pain medication as recommended",
                ],
            },
            {
                title: "Warning Signs",
                items: [
                    "Increased redness, swelling, or pus",
                    "Fever above 100.4°F (38°C)",
                    "Persistent or worsening pain",
                    "Foul smell from the wound",
                ],
            },
        ],
    },
    {
        woundType: "Deep Laceration",
        baseSeverity: 74,
        baseRecoveryMin: 10,
        baseRecoveryMax: 21,
        baseHospital: true,
        baseUrgency: "high" as const,
        precautions: [
            {
                title: "Immediate Care",
                items: [
                    "Apply firm, direct pressure with a clean cloth",
                    "Do not remove embedded objects",
                    "Keep the wound elevated above heart level",
                    "Seek medical attention for stitches if deeper than 1/4 inch",
                ],
            },
            {
                title: "Wound Management",
                items: [
                    "Keep stitches or wound closure strips dry for 24-48 hours",
                    "Clean gently with mild soap after 48 hours",
                    "Apply antibiotic ointment as prescribed",
                    "Do not pick at scabs or stitches",
                ],
            },
            {
                title: "Warning Signs",
                items: [
                    "Excessive bleeding that won't stop",
                    "Numbness or tingling beyond the wound",
                    "Red streaks extending from the wound",
                    "Signs of infection (warmth, swelling, pus)",
                ],
            },
        ],
    },
    {
        woundType: "Minor Cut",
        baseSeverity: 22,
        baseRecoveryMin: 3,
        baseRecoveryMax: 7,
        baseHospital: false,
        baseUrgency: "low" as const,
        precautions: [
            {
                title: "Home Care",
                items: [
                    "Wash hands before treating the wound",
                    "Clean the cut with clean water",
                    "Apply gentle pressure to stop bleeding",
                    "Apply an adhesive bandage or sterile gauze",
                ],
            },
            {
                title: "Healing Tips",
                items: [
                    "Change the bandage daily",
                    "Keep the wound clean and dry",
                    "Apply over-the-counter antibiotic ointment",
                    "Avoid picking at the scab",
                ],
            },
        ],
    },
    {
        woundType: "Infected Wound",
        baseSeverity: 78,
        baseRecoveryMin: 14,
        baseRecoveryMax: 28,
        baseHospital: true,
        baseUrgency: "critical" as const,
        precautions: [
            {
                title: "Urgent Steps",
                items: [
                    "Seek medical attention immediately",
                    "Do not attempt to drain the infection yourself",
                    "Keep the area clean and covered",
                    "Complete the full course of prescribed antibiotics",
                ],
            },
            {
                title: "Monitoring",
                items: [
                    "Track the size of redness with a marker",
                    "Monitor body temperature regularly",
                    "Watch for spreading redness or red streaks",
                    "Note any increase in discharge or odor",
                ],
            },
            {
                title: "Prevention",
                items: [
                    "Always clean wounds promptly",
                    "Use sterile bandages and change regularly",
                    "Keep tetanus vaccination up to date",
                    "Maintain good hand hygiene",
                ],
            },
        ],
    },
    {
        woundType: "Abrasion",
        baseSeverity: 30,
        baseRecoveryMin: 5,
        baseRecoveryMax: 10,
        baseHospital: false,
        baseUrgency: "low" as const,
        precautions: [
            {
                title: "Cleaning",
                items: [
                    "Rinse thoroughly with clean water",
                    "Gently remove debris with tweezers if needed",
                    "Pat dry with a clean cloth",
                    "Apply antiseptic solution",
                ],
            },
            {
                title: "Protection",
                items: [
                    "Cover with a non-stick sterile bandage",
                    "Apply petroleum jelly to keep moist",
                    "Change dressing daily or when soiled",
                    "Avoid exposing to dirt or contaminants",
                ],
            },
        ],
    },
    {
        woundType: "Diabetic Ulcer",
        baseSeverity: 82,
        baseRecoveryMin: 30,
        baseRecoveryMax: 60,
        baseHospital: true,
        baseUrgency: "critical" as const,
        precautions: [
            {
                title: "Medical Care",
                items: [
                    "Consult a wound care specialist immediately",
                    "Offload pressure from the affected area",
                    "Maintain strict blood sugar control",
                    "Follow prescribed wound care regimen exactly",
                ],
            },
            {
                title: "Daily Management",
                items: [
                    "Inspect feet daily for changes",
                    "Keep the ulcer clean and properly dressed",
                    "Never walk barefoot",
                    "Wear properly fitted diabetic footwear",
                ],
            },
            {
                title: "Lifestyle",
                items: [
                    "Monitor blood glucose levels frequently",
                    "Maintain a balanced diet",
                    "Avoid smoking as it impairs healing",
                    "Keep follow-up appointments",
                ],
            },
        ],
    },
];

export function runMockAssessment(patientData: PatientData): AssessmentResult {
    // Pick a random wound scenario
    const scenario = woundScenarios[Math.floor(Math.random() * woundScenarios.length)];

    // Calculate risk adjustments
    const ageFactor = patientData.age > 60 ? 0.25 : patientData.age > 45 ? 0.1 : 0;
    const diabetesFactor = patientData.hasDiabetes ? 0.3 : 0;
    const bpFactor = patientData.hasHighBP ? 0.15 : 0;
    const riskMultiplier = 1 + ageFactor + diabetesFactor + bpFactor;

    // Adjust severity
    const severity = Math.min(98, Math.round(scenario.baseSeverity * riskMultiplier));

    // Adjust recovery time
    const recoveryMin = Math.round(scenario.baseRecoveryMin * riskMultiplier);
    const recoveryMax = Math.round(scenario.baseRecoveryMax * riskMultiplier);

    // Determine urgency
    let urgency: string = scenario.baseUrgency;
    if (severity > 85) urgency = "critical";
    else if (severity > 65) urgency = "high";
    else if (severity > 40) urgency = "moderate";

    // Hospital recommendation
    const hospitalRecommended =
        scenario.baseHospital || severity > 60 || (patientData.hasDiabetes && severity > 40);

    // Severity label
    let severityLabel = "Mild";
    if (severity > 80) severityLabel = "Severe";
    else if (severity > 60) severityLabel = "Moderate";
    else if (severity > 40) severityLabel = "Mild-Moderate";

    // Risk factors
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
            : "No diabetes — lower risk of healing complications.",
    });

    if (patientData.medications.trim())
        riskFactors.push({
            label: "Medications",
            impact: "moderate",
            description: `Current medications (${patientData.medications}) may interact with wound healing processes.`,
        });

    return {
        woundType: scenario.woundType,
        severity,
        severityLabel,
        recoveryMin,
        recoveryMax,
        hospitalRecommended,
        urgency,
        precautions: scenario.precautions,
        riskFactors,
    };
}

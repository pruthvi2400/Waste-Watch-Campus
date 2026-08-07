const { GoogleGenerativeAI } = require('@google/generative-ai');

const analyzeWasteImage = async (imageBuffer, mimeType = 'image/jpeg') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key') {
    console.error('Gemini API key is not configured or is a placeholder.');
    return { waste_type: 'Unknown', severity: 'Unknown' };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this image of waste. Identify:
1. Waste type (e.g., Paper, Plastic, E-waste, Food waste, Mixed waste, Hazardous)
2. Severity (Critical, High, Medium, Low)
Return ONLY as a valid JSON object: {"waste_type": "...", "severity": "..."}`;

    const imageParts = [
      {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini raw response text:', text);

    // Attempt to extract JSON
    try {
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const waste_type = parsed.waste_type || 'Unknown';
        const severity = parsed.severity || 'Unknown';
        return { waste_type, severity };
      }
    } catch (parseError) {
      console.error('Error parsing Gemini JSON response:', parseError);
    }

    // Keyword fallback scanning (mirrors python fallback)
    const lowerText = text.toLowerCase();
    let waste_type = 'Mixed waste';
    if (lowerText.includes('paper')) waste_type = 'Paper';
    else if (lowerText.includes('plastic')) waste_type = 'Plastic';
    else if (lowerText.includes('e-waste') || lowerText.includes('electronic')) waste_type = 'E-waste';
    else if (lowerText.includes('food')) waste_type = 'Food waste';
    else if (lowerText.includes('hazard')) waste_type = 'Hazardous';

    let severity = 'Unknown';
    if (lowerText.includes('critical')) severity = 'Critical';
    else if (lowerText.includes('high')) severity = 'High';
    else if (lowerText.includes('medium')) severity = 'Medium';
    else if (lowerText.includes('low')) severity = 'Low';

    return { waste_type, severity };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return { waste_type: 'Unknown', severity: 'Unknown' };
  }
};

module.exports = { analyzeWasteImage };

export async function analyzeEmailSecurity(emailData) {
    try {
        const GROQ_API_KEY = "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";
        if (!GROQ_API_KEY) {
            throw new Error("GROQ API key not found");
        }

        const prompt = `
          Analyze this email for security threats:
          
          SUBJECT: ${emailData.subject || 'Unknown'}
          FROM: ${emailData.sender || 'Unknown'} (${emailData.senderName || 'Unknown'})
          BODY: ${emailData.bodyText || 'No content'}
          
          Determine if this email is safe or potentially dangerous. Look for:
          1. Phishing attempts
          2. Suspicious links
          3. Urgent requests for personal information
          4. Grammatical errors typical of scams
          5. Mismatched sender information
          6. Suspicious attachments mentioned
          
          Provide your analysis in JSON format:
          {
            "isSafe": true/false,
            "reasoning": "brief explanation of your decision",
            "threatLevel": number from 0 (completely safe) to 10 (extremely dangerous)
          }`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    {
                        role: "system",
                        content: "You are a cybersecurity expert specializing in email security analysis."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.2,
                response_format: {type: "json_object"}
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const responseData = await response.json();
        const analysisText = responseData.choices[0]?.message?.content;
        try {
            return JSON.parse(analysisText);
        } catch (err) {
            console.error("Failed to parse Groq response", err);
            return {
                isSafe: false,
                reasoning: "Couldn't analyze email (parsing error)",
                threatLevel: 5
            };
        }
    } catch (err) {
        console.error("Error analyzing email security", err);
        return {
            isSafe: false,
            reasoning: `Couldn't analyze email: ${err.message})`,
            threatLevel: 5
        };
    }
}
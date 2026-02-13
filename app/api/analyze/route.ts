import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text, mode } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      )
    }

    const systemPrompt =
      mode === "pattern"
        ? `
You are an intelligent growth coach.

The system detected a repeated behavioral pattern.

Generate:
- A positive insight
- Gentle constructive guidance
- Encouragement
- Under 120 words
Never criticize harshly.
`
        : `
You are a growth-focused AI coach.

Analyze the user's failure reflection.

Always:
- Be positive
- Encourage resilience
- Offer constructive advice
- Keep under 150 words
`

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text },
          ],
        }),
      }
    )

    const result = await response.json()

    return NextResponse.json({
      output: result.result?.response || "No response generated.",
    })
  } catch (error) {
    return NextResponse.json(
      { error: "AI analysis failed." },
      { status: 500 }
    )
  }
}

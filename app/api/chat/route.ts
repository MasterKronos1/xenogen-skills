export const runtime = 'nodejs'

import Groq from 'groq-sdk'
import { ARBI_SKILLS_SYSTEM_PROMPT } from '../../core/arbi'

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
]

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    for (const model of GROQ_MODELS) {
      try {
        const stream = await groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: ARBI_SKILLS_SYSTEM_PROMPT },
            ...messages,
          ],
          max_tokens: 600,
          temperature: 0.7,
          stream: true,
        })

        const encoder = new TextEncoder()
        const readable = new ReadableStream({
          async start(controller) {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || ''
              if (text) controller.enqueue(encoder.encode(text))
            }
            controller.close()
          },
        })

        return new Response(readable, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      } catch {
        continue
      }
    }

    return Response.json({ error: 'ARBI unavailable' }, { status: 503 })
  } catch (err) {
    console.error('Chat error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}

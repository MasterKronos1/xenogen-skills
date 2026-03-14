export const runtime = 'nodejs'

import Groq from 'groq-sdk'
import { ARBI_SKILLS_SYSTEM_PROMPT } from '../../core/arbi'

const MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
  'mixtral-8x7b-32768',
]

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return new Response(
      'ARBI is not configured yet. Please add GROQ_API_KEY to your environment variables in Vercel.',
      { status: 503, headers: { 'Content-Type': 'text/plain' } }
    )
  }

  let messages: { role: string; content: string }[] = []

  try {
    const body = await req.json()
    messages = body.messages || []
  } catch {
    return new Response('Invalid request body.', { status: 400 })
  }

  const groq = new Groq({ apiKey })

  for (const model of MODELS) {
    try {
      const stream = await groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: ARBI_SKILLS_SYSTEM_PROMPT },
          ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        ],
        max_tokens: 600,
        temperature: 0.7,
        stream: true,
      })

      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || ''
              if (text) controller.enqueue(encoder.encode(text))
            }
          } finally {
            controller.close()
          }
        },
      })

      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      // If rate limited or model unavailable, try next
      if (msg.includes('rate') || msg.includes('model') || msg.includes('capacity')) {
        continue
      }
      // Any other error — return useful message
      return new Response(
        `ARBI encountered an issue: ${msg}. Please try again.`,
        { status: 500, headers: { 'Content-Type': 'text/plain' } }
      )
    }
  }

  return new Response(
    'ARBI is temporarily unavailable — all models are at capacity. Please try again in a moment.',
    { status: 503, headers: { 'Content-Type': 'text/plain' } }
  )
}

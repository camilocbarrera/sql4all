import { createGroq } from '@ai-sdk/groq'
import { streamText } from 'ai'
import { z } from 'zod'

const groq = createGroq()

const hintRequestSchema = z.object({
  exercise: z.object({
    title: z.string(),
    description: z.string(),
    details: z.string(),
    hint: z.string(),
    type: z.enum(['dml', 'ddl']).optional(),
  }),
  userQuery: z.string(),
  error: z.string(),
  schema: z.string().optional(),
  previousHint: z.string().optional(),
})

const SYSTEM_PROMPT = `You are a SQL tutor helping students learn SQL through practice. Your role is to guide, not solve.

Guidelines:
- Give brief hints (2-3 sentences max) that point toward the solution without revealing it
- Use Socratic questioning when appropriate ("Have you considered...?", "What happens if...?")
- Reference relevant SQL concepts or syntax
- If it's a syntax error, point to the problematic area
- If it's a logic error, ask guiding questions about the expected output
- Never provide the complete correct query
- Encourage students to check the schema for column/table names
- Be encouraging and supportive
- Respond in Spanish since the platform is in Spanish

Remember: The goal is learning, not just getting the right answer.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { exercise, userQuery, error, schema, previousHint } = hintRequestSchema.parse(body)

    const isFollowUp = !!previousHint

    const prompt = isFollowUp
      ? `
Exercise: ${exercise.title}
Description: ${exercise.description}
Details: ${exercise.details}
Exercise type: ${exercise.type || 'dml'}

User's SQL query:
\`\`\`sql
${userQuery}
\`\`\`

Error message: ${error}

${schema ? `Available schema:\n${schema}` : ''}

Previous hint given:
"${previousHint}"

The student didn't understand the previous hint and needs a clearer explanation. Provide a more detailed hint that:
- Explains the concept differently
- Gives a more specific direction without revealing the answer
- Maybe includes a small example of the concept (not the solution)
- Is still educational and encourages thinking`
      : `
Exercise: ${exercise.title}
Description: ${exercise.description}
Details: ${exercise.details}
Exercise type: ${exercise.type || 'dml'}

User's SQL query:
\`\`\`sql
${userQuery}
\`\`\`

Error message: ${error}

${schema ? `Available schema:\n${schema}` : ''}

Provide a brief, educational hint to help the student understand their mistake without giving away the answer.`

    const result = streamText({
      model: groq('openai/gpt-oss-20b'),
      system: SYSTEM_PROMPT,
      prompt,
      providerOptions: {
        groq: {
          maxTokens: isFollowUp ? 350 : 200,
          temperature: 0.7,
        },
      },
    })

    return result.toTextStreamResponse()
  } catch (err) {
    console.error('AI hint error:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to generate hint' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}


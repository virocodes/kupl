import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are an AI relationship therapist. Answer the user's questions regarding their relationship with another person, based on the user's messages with that person and the AI generated summary of their relationship`;

export async function POST(req) {
    const openai = new OpenAI(process.env.NEXT_PUBLIC_OPENAI_KEY);
    const data = await req.json();
    console.log(data)

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }, ...data],
        stream: true,
    });   

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
            try {
                // Iterate over the streamed chunks of the response
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
                    if (content) {
                        const text = encoder.encode(content) // Encode the content to Uint8Array
                        controller.enqueue(text) // Enqueue the encoded text to the stream
                    }
                }
            } catch (err) {
                controller.error(err) // Handle any errors that occur during streaming
            } finally {
                controller.close() // Close the stream when done
            }
        },
    })

    return new NextResponse(stream) // Return the stream as the response
}
/**
 * ElevenLabs Scribe v2 Realtime Integration
 *
 * This API route provides server-side support for ElevenLabs transcription.
 * However, for real-time transcription, the client-side WebSocket implementation
 * is preferred for lower latency.
 */

import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audioData, language = 'en', enableVAD = true } = body;

    // For real-time transcription, use the client-side WebSocket implementation
    // This route can be extended for batch transcription or server-side processing
    return NextResponse.json({
      message: 'Use client-side WebSocket for real-time transcription',
      endpoint: 'wss://api.elevenlabs.io/v1/speech-to-text/realtime',
    });
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}

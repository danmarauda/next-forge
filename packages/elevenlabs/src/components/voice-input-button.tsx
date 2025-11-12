'use client';

import { Loader2, Mic, MicOff } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  type UseVoiceInputOptions,
  useVoiceInput,
} from '@/lib/elevenlabs/useVoiceInput';
import { cn } from '@/lib/utils';

export interface VoiceInputButtonProps extends UseVoiceInputOptions {
  onTranscript?: (text: string) => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Voice input button component for ElevenLabs Scribe v2 Realtime
 * Provides a microphone button that enables voice-to-text input
 */
export function VoiceInputButton({
  apiKey,
  onTranscript,
  onError,
  language,
  enableVAD,
  className,
  size = 'icon',
  variant = 'outline',
}: VoiceInputButtonProps) {
  const {
    isRecording,
    isProcessing,
    transcript,
    error,
    startRecording,
    stopRecording,
  } = useVoiceInput({
    apiKey,
    onTranscript,
    onError,
    language,
    enableVAD,
  });

  // Forward transcript to parent
  useEffect(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  const handleClick = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <Button
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      aria-pressed={isRecording}
      className={cn('relative', className)}
      disabled={isProcessing || !!error}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4 text-destructive" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      {isRecording && (
        <span className="-top-1 -right-1 absolute flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" />
        </span>
      )}
    </Button>
  );
}

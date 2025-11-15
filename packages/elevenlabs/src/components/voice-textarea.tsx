'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { VoiceInputButton } from '@/components/ui/voice-input-button';
import { cn } from '@/lib/utils';

export interface VoiceTextareaProps extends React.ComponentProps<'textarea'> {
  onVoiceTranscript?: (text: string) => void;
  voiceApiKey?: string;
  voiceLanguage?: string;
  showVoiceButton?: boolean;
}

/**
 * Enhanced Textarea component with integrated ElevenLabs Scribe v2 Realtime voice input
 * Adds a microphone button that enables voice-to-text transcription
 */
export const VoiceTextarea = React.forwardRef<
  HTMLTextAreaElement,
  VoiceTextareaProps
>(
  (
    {
      className,
      onVoiceTranscript,
      voiceApiKey,
      voiceLanguage,
      showVoiceButton = true,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const handleVoiceTranscript = (text: string) => {
      if (onVoiceTranscript) {
        onVoiceTranscript(text);
      } else if (onChange) {
        // Create synthetic event to update textarea value
        const syntheticEvent = {
          target: { value: text },
          currentTarget: { value: text },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);
      }
    };

    if (!showVoiceButton || !voiceApiKey) {
      return (
        <Textarea
          className={className}
          onChange={onChange}
          ref={ref}
          value={value}
          {...props}
        />
      );
    }

    return (
      <div className="relative">
        <Textarea
          className={cn('pr-10', className)}
          onChange={onChange}
          ref={ref}
          value={value}
          {...props}
        />
        <div className="absolute right-2 bottom-2">
          <VoiceInputButton
            apiKey={voiceApiKey}
            language={voiceLanguage}
            onTranscript={handleVoiceTranscript}
            size="icon"
            variant="ghost"
          />
        </div>
      </div>
    );
  },
);

VoiceTextarea.displayName = 'VoiceTextarea';

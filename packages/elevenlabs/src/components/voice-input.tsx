'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { VoiceInputButton } from '@/components/ui/voice-input-button';
import { cn } from '@/lib/utils';

export interface VoiceInputProps extends React.ComponentProps<'input'> {
  onVoiceTranscript?: (text: string) => void;
  voiceApiKey?: string;
  voiceLanguage?: string;
  showVoiceButton?: boolean;
}

/**
 * Enhanced Input component with integrated ElevenLabs Scribe v2 Realtime voice input
 * Adds a microphone button that enables voice-to-text transcription
 */
export const VoiceInput = React.forwardRef<HTMLInputElement, VoiceInputProps>(
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
    ref
  ) => {
    const handleVoiceTranscript = (text: string) => {
      if (onVoiceTranscript) {
        onVoiceTranscript(text);
      } else if (onChange) {
        // Create synthetic event to update input value
        const syntheticEvent = {
          target: { value: text },
          currentTarget: { value: text },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    if (!showVoiceButton || !voiceApiKey) {
      return (
        <Input
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
        <Input
          className={cn('pr-10', className)}
          onChange={onChange}
          ref={ref}
          value={value}
          {...props}
        />
        <div className="-translate-y-1/2 absolute top-1/2 right-2">
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
  }
);

VoiceInput.displayName = 'VoiceInput';

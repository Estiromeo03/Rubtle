import { IconButton } from '~/components/ui/IconButton';
import { classNames } from '~/utils/classNames';
import React from 'react';

export const SpeechRecognitionButton = ({
  isListening,
  onStart,
  onStop,
  disabled,
}: {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}) => {
  return (
    <IconButton
      title={isListening ? 'Stop listening' : 'Start speech recognition'}
      disabled={disabled}
      className={classNames('transition-all border border-[#444]')}
      onClick={isListening ? onStop : onStart}
    >
      {isListening ? <div className="i-ph:microphone-slash text-gray-200 text-xl" /> : <div className="i-ph:microphone text-gray-200 text-xl" />}
    </IconButton>
  );
};

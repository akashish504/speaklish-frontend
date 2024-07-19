import { useReactMediaRecorder } from 'react-media-recorder'; // Import at the top level
import { useState } from 'react';

type ReactMediaRecorderHookProps = {
  audio: boolean;
};

type ReactMediaRecorderRenderProps = {
  startRecording: () => void;
  stopRecording: () => void;
  mediaBlobUrl: string | null; // Keep as string | null
  clearBlobUrl: () => void;
};

export const useDynamicReactMediaRecorder = (props: ReactMediaRecorderHookProps): ReactMediaRecorderRenderProps | null => {
  const { startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder(props);
  return { startRecording, stopRecording, mediaBlobUrl: mediaBlobUrl ?? null, clearBlobUrl }; // Handle undefined case
};

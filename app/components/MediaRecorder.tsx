'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/MediaRecorder.module.css';
import { useDynamicReactMediaRecorder } from '../useDynamicReactMediaRecorder';

const questions: string[] = [
  "Tell me something about the solar system?",
  "Tell me about the things you did during your summer break in childhood.",
	"Tell me about what you did on your last birthday?",
	"Tell me about your occupation?",
	"Tell me about your hobbies?"
];

const MediaRecorder: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const mediaRecorder = useDynamicReactMediaRecorder({ audio: true });

  useEffect(() => {
    const fetchData = async () => {
      if (mediaRecorder && mediaRecorder.mediaBlobUrl) {
        'use server';
        setLoading(true);
        const response = await fetch(mediaRecorder.mediaBlobUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('file', blob);

        try {
          const res = await axios.post<{ transcription: string, chatgpt_response: string }>('https://api.ashish.quest/transcribe', formData);
          setFeedback(res.data.chatgpt_response);
          setTranscript(res.data.transcription);
          setIsListening(false);
        } catch (error) {
          console.error('Transcription error:', error);
        } finally {
          setLoading(false);
          mediaRecorder.clearBlobUrl();
        }
      }
    };

    fetchData();
  }, [mediaRecorder, mediaRecorder?.mediaBlobUrl]);

  const askNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscript("");
      setFeedback("");
    } else {
      console.log('All questions asked');
    }
  };

  const handleStartSpeaking = () => {
    if (mediaRecorder) {
      setIsListening(true);
      setIsSpeaking(true);
      mediaRecorder.startRecording();
    }
  };

  const handleStopSpeaking = () => {
    if (mediaRecorder) {
      mediaRecorder.stopRecording();
      setIsSpeaking(false);
    }
  };

  return (
		<main>
			<div>
				<p className={styles.heading}>Your AI buddy that can help you improve your spoken English</p>
				<p className={styles.question}>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]}</p>
				<button className={styles.button} onClick={handleStartSpeaking} disabled={isSpeaking || isListening}>Start Speaking</button>
        {isSpeaking && <p className={styles.textBox}>System is listening...</p>}
        {isSpeaking && <button className={styles.button} onClick={handleStopSpeaking}>Stop Speaking</button>}
        {loading && <p className={styles.textBox}>Processing...</p>}
        {transcript && <p className={styles.textBox}>Transcript: {transcript}</p>}
        {feedback && <p className={styles.textBox}>Feedback: {feedback}</p>}
        <button className={styles.button} onClick={askNextQuestion} disabled={isListening}>Next Question</button>
			</div>
		</main>
  );
};

export default MediaRecorder;
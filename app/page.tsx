'use client';

import { useState, useEffect, useRef } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import axios from 'axios';
import styles from './page.module.css';
import Image from 'next/image';

const questions: string[] = [
  "Tell me something about the solar system?",
  "Tell me about the things you did during your summer break in childhood."
];

const Home: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (mediaBlobUrl) {
      const fetchData = async () => {
        const response = await fetch(mediaBlobUrl);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append('file', blob);

        try {
          const res = await axios.post<{ transcription: string, chatgpt_response: string }>('https://api.ashish.quest/transcribe', formData);
          console.log('Transcript:', res.data.transcription);
          console.log('Feedback:', res.data.chatgpt_response);
          setFeedback(res.data.chatgpt_response);
          setTranscript(res.data.transcription);
          setIsListening(false);
        } catch (error) {
          console.error('Transcription error:', error);
        }
      };

      fetchData();
      clearBlobUrl();
    }
  }, [mediaBlobUrl]);

  const askNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscript(""); // Clear previous transcript
      setFeedback(""); // Clear previous feedback
    } else {
      console.log('All questions asked');
    }
  };

  const handleStartSpeaking = () => {
    setIsListening(true);
    setIsSpeaking(true);
    startRecording();
  };

  const handleStopSpeaking = () => {
    stopRecording();
    setIsSpeaking(false);
  };

  return (
    <div className={styles.container}>
      <main>
        <h1 className={styles.heading}>Your AI buddy that can help you improve your spoken English</h1>
        <h2 className={styles.question}>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]}</h2>
        <button className={styles.button} onClick={handleStartSpeaking} disabled={isSpeaking || isListening}>Start Speaking</button>
        {isSpeaking && <p className={styles.textBox}>System is listening...</p>}
        {isSpeaking && <button className={styles.button} onClick={handleStopSpeaking}>Stop Speaking</button>}
        {transcript && <p className={styles.textBox}>Transcript: {transcript}</p>}
        {feedback && <p className={styles.textBox}>Feedback: {feedback}</p>}
        <button className={styles.button} onClick={askNextQuestion} disabled={isListening}>Next Question</button>
      </main>
    </div>
  );
};

export default Home;

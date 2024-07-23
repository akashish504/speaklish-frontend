'use client';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import Header from './components/Header';
// import MediaRecorder from './components/MediaRecorder';

const MediaRecorder = dynamic(() => import('./components/MediaRecorder'), {
  ssr: false,
});

const Page: React.FC = () => {

  return (
    <div className={styles.container}>
      <Header/>
      <MediaRecorder />
    </div>
  );
};

export default Page;
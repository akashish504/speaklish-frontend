'use client';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const MediaRecorder = dynamic(() => import('./mediaRecorder'), {
  ssr: false,
});

const Page: React.FC = () => {

  return (
    <div className={styles.container}>
      <main>
        <MediaRecorder />
      </main>
    </div>
  );
};

export default Page;
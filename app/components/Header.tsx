import styles from '../styles/Header.module.css';
import Image from 'next/image';

const Header = () => {
  return (
    <header className={styles.Header}>
      <div className={styles.logo}>
        <Image src="/speaklish-logo.png" alt="JotMe Logo" width={70} height={70} />
      </div>
      <div className={styles.head_text}>Speaklish</div>
    </header>
  );
};

export default Header;

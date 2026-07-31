import { useSceneStore, type SceneObjectKey } from '../../stores';
import styles from './NavDots.module.css';

const DOTS: { key: SceneObjectKey; label: string }[] = [
  { key: 'laptop', label: 'Projects' },
  { key: 'bookshelf', label: 'Skills' },
  { key: 'frame', label: 'About Me' },
  { key: 'character', label: 'Contact' }
];

export function NavDots() {
  const { focus, setFocus, loading } = useSceneStore();

  const navigate = (key: SceneObjectKey) => {
    if (!loading.done) return;
    setFocus(key);
  };

  if (!loading.done) return null;

  return (
    <nav className={styles.navDots} aria-label="Quick navigation">
      {DOTS.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.navDot} ${focus.key === key ? styles.active : ''}`}
          onClick={() => navigate(key)}
          aria-label={label}
          title={label}
        >
          <span className={styles.navDotLabel}>{label}</span>
        </button>
      ))}
    </nav>
  );
}

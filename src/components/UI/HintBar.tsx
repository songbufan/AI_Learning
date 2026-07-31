import { useState, useEffect } from 'react';
import { useSceneStore } from '../../stores';
import styles from './HintBar.module.css';

export function HintBar() {
  const { loading, focus } = useSceneStore();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (focus.key) setDismissed(true);
  }, [focus.key]);

  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
  const hintText = isTouchDevice
    ? 'Tap an object · Drag to orbit · Pinch to zoom'
    : 'Click an object to explore · Drag to orbit · Scroll to zoom';

  if (!loading.done || dismissed) return null;

  return (
    <p className={styles.hint} aria-hidden="true">{hintText}</p>
  );
}

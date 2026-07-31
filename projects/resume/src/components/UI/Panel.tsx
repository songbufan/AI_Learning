import { useEffect, useCallback } from 'react';
import { useUIStore, useSceneStore } from '../../stores';
import styles from './Panel.module.css';

export function Panel() {
  const { panel, closePanel } = useUIStore();
  const { setFocus } = useSceneStore();

  const handleClose = useCallback(() => {
    setFocus(null);
    closePanel();
  }, [setFocus, closePanel]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleClose]);

  return (
    <>
      <div
        className={`${styles.panel} ${panel.open ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={panel.content?.title ?? 'Detail panel'}
        aria-hidden={!panel.open}
      >
        <button className={styles.panelClose} onClick={handleClose} aria-label="Close panel">
          ✕
        </button>

        {panel.content && (
          <>
            <h2 className={styles.panelTitle}>{panel.content.title}</h2>
            <div
              className={styles.panelBody}
              dangerouslySetInnerHTML={{ __html: panel.content.html }}
            />
          </>
        )}
      </div>

      {panel.open && (
        <button
          className={styles.panelBackdrop}
          onClick={handleClose}
          aria-label="Close panel"
          tabIndex={-1}
        />
      )}
    </>
  );
}

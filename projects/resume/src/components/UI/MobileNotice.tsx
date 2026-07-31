import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores';
import styles from './MobileNotice.module.css';

export function MobileNotice() {
  const { mobile, dismissMobileNotice } = useUIStore();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShouldShow(window.innerWidth < 768 && !mobile.dismissed);
    }
  }, [mobile.dismissed]);

  if (!shouldShow || mobile.dismissed) return null;

  return (
    <div className={styles.mobileNotice} role="alertdialog" aria-modal="true" aria-label="Screen size notice">
      <h2>Best on desktop</h2>
      <p>This 3D experience is optimised for a larger screen.<br />You can still continue on mobile.</p>
      <button className={styles.continueBtn} onClick={dismissMobileNotice}>Continue anyway</button>
    </div>
  );
}

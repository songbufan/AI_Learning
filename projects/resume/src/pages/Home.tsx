import { useEffect, useState } from 'react';
import {
  Scene,
  Panel,
  NavDots,
  LoadingScreen,
  HelpModal,
  HintBar,
  MobileNotice,
  FallbackContent
} from '../components';

export function Home() {
  const [sceneLoaded, setSceneLoaded] = useState(false);

  useEffect(() => {
    setSceneLoaded(true);
  }, []);

  return (
    <>
      <MobileNotice />
      <LoadingScreen />
      {sceneLoaded && <Scene />}
      <FallbackContent />
      <NavDots />
      <Panel />
      <HintBar />
      <HelpModal />
    </>
  );
}

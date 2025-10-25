
"use client";

import YouTube from 'react-youtube';
import styles from './video-tab.module.css';

export function VideoTab({ videoId, onVideoEnd }) {
  if (!videoId) {
    return <div className={styles.noVideo}>Відео для цієї екосистеми не знайдено.</div>;
  }

  const onPlayerReady = (event) => {
    // console.log("Player is ready");
  };

  return (
    <div className={styles.videoContainer}>
        <YouTube 
            videoId={videoId} 
            onReady={onPlayerReady} 
            onEnd={onVideoEnd} 
            className={styles.youtubePlayer}
        />
    </div>
  );
}

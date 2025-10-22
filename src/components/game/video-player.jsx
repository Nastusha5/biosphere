
"use client";

import YouTube from 'react-youtube';
import styles from './video-player.module.css';

export function VideoPlayerModal({ isOpen, onVideoEnd, videoId }) {

  const onPlayerStateChange = (event) => {
    if (event.data === 0) {
      onVideoEnd();
    }
  };
  
  const opts = {
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3,
    },
  };

  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
        <YouTube 
          videoId={videoId}
          opts={opts}
          onStateChange={onPlayerStateChange}
          className={styles.youtubeContainer}
          iframeClassName={styles.youtubeIframe}
        />
      </div>
    </div>
  );
}
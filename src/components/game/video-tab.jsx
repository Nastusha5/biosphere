
import { useRef } from 'react';
import YouTube from 'react-youtube';
import styles from './video-tab.module.css';

export function VideoTab({ videoId, onVideoEnd }) {
    const playerRef = useRef(null);

    const videoOptions = {
        playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            fs: 1, 
        },
    };

    const onReady = (event) => {
        playerRef.current = event.target;
    };

    return (
        <div className={styles.videoContainer}>
            {videoId ? (
                <div className={styles.videoWrapper}>
                    <YouTube
                        videoId={videoId}
                        opts={videoOptions}
                        onReady={onReady}
                        onEnd={onVideoEnd}
                        className={styles.youtubePlayer}
                    />
                </div>
            ) : (
                <div className={styles.noVideo}>
                    <p>Відео для цього уроку ще не додано.</p>
                </div>
            )}
        </div>
    );
}

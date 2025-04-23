'use client';

import { useRef, useState } from 'react';

interface VideoPlayerProps {
	onPlayingChange: (isPlaying: boolean) => void;
	onTimeUpdate: (time: number) => void;
}

const VideoPlayer = ({ onPlayingChange, onTimeUpdate }: VideoPlayerProps) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const handlePlayClick = () => {
		if (videoRef.current) {
			if (!isPlaying) {
				videoRef.current.play();
			} else {
				videoRef.current.pause();
			}
			const newPlayingState = !isPlaying;
			setIsPlaying(newPlayingState);
			onPlayingChange(newPlayingState);
		}
	};

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			onTimeUpdate(videoRef.current.currentTime);
		}
	};

	return (
		<div className='w-full aspect-video mb-4 relative'>
			<video
				ref={videoRef}
				className='w-full h-full object-cover rounded-lg'
				src='/sample_video.mp4'
				controls={isPlaying}
				muted
				loop
				onTimeUpdate={handleTimeUpdate}
			/>
			{!isPlaying && (
				<button
					onClick={handlePlayClick}
					className='absolute inset-0 w-full h-full flex items-center justify-center bg-black/50 rounded-lg hover:bg-black/40 transition-colors'
				>
					<div className='w-20 h-20 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm'>
						<svg className='w-10 h-10 text-white' fill='currentColor' viewBox='0 0 24 24'>
							<path d='M8 5v14l11-7z' />
						</svg>
					</div>
				</button>
			)}
		</div>
	);
};

export default VideoPlayer;

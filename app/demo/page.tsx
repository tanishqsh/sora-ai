'use client';

import QuizSection from './components/QuizSection';
import ChatSection from './components/ChatSection';
import AnimatedBackground from './components/AnimatedBackground';
import LivePlayCommentary from './components/LivePlayCommentary';
import VideoPlayer from './components/VideoPlayer';
import { useState } from 'react';

export default function Demo() {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);

	return (
		<div className='flex md:flex-row flex-col items-center justify-center md:h-screen w-screen relative overflow-hidden'>
			<AnimatedBackground />
			<div className='w-full h-full p-4 relative z-10'>
				<VideoPlayer onPlayingChange={setIsPlaying} onTimeUpdate={setCurrentTime} />
				<LivePlayCommentary isPlaying={isPlaying} currentTime={currentTime} />
			</div>
			<div className='w-full h-full bg-white/2 flex flex-col'>
				<QuizSection isPlaying={isPlaying} currentTime={currentTime} />
				<ChatSection isPlaying={isPlaying} currentTime={currentTime} />
			</div>
		</div>
	);
}

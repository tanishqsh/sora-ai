'use client';

import QuizSection from './components/QuizSection';
import ChatSection from './components/ChatSection';
import AnimatedBackground from './components/AnimatedBackground';
import Commentary from './components/Commentary';

export default function Demo() {
	return (
		<div className='flex md:flex-row flex-col items-center justify-center md:h-screen w-screen relative overflow-hidden'>
			<AnimatedBackground />
			<div className='w-full h-full p-4 relative z-10'>
				<Commentary />
			</div>
			<div className='w-full h-full bg-white/2 flex flex-col'>
				<QuizSection />
				<ChatSection />
			</div>
		</div>
	);
}

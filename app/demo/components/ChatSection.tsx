'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const chatMessages = [
	{
		start: 0.0,
		end: 7.62,
		user: 'Ahmed',
		message: "Bento's distribution has been excellent today! 🧤",
	},
	{
		start: 8.12,
		end: 9.62,
		user: 'Hassan',
		message: 'Sadio Mané is making those brilliant runs down the left! ⚡',
	},
	{
		start: 21.18,
		end: 22.8,
		user: 'Omar',
		message: "Al-Nassr's attacking play is looking dangerous",
	},
	{
		start: 23.9,
		end: 26.94,
		user: 'Kamal',
		message: 'Boushal is absolutely dominating that left flank 🔥',
	},
	{
		start: 27.08,
		end: 29.94,
		user: 'Tani',
		message: 'The crowd is going wild after that move by Mané!',
	},
	{
		start: 30.0,
		end: 32.06,
		user: 'Ahmed',
		message: 'We need more support in the box for these crosses',
	},
	{
		start: 32.34,
		end: 36.58,
		user: 'Hassan',
		message: 'Al-Nassr building up the pressure now ⚽',
	},
	{
		start: 37.06,
		end: 39.2,
		user: 'Omar',
		message: 'What a defensive clearance! Just when we needed it',
	},
];

const messageVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
		},
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: {
			duration: 0.3,
		},
	},
};

interface ChatSectionProps {
	isPlaying: boolean;
	currentTime: number;
}

export default function ChatSection({ isPlaying, currentTime }: ChatSectionProps) {
	const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

	useEffect(() => {
		if (!isPlaying) {
			setVisibleMessages([]);
			return;
		}

		// Find all messages that should be visible at the current time
		const newVisibleMessages = chatMessages.map((_, index) => index).filter((index) => chatMessages[index].start <= currentTime);

		// Only update if there are new messages to show
		if (newVisibleMessages.length !== visibleMessages.length) {
			setVisibleMessages(newVisibleMessages);
		}
	}, [currentTime, isPlaying]);

	if (!isPlaying) {
		return null;
	}

	return (
		<div className='h-1/2 p-6'>
			<div className='bg-white/2 border border-white/10 rounded-2xl p-6 h-full flex flex-col'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center space-x-2'>
						<span className='h-2 w-2 bg-green-500 rounded-full animate-pulse'></span>
						<span className='text-xs text-white/60'>Live</span>
					</div>
				</div>
				<div className='flex-1 overflow-y-auto mb-4 relative'>
					<div className='absolute inset-0 overflow-y-auto'>
						<div className='flex flex-col-reverse min-h-full'>
							<AnimatePresence mode='popLayout'>
								{chatMessages
									.filter((_, index) => visibleMessages.includes(index))
									.reverse()
									.map((msg) => (
										<motion.div
											key={msg.start}
											variants={messageVariants}
											initial='hidden'
											animate='visible'
											exit='exit'
											className='flex flex-col mb-4'
										>
											<div className='flex items-center space-x-2 mb-1 px-2'>
												<span className='font-medium text-sm text-orange-500'>{msg.user}</span>
												<span className='text-xs text-white/40'>•</span>
												<span className='text-xs text-white/40'>{msg.start.toFixed(1)}s</span>
											</div>
											<div className='bg-white/5 hover:bg-white/10 transition-colors rounded-md px-2 py-2 max-w-[95%] self-start'>
												<p className='text-sm text-white/90 leading-relaxed'>{msg.message}</p>
											</div>
											<div className='flex items-center space-x-3 mt-1 px-2'>
												<button className='text-xs text-white/40 hover:text-white/60 transition-colors'>Reply</button>
												<button className='text-xs text-white/40 hover:text-white/60 transition-colors'>Share</button>
												<button className='text-xs text-white/40 hover:text-white/60 transition-colors'>Report</button>
											</div>
										</motion.div>
									))}
							</AnimatePresence>
						</div>
					</div>
				</div>
				<div className='flex space-x-2 bg-white/5 rounded-full p-1'>
					<input type='text' placeholder='Type your message...' className='flex-1 bg-transparent rounded-full px-4 py-2 text-sm focus:outline-none' />
					<button className='px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full font-medium transition-all transform hover:scale-105'>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z'
								clipRule='evenodd'
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}

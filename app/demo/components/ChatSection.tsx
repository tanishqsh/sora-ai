'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOT_MESSAGES = [
	"Great goal! The striker's positioning was perfect.",
	'Did you see that save? Absolutely incredible!',
	'The midfield is really controlling the game now.',
	'VAR check in progress...',
	'That was a clear foul, should have been a yellow card.',
	'The crowd is going wild after that play!',
	"Substitution coming up - looks like they're bringing on fresh legs.",
	'Tactical change from the manager, switching to a 4-3-3 formation.',
	'Corner kick coming up - this could be dangerous!',
	'Half-time stats: 65% possession, 8 shots on target.',
];

const BOT_USERS = ['Ahed', 'Kamal', 'Tanishq'];

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

export default function ChatSection() {
	const [chatMessages, setChatMessages] = useState([
		{
			id: 1,
			user: 'Ahed',
			message: 'What a goal by Al-Buraikan! 🔥',
			timestamp: '2m ago',
		},
		{
			id: 2,
			user: 'Tanishq',
			message: 'Iran needs to step up their defense',
			timestamp: '1m ago',
		},
		{
			id: 3,
			user: 'Kamal',
			message: 'The atmosphere in the stadium is electric!',
			timestamp: 'Just now',
		},
	]);

	useEffect(() => {
		const addBotMessage = () => {
			const randomMessage = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];
			const randomUser = BOT_USERS[Math.floor(Math.random() * BOT_USERS.length)];
			const timestamp = 'Just now';

			setChatMessages((prev) => {
				const newMessages = [
					...prev,
					{
						id: Date.now(),
						user: randomUser,
						message: randomMessage,
						timestamp,
					},
				];
				// Keep only the last 20 messages
				return newMessages.slice(-20);
			});
		};

		// Add initial bot messages
		const initialMessages: NodeJS.Timeout[] = Array.from({ length: 3 }, (_, i) => {
			return setTimeout(addBotMessage, (i + 1) * 2000);
		});

		// Add random interval messages
		const interval = setInterval(() => {
			const randomDelay = Math.floor(Math.random() * 5000) + 3000; // 3-8 seconds
			setTimeout(addBotMessage, randomDelay);
		}, 10000); // Check every 10 seconds

		return () => {
			initialMessages.forEach(clearTimeout);
			clearInterval(interval);
		};
	}, []);

	return (
		<div className='h-1/2 p-6'>
			<div className='bg-white/2 border border-white/10 rounded-2xl p-6 h-full flex flex-col'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center space-x-2'>
						<span className='h-2 w-2 bg-green-500 rounded-full animate-pulse'></span>
						<span className='text-xs text-white/60'>Live</span>
					</div>
				</div>
				<div className='flex-1 overflow-y-auto mb-4'>
					<div className='flex flex-col-reverse min-h-full'>
						<AnimatePresence mode='popLayout'>
							{chatMessages.map((msg) => (
								<motion.div
									key={msg.id}
									variants={messageVariants}
									initial='hidden'
									animate='visible'
									exit='exit'
									className='flex flex-col mb-4'
								>
									<div className='flex items-center space-x-2 mb-1 px-2'>
										<span className='font-medium text-sm text-orange-500'>{msg.user}</span>
										<span className='text-xs text-white/40'>•</span>
										<span className='text-xs text-white/40'>{msg.timestamp}</span>
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

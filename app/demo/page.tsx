'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import QuizSection from './components/QuizSection';
import ChatSection from './components/ChatSection';
import AnimatedBackground from './components/AnimatedBackground';

// Animation configuration
const DELAY_BETWEEN_ITEMS = 5; // seconds between each item

const commentaryItems = [
	{
		time: "1'",
		text: "The whistle blows, and we're underway in what's always a high-stakes encounter — Saudi Arabia versus Iran. The atmosphere is electric, with both sets of fans in full voice.",
	},
	{
		time: "4'",
		text: 'Early pressure from Iran. Taremi tests the Saudi keeper with a low drive from just outside the box — but Al Owais gets down well to save.',
	},
	{
		time: "7'",
		text: "Saudi respond with a counter — Salem Al-Dawsari darts down the left, cuts in, and curls one… inches wide! That's the first real threat from the Green Falcons.",
	},
	{
		time: "12'",
		text: "Tension rising. Hard tackles flying in. This is more than just a match — it's about pride, politics, and dominance in West Asian football.",
	},
	{
		time: "18'",
		text: "GOOOAAAL! 🇸🇦 Saudi Arabia 1-0 Iran It's Firas Al-Buraikan! Quick one-two play at the edge of the box, and Al-Buraikan slams it low into the corner. The stadium erupts!",
	},
	{
		time: "25'",
		text: "Iran look rattled. Saudi are pressing high, playing aggressively, feeding off the home crowd's energy.",
	},
	{
		time: "30'",
		text: "Yellow card for Iran's Ehsan Hajsafi after a late challenge on Kanno. The midfield battle is getting fiery.",
	},
	{
		time: "35'",
		text: "Big chance for Iran! Azmoun gets a free header from a corner — but it's straight at the keeper. He'll be disappointed with that one.",
	},
];

const itemVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
		},
	},
	exit: {
		opacity: 0,
		y: 20,
		transition: {
			duration: 0.3,
		},
	},
};

export default function Demo() {
	const [visibleItems, setVisibleItems] = useState(1);

	useEffect(() => {
		const interval = setInterval(() => {
			setVisibleItems((prev) => {
				if (prev >= commentaryItems.length) return prev;
				return prev + 1;
			});
		}, DELAY_BETWEEN_ITEMS * 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className='flex items-center justify-center h-screen w-screen relative overflow-hidden'>
			<AnimatedBackground />
			<div className='w-full h-full p-4 relative z-10'>
				<div className='bg-white/2 border border-white/10 rounded-2xl w-full h-full p-4'>
					<div className='flex items-center justify-between'>
						<div className='inline-flex px-3 space-x-2 items-center justify-center py-1 rounded-full bg-white/10'>
							<span className='h-2 w-2 bg-green-800 rounded-full animate-pulse'></span>
							<p className='font-mono text-xs'> Translating live</p>
						</div>
						<div className='relative w-6 h-6'>
							<svg className='w-6 h-6' viewBox='0 0 36 36'>
								<circle className='stroke-white/30' strokeWidth='2' fill='none' cx='18' cy='18' r='16' />
								<circle
									className='stroke-green-500 circle-progress'
									strokeWidth='2'
									strokeDasharray='100.53'
									strokeDashoffset='100.53'
									strokeLinecap='round'
									fill='none'
									cx='18'
									cy='18'
									r='16'
								/>
							</svg>
						</div>
					</div>
					<div className='h-[calc(100%-2rem)] overflow-hidden relative'>
						<div className='h-full mt-8 overflow-y-auto'>
							<AnimatePresence mode='popLayout'>
								{commentaryItems
									.slice(0, visibleItems)
									.reverse()
									.map((item) => (
										<motion.p
											key={item.time}
											layout
											variants={itemVariants}
											initial='hidden'
											animate='visible'
											exit='exit'
											className='text-sm leading-relaxed mb-1 px-4 bg-white/5 py-2 rounded-md flex items-start gap-2'
										>
											<span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80'>
												{item.time}
											</span>
											<span>{item.text}</span>
										</motion.p>
									))}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
			<div className='w-full h-full bg-white/2 flex flex-col'>
				<QuizSection />
				<ChatSection />
			</div>
		</div>
	);
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

/*
 * Commentary Generation Process:
 * 1. Video Processing:
 *    - Frames extracted every 0.2 seconds from match footage (45-63 min)
 *    - Ball tracking coordinates captured in JSON format
 *
 * 2. Audio Processing:
 *    - Arabic commentary extracted using Whisper ASR
 *    - Timestamps preserved for synchronization
 *
 * 3. Translation & Refinement:
 *    - Arabic commentary translated to English
 *    - Commentary segments aligned with video timestamps
 *    - Text refined for natural flow while preserving key events
 *    - Timestamps adjusted to match video segments
 *
 * The resulting commentaryItems array contains synchronized
 * text segments that match the ball movement and game action,
 * creating an authentic match commentary experience.
 */

interface LivePlayCommentaryProps {
	isPlaying: boolean;
	currentTime: number;
}

const commentaryItems = [
	{
		start: 0.0,
		end: 7.62,
		text: 'While legends dominate the field, the electrifying crowd atmosphere steals the show.',
	},
	{
		start: 8.12,
		end: 9.62,
		text: 'The ball returns again to Bento.',
	},
	{
		start: 21.18,
		end: 22.8,
		text: 'Bento to Boushal.',
	},
	{
		start: 23.9,
		end: 26.94,
		text: 'A header finds Sadio Mane.',
	},
	{
		start: 27.08,
		end: 29.94,
		text: "He keeps possession. Down the left, danger looms—it's Boushal.",
	},
	{
		start: 30.0,
		end: 32.06,
		text: 'A dangerous run from Al-Nassr.',
	},
	{
		start: 32.34,
		end: 36.58,
		text: 'Boushal pushes forward, waiting for support, and the ball is in a threatening position.',
	},
	{
		start: 37.06,
		end: 39.2,
		text: "But there's no one there to finish that move.",
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

export default function LivePlayCommentary({ isPlaying, currentTime }: LivePlayCommentaryProps) {
	const [visibleItems, setVisibleItems] = useState<number[]>([]);

	useEffect(() => {
		if (!isPlaying) {
			setVisibleItems([]);
			return;
		}

		// Find all items that should be visible at the current time
		const newVisibleItems = commentaryItems.map((_, index) => index).filter((index) => commentaryItems[index].start <= currentTime);

		// Only update if there are new items to show
		if (newVisibleItems.length !== visibleItems.length) {
			setVisibleItems(newVisibleItems);
		}
	}, [currentTime, isPlaying]);

	if (!isPlaying) {
		return null;
	}

	return (
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
							.filter((_, index) => visibleItems.includes(index))
							.reverse()
							.map((item) => (
								<motion.p
									key={item.start}
									layout
									variants={itemVariants}
									initial='hidden'
									animate='visible'
									exit='exit'
									className='text-sm leading-relaxed mb-1 px-4 bg-white/5 py-2 rounded-md flex items-start gap-2'
								>
									<span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80'>
										{item.start.toFixed(1)}s
									</span>
									<span>{item.text}</span>
								</motion.p>
							))}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}

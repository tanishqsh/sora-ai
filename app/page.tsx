'use client';

import InteractiveASCII from '@/components/InteractiveASCII';
import ASCII_ART from '@/components/InteractiveASCII/constants';
import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
	// Audio-related state
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isMuted, setIsMuted] = useState(true);
	const [hasInteracted, setHasInteracted] = useState(false);

	// Play static sound when component mounts
	useEffect(() => {
		// Create audio element if it doesn't exist
		if (!audioRef.current) {
			audioRef.current = new Audio('/static.mp3');
			audioRef.current.volume = 0.3; // Set volume to 30%
			audioRef.current.loop = true; // Loop the audio
		}

		// Play the audio if user has interacted
		const playAudio = async () => {
			try {
				if (audioRef.current && hasInteracted) {
					await audioRef.current.play();
				}
			} catch (error) {
				console.error('Audio playback failed:', error);
			}
		};

		// Try to play audio if user has interacted
		playAudio();

		// Cleanup function to pause audio when component unmounts
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}
		};
	}, [hasInteracted]);

	// Handle mute/unmute
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.muted = isMuted;
		}
	}, [isMuted]);

	// Toggle mute/unmute
	const toggleMute = async () => {
		// Mark as interacted when user clicks the mute button
		if (!hasInteracted) {
			setHasInteracted(true);
		}

		setIsMuted(!isMuted);

		// If we're unmuting, try to play (in case it was blocked initially)
		if (isMuted && audioRef.current) {
			try {
				await audioRef.current.play();
			} catch (error) {
				console.error('Audio playback failed:', error);
			}
		}
	};

	// Handle user interaction
	const handleInteraction = async () => {
		if (!hasInteracted) {
			setHasInteracted(true);

			// Try to play audio after user interaction
			if (audioRef.current && !isMuted) {
				try {
					await audioRef.current.play();
				} catch (error) {
					console.error('Audio playback failed:', error);
				}
			}
		}
	};

	return (
		<div className='h-screen relative' onClick={handleInteraction}>
			<div className='p-8 bg-black/10 h-screen w-full flex items-center justify-center z-10 relative'>
				{/* Audio control button */}
				<motion.button
					className='absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white/80 hover:bg-black/70 transition-colors'
					onClick={toggleMute}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
					title={isMuted ? 'Unmute' : 'Mute'}
				>
					{isMuted ? (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M11 5L6 9H2v6h4l5 4V5z'></path>
							<line x1='23' y1='9' x2='17' y2='15'></line>
							<line x1='17' y1='9' x2='23' y2='15'></line>
						</svg>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5'></polygon>
							<path d='M15.54 8.46a5 5 0 0 1 0 7.07'></path>
							<path d='M19.07 4.93a10 10 0 0 1 0 14.14'></path>
						</svg>
					)}
				</motion.button>

				{/* Main container with thinner border and subtle shadow */}
				<motion.div
					className='p-8 bg-black/90 rounded-md relative overflow-hidden shadow-lg max-w-lg w-full'
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						duration: 0.8,
						ease: [0.19, 1, 0.22, 1], // Cubic bezier for smooth entry
						delay: 0.2,
					}}
				>
					{/* CRT scan lines effect */}
					<div className='absolute inset-0 pointer-events-none z-[1] overflow-hidden'>
						{/* Horizontal scan lines */}
						<div
							className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]'
							style={{ opacity: 0.2 }}
						></div>

						{/* Vertical color bleeding effect */}
						<div
							className='absolute inset-0 bg-[linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]'
							style={{ mixBlendMode: 'color' }}
						></div>

						{/* CRT vignette effect */}
						<div
							className='absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.4)_100%)]'
							style={{ mixBlendMode: 'multiply' }}
						></div>
					</div>

					{/* Subtle background glow */}
					<div className='absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-[pulse_8s_ease-in-out_infinite]'></div>

					{/* Animated scanner line */}
					<motion.div
						className='absolute left-0 right-0 h-[2px] bg-green-500/30'
						initial={{ top: 0, opacity: 0 }}
						animate={{
							top: ['0%', '100%', '0%'],
							opacity: [0.1, 0.5, 0.1],
						}}
						transition={{
							duration: 15,
							ease: 'linear',
							repeat: Infinity,
							repeatType: 'loop',
						}}
					/>

					{/* Content wrapper with z-index to appear above CRT effects */}
					<div className='relative z-[2]'>
						{/* Minimalist header section */}
						<motion.div
							className='relative mb-10'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							{/* Minimal live indicator with KSA clock */}
							<div className='flex items-center justify-between mb-4'>
								<KSAClock />
							</div>

							{/* Subtitle with minimal styling */}
							<motion.p
								className='font-mono text-lg font-medium tracking-wide text-white'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.8, delay: 0.6 }}
							>
								We are Sora. Building at the intersection of passion and technology, we craft experiences that change how fans connect with what
								they love.
							</motion.p>
							{/* <motion.p
								className='font-mono mt-8 text-base font-light tracking-wide text-white'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.8, delay: 0.6 }}
							>
								نحن سورا. نبني عند تقاطع الشغف والتكنولوجيا، نصمم تجارب تغير طريقة تواصل المشجعين مع ما يحبون
							</motion.p> */}
						</motion.div>

						{/* Sleek content section */}
						<motion.div className='relative' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
							{/* Content container */}
							<div className='relative z-10 font-mono'>
								{/* Minimal terminal output with random text */}
								<motion.div
									className='border-l border-green-500/30 pl-4 font-mono text-sm text-white/70 space-y-2'
									initial={{ x: -10, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.5, delay: 1 }}
								>
									<RandomSystemPrompt />
									<motion.div
										className='text-xs text-white/50'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.5, delay: 1.2 }}
									>
										Last updated: 2 minutes ago
									</motion.div>
								</motion.div>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</div>
			<div className='absolute inset-0 -z-10'>
				<InteractiveASCII ASCII_ART={ASCII_ART} />
			</div>
		</div>
	);
}

// KSA Clock component
function KSAClock() {
	const [time, setTime] = useState('');
	const [seconds, setSeconds] = useState('');
	const [isBlinking, setIsBlinking] = useState(false);

	useEffect(() => {
		// Function to update time
		const updateTime = () => {
			const now = new Date();
			// KSA is UTC+3
			const ksaTime = new Date(now.getTime() + (3 * 60 * 60 * 1000 + now.getTimezoneOffset() * 60 * 1000));
			const hours = ksaTime.getHours().toString().padStart(2, '0');
			const minutes = ksaTime.getMinutes().toString().padStart(2, '0');
			const secs = ksaTime.getSeconds().toString().padStart(2, '0');

			setTime(`${hours}:${minutes}`);
			setSeconds(secs);
			setIsBlinking((prev) => !prev); // Toggle blink state every second
		};

		// Update immediately
		updateTime();

		// Update every second
		const interval = setInterval(updateTime, 1000);

		// Clean up interval
		return () => clearInterval(interval);
	}, []);

	return (
		<motion.div
			className='font-mono text-xs text-white/80 tracking-wider flex items-center'
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.3 }}
		>
			<motion.span
				className='text-green-400/80 mr-1.5'
				initial={{ opacity: 0 }}
				animate={{ opacity: [0.7, 1, 0.7] }}
				transition={{ duration: 4, repeat: Infinity }}
			>
				KSA
			</motion.span>
			<span>{time}</span>
			<motion.span animate={{ opacity: isBlinking ? 1 : 0.3 }} transition={{ duration: 0.2 }} className='mx-0.5'>
				:
			</motion.span>
			<motion.span
				key={seconds}
				initial={{ y: -8, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ type: 'spring', stiffness: 200, damping: 10 }}
			>
				{seconds}
			</motion.span>
		</motion.div>
	);
}

// Random System Prompt component
function RandomSystemPrompt() {
	const [prompt, setPrompt] = useState('');
	const [key, setKey] = useState(0); // Key for AnimatePresence

	const systemPrompts = useMemo(
		() => [
			'> System ready. All subsystems nominal.',
			'> Neural network optimization complete.',
			'> Analyzing user engagement patterns...',
			'> Content delivery systems operating at 98.7% efficiency.',
			'> Deploying enhanced recommendation algorithms.',
			'> Security protocols updated to version 3.4.2.',
			'> Predictive analytics module initialized.',
			'> User satisfaction metrics exceeding expectations.',
			'> Synchronizing distributed data nodes...',
			'> AI-driven content curation active.',
			'> Quantum processing units online.',
			'> Biometric authentication systems engaged.',
		],
		[]
	);

	useEffect(() => {
		// Set initial random prompt
		setPrompt(systemPrompts[Math.floor(Math.random() * systemPrompts.length)]);

		// Change prompt randomly every 5 seconds
		const interval = setInterval(() => {
			setKey((prevKey) => prevKey + 1); // Update key to trigger animation
			setPrompt(systemPrompts[Math.floor(Math.random() * systemPrompts.length)]);
		}, 5000);

		// Clean up interval
		return () => clearInterval(interval);
	}, [systemPrompts]);

	// Character animation variants
	const container = {
		hidden: { opacity: 0 },
		visible: (i = 1) => ({
			opacity: 1,
			transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
		}),
		exit: {
			opacity: 0,
			filter: 'blur(10px)',
			transition: { duration: 0.5, ease: 'easeOut' },
		},
	};

	const child = {
		hidden: {
			opacity: 0,
			y: 20,
			color: '#00ff00',
			textShadow: '0 0 8px rgba(0, 255, 0, 0)',
		},
		visible: {
			opacity: 1,
			y: 0,
			color: 'rgba(74, 222, 128, 0.9)',
			textShadow: '0 0 8px rgba(74, 222, 128, 0.3)',
			transition: {
				type: 'spring',
				damping: 12,
				stiffness: 100,
			},
		},
	};

	return (
		<motion.div key={key} className='text-green-400/90 overflow-hidden' variants={container} initial='hidden' animate='visible' exit='exit'>
			{prompt.split('').map((char, index) => (
				<motion.span key={index} variants={child} style={{ display: 'inline-block' }} className={char === ' ' ? 'w-2' : ''}>
					{char}
				</motion.span>
			))}
		</motion.div>
	);
}

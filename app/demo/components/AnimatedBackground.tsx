'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Dithering pattern styles
const ditheringPattern = {
	backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
	backgroundSize: '20px 20px',
	transition: 'background-color 0.3s ease',
};

// Dithering animation variants
const ditherVariants = {
	initial: {
		opacity: 0.3,
		scale: 1,
	},
	animate: {
		opacity: [0.3, 0.5, 0.3],
		scale: [1, 1.02, 1],
		transition: {
			duration: 4,
			repeat: Infinity,
			ease: 'easeInOut',
		},
	},
};

export default function AnimatedBackground() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const handleMouseMove = (e: React.MouseEvent) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	return (
		<motion.div
			className='absolute inset-0 z-0'
			style={{
				...ditheringPattern,
				backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.1) 1px, transparent 0), ${ditheringPattern.backgroundImage}`,
			}}
			variants={ditherVariants}
			initial='initial'
			animate='animate'
			onMouseMove={handleMouseMove}
			onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
		>
			{/* Animated scan lines */}
			<motion.div
				className='absolute inset-0'
				style={{
					backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.1) 50%)',
					backgroundSize: '100% 4px',
				}}
				animate={{
					y: ['0%', '100%'],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: 'linear',
				}}
			/>
		</motion.div>
	);
}

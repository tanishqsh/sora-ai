'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AsciiChar {
	x: number;
	y: number;
	originalX: number;
	originalY: number;
	char: string;
	opacity: number;
	color: string;
}

interface InteractiveASCIIProps {
	ASCII_ART: string;
	rectangleWidthFactor?: number;
	fullScreenRectangle?: boolean;
	baseInfluenceSize?: number;
	maxAttractionDistance?: number;
	colorIntensityThreshold?: number;
	colors?: string[];
	mouseInfluence?: number; // How strongly the mouse pulls characters
}

const InteractiveASCII: React.FC<InteractiveASCIIProps> = ({
	ASCII_ART,
	rectangleWidthFactor = 1,
	fullScreenRectangle = false,
	baseInfluenceSize = 500,
	maxAttractionDistance = 50,
	colorIntensityThreshold = 0.5,
	colors = [
		'rgba(255, 105, 180, 1)', // Hot pink
		'rgba(0, 255, 255, 1)', // Cyan
		'rgba(255, 215, 0, 1)', // Gold
		'rgba(50, 205, 50, 1)', // Lime green
		'rgba(147, 112, 219, 1)', // Purple
		'rgba(255, 165, 0, 1)', // Orange
		'rgba(0, 191, 255, 1)', // Deep sky blue
	],
	mouseInfluence = 0.2, // Increased default mouse influence for more noticeable effect
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	// Use state for mouse position to ensure component updates when mouse moves
	const [mousePos, setMousePos] = useState(() => ({
		x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
		y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
	}));
	const [isMouseInCanvas, setIsMouseInCanvas] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationFrameId: number;

		const resizeCanvas = () => {
			if (canvas) {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			}
		};
		resizeCanvas();

		// Rectangle parameters
		const rectangleWidth = fullScreenRectangle ? window.innerWidth : window.innerWidth / rectangleWidthFactor;

		const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
		const asciiChars: AsciiChar[] = [];

		const initAsciiChars = () => {
			ctx.font = '14px monospace';
			const lines = ASCII_ART.split('\n');
			const charWidth = ctx.measureText('M').width;
			const lineHeight = 10;

			const cols = Math.ceil(canvas.width / charWidth);
			const rows = Math.ceil(canvas.height / lineHeight);
			const startX = 0;
			const startY = lineHeight;

			for (let i = 0; i < rows; i++) {
				const line = lines[i % lines.length];
				for (let j = 0; j < cols; j++) {
					const char = line[j % line.length];
					if (char !== ' ') {
						const x = startX + j * charWidth;
						const y = startY + i * lineHeight;
						asciiChars.push({
							x,
							y,
							originalX: x,
							originalY: y,
							char,
							opacity: 0.1,
							color: 'rgba(255, 255, 255, 0.1)',
						});
					}
				}
			}
		};

		initAsciiChars();

		const drawCityscape = () => {
			ctx.font = '12px monospace';
			asciiChars.forEach((char) => {
				ctx.fillStyle = char.color;
				ctx.fillText(char.char, char.x, char.y);
			});
		};

		// Animation time tracking
		let startTime = Date.now();

		const animate = () => {
			const currentTime = Date.now();
			const elapsedTime = (currentTime - startTime) / 1000; // in seconds

			ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			drawCityscape();

			// Calculate rectangle position - now based on time instead of mouse
			let rectangleX = 0;
			if (!fullScreenRectangle) {
				// Move rectangle back and forth across the screen based on time
				const oscillation = Math.sin(elapsedTime * 0.5) * 0.5 + 0.5; // Value between 0 and 1
				rectangleX = oscillation * (canvas.width - rectangleWidth);
			}

			// Update ASCII characters
			asciiChars.forEach((char) => {
				const isInRectangle = fullScreenRectangle || (char.originalX >= rectangleX && char.originalX <= rectangleX + rectangleWidth);

				if (isInRectangle) {
					// Calculate influence factor
					let influenceFactor = 1;
					if (!fullScreenRectangle) {
						const distanceFromCenter = Math.abs(rectangleX + rectangleWidth / 2 - char.originalX);
						influenceFactor = 1 - distanceFromCenter / (rectangleWidth / 2);
						influenceFactor = Math.max(0, Math.min(1, influenceFactor)); // Clamp between 0 and 1
					}

					// Update opacity and color
					const newOpacity = Math.min(1, 0.1 + influenceFactor * 1);
					char.opacity = newOpacity;
					char.color = newOpacity > colorIntensityThreshold ? getRandomColor() : `rgba(255, 255, 255, ${char.opacity})`;

					// Base animation using time
					const waveX = Math.sin(elapsedTime + char.originalX * 0.01) * maxAttractionDistance * 0.2;
					const waveY = Math.cos(elapsedTime + char.originalY * 0.01) * maxAttractionDistance * 0.2;

					// Calculate mouse influence if mouse is in canvas
					let mouseX = 0;
					let mouseY = 0;

					if (isMouseInCanvas && mouseInfluence > 0) {
						// Calculate distance to mouse
						const dx = mousePos.x - char.originalX;
						const dy = mousePos.y - char.originalY;
						const distance = Math.sqrt(dx * dx + dy * dy);

						if (distance < baseInfluenceSize) {
							// Calculate pull strength based on distance
							const pullStrength = (1 - distance / baseInfluenceSize) * mouseInfluence;

							// Apply pull toward mouse - increased strength for more noticeable effect
							mouseX = dx * pullStrength;
							mouseY = dy * pullStrength;
						}
					}

					// Combine time-based animation with mouse influence
					char.x = char.originalX + waveX * (1 - mouseInfluence) + mouseX * influenceFactor;
					char.y = char.originalY + waveY * (1 - mouseInfluence) + mouseY * influenceFactor;
				} else {
					// Reset characters outside the rectangle
					char.opacity = 0.1;
					char.color = 'rgba(255, 255, 255, 0.1)';
					char.x = char.originalX;
					char.y = char.originalY;
				}
			});

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		// Event handlers using React state setters
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};

		const handleMouseEnter = () => {
			setIsMouseInCanvas(true);
		};

		const handleMouseLeave = () => {
			setIsMouseInCanvas(false);
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (e.touches.length > 0) {
				setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
				setIsMouseInCanvas(true);
			}
		};

		const handleTouchEnd = () => {
			setIsMouseInCanvas(false);
		};

		// Use window for event listeners to capture mouse movement anywhere
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseenter', handleMouseEnter);
		window.addEventListener('mouseleave', handleMouseLeave);
		window.addEventListener('touchmove', handleTouchMove);
		window.addEventListener('touchend', handleTouchEnd);
		window.addEventListener('resize', resizeCanvas);

		// Debug - log to confirm event handlers are attached
		console.log('Event handlers attached, mouseInfluence:', mouseInfluence);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseenter', handleMouseEnter);
			window.removeEventListener('mouseleave', handleMouseLeave);
			window.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('touchend', handleTouchEnd);
			window.removeEventListener('resize', resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, [
		ASCII_ART,
		rectangleWidthFactor,
		fullScreenRectangle,
		baseInfluenceSize,
		maxAttractionDistance,
		colorIntensityThreshold,
		colors,
		mouseInfluence,
		mousePos,
		isMouseInCanvas,
	]);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				background: 'black',
			}}
		/>
	);
};

export default InteractiveASCII;

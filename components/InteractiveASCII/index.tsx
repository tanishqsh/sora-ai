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
}

const InteractiveASCII: React.FC<InteractiveASCIIProps> = ({ ASCII_ART }: InteractiveASCIIProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		// Check if device is mobile
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

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
		window.addEventListener('resize', resizeCanvas);

		const baseInfluenceRadius = 100; // Base radius of influence for ASCII characters
		const maxAttractionDistance = 50; // Maximum distance a character can be attracted
		const influenceScalingFactor = 10; // Scaling factor for the influence radius

		let mousePos = { x: 0, y: 0 };

		// Generate a random color
		const getRandomColor = () => {
			const colors = [
				'rgba(255, 105, 180, 1)', // Hot pink
				'rgba(0, 255, 255, 1)', // Cyan
				'rgba(255, 215, 0, 1)', // Gold
				'rgba(50, 205, 50, 1)', // Lime green
				'rgba(147, 112, 219, 1)', // Purple
				'rgba(255, 165, 0, 1)', // Orange
				'rgba(0, 191, 255, 1)', // Deep sky blue
			];
			return colors[Math.floor(Math.random() * colors.length)];
		};

		const cityscapeAscii = ASCII_ART;
		const asciiChars: AsciiChar[] = [];

		const initAsciiChars = () => {
			ctx.font = '13px monospace';
			const lines = cityscapeAscii.split('\n');
			const charWidth = ctx.measureText('W').width;
			const lineHeight = 12;

			// Calculate how many characters we need to fill the screen
			const cols = Math.ceil(canvas.width / charWidth);
			const rows = Math.ceil(canvas.height / lineHeight);

			// Distribute characters evenly across the entire canvas
			const startX = 0;
			const startY = lineHeight; // Start a bit down to ensure visibility

			for (let i = 0; i < rows; i++) {
				const line = lines[i % lines.length];
				for (let j = 0; j < cols; j++) {
					const char = line[j % line.length];
					if (char !== ' ') {
						const x = startX + j * charWidth;
						const y = startY + i * lineHeight;
						asciiChars.push({
							x: x,
							y: y,
							originalX: x,
							originalY: y,
							char: char,
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

		const animate = () => {
			ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			drawCityscape();

			// Calculate dynamic influence radius based on mouse position
			const distanceFromCenter = Math.sqrt(Math.pow(mousePos.x - canvas.width / 2, 2) + Math.pow(mousePos.y - canvas.height / 2, 2));
			const maxDistance = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2));
			const influenceRadius = baseInfluenceRadius * (influenceScalingFactor - distanceFromCenter / maxDistance);

			// Update ASCII characters opacity and position based on mouse position
			asciiChars.forEach((char) => {
				const dx = mousePos.x - char.x;
				const dy = mousePos.y - char.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < influenceRadius) {
					const newOpacity = Math.min(1, 0.1 + (1 - distance / influenceRadius) * 0.9);
					char.opacity = newOpacity;

					// Assign a sparkly color when character is influenced
					if (newOpacity > 0.5) {
						char.color = getRandomColor();
					} else {
						// Fade back to white with lower opacity when less influenced
						char.color = `rgba(255, 255, 255, ${char.opacity})`;
					}

					// Calculate attraction
					const attractionForce = Math.min(1, (influenceRadius - distance) / influenceRadius);
					const attractionX = dx * attractionForce * (maxAttractionDistance / influenceRadius);
					const attractionY = dy * attractionForce * (maxAttractionDistance / influenceRadius);

					char.x = char.originalX + attractionX;
					char.y = char.originalY + attractionY;
				} else {
					char.opacity = 0.1;
					char.color = 'rgba(255, 255, 255, 0.1)';
					char.x = char.originalX;
					char.y = char.originalY;
				}
			});

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		const handleMouseMove = (e: MouseEvent) => {
			// Only update mouse position on non-mobile devices
			if (!isMobile) {
				mousePos = { x: e.clientX, y: e.clientY };
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (e.touches.length > 0) {
				mousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('touchmove', handleTouchMove);

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('resize', checkMobile);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('touchmove', handleTouchMove);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'black' }} />;
};

export default InteractiveASCII;

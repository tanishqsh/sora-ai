'use client';

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { throttle } from 'lodash';

interface AsciiChar {
	x: number;
	y: number;
	char: string;
	color: string;
	baseOpacity: number;
}

interface InteractiveASCIIProps {
	ASCII_ART: string;
	colors?: string[];
	cursorSquareWidth?: number;
	cursorSquareHeight?: number;
	fps?: number;
}

const InteractiveASCII: React.FC<InteractiveASCIIProps> = ({
	ASCII_ART,
	colors = [
		'rgba(255, 105, 180, 1)', // Hot pink
		'rgba(0, 255, 255, 1)', // Cyan
		'rgba(255, 215, 0, 1)', // Gold
		'rgba(50, 205, 50, 1)', // Lime green
		'rgba(147, 112, 219, 1)', // Purple
		'rgba(255, 165, 0, 1)', // Orange
		'rgba(0, 191, 255, 1)', // Deep sky blue
	],
	cursorSquareWidth = 1500,
	cursorSquareHeight = 1500,
	fps = 30,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const charsRef = useRef<AsciiChar[]>([]);
	const animationFrameIdRef = useRef<number>(0);
	const lastFrameTimeRef = useRef<number>(0);
	const frameIntervalRef = useRef<number>(1000 / fps);
	const mousePosRef = useRef({ x: 0, y: 0 });
	const isMouseInCanvasRef = useRef(false);
	const canvasSizeRef = useRef({ width: 0, height: 0 });

	// Pre-compute colors array for better performance
	const colorCache = useMemo(() => colors, [colors]);

	// Memoized function to get random color
	const getRandomColor = useCallback(() => {
		return colorCache[Math.floor(Math.random() * colorCache.length)];
	}, [colorCache]);

	// Initialize ASCII characters - only run when canvas size changes
	const initAsciiChars = useCallback(
		(width: number, height: number) => {
			const charWidth = 8; // Approximate width of monospace character
			const lineHeight = 10;

			const cols = Math.ceil(width / charWidth);
			const rows = Math.ceil(height / lineHeight);
			const startX = 0;
			const startY = lineHeight;

			const lines = ASCII_ART.split('\n');
			const chars: AsciiChar[] = [];

			for (let i = 0; i < rows; i++) {
				const line = lines[i % lines.length];
				for (let j = 0; j < cols; j++) {
					const charIndex = j % line.length;
					const char = line[charIndex];
					if (char !== ' ') {
						const x = startX + j * charWidth;
						const y = startY + i * lineHeight;
						chars.push({
							x,
							y,
							char,
							color: 'rgba(255, 255, 255, 0.3)',
							baseOpacity: 0.3,
						});
					}
				}
			}
			return chars;
		},
		[ASCII_ART]
	);

	// Update canvas size and reinitialize characters
	const updateCanvasSize = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const width = window.innerWidth;
		const height = window.innerHeight;

		// Only update if dimensions actually changed
		if (width !== canvasSizeRef.current.width || height !== canvasSizeRef.current.height) {
			canvas.width = width;
			canvas.height = height;
			canvasSizeRef.current = { width, height };
			charsRef.current = initAsciiChars(width, height);
		}
	}, [initAsciiChars]);

	// Effect to initialize canvas and handle resize
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// Initial canvas setup
		updateCanvasSize();

		// Create throttled resize function
		const throttledResize = throttle(() => {
			updateCanvasSize();
		}, 200);

		// Add resize listener
		window.addEventListener('resize', throttledResize);

		return () => {
			window.removeEventListener('resize', throttledResize);
			throttledResize.cancel();
		};
	}, [updateCanvasSize]);

	// Effect for mouse/touch events
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const handleMouseLeave = () => {
			isMouseInCanvasRef.current = false;
		};

		const handleMouseEnter = () => {
			isMouseInCanvasRef.current = true;
		};

		const handleTouchEnd = () => {
			isMouseInCanvasRef.current = false;
		};

		// Create throttled handlers
		const throttledMouseMove = throttle((e: MouseEvent) => {
			mousePosRef.current = { x: e.clientX, y: e.clientY };
			isMouseInCanvasRef.current = true;
		}, 16);

		const throttledTouchMove = throttle((e: TouchEvent) => {
			if (e.touches.length > 0) {
				mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
				isMouseInCanvasRef.current = true;
			}
		}, 16);

		// Add event listeners
		window.addEventListener('mousemove', throttledMouseMove);
		canvas.addEventListener('mouseenter', handleMouseEnter);
		canvas.addEventListener('mouseleave', handleMouseLeave);
		window.addEventListener('touchmove', throttledTouchMove, { passive: true });
		window.addEventListener('touchend', handleTouchEnd);

		return () => {
			window.removeEventListener('mousemove', throttledMouseMove);
			canvas.removeEventListener('mouseenter', handleMouseEnter);
			canvas.removeEventListener('mouseleave', handleMouseLeave);
			window.removeEventListener('touchmove', throttledTouchMove);
			window.removeEventListener('touchend', handleTouchEnd);

			// Clean up throttled functions
			throttledMouseMove.cancel();
			throttledTouchMove.cancel();
		};
	}, []);

	// Animation effect
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || charsRef.current.length === 0) return;

		const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
		if (!ctx) return;

		// Pre-calculate square boundaries
		const halfWidth = cursorSquareWidth / 2.5;
		const halfHeight = cursorSquareHeight;

		const animate = (timestamp: number) => {
			// Implement frame rate limiting
			if (timestamp - lastFrameTimeRef.current < frameIntervalRef.current) {
				animationFrameIdRef.current = requestAnimationFrame(animate);
				return;
			}

			lastFrameTimeRef.current = timestamp;

			// Clear with solid black (faster than using clearRect)
			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Get current mouse position from ref
			const mousePos = mousePosRef.current;
			const isMouseInCanvas = isMouseInCanvasRef.current;

			// Calculate square boundaries only when needed
			const squareLeft = mousePos.x - halfWidth;
			const squareRight = mousePos.x + halfWidth;
			const squareTop = mousePos.y - halfHeight;
			const squareBottom = mousePos.y + halfHeight;

			// Set font once outside the loop
			ctx.font = '12px monospace';

			// Draw ASCII characters with cursor-based color changes
			const chars = charsRef.current;
			const isActive = isMouseInCanvas;

			for (let i = 0; i < chars.length; i++) {
				const char = chars[i];

				// Only process colors for characters in view and near cursor
				const isInSquare = isActive && char.x >= squareLeft && char.x <= squareRight && char.y >= squareTop && char.y <= squareBottom;

				if (isInSquare) {
					// Calculate relative position within square (0-1 range for both x and y)
					const relX = Math.abs((char.x - mousePos.x) / halfWidth);
					const relY = Math.abs((char.y - mousePos.y) / halfHeight);

					// Use the maximum of the relative X and Y positions
					const distanceFactor = Math.max(relX, relY);

					// The closer to the center of the square, the more likely to get a color
					const colorProbability = 1 - distanceFactor;

					// Reduce random calls by using a threshold
					if (Math.random() < colorProbability * 0.75) {
						// Reduced probability
						char.color = getRandomColor();
					} else {
						// Fade to white as distance from center increases
						const opacity = 0.3 + 0.7 * (1 - distanceFactor);
						char.color = `rgba(255, 255, 255, ${opacity})`;
					}
				} else if (char.color !== `rgba(255, 255, 255, ${char.baseOpacity})`) {
					// Reset to base color if outside square (only if needed)
					char.color = `rgba(255, 255, 255, ${char.baseOpacity})`;
				}

				// Draw the character
				ctx.fillStyle = char.color;
				ctx.fillText(char.char, char.x, char.y);
			}

			animationFrameIdRef.current = requestAnimationFrame(animate);
		};

		animationFrameIdRef.current = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationFrameIdRef.current);
		};
	}, [getRandomColor, cursorSquareWidth, cursorSquareHeight]);

	// Update frame rate if fps prop changes
	useEffect(() => {
		frameIntervalRef.current = 1000 / fps;
	}, [fps]);

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

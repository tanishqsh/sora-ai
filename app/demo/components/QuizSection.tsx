'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quizQuestions = [
	{
		start: 0,
		end: 10, // 10 seconds to answer
		question: "Rate Bento's distribution so far in the match?",
		options: ['Excellent', 'Good', 'Average', 'Poor'],
		correctAnswer: 0, // Excellent (based on commentary)
	},
	{
		start: 15,
		end: 25, // 10 seconds to answer
		question: "Who's been dominating the left flank for Al-Nassr?",
		options: ['Sadio Mané', 'Boushal', 'Talisca', 'Otavio'],
		correctAnswer: 1, // Boushal (based on commentary)
	},
];

// Mock data for social features
const mockStats = {
	answers: [45, 20, 15, 20], // Percentage of users who chose each option
	reactions: {
		likes: 128,
		comments: 32,
		shares: 15,
	},
	leaderboard: [
		{ username: 'FootballFan123', score: 100, streak: 5 },
		{ username: 'SoccerExpert', score: 95, streak: 4 },
		{ username: 'MatchCommentator', score: 90, streak: 3 },
	],
	// Add current user data
	currentUser: {
		username: 'You',
		score: 85,
		streak: 2,
		rank: 4,
		percentile: 92, // Top 8% of players
		pointsBalance: 1250,
		pointsWon: 50, // Points won for current question
	},
};

const AnimatedNumber = ({ value }: { value: number }) => {
	return (
		<AnimatePresence mode='popLayout'>
			<motion.span
				key={value}
				initial={{ y: 20, opacity: 0, scale: 0.8 }}
				animate={{ y: 0, opacity: 1, scale: 1 }}
				exit={{ y: -20, opacity: 0, scale: 0.8 }}
				transition={{
					duration: 0.4,
					ease: [0.4, 0, 0.2, 1],
					opacity: { duration: 0.2 },
				}}
				className='inline-block'
			>
				{value}
			</motion.span>
		</AnimatePresence>
	);
};

interface QuizSectionProps {
	isPlaying: boolean;
	currentTime: number;
}

export default function QuizSection({ isPlaying, currentTime }: QuizSectionProps) {
	const [quizState, setQuizState] = useState<{
		currentQuestion: number | null;
		selectedAnswer: number | null;
		showStats: boolean;
		showLeaderboard: boolean;
		showPointsWon: boolean;
		timeRemaining: number | null;
	}>({
		currentQuestion: null,
		selectedAnswer: null,
		showStats: false,
		showLeaderboard: false,
		showPointsWon: false,
		timeRemaining: null,
	});

	const [dynamicStats, setDynamicStats] = useState(mockStats);

	// Handle quiz timing and progression
	useEffect(() => {
		if (!isPlaying) {
			setQuizState((prev) => ({
				...prev,
				currentQuestion: null,
				selectedAnswer: null,
				showStats: false,
				timeRemaining: null,
			}));
			return;
		}

		// Find the current active question based on video time
		const activeQuestionIndex = quizQuestions.findIndex((q) => currentTime >= q.start && currentTime <= q.end);

		if (activeQuestionIndex !== -1) {
			const question = quizQuestions[activeQuestionIndex];
			const timeRemaining = Math.max(0, Math.floor(question.end - currentTime));

			setQuizState((prev) => ({
				...prev,
				currentQuestion: activeQuestionIndex,
				timeRemaining,
				// Reset answer and stats if it's a new question
				...(prev.currentQuestion !== activeQuestionIndex && {
					selectedAnswer: null,
					showStats: false,
					showPointsWon: false,
				}),
			}));
		} else {
			setQuizState((prev) => ({
				...prev,
				currentQuestion: null,
				timeRemaining: null,
			}));
		}
	}, [currentTime, isPlaying]);

	// Handle stats updates
	useEffect(() => {
		const interval = setInterval(() => {
			setDynamicStats((prevStats) => ({
				...prevStats,
				answers: prevStats.answers.map((percent) => {
					const change = Math.floor(Math.random() * 10) - 5;
					return Math.max(0, Math.min(100, percent + change));
				}),
				reactions: {
					likes: prevStats.reactions.likes + Math.floor(Math.random() * 5),
					comments: prevStats.reactions.comments + Math.floor(Math.random() * 2),
					shares: prevStats.reactions.shares + Math.floor(Math.random() * 2),
				},
				leaderboard: prevStats.leaderboard.map((user) => ({
					...user,
					score: user.score + Math.floor(Math.random() * 3),
					streak: user.streak + (Math.random() > 0.8 ? 1 : 0),
				})),
				currentUser: {
					...prevStats.currentUser,
					score: prevStats.currentUser.score + Math.floor(Math.random() * 3),
					streak: prevStats.currentUser.streak + (Math.random() > 0.8 ? 1 : 0),
					// Remove pointsBalance from random updates
					pointsBalance: prevStats.currentUser.pointsBalance,
				},
			}));
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	const handleAnswerSelect = (index: number) => {
		if (quizState.timeRemaining === 0) return;

		setQuizState((prev) => ({
			...prev,
			selectedAnswer: index,
			showStats: true,
			showPointsWon: true,
		}));
	};

	const toggleLeaderboard = () => {
		setQuizState((prev) => ({ ...prev, showLeaderboard: !prev.showLeaderboard }));
	};

	if (!isPlaying || quizState.currentQuestion === null) {
		return (
			<div className='h-1/2 p-6'>
				<div className='h-full flex flex-col'>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-lg font-medium'>Live Match Quiz</h2>
						<span className='text-sm text-white/60'>Waiting for next question...</span>
					</div>
				</div>
			</div>
		);
	}

	const currentQuiz = quizQuestions[quizState.currentQuestion];

	return (
		<div className='h-1/2 p-6'>
			<div className='h-full flex flex-col'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center space-x-4'>
						<h2 className='text-lg font-medium'>Live Match Quiz</h2>
						<div className='flex items-center space-x-2 text-sm bg-white/5 px-2 py-1 rounded-full'>
							<span className='text-white/60'>Time</span>
							<span className='font-medium text-orange-500'>{quizState.timeRemaining}s</span>
						</div>
						<div className='flex items-center space-x-2 text-sm bg-white/5 px-2 py-1 rounded-full'>
							<span className='text-white/60'>Rank</span>
							<span className='font-medium'>
								#<AnimatedNumber value={dynamicStats.currentUser.rank} />
							</span>
							<span className='text-green-500'>
								Top <AnimatedNumber value={dynamicStats.currentUser.percentile} />%
							</span>
						</div>
						<div className='flex items-center space-x-2 text-sm bg-white/5 px-2 py-1 rounded-full'>
							<span className='text-white/60'>Sync Coin Balance</span>
							<span className='font-medium text-green-500'>
								<AnimatedNumber value={dynamicStats.currentUser.pointsBalance} />
							</span>
							{quizState.showPointsWon && (
								<span className='text-green-500'>
									+<AnimatedNumber value={dynamicStats.currentUser.pointsWon} />
								</span>
							)}
						</div>
					</div>
					<div className='flex items-center space-x-4'>
						<button onClick={toggleLeaderboard} className='text-sm text-white/60 hover:text-white transition-colors'>
							🏆 Leaderboard
						</button>
					</div>
				</div>
				<div className='flex-1 flex flex-col justify-between'>
					<div>
						<div className='flex items-center justify-between mb-2'>
							<p className='text-md text-white/80'>{currentQuiz.question}</p>
							<div className='flex items-center space-x-2 text-sm text-white/60'>
								<span>
									❤️ <AnimatedNumber value={dynamicStats.reactions.likes} />
								</span>
								<span>
									💬 <AnimatedNumber value={dynamicStats.reactions.comments} />
								</span>
								<span>
									🔄 <AnimatedNumber value={dynamicStats.reactions.shares} />
								</span>
							</div>
						</div>
						<div className='space-y-1'>
							{currentQuiz.options.map((option, index) => (
								<button
									key={index}
									onClick={() => handleAnswerSelect(index)}
									disabled={quizState.timeRemaining === 0}
									className={`w-full px-4 py-3 rounded-md text-sm text-left transition-colors relative ${
										quizState.selectedAnswer === index
											? index === currentQuiz.correctAnswer
												? 'bg-green-500/20 border border-green-500'
												: 'bg-red-500/20 border border-red-500'
											: quizState.timeRemaining === 0 && index === currentQuiz.correctAnswer
											? 'bg-green-500/20 border border-green-500'
											: 'bg-white/2 hover:bg-white/5'
									}`}
								>
									{option}
									{quizState.showStats && (
										<span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/60'>
											<AnimatedNumber value={dynamicStats.answers[index]} />%
										</span>
									)}
								</button>
							))}
						</div>
					</div>
					{quizState.showLeaderboard && (
						<div className='mt-4 bg-white/5 rounded-lg p-4'>
							<h3 className='text-sm font-medium mb-2'>Top Performers</h3>
							<div className='space-y-2'>
								{dynamicStats.leaderboard.map((user, index) => (
									<div key={index} className='flex items-center justify-between text-sm'>
										<div className='flex items-center space-x-2'>
											<span className='text-white/60'>{index + 1}.</span>
											<span>{user.username}</span>
											<span className='text-green-500'>
												🔥 <AnimatedNumber value={user.streak} />
											</span>
										</div>
										<span className='text-white/60'>
											<AnimatedNumber value={user.score} /> pts
										</span>
									</div>
								))}
								{/* Current user's rank */}
								<div className='pt-2 mt-2 border-t border-white/10'>
									<div className='flex items-center justify-between text-sm'>
										<div className='flex items-center space-x-2'>
											<span className='text-white/60'>
												<AnimatedNumber value={dynamicStats.currentUser.rank} />.
											</span>
											<span className='text-green-500'>{dynamicStats.currentUser.username}</span>
											<span className='text-green-500'>
												🔥 <AnimatedNumber value={dynamicStats.currentUser.streak} />
											</span>
										</div>
										<span className='text-white/60'>
											<AnimatedNumber value={dynamicStats.currentUser.score} /> pts
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

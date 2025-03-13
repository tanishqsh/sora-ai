import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const notoSansArabic = Noto_Sans_Arabic({
	variable: '--font-noto-sans-arabic',
	subsets: ['arabic'],
});

export const metadata: Metadata = {
	title: 'Sora AI',
	description: 'Immersive fan engagement platform',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable} ${notoSansArabic.variable} antialiased`}>{children}</body>
		</html>
	);
}

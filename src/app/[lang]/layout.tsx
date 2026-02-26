import React from "react";
import { Metadata } from "next";
import { ReactLenis } from "lenis/react";
import { Spline_Sans } from "next/font/google";
import "../globals.css";
import { PostHogProvider } from "../providers";

const spline = Spline_Sans({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SiLab — Web Development",
    description: "SI lab builds modern web applications and AI-powered solutions. Fullstack development, AI integration, and scalable architecture for startups and businesses.",
    icons: {
        icon: { url: "/coding.svg", type: "image/svg+xml" },
    },
    verification: {
        google: "UHg0wtsc2rW9CqzIsVhdiiI-ZsqpDocFtYKRhVMX1xA",
    },
};

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'da' }];
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params as { lang: 'en' | 'da' };

    return (
        <html lang={lang}>
            <body className={`${spline.className} antialiased`}>
                <ReactLenis root />
                <PostHogProvider>
                    {children}
                </PostHogProvider>
            </body>
        </html>
    );
}

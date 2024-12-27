"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const WobbleCard = ({
    children,
    containerClassName,
    className,
}: {
    children: React.ReactNode;
    containerClassName?: string;
    className?: string;
}) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY } = event;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (clientX - (rect.left + rect.width / 2)) / 20;
        const y = (clientY - (rect.top + rect.height / 2)) / 20;
        setMousePosition({ x, y });
    };

    return (
        <motion.section
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                setMousePosition({ x: 0, y: 0 });
            }}
            style={{
                transform: isHovering
                    ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
                    : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
                transition: "transform 0.1s ease-out",
            }}
            className={cn(
                "mx-auto w-full bg-primary/5 relative rounded-xl overflow-hidden border shadow-lg",
                containerClassName
            )}
        >
            <div
                className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.12),transparent)] sm:mx-0 sm:rounded-xl overflow-hidden"
                style={{
                    backgroundImage: `
                        linear-gradient(to bottom right, 
                            rgba(var(--primary), 0.2), 
                            rgba(var(--accent), 0.1), 
                            rgba(var(--secondary), 0.05)
                        )
                    `,
                }}
            >
                <div
                    className="absolute inset-0 w-full h-full opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundSize: '100px',
                    }}
                />
                <motion.div
                    style={{
                        transform: isHovering
                            ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
                            : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
                        transition: "transform 0.1s ease-out",
                    }}
                    className={cn("relative h-full px-6 py-8", className)}
                >
                    {children}
                </motion.div>
            </div>
        </motion.section>
    );
};

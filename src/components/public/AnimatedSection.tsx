"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    animation?: "fade-up" | "fade-in" | "stagger";
    delay?: number;
}

export function AnimatedSection({ children, className = "", animation = "fade-up", delay = 0 }: AnimatedSectionProps) {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!container.current) return;

        if (animation === "stagger") {
            const elements = container.current.children;
            gsap.from(elements, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                delay,
                scrollTrigger: {
                    trigger: container.current,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        } else if (animation === "fade-up") {
            gsap.from(container.current, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                delay,
                scrollTrigger: {
                    trigger: container.current,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        } else if (animation === "fade-in") {
            gsap.from(container.current, {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                delay,
                scrollTrigger: {
                    trigger: container.current,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        }
    }, { scope: container });

    return (
        <div ref={container} className={className}>
            {children}
        </div>
    );
}

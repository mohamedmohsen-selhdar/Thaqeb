import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

interface ParticleBackgroundProps {
    color?: string;
    particleCount?: number;
    linkDistance?: number;
    mouseLinkDistance?: number;
    speed?: number;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
    color = 'rgba(255, 255, 255, 0.4)', // Slightly transparent white for Antigravity feel
    particleCount = 100,
    linkDistance = 120,
    mouseLinkDistance = 180,
    speed = 0.5,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>();
    const particles = useRef<Particle[]>([]);
    const mousePosition = useRef({ x: -1000, y: -1000 }); // Initially offscreen

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width;
        let height = canvas.height;

        // Helper to initialize particles
        const initParticles = () => {
            particles.current = [];
            for (let i = 0; i < particleCount; i++) {
                particles.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * speed,
                    vy: (Math.random() - 0.5) * speed,
                    radius: Math.random() * 1.5 + 0.5, // Dot size 0.5 to 2
                });
            }
        };

        // Resize handler
        const handleResize = () => {
            // Get the parent container's size if possible, or fallback to window
            const parent = canvas.parentElement;
            width = parent ? parent.clientWidth : window.innerWidth;
            height = parent ? parent.clientHeight : window.innerHeight;

            canvas.width = width;
            canvas.height = height;

            initParticles(); // Reinitialize to distribute evenly
        };

        // Initial sizing
        handleResize();
        window.addEventListener('resize', handleResize);

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mousePosition.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseLeave = () => {
            mousePosition.current = { x: -1000, y: -1000 };
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            particles.current.forEach((p, index) => {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off walls
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                // Connect to other particles
                for (let j = index + 1; j < particles.current.length; j++) {
                    const p2 = particles.current[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < linkDistance * linkDistance) {
                        const distance = Math.sqrt(distSq);
                        const opacity = 1 - distance / linkDistance;

                        // Extract rgb from rgba or assume white-ish
                        // Simple hack: modify alpha of the color based on distance
                        const linkColor = color.replace(/[\d.]+\)$/g, `${opacity * 0.5})`);

                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = linkColor;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                const mouseDx = p.x - mousePosition.current.x;
                const mouseDy = p.y - mousePosition.current.y;
                const mouseDistSq = mouseDx * mouseDx + mouseDy * mouseDy;

                if (mouseDistSq < mouseLinkDistance * mouseLinkDistance) {
                    const distance = Math.sqrt(mouseDistSq);
                    // Stronger connection to the mouse
                    const opacity = (1 - distance / mouseLinkDistance) * 0.8;

                    const linkColor = color.replace(/[\d.]+\)$/g, `${opacity})`);

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mousePosition.current.x, mousePosition.current.y);
                    ctx.strokeStyle = linkColor;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Optional Antigravity effect: slight repel or attract to mouse
                    // Let's do a tiny bit of attraction to make it feel "magnetic"
                    const force = (mouseLinkDistance - distance) / mouseLinkDistance;
                    const ax = (mouseDx / distance) * force * 0.02;
                    const ay = (mouseDy / distance) * force * 0.02;

                    p.vx -= ax;
                    p.vy -= ay;

                    // Cap speed to prevent crazy sling-shotting
                    const maxSpeed = speed * 3;
                    const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    if (currentSpeed > maxSpeed) {
                        p.vx = (p.vx / currentSpeed) * maxSpeed;
                        p.vy = (p.vy / currentSpeed) * maxSpeed;
                    }
                }
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [color, particleCount, linkDistance, mouseLinkDistance, speed]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-auto"
            style={{ display: 'block' }}
        />
    );
};

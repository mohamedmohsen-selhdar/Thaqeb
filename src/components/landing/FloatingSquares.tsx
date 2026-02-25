import React, { useEffect, useState } from 'react';

// Generates random numbers within a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const FloatingSquares = () => {
    const [squares, setSquares] = useState<Array<{
        id: number;
        size: number;
        x: number;
        y: number;
        duration: number;
        opacity: number;
        delay: number;
    }>>([]);

    useEffect(() => {
        // Generate between 30 and 50 squares
        const numSquares = Math.floor(random(30, 50));
        const newSquares = Array.from({ length: numSquares }).map((_, i) => ({
            id: i,
            size: random(2, 6), // Sizes between 2px and 6px like the reference image
            x: random(0, 100), // Random starting X position (%)
            y: random(100, 120), // Start slightly below the screen
            duration: random(15, 35), // How long it takes to float up (in seconds)
            opacity: random(0.1, 0.4), // Varying opacity for depth
            delay: random(0, 20), // Stagger the start times
        }));

        setSquares(newSquares);
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {squares.map((square) => (
                <div
                    key={square.id}
                    className="absolute bg-white/80 animate-float-up"
                    style={{
                        width: `${square.size}px`,
                        height: `${square.size}px`,
                        left: `${square.x}%`,
                        bottom: `-${square.size * 2}px`, // strictly start off-screen
                        opacity: square.opacity,
                        animationDuration: `${square.duration}s`,
                        animationDelay: `${square.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

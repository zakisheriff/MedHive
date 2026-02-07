import React, { useState, useEffect } from 'react';
import './CountdownClock.css';

const CountdownClock = () => {
    const calculateTimeLeft = () => {
        const launchDate = new Date(2026, 1, 8, 18, 0, 0); // Feb 8th, 2026 at 6 PM Local Time
        const now = new Date();
        const difference = launchDate - now;

        console.log('Countdown Debug:', {
            launchDate: launchDate.toString(),
            now: now.toString(),
            difference,
            calculatedHours: Math.floor(difference / (1000 * 60 * 60))
        });

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor(difference / (1000 * 60 * 60)),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = {
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Pad numbers with leading zeros
    const formatNumber = (num) => {
        return num < 10 ? `0${num}` : num;
    };

    return (
        <section className="countdown-wrapper">
            <div className="countdown-container scroll-fade-in" style={{ opacity: 1, transform: 'translateY(0)' }}> {/* Force visible for now, or rely on scroll animation classes if they trigger automatically */}
                <h2 className="countdown-title">Launch Initiating In</h2>

                <div className="countdown-timer">
                    <div className="time-segment">
                        <span className="time-value">{formatNumber(timeLeft.hours)}</span>
                        <span className="time-label">Hours</span>
                    </div>

                    <span className="divider">:</span>

                    <div className="time-segment">
                        <span className="time-value">{formatNumber(timeLeft.minutes)}</span>
                        <span className="time-label">Minutes</span>
                    </div>

                    <span className="divider">:</span>

                    <div className="time-segment">
                        <span className="time-value">{formatNumber(timeLeft.seconds)}</span>
                        <span className="time-label">Seconds</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CountdownClock;

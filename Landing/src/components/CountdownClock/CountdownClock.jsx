import React, { useState, useEffect } from 'react';
import './CountdownClock.css';

const CountdownClock = () => {
    const calculateTimeLeft = () => {
        const launchDate = new Date('2026-02-08T00:00:00'); // Feb 8th, 2026
        const now = new Date();
        const difference = launchDate - now;

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = {
                days: 0,
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
        <section className="container">
            <div className="countdown-container scroll-fade-in" style={{ opacity: 1, transform: 'translateY(0)' }}> {/* Force visible for now, or rely on scroll animation classes if they trigger automatically */}
                <h2 className="countdown-title">Launch Initiating In</h2>

                <div className="countdown-timer">
                    <div className="time-segment">
                        <span className="time-value">{formatNumber(timeLeft.days)}</span>
                        <span className="time-label">Days</span>
                    </div>

                    <span className="divider">:</span>

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

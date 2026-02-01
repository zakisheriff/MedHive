import React, { useState, useRef, useEffect, useMemo } from 'react';
import './TeamSection.css';

const teamMembers = [
    {
        id: 1,
        name: 'Zaki Sheriff',
        role: 'App Frontend',
        image: '/Team/Zaki.png',
        social: {
            linkedin: 'https://www.linkedin.com/in/zakisheriff',
            github: 'https://github.com/zakisheriff'
        }
    },
    {
        id: 2,
        name: 'Abdul Raheem',
        role: 'Clinic Frontend',
        image: '/Team/Raheem.jpeg',
        social: {
            linkedin: 'https://www.linkedin.com/in/abdul-raheem-aouffan',
            github: 'https://github.com/abdulraheem05'
        }
    },
    {
        id: 3,
        name: 'Hanaa Ajuward',
        role: 'Clinic Backend',
        image: '/Team/Hanaa.jpeg',
        social: {
            linkedin: '#',
            github: '#'
        }
    },
    {
        id: 4,
        name: 'Abdul Rahman',
        role: 'App Backend',
        image: '/Team/Rahman.png',
        social: {
            linkedin: '#',
            github: '#'
        }
    },
    {
        id: 5,
        name: 'Kausian Senthan',
        role: 'Pharma Company Frontend',
        image: '/Team/Kausian.png',
        social: {
            linkedin: 'https://www.linkedin.com/in/kausian-senthan',
            github: 'https://github.com/Kausian'
        }
    },
    {
        id: 6,
        name: 'Afker Thowfeek',
        role: 'Pharma Company Backend',
        image: '/Team/Afker.jpeg',
        social: {
            linkedin: '#',
            github: '#'
        }
    }
];

const TeamSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
    const scrollRef = useRef(null);
    const isScrollingToMember = useRef(false);
    const scrollTimeout = useRef(null);

    // Track screen size for ordering
    useEffect(() => {
        const mql = window.matchMedia('(max-width: 992px)');
        const onChange = (e) => setIsMobile(e.matches);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    // Reorder members programmatically to sync DOM order with visual order
    const displayMembers = useMemo(() => {
        const members = [...teamMembers];
        if (!isMobile) {
            // Desktop: Zaki (id:1) 2nd, Raheem (id:2) 1st
            const zakiIndex = members.findIndex(m => m.id === 1);
            const raheemIndex = members.findIndex(m => m.id === 2);
            if (zakiIndex !== -1 && raheemIndex !== -1) {
                [members[zakiIndex], members[raheemIndex]] = [members[raheemIndex], members[zakiIndex]];
            }
        }
        return members;
    }, [isMobile]);

    // Determine dot count: 4 for desktop, 6 for mobile
    const displayDots = useMemo(() => {
        return isMobile ? displayMembers : displayMembers.slice(0, 4);
    }, [isMobile, displayMembers]);

    // Track scroll position to update active index and progress
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.offsetWidth;

            // 1. Update scroll progress in real-time (independent of active index)
            if (maxScroll > 0) {
                const progress = (scrollLeft / maxScroll) * 100;
                setScrollProgress(progress);
            }

            // 2. Update active index (dots)
            if (isScrollingToMember.current) return;

            const cards = container.querySelectorAll('.team-premium-card');
            if (cards.length === 0) return;

            // Force first/last indices at scroll boundaries
            if (scrollLeft <= 30) {
                if (activeIndex !== 0) setActiveIndex(0);
                return;
            }
            if (scrollLeft >= maxScroll - 30) {
                const lastIdx = displayDots.length - 1;
                if (activeIndex !== lastIdx) setActiveIndex(lastIdx);
                return;
            }

            let newIndex = 0;
            if (!isMobile) {
                // Stable Desktop logic
                const scrollPercentage = scrollLeft / maxScroll;
                newIndex = Math.min(3, Math.round(scrollPercentage * 3));
            } else {
                // Mobile logic: Closest to center
                const containerCenter = scrollLeft + container.offsetWidth / 2;
                let minDistance = Infinity;
                cards.forEach((card, index) => {
                    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                    const distance = Math.abs(containerCenter - cardCenter);
                    if (distance < minDistance) {
                        minDistance = distance;
                        newIndex = index;
                    }
                });
            }

            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, [isMobile, displayDots.length, activeIndex]); // Simplified dependencies for more stable listener

    const scrollToMember = (index) => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const cards = container.querySelectorAll('.team-premium-card');

            if (cards[index] || index === displayDots.length - 1) {
                isScrollingToMember.current = true;
                setActiveIndex(index);

                // Clear any existing timeout
                if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

                let targetScroll;
                if (index === 0) {
                    targetScroll = 0;
                } else if (index === displayDots.length - 1) {
                    targetScroll = container.scrollWidth - container.offsetWidth;
                } else {
                    const card = cards[index];
                    // Center the card in the viewport
                    targetScroll = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
                }

                container.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });

                // Unlock after animation (approx 700ms for smooth behavior)
                scrollTimeout.current = setTimeout(() => {
                    isScrollingToMember.current = false;
                }, 700);
            }
        }
    };

    return (
        <section className="team-section" id="team">
            <div className="container">
                <div className="team-header">
                    <h2 className="section-title">Meet Our Team</h2>
                    <p className="section-subtitle">The Visionary Minds Behind MedHive's Revolutionary Healthcare Platform</p>
                </div>

                <div className="team-scroll-container" ref={scrollRef}>
                    <div className="team-row">
                        {displayMembers.map((member, index) => (
                            <div
                                key={member.id}
                                className={`team-premium-card member-${member.id}`}
                            >
                                <div className="member-image-wrapper">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="member-image"
                                    />
                                    <div className="member-social-overlay">
                                        {Object.keys(member.social).map((platform) => (
                                            <a
                                                key={platform}
                                                href={member.social[platform]}
                                                className="social-icon-btn"
                                                aria-label={`${member.name}'s ${platform}`}
                                                target='_blank'
                                                rel="noopener noreferrer"
                                            >
                                                <i className={`fab fa-${platform}`}></i>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="member-details">
                                    <span className="member-role-badge">{member.role}</span>
                                    <h3 className="member-full-name">{member.name}</h3>
                                    <div className="member-accent-line"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {isMobile ? (
                    <div className="team-pagination">
                        {displayDots.map((_, index) => (
                            <button
                                key={index}
                                className={`pagination-dot ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => scrollToMember(index)}
                                aria-label={`Go to team member ${index + 1}`}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="team-scroll-indicator-container">
                        <div className="team-scroll-indicator-track">
                            <div
                                className="team-scroll-indicator-fill"
                                style={{ width: `${scrollProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TeamSection;

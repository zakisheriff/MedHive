import React from 'react';
import './TeamSection.css';

const teamMembers = [
    {
        id: 1,
        name: 'Abdul Raheem',
        role: 'Frontend and ML',
        image: '/Team/Raheem.jpeg',
        social: {
            linkedin: '#',
            github: '#'
        }
    },
    {
        id: 2,
        name: 'Zaki Sheriff',
        role: 'Frontend and Backend',
        image: '/Team/Zaki.png',
        social: {
            linkedin: '#',
            github: '#'
        }
    },


    {
        id: 3,
        name: 'Hanaa Ajuward',
        role: 'Backend Developer',
        image: '/Team/Hanaa.jpeg',
        social: {
            linkedin: '#',
            github: '#'
        }
    },
    {
        id: 4,
        name: 'Abdul Rahman',
        role: 'Backend Developer',
        image: '/Team/Rahman.png',
        social: {
            linkedin: '#',
            github: '#'
        }
    },
    {
        id: 5,
        name: 'Kausian Senthan',
        role: 'Backend Developer',
        image: '/Team/Kausian.png',
        social: {
            linkedin: 'https://www.linkedin.com/in/kausian-senthan',
            github: 'https://github.com/Kausian'
        }
    },
    {
        id: 6,
        name: 'Afker Thowfeek',
        role: 'Database Administrator',
        bio: 'Ensuring seamless delivery and operational excellence across all regions.',
        image: '/Team/Afker.jpeg',
        social: {
            linkedin: '#',
            github: '#'
        }
    }
];

const TeamSection = () => {
    return (
        <section className="team-section" id="team">
            <div className="container">
                <h2 className="section-title">Meet Our Team</h2>

                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <div
                            key={member.id}
                            className={`glass-card team-card member-${member.id}`}
                        >
                            <div className="member-image-container">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="member-image"
                                />
                            </div>
                            <div className="member-info">
                                <h3>{member.name}</h3>
                                <span className="member-role">{member.role}</span>
                                <p className="member-bio">{member.bio}</p>

                                <div className="social-links">
                                    {Object.keys(member.social).map((platform) => (
                                        <a
                                            key={platform}
                                            href={member.social[platform]}
                                            className="social-link"
                                            aria-label={`${member.name}'s ${platform}`}
                                            target='_blank'
                                        >
                                            <i className={`fab fa-${platform}`}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;


import React from 'react';
import './TeamSection.css';

const teamMembers = [
    {
        id: 1,
        name: 'Zaki Sheriff',
        role: 'App Frontend',
        bio: 'Building The Future of Digital Health on Mobile.',
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
        bio: 'Building Responsive and Accessible Clinic Interfaces.',
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
        bio: 'Architecting Robust and Scalable Server-Side Logic.',
        image: '/Team/Hanaa.jpeg',
        social: {
            linkedin: '#',
            github: '#'
        }
    },
    {
        id: 4,
        name: 'Abdul Rahman Nazar',
        role: 'App Backend',
        bio: 'Engineering Secure and High-Performance Backend Infrastructure for Patients.',
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
        bio: 'Designing Efficient Portals for Pharmaceutical Partners.',
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
        bio: 'Managing Secure Supply Chain Data Integrations.',
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
                <div className="team-header">
                    <h2 className="section-title">Meet Our Team</h2>
                    <p className="section-subtitle">The Visionary Minds Behind MedHive's Revolutionary Healthcare Platform</p>
                </div>

                <div className="team-grid">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="team-premium-card">
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
                                <p className="member-bio">{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;

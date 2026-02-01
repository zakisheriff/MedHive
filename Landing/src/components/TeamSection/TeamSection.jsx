import React from 'react';
import './TeamSection.css';

const teamMembers = [
    {
        id: 1,
        name: 'Abdul Raheem',
        role: 'Clinic Frontend',
        image: '/Team/Raheem.jpeg',
        social: {
            linkedin: 'https://www.linkedin.com/in/abdul-raheem-aouffan',
            github: 'https://github.com/abdulraheem05'
        }
    },
    {
        id: 2,
        name: 'Zaki Sheriff',
        role: 'Patient Frontend',
        image: '/Team/Zaki.png',
        social: {
            linkedin: 'https://www.linkedin.com/in/zakisheriff',
            github: 'https://github.com/zakisheriff'
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
        role: 'Patient Backend',
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

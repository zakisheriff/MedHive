import React, { useEffect } from 'react';
import BlogCard from '../../components/BlogCard/BlogCard';
import blogTitleImg from './images/blog-title.jpg';
import blogTitle3Img from './images/blog-title3.jpeg';
import './BlogList.css';

const posts = [
    {
        title: "Why Sri Lanka's Healthcare System Desperately Needs Digital Prescriptions",
        description:
            "Handwritten prescriptions cause errors, delays, and lost records. Digital solutions can transform Sri Lanka's healthcare.",
        image: blogTitleImg,
        date: 'March 18, 2026',
        category: '',
        link: '/blog/digital-prescriptions-sri-lanka',
    },
    {
        title: '5 Reasons Private Clinics Should Switch to Digital Records in 2026',
        description:
            'Discover how MedHive helps clinics and patients move from paper-based prescriptions to a faster, safer digital workflow.',
        image: blogTitle3Img,
        date: 'March 19, 2026',
        category: '',
        link: '/blog/digital-prescriptions-sri-lanka',
    },
];

const BlogList = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className="mh-blog-list-page">
            <div className="container">
                <div className="mh-blog-list-header">
                    <span className="mh-blog-list-kicker">MedHive Journal</span>
                    <h1>Healthcare AI Insights</h1>
                    <p>
                        Product updates, clinical technology thinking, and practical ideas to modernize
                        prescription workflows in Sri Lanka.
                    </p>
                </div>

                <div className="mh-blog-list-grid" role="list" aria-label="Blog post cards">
                    {posts.map((post) => (
                        <div key={`${post.title}-${post.date}`} role="listitem">
                            <BlogCard {...post} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogList;

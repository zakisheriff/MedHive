import React, { useEffect } from 'react';
import BlogCard from '../../components/BlogCard/BlogCard';
import blogTitleImg from './images/blog-title.jpg';
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

import React from 'react';
import { Link } from 'react-router-dom';
import './BlogCard.css';

const BlogCard = ({ title, description, image, date, category, link }) => {
    const fallbackImage =
        image ||
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80';

    return (
        <Link to={link} className="mh-blog-card-link" aria-label={`Read blog post: ${title}`}>
            <article className="mh-blog-card">
                <div className="mh-blog-card-media">
                    <img src={fallbackImage} alt={title} loading="lazy" />
                    <div className="mh-blog-card-gradient" aria-hidden="true" />

                    <span className="mh-blog-card-badge mh-blog-card-date">{date}</span>
                    {category ? (
                        <span className="mh-blog-card-badge mh-blog-card-category">{category}</span>
                    ) : null}
                </div>

                <div className="mh-blog-card-content">
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <span className="mh-blog-card-readmore">
                        Read More <span aria-hidden="true">&rarr;</span>
                    </span>
                </div>
            </article>
        </Link>
    );
};

export default BlogCard;

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    title?: React.ReactNode;
    icon?: React.ElementType; // Lucide icon
    children: React.ReactNode;
    footer?: React.ReactNode;
    action?: React.ReactNode; // Top right action button or badge
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon: Icon, children, footer, action, className }) => {
    return (
        <div className={`${styles.card} ${className || ''}`}>
            {(title || Icon) && (
                <div className={styles.header}>
                    <div className={styles.title}>
                        {Icon && <Icon size={20} className="text-primary" style={{ color: 'var(--color-primary)' }} />}
                        {title}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={styles.body}>
                {children}
            </div>
            {footer && <div className={styles.footer}>{footer}</div>}
        </div>
    );
};

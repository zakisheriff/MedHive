import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    icon?: React.ElementType;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', icon: Icon }) => {
    return (
        <span className={`${styles.badge} ${styles[variant]}`}>
            {Icon && <Icon size={12} />}
            {children}
        </span>
    );
};

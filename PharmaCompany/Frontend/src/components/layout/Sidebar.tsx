import React from 'react';
import {
    LayoutDashboard,
    Activity,
    CloudRain,
    Factory,
    Clock,
    Recycle,
    FileText
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
    const menuItems = [
        { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'disease', label: 'Disease Intelligence', icon: Activity },
        { id: 'climate', label: 'Climate Forecasting', icon: CloudRain },
        { id: 'manufacturing', label: 'Manufacturing & Dist.', icon: Factory },
        { id: 'expiry', label: 'Expiry & Overstock', icon: Clock },
        { id: 'waste', label: 'Waste & Compliance', icon: Recycle },
        { id: 'reports', label: 'Reports', icon: FileText },
    ];

    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                        <a
                            key={item.id}
                            href="#"
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate(item.id);
                            }}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </a>
                    );
                })}
            </nav>
        </aside>
    );
};

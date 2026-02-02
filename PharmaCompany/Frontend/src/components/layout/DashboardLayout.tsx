import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [activePage, setActivePage] = useState('overview');

    const handleNavigate = (page: string) => {
        setActivePage(page);
        // In a real app, this would update the Route.
        // For this prototype, we might just expose activePage or manage rendering children here.
        // But typically instructions say "Assemble Pages -> Update main application".
        // I will expose the active page or let the parent control it.
        // However, for simplicity here, I'll pass children, but the children usually depends on activePage.
        // I'll emit the even layout navigation if needed, but for now I guess App.tsx manages state?
        // Let's assume App.tsx manages the page state and passes it down.
        // To fix: I should lift state up.
    };

    // Actually, let's make this layout accept activePage and onNavigate props so App.tsx can control it.
    // But wait, the standard usually is `children`.
    // I will just render children.
    // The Sidebar needs to know activePage.
    // I will make `DashboardLayout` accept `activePage` and `onNavigate`.

    return (
        <div className={styles.layout}>
            <Navbar />
            <div className={styles.mainWrapper}>
                <Sidebar activePage={activePage} onNavigate={handleNavigate} />
                <main className={styles.content}>
                    <div className="fade-in">
                        {/* We will render children. But we need to communicate activePage to the parent? 
                 In a non-routing prototype, the page content is often inside. 
                 Let's modify the signature to support the "Single Page" flow since we don't have react-router setup in the plan expressly (it said "Ensure proper routing" but didn't mandate react-router).
                 I'll probably add state in App.tsx.
              */}
                        {/* Actually, I will lift the state to props in the next step. 
                 For now, let's assume local state and that I will render the specific views based on local state here if children is not provided?
                 No, `children` is cleaner. I will modify App.tsx to pass `activePage` to Layout?
                 Let's stick to standard `children` layout and `Sidebar` being controlled by props.
              */}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Re-defining for controlled usage
export const DashboardLayoutControlled: React.FC<{
    children: React.ReactNode;
    activePage: string;
    onNavigate: (page: string) => void;
}> = ({ children, activePage, onNavigate }) => {
    return (
        <div className={styles.layout}>
            <Navbar />
            <div className={styles.mainWrapper}>
                <Sidebar activePage={activePage} onNavigate={onNavigate} />
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};

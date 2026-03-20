import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUser, UserData } from '../utils/userStore';
import { API_ENDPOINTS } from '../constants/config';
import * as Haptics from 'expo-haptics';

interface AccessContextType {
    activeOtp: string | null;
    userData: UserData | null;
    refreshOtp: () => Promise<void>;
    isOtpDismissed: boolean;
    dismissOtp: () => void;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeOtp, setActiveOtp] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isOtpDismissed, setIsOtpDismissed] = useState(false);

    const loadUser = useCallback(async () => {
        const user = await getUser();
        setUserData(user);
    }, []);

    const fetchOtp = useCallback(async () => {
        let currentMedId = userData?.med_id;
        
        // If we don't have med_id, try to load it from storage
        if (!currentMedId) {
            const user = await getUser();
            if (user?.med_id) {
                setUserData(user);
                currentMedId = user.med_id;
            } else {
                return; // Still no user found
            }
        }

        try {
            const response = await fetch(API_ENDPOINTS.GET_OTP(String(currentMedId)));
            if (response.ok) {
                const data = await response.json();
                
                setActiveOtp(prev => {
                    if (data.otp !== prev) {
                        setIsOtpDismissed(false);
                        if (!prev && data.otp) {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        }
                        return data.otp;
                    }
                    return prev;
                });
            } else {
                setActiveOtp(null);
                setIsOtpDismissed(false);
            }
        } catch (error: any) {
            // Silently handle errors to avoid UI noise in background polling
            console.log("Background OTP fetch silent error:", error?.message);
        }
    }, [userData?.med_id]);

    const dismissOtp = () => setIsOtpDismissed(true);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    useEffect(() => {
        // Run immediately
        fetchOtp();
        
        // Start a truly stable interval
        const interval = setInterval(() => {
            fetchOtp();
        }, 5000);
        
        return () => clearInterval(interval);
    }, [fetchOtp]);

    return (
        <AccessContext.Provider value={{ activeOtp, userData, refreshOtp: fetchOtp, isOtpDismissed, dismissOtp }}>
            {children}
        </AccessContext.Provider>
    );
};

export const useAccess = () => {
    const context = useContext(AccessContext);
    if (!context) {
        throw new Error('useAccess must be used within an AccessProvider');
    }
    return context;
};

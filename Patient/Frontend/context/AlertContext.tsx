import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';

interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface AlertOptions {
    title: string;
    message?: string;
    buttons?: AlertButton[];
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
    alertState: {
        visible: boolean;
        options: AlertOptions | null;
    };
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alertState, setAlertState] = useState<{
        visible: boolean;
        options: AlertOptions | null;
    }>({
        visible: false,
        options: null,
    });

    const hideAlert = useCallback(() => {
        setAlertState(prev => ({ ...prev, visible: false }));
    }, []);

    const showAlert = useCallback((options: AlertOptions) => {
        if (Platform.OS === 'ios') {
            Alert.alert(
                options.title,
                options.message,
                options.buttons?.map(btn => ({
                    text: btn.text,
                    onPress: () => {
                        btn.onPress?.();
                    },
                    style: btn.style,
                }))
            );
        } else {
            setAlertState({
                visible: true,
                options,
            });
        }
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert, alertState }}>
            {children}
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
}

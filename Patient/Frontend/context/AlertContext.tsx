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
    forceCustom?: boolean;
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
        // Use native alert() for web ONLY if there's 1 or fewer buttons AND it's not forced to custom
        if (Platform.OS === 'web' && (!options.buttons || options.buttons.length <= 1) && !options.forceCustom) {
            const message = options.message ? `${options.title}\n\n${options.message}` : options.title;
            alert(message);
            if (options.buttons && options.buttons.length === 1) {
                options.buttons[0].onPress?.();
            }
        } else if (Platform.OS === 'ios') {
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
            // For Android OR Web/iOS with multiple buttons OR forced custom
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

"use client"

import { NOTIFICATIONS } from "@/utils/constant";
import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode } from "react";
import CheckIcon from "../Icons/CheckIcon";
import ErrorIcon from "../Icons/ErrorIcon";
import WarningIcon from "../Icons/WarningIcon";
import { Toast, ToastDescription, ToastProvider, ToastViewport } from "./Toast";
import colors from "@/colors";

const NotificationContext = React.createContext<{
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
}>({
    success: () => { },
    error: () => { },
    warning: () => { }
});
interface INotificationProps {
    position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'topCenter';
    children: ReactNode;
}

interface Notification {
    type: NOTIFICATIONS;
    message: string;
}

const prefixIcon = (type: NOTIFICATIONS) => {
    if (type === NOTIFICATIONS.SUCCESS) return <CheckIcon color={colors.typo.primary}/>;
    if (type === NOTIFICATIONS.ERROR) return <ErrorIcon />;
    if (type === NOTIFICATIONS.WARNING) return <WarningIcon />;

};

const Notifications = ({ position = 'topCenter', children }: INotificationProps) => {
    const [notifications, setNotifications] = React.useState(new Map<string, Notification>());
    const isPositionedTop = position === "topLeft" || position === "topRight" || position === 'topCenter';

    const handleAddToast = React.useCallback((toast: Notification) => {
        setNotifications((prev) => {
            const newMap = new Map(prev);
            newMap.set(String(Date.now()), { ...toast });
            return newMap;
        });
    }, []);

    const handleRemoveToast = React.useCallback((key: string) => {
        setNotifications((prev) => {
            const newMap = new Map(prev);
            newMap.delete(key);
            return newMap;
        });
    }, []);

    const handleDispatchSuccess = React.useCallback(
        (message: string) => handleAddToast({ message, type: NOTIFICATIONS.SUCCESS }),
        [handleAddToast]
    );

    const handleDispatchError = React.useCallback(
        (message: string) => handleAddToast({ message, type: NOTIFICATIONS.ERROR }),
        [handleAddToast]
    );

    const handleDispatchWarning = React.useCallback(
        (message: string) => handleAddToast({ message, type: NOTIFICATIONS.WARNING }),
        [handleAddToast]
    );

    return (
        <NotificationContext.Provider
            value={React.useMemo(
                () => ({
                    success: handleDispatchSuccess,
                    error: handleDispatchError,
                    warning: handleDispatchWarning
                }),
                [handleDispatchSuccess, handleDispatchError, handleDispatchWarning]
            )}
        >
            <ToastProvider>
                {children}
                <AnimatePresence>
                    {Array.from(notifications).map(([key, notification]) => {
                        const { type, message } = notification;
                        return (
                            <Toast
                                variant={notification.type}
                                onOpenChange={(open) => {
                                    if (!open) handleRemoveToast(key);
                                }}
                                key={key}
                                asChild
                                forceMount
                                className="max-w-[280px]"
                            >
                                <motion.li
                                    initial={{
                                        y: isPositionedTop ? -100 : 100,
                                        scale: 0.6,
                                        opacity: 0
                                    }}
                                    animate={{
                                        y: 0,
                                        scale: 1,
                                        opacity: 1,
                                        transition: { duration: 0.3 }
                                    }}
                                    exit={{
                                        scale: 0.9,
                                        opacity: 0,
                                        transition: { duration: 0.15 }
                                    }}
                                    layout
                                >
                                    <div
                                        className="flex gap-2 items-center justify-start px-2"
                                    >
                                        <div className="flex size-5" aria-hidden>
                                            {
                                                prefixIcon(type)
                                            }
                                        </div>
                                        {/* <ToastTitle>{message}</ToastTitle> */}
                                        <ToastDescription className="whitespace-pre-wrap">
                                            {message}
                                        </ToastDescription>

                                    </div>
                                </motion.li>
                            </Toast>
                        );
                    })}
                </AnimatePresence>

                <ToastViewport position={position} />
            </ToastProvider>
        </NotificationContext.Provider>
    );
};

function useNotification() {
    const context = React.useContext(NotificationContext);
    if (context) return context;
    throw new Error("useNotification must be used within Notifications");
}

/* -----------------------------------------------------------------------------------------------*/

export { Notifications, useNotification };

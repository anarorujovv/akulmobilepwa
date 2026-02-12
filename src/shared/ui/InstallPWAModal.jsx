import React, { useEffect, useState } from 'react';
import { Modal, Button, AutoCenter } from 'antd-mobile';
import useTheme from '../theme/useTheme';

const InstallPWAModal = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);

            // Only show if not dismissed permanently
            const localDismiss = localStorage.getItem('pwa_install_dismissed');
            if (localDismiss !== 'true') {
                setVisible(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            return;
        }
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setVisible(false);
    };

    const handleDontShowAgain = () => {
        localStorage.setItem('pwa_install_dismissed', 'true');
        setVisible(false);
    };

    const handleClose = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            onClose={handleClose}
            showCloseButton
            closeOnMaskClick
            content={
                <AutoCenter>
                    <div style={{ padding: 10, textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 'bold' }}>Tətbiqi Yükləyin</div>
                        <div style={{ marginTop: 10, color: theme.grey }}>
                            Daha sürətli və rahat istifadə üçün tətbiqi telefonunuza yükləyin.
                        </div>

                        <Button
                            block
                            color='primary'
                            size='large'
                            onClick={handleInstall}
                            style={{
                                marginTop: 20,
                                fontWeight: 600
                            }}
                        >
                            Yüklə
                        </Button>

                        <Button
                            block
                            fill='outline'
                            size='large'
                            onClick={handleDontShowAgain}
                            style={{
                                marginTop: 10,
                                fontWeight: 500
                            }}
                        >
                            Birdaha göstərmə
                        </Button>
                    </div>
                </AutoCenter>
            }
        />
    );
};

export default InstallPWAModal;

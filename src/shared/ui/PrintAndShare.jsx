import React from 'react';
import useTheme from '../theme/useTheme';
import { IoPrint, IoShareSocial } from 'react-icons/io5';
import ErrorMessage from './RepllyMessage/ErrorMessage';

const PrintAndShare = ({ navigation, route }) => {

    const { html } = route.params;
    let theme = useTheme();

    const styles = {
        container: {
            width: '100%',
            height: '100%',
            position: 'relative',
        },
        button: {
            position: 'fixed',
            bottom: 40,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.primary,
            boxShadow: `0 4px 10px ${theme.primary}66`,
            cursor: 'pointer',
            border: 'none',
            zIndex: 100
        },
        buttonPrint: {
            position: 'fixed',
            bottom: 40,
            left: 20,
            width: 60,
            height: 60,
            borderRadius: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.primary,
            boxShadow: `0 4px 10px ${theme.primary}66`,
            cursor: 'pointer',
            border: 'none',
            zIndex: 100
        },
        iframeContainer: {
            width: '100%',
            height: '100vh',
            overflow: 'hidden'
        }
    };

    const getShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Sənəd',
                    text: 'Sənədi paylaşıram',
                    url: window.location.href, // Veya uygun bir URL
                });
            } else {
                ErrorMessage("Tarayıcınız paylaşımı desteklemiyor.");
            }
        } catch (err) {
            ErrorMessage(err);
        }
    }

    const getPrint = () => {
        try {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        } catch (err) {
            ErrorMessage(err);
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.iframeContainer} dangerouslySetInnerHTML={{ __html: html }} />

            <button onClick={getShare} style={styles.button}>
                <IoShareSocial size={25} color={'white'} />
            </button>
            <button onClick={getPrint} style={styles.buttonPrint}>
                <IoPrint size={25} color={'white'} />
            </button>

        </div>
    );
};

export default PrintAndShare;

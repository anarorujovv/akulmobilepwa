import React from 'react';
import { IoInformationCircle } from 'react-icons/io5';
import { Card, Input } from 'antd-mobile';
import useTheme from '../theme/useTheme';
import Selection from './Selection';

const DestinationCard = ({ changeInput, changeSelection, document, setDocument, isAllDisabled }) => {

    const theme = useTheme();

    if (!document) return null;

    const styles = {
        header: {
            width: '100%',
            padding: 15,
            gap: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            boxSizing: 'border-box'
        },
        text: {
            color: theme.grey
        },
        content: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        spacer: {
            marginTop: 10
        }
    };

    return (
        <>
            <Card
                title={
                    <div style={styles.header}>
                        <IoInformationCircle size={23} color={theme.grey} />
                        <span style={styles.text}>Təyinat</span>
                    </div>
                }
            >
                <div style={styles.content}>
                    <Selection
                        disabled={isAllDisabled}
                        apiName={'owners/get.php'}
                        apiBody={{}}
                        change={(e) => {
                            changeInput('OwnerId', e.Id);
                        }}
                        value={document.OwnerId}
                        title={'Cavabdeh'}
                    />
                    <div style={styles.spacer} />
                    <Selection
                        disabled={isAllDisabled}
                        apiName={'departments/get.php'}
                        apiBody={{}}
                        change={(e) => {
                            changeInput('DepartmentId', e.Id)
                        }}
                        value={document.DepartmentId}
                        title={'Şöbə'}
                    />
                    {
                        document.Description != null &&
                        <>
                            <div style={styles.spacer} />
                            <Input
                                placeholder='Açıqlama'
                                value={document.Description}
                                onChange={val => {
                                    changeInput('Description', val);
                                }}
                                disabled={isAllDisabled}
                            />
                        </>
                    }
                </div>

            </Card>
        </>
    );
};

export default DestinationCard;


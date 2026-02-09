import React from 'react';
import { IoInformationCircle } from 'react-icons/io5';
import ManageCard from './ManageCard';
import useTheme from '../theme/useTheme';
import Input from './Input';
import Selection from './Selection';

const DestinationCard = ({ changeInput, changeSelection, document, setDocument, isAllDisabled }) => {

    const theme = useTheme();

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
            <ManageCard>
                <div style={styles.header}>
                    <IoInformationCircle size={23} color={theme.grey} />
                    <span style={styles.text}>Təyinat</span>
                </div>

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
                                value={document.Description}
                                disabled={isAllDisabled}
                                isRequired={false}
                                onChange={(e) => {
                                    changeInput('Description', e);
                                }}
                                placeholder={'Açıqlama'}
                                type={'string'}
                                width={'70%'}
                            />
                        </>
                    }
                </div>

            </ManageCard>
        </>
    );
};

export default DestinationCard;


import React, { useState } from 'react';
import ManageCard from './../../../shared/ui/ManageCard';
import Input from '../../../shared/ui/Input';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';

const MainCard = ({ document }) => {

    let theme = useTheme();

    const [momentModal, setMomentModal] = useState(false);


    return (
        <ManageCard>
            <div style={{
                width: '100%',
                padding: 15,
                boxSizing: 'border-box'
            }}>
                <span style={{
                    fontSize: 20,
                    color: theme.primary,
                    fontWeight: 'bold',
                    display: 'block'
                }}>Satış</span>
            </div>
            <div style={{
                marginTop: 20,
                gap: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingBottom: 20
            }}>
                <Input
                    disabled={true}
                    placeholder={'Ad'}
                    type={'string'}
                    width={'70%'}
                    value={document.Name}
                />

                <SelectionDate
                    disabled={true}
                    change={() => { }}
                    document={document}
                    setDocument={() => { }}
                    modalVisible={momentModal}
                    setModalVisible={setMomentModal}
                />
            </div>

        </ManageCard>
    )
}

export default MainCard;

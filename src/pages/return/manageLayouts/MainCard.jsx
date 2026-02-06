import { Text, View } from 'react-native'
import React, { useState } from 'react'
import ManageCard from './../../../shared/ui/ManageCard';
import Input from '../../../shared/ui/Input';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';
const MainCard = ({ document }) => {

    let theme = useTheme();

    const [momentModal, setMomentModal] = useState(false);


    return (
        <ManageCard>
            <View style={{
                width: '100%',
                padding: 15,
            }}>
                <Text style={{
                    fontSize: 20,
                    color: theme.primary
                }}>Satış</Text>
            </View>
            <View style={{
                marginTop: 20,
                gap: 20,
                alignItems: 'center'
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
                    change={() => {}}
                    document={document}
                    setDocument={() => {}}
                    modalVisible={momentModal}
                    setModalVisible={setMomentModal}
                />
            </View>

        </ManageCard>
    )
}

export default MainCard

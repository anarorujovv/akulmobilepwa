import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import useTheme from '../theme/useTheme';

const MySelection = ({ label, list, valueName, labelName, onValueChange, value, width }) => {

    let theme = useTheme();

    return (
        <View style={{
            width: width
        }}>
            <Text style={{
                fontSize: 14,
                color: theme.input.grey
            }}>{label}</Text>
            <View style={{
                height: 30,
                borderBottomWidth: 1,
                borderColor: theme.input.grey,
                justifyContent: 'center',
                overflow: 'hidden'
            }}>

                <Picker
                    onValueChange={onValueChange}
                    placeholder='asdasdas' style={{
                        marginLeft: -8,
                        marginRight: -20,
                    }}
                    selectedValue={value} >
                    {
                        list != null ?

                            list[0] ?
                                list.map(item => <Picker.Item color={theme.black} key={item[valueName]} label={item[labelName]} value={item[valueName]} />)
                                :
                                ""
                            :
                            ""
                    }
                </Picker>

            </View>
        </View>
    )
}

export default MySelection

const styles = StyleSheet.create({})
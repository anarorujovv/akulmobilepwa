import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from '../theme/useTheme';
import IconButton from './IconButton';


const ListPagesHeader = ({
    header,
    isSearch,
    processScannerClick,
    filterSearchKey,
    filter,
    setFilter,
    isFilter,
    processFilterClick,
    searchM,
}) => {

    const theme = useTheme();
    const [searchMode, setSearchMode] = useState(false);
    const inputRef = useRef(null);


    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.primary,
            width: '100%',
            height: 55,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingRight: 10,
            alignItems: 'center'
        },
        right: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: 150
        },
        text: {
            fontSize: 18,
            color: theme.stable.white
        },
        pressContainer: {
            borderRadius: 40,
            overflow: 'hidden'
        },
        press: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 40
        },

        right_active: {
            width: '10%'
        },
        left: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '80%'
        },
        input: {
            color: theme.stable.white,
            fontSize: 18
        }
    })

    useEffect(() => {
        if (searchMode) {
            inputRef.current.focus();
        }
    }, [searchMode]);

    useEffect(() => {
        if (searchM) {
            setSearchMode(true)
        }
    }, [searchM])

    useEffect(() => {
        if (filter && filter[filterSearchKey] && filter[filterSearchKey].length > 0) {
            setSearchMode(true);
        }
    }, [filter, filterSearchKey]);

    return (
        <View style={styles.container}>
            {searchMode ? (
                <>
                    <View style={styles.left}>

                        <IconButton size={40} onPress={() => {
                            setSearchMode(false);
                            let myFilter = { ...filter };
                            myFilter[filterSearchKey] = '';
                            myFilter.pg = 1;
                            setFilter(myFilter);
                        }}>
                            <Ionicons name='arrow-back' size={20} color={theme.stable.white} />
                        </IconButton>

                        <TextInput
                            value={filter[filterSearchKey]}
                            onChangeText={(e) => {
                                let myFilter = { ...filter };
                                myFilter[filterSearchKey] = e;
                                myFilter.pg = 1;
                                setFilter(myFilter);
                            }}
                            ref={inputRef}
                            placeholderTextColor={theme.whiteGrey}
                            cursorColor={theme.stable.white}
                            placeholder='Axtarış...'
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.right_active}>
                        {
                            isFilter &&
                            <IconButton size={40}>
                                <Ionicons name='filter' size={20} color={theme.stable.white} />
                            </IconButton>
                        }
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.text}>{header}</Text>

                    <View style={styles.right}>
                        {isSearch && (
                            <IconButton onPress={() => setSearchMode(true)} size={40}>
                                <Ionicons name='search' size={20} color={theme.stable.white} />
                            </IconButton>
                        )}

                        {isFilter && (
                            <IconButton size={40} onPress={() => {
                                processFilterClick();
                            }}>
                                <Ionicons name='filter' size={20} color={theme.stable.white} />
                            </IconButton>
                        )}

                        {processScannerClick && (
                            <IconButton onPress={processScannerClick} size={40}>
                                <MaterialCommunityIcon name='line-scan' size={20} color={theme.stable.white} />
                            </IconButton>
                        )}
                    </View>
                </>
            )}

        </View>
    );
}

export default ListPagesHeader;

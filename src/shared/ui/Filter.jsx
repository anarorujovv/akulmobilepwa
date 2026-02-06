import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import useTheme from '../theme/useTheme'
import Button from './Button';
import Input from './Input';
import Selection from './Selection';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateRangePicker from './DateRangePicker';
import CustomSelection from './CustomSelection';

const Filter = ({ route, navigation }) => {

    /**
    * Filter sistəmin documentasiyası
    * 
    * @param {Array} searchParams - Hansı parametrlərə görə filter olunacaq burdan bildirilir.
    * @param {Array} sortList - Nələr görə sort olunacaq burdan bildirilir.
    * { id,label,value } şəklində
    * @param {Object} customFields - İstənilən parametr olmadığı zaman özü menual olaraq əlavə edir.
    * { title,name,type,api } 
    */


    let {
        filter,
        setFilter,
        searchParams,
        sortList,
        customFields,
    } = route.params;


    const [fields, setFields] = useState([])
    const [tempFilter, setTempFilter] = useState(filter ? filter : {});

    const [searchLoading, setSearchLoading] = useState(false);

    const [params, setParams] = useState({
        documentName: {
            title: '№',
            name: "docNumber",
            type: 'string'
        },
        customers: {
            title: 'Təchizatçı',
            api: 'customers',
            name: "customerName",
            type: 'select',
            searchApi: 'customers/getfast.php',
            searchKey: 'fast'
        },
        stocks: {
            title: "Anbar",
            api: 'stocks',
            name: "stockName",
            type: 'select'
        },
        owners: {
            title: "Cavabdeh",
            api: 'owners',
            name: "ownerName",
            type: "select"
        },
        departments: {
            title: "Satış şöbəsi",
            api: 'departments',
            name: "departmentId",
            type: 'select'
        },
        customerGroups: {
            title: "Müştəri qrupu",
            api: 'customergroups',
            name: "gp",
            type: 'select'
        },
        product: {
            title: "Məhsul",
            api: 'products',
            name: "productId",
            type: 'select',
            searchApi: 'products/getfast.php',
            searchKey: 'fast'
        },
        unit: {
            title: 'Əsas vahid',
            api: 'units',
            name: "unit",
            type: 'select',
        },
        artCode: {
            title: 'Artkod',
            name: 'ac',
            type: 'string'
        },
        barCode: {
            title: "Barkod",
            name: "bc",
            type: 'number'
        },
        productName: {
            title: "Məhsulun adı",
            name: 'productname',
            type: 'string'
        },
        spendItems: {
            title: 'Xərc-Maddəsi',
            name: 'spendItem',
            type: 'select',
            api: 'spenditems'
        },
        cashes: {
            title: "Hesab",
            name: "cashid",
            api: 'cashes',
            type: 'select'
        },
        salePoint: {
            title: 'Satış nöqtəsi',
            name: 'slpnt',
            api: 'salepoints',
            type: 'select'
        },
        ...customFields
    })

    // Documentation

    // Field format is array

    // Field item keys = title,name,type If type is an select then api should be sent = api

    // let obj = {
    //     title: "This title",
    //     name: "This name",
    //     type: "select",
    //     api: "If type is an select then api should be sent",
    // }


    let theme = useTheme();

    const [sortOptions, setSortOptions] = useState([]);

    const changeTempFiltersState = (name, value) => {
        setTempFilter(rel => ({ ...rel, [name]: value }));
    }

    const handleFastSearch = () => {
        let myFilter = { ...tempFilter };
        setFilter(myFilter);
        navigation.goBack();
    }

    const handleFilterReset = () => {
        let obj = { ...tempFilter };
        searchParams.forEach((element, index) => {
            delete obj[params[element].name];
        })

        setFilter(obj);
        navigation.goBack();
    }

    const renderItem = (item, index) => {
        switch (item.type) {
            case "string":
                return (
                    <Input
                        value={tempFilter[item.name] || ""}
                        onChange={(txt) => {
                            changeTempFiltersState(item.name, txt)
                        }}
                        placeholder={item.title}
                        type={item.type}
                        width={'70%'}
                    />
                )
            case "number":
                return (
                    <Input
                        value={tempFilter[item.name] || ""}
                        onChange={(txt) => {
                            changeTempFiltersState(item.name, txt)
                        }}
                        placeholder={item.title}
                        type={item.type}
                        width={'70%'}
                    />
                )
            case "select":
                return (
                    item.customSelection ?
                        <CustomSelection
                            onChange={(e) => changeTempFiltersState(item.name, e)}
                            disabled={false}
                            options={item.options}
                            placeholder={item.title}
                            title={item.title}
                            value={tempFilter[item.name] || ""}
                        />
                        :
                        <>
                            <Selection
                                apiBody={{}}
                                searchApi={item.searchApi || undefined}
                                searchKey={item.searchKey || undefined}
                                apiName={`${item.api}/get.php`}
                                change={(e) => {
                                    changeTempFiltersState(item.name, e.Id);
                                }}
                                value={tempFilter[item.name] || ""}
                                title={item.title}
                            />
                        </>
                )
        }
    }

    const getProsess = () => {

        if (searchParams) {
            let tempFields = [];
            searchParams.forEach(element => {
                tempFields.push(params[element]);
            });

            if (sortList) {
                let tempSortOptions = sortList.map(item => ({
                    ...item,
                    isSelected: tempFilter.sr === item.value
                }));
                setSortOptions(tempSortOptions);
            }

            setFields(tempFields);
        }
    };

    const handleSort = (selectedOption) => {
        const updatedOptions = sortOptions.map(option => ({
            ...option,
            isSelected: option.value === selectedOption.value
        }));
        setSortOptions(updatedOptions);
        changeTempFiltersState('sr', selectedOption.value);
    };

    useEffect(() => {
        getProsess();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.whiteGrey,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        card: {
            backgroundColor: theme.bg,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: theme.text,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.whiteGrey,
        },
        cardTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.text,
        },
        cardContent: {
            padding: 16,
            gap: 12,
            alignItems: 'center'
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        clearButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
        },
        clearText: {
            color: theme.primary,
            marginLeft: 4,
            fontSize: 14,
        },
        sortOptionContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 16,
        },
        radioOuter: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        radioInner: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: theme.primary,
        },
        sortLabel: {
            color: 'black',
            fontSize: 14,
            flex: 1,
        },
    });

    const SortOption = ({ option, isSelected, onSelect }) => (
        <Pressable
            onPress={onSelect}
            style={({ pressed }) => [
                styles.sortOptionContainer,
                pressed && { opacity: 0.7, backgroundColor: theme.whiteGrey }
            ]}
        >
            <View style={styles.radioOuter}>
                {isSelected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.sortLabel}>{option.label}</Text>
        </Pressable>
    );

    return (
        <ScrollView style={styles.container}>
            {fields[0] ? (
                <>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Filtrlər</Text>
                        </View>
                        <View style={styles.cardContent}>
                            {fields.map((element, index) => (
                                <View style={{ alignItems: 'center' }} key={index}>
                                    {renderItem(element, index)}
                                </View>
                            ))}
                            <View style={{ alignItems: 'center' }}>
                                <DateRangePicker
                                    filter={tempFilter}
                                    setFilter={setTempFilter}
                                    width={'70%'}
                                />
                            </View>
                        </View>
                    </View>

                    {sortOptions.length > 0 && (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Sıralama</Text>
                            </View>
                            <View>
                                {sortOptions.map((option, index) => (
                                    <SortOption
                                        key={index}
                                        option={option}
                                        isSelected={option.isSelected}
                                        onSelect={() => handleSort(option)}
                                    />
                                ))}
                            </View>
                        </View>
                    )}
                    <View style={styles.card}>
                        <View style={styles.buttonContainer}>

                            <Pressable
                                style={styles.clearButton}
                                onPress={handleFilterReset}
                            >
                                <MaterialIcons name="clear" size={18} color={theme.primary} />
                                <Text style={styles.clearText}>Təmizlə</Text>
                            </Pressable>

                            <Button
                                onClick={handleFastSearch}
                                isLoading={searchLoading}
                                width="48%"
                            >
                                Axtar
                            </Button>


                        </View>
                    </View>
                </>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                    <ActivityIndicator size={30} color={theme.primary} />
                </View>
            )}
        </ScrollView>
    );
};

export default Filter;

const styles = StyleSheet.create({})
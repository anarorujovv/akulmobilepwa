import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdClear } from 'react-icons/md';
import useTheme from '../theme/useTheme';
import Button from './Button';
import Input from './Input';
import Selection from './Selection';
import DateRangePicker from './DateRangePicker';
import CustomSelection from './CustomSelection';

const Filter = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Fallback if location.state is undefined
    const {
        filter = {},
        setFilter: parentSetFilter, // This won't work across routes usually, we might need a context or callback in state
        searchParams,
        sortList,
        customFields,
    } = location.state || {};

    const [fields, setFields] = useState([]);
    const [tempFilter, setTempFilter] = useState(filter);
    const [searchLoading, setSearchLoading] = useState(false);
    const [sortOptions, setSortOptions] = useState([]);

    const theme = useTheme();

    const [params, setParams] = useState({
        documentName: { title: '№', name: "docNumber", type: 'string' },
        customers: { title: 'Təchizatçı', api: 'customers', name: "customerName", type: 'select', searchApi: 'customers/getfast.php', searchKey: 'fast' },
        stocks: { title: "Anbar", api: 'stocks', name: "stockName", type: 'select' },
        owners: { title: "Cavabdeh", api: 'owners', name: "ownerName", type: "select" },
        departments: { title: "Satış şöbəsi", api: 'departments', name: "departmentId", type: 'select' },
        customerGroups: { title: "Müştəri qrupu", api: 'customergroups', name: "gp", type: 'select' },
        product: { title: "Məhsul", api: 'products', name: "productId", type: 'select', searchApi: 'products/getfast.php', searchKey: 'fast' },
        unit: { title: 'Əsas vahid', api: 'units', name: "unit", type: 'select' },
        artCode: { title: 'Artkod', name: 'ac', type: 'string' },
        barCode: { title: "Barkod", name: "bc", type: 'number' },
        productName: { title: "Məhsulun adı", name: 'productname', type: 'string' },
        spendItems: { title: 'Xərc-Maddəsi', name: 'spendItem', type: 'select', api: 'spenditems' },
        cashes: { title: "Hesab", name: "cashid", api: 'cashes', type: 'select' },
        salePoint: { title: 'Satış nöqtəsi', name: 'slpnt', api: 'salepoints', type: 'select' },
        ...customFields
    });

    const changeTempFiltersState = (name, value) => {
        setTempFilter(rel => ({ ...rel, [name]: value }));
    };

    const handleFastSearch = () => {
        // Since we can't directly call setFilter from previous page, 
        // we might need to navigate back with state or use a context.
        // For now, assuming we navigate back and the previous page checks location state on focus
        navigate(-1, { state: { appliedFilter: tempFilter } });
    };

    const handleFilterReset = () => {
        let obj = { ...tempFilter };
        if (searchParams) {
            searchParams.forEach((element) => {
                if (params[element]) delete obj[params[element].name];
            });
        }
        setTempFilter(obj);
        // navigate(-1, { state: { appliedFilter: obj } }); // Optional: auto apply on reset
    };

    const renderItem = (item, index) => {
        if (!item) return null;
        switch (item.type) {
            case "string":
            case "number":
                return (
                    <Input
                        value={tempFilter[item.name] || ""}
                        onChange={(val) => changeTempFiltersState(item.name, val)}
                        placeholder={item.title}
                        type={item.type === 'number' ? 'number' : 'text'}
                        width={'70%'}
                    />
                );
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
                        <Selection
                            apiBody={{}}
                            searchApi={item.searchApi || undefined}
                            searchKey={item.searchKey || undefined}
                            apiName={`${item.api}/get.php`}
                            change={(e) => changeTempFiltersState(item.name, e.Id)}
                            value={tempFilter[item.name] || ""}
                            title={item.title}
                        />
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        if (searchParams) {
            let tempFields = [];
            searchParams.forEach(element => {
                if (params[element]) tempFields.push(params[element]);
            });

            if (sortList) {
                let tempSortOptions = sortList.map(item => ({
                    ...item,
                    isSelected: tempFilter?.sr === item.value
                }));
                setSortOptions(tempSortOptions);
            }
            setFields(tempFields);
        }
    }, [searchParams]);

    const handleSort = (selectedOption) => {
        const updatedOptions = sortOptions.map(option => ({
            ...option,
            isSelected: option.value === selectedOption.value
        }));
        setSortOptions(updatedOptions);
        changeTempFiltersState('sr', selectedOption.value);
    };

    const styles = {
        container: {
            height: '100vh',
            overflowY: 'auto',
            backgroundColor: theme.whiteGrey,
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
        },
        card: {
            backgroundColor: theme.bg,
            borderRadius: 12,
            marginBottom: 16,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            paddingBottom: 16
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: `1px solid ${theme.whiteGrey}`,
            marginBottom: 10
        },
        cardTitle: {
            fontSize: 16,
            fontWeight: 600,
            color: theme.text,
        },
        cardContent: {
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'center'
        },
        buttonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
        },
        clearButton: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            cursor: 'pointer',
            border: 'none',
            background: 'none'
        },
        sortOption: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '10px 16px',
            cursor: 'pointer'
        },
        radioOuter: {
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: `2px solid ${theme.primary}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        radioInner: {
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: theme.primary,
        }
    };

    if (!fields[0]) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner" style={{ borderTopColor: theme.primary }}></div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <span style={styles.cardTitle}>Filtrlər</span>
                </div>
                <div style={styles.cardContent}>
                    {fields.map((element, index) => (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }} key={index}>
                            {renderItem(element, index)}
                        </div>
                    ))}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <DateRangePicker
                            filter={tempFilter}
                            setFilter={setTempFilter}
                            width={'70%'}
                        />
                    </div>
                </div>
            </div>

            {sortOptions.length > 0 && (
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <span style={styles.cardTitle}>Sıralama</span>
                    </div>
                    <div>
                        {sortOptions.map((option, index) => (
                            <div
                                key={index}
                                style={styles.sortOption}
                                onClick={() => handleSort(option)}
                            >
                                <div style={styles.radioOuter}>
                                    {option.isSelected && <div style={styles.radioInner} />}
                                </div>
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={styles.card}>
                <div style={styles.buttonContainer}>
                    <button
                        style={styles.clearButton}
                        onClick={handleFilterReset}
                    >
                        <MdClear size={18} color={theme.primary} />
                        <span style={{ color: theme.primary, marginLeft: 4, fontSize: 14 }}>Təmizlə</span>
                    </button>

                    <Button
                        onClick={handleFastSearch}
                        isLoading={searchLoading}
                        width="48%"
                    >
                        Axtar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Filter;
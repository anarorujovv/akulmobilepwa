import React, { useEffect, useState, useMemo } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Radio,
    Space,
    SpinLoading,
    DatePicker
} from 'antd-mobile';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import Selection from './Selection';
import CustomSelection from './CustomSelection';
import moment from 'moment';

const Filter = ({
    filter = {},
    searchParams = [],
    sortList = [],
    customFields = {},
    onApply,
    onClose
}) => {
    const [tempFilter, setTempFilter] = useState({ ...filter });
    const [startDateVisible, setStartDateVisible] = useState(false);
    const [endDateVisible, setEndDateVisible] = useState(false);

    // Memoize params to include customFields
    const params = useMemo(() => ({
        documentName: { title: '№', name: 'docNumber', type: 'string' },
        customers: { title: 'Təchizatçı', api: 'customers', name: 'customerName', type: 'select', searchApi: 'customers/getfast.php', searchKey: 'fast' },
        stocks: { title: 'Anbar', api: 'stocks', name: 'stockName', type: 'select' },
        owners: { title: 'Cavabdeh', api: 'owners', name: 'ownerName', type: 'select' },
        departments: { title: 'Satış şöbəsi', api: 'departments', name: 'departmentId', type: 'select' },
        customerGroups: { title: 'Müştəri qrupu', api: 'customergroups', name: 'gp', type: 'select' },
        product: { title: 'Məhsul', api: 'products', name: 'productId', type: 'select', searchApi: 'products/getfast.php', searchKey: 'fast' },
        unit: { title: 'Əsas vahid', api: 'units', name: 'unit', type: 'select' },
        artCode: { title: 'Artkod', name: 'ac', type: 'string' },
        barCode: { title: 'Barkod', name: 'bc', type: 'number' },
        productName: { title: 'Məhsulun adı', name: 'productname', type: 'string' },
        spendItems: { title: 'Xərc-Maddəsi', name: 'spendItem', type: 'select', api: 'spenditems' },
        cashes: { title: 'Hesab', name: 'cashid', api: 'cashes', type: 'select' },
        salePoint: { title: 'Satış nöqtəsi', name: 'slpnt', api: 'salepoints', type: 'select' },
        ...customFields
    }), [customFields]);

    // Build fields from searchParams
    const fields = useMemo(() => {
        if (!searchParams || searchParams.length === 0) return [];
        return searchParams
            .map(key => params[key])
            .filter(Boolean);
    }, [searchParams, params]);

    // Build sort options from sortList
    const sortOptions = useMemo(() => {
        if (!sortList || sortList.length === 0) return [];
        return sortList.map(item => ({
            ...item,
            isSelected: tempFilter?.sr === item.value
        }));
    }, [sortList, tempFilter?.sr]);

    // Sync tempFilter when filter prop changes
    useEffect(() => {
        setTempFilter({ ...filter });
    }, [filter]);

    const changeTempFiltersState = (name, value) => {
        setTempFilter(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyClick = () => {
        console.log('Filter applying:', tempFilter);
        if (onApply) {
            onApply({ ...tempFilter });
        }
    };

    const handleResetClick = () => {
        const resetFilter = { ...tempFilter };

        // Reset fields based on searchParams
        if (searchParams && searchParams.length > 0) {
            searchParams.forEach(key => {
                const param = params[key];
                if (param && param.name) {
                    delete resetFilter[param.name];
                }
            });
        }

        // Reset date fields
        delete resetFilter.sd;
        delete resetFilter.ed;

        // Reset sort
        if (sortList && sortList.length > 0) {
            resetFilter.sr = sortList[0].value;
        } else {
            delete resetFilter.sr;
        }

        console.log('Filter reset:', resetFilter);
        setTempFilter(resetFilter);

        // Apply the reset filter to parent and close modal
        if (onApply) {
            onApply(resetFilter);
        }
    };

    const handleSortChange = (value) => {
        changeTempFiltersState('sr', value);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return moment(date).format('DD.MM.YYYY');
    };

    const parseDate = (dateStr) => {
        if (!dateStr) return new Date();
        return moment(dateStr, 'DD.MM.YYYY').toDate();
    };

    const renderField = (item, index) => {
        if (!item) return null;

        switch (item.type) {
            case 'string':
            case 'number':
                return (
                    <Form.Item label={item.title} key={`field-${index}`}>
                        <Input
                            value={tempFilter[item.name] || ''}
                            onChange={(val) => changeTempFiltersState(item.name, val)}
                            placeholder={item.title}
                            type={item.type === 'number' ? 'number' : 'text'}
                            clearable
                        />
                    </Form.Item>
                );
            case 'select':
                return (
                    <Form.Item label={item.title} key={`field-${index}`}>
                        {item.customSelection ? (
                            <CustomSelection
                                onChange={(e) => changeTempFiltersState(item.name, e)}
                                disabled={false}
                                options={item.options || []}
                                placeholder={item.title}
                                title={item.title}
                                value={tempFilter[item.name] || ''}
                            />
                        ) : (
                            <Selection
                                apiBody={{}}
                                searchApi={item.searchApi}
                                searchKey={item.searchKey}
                                apiName={`${item.api}/get.php`}
                                change={(e) => changeTempFiltersState(item.name, e.Id)}
                                value={tempFilter[item.name] || ''}
                                title={item.title}
                            />
                        )}
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    // Loading state
    if (fields.length === 0 && sortOptions.length === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 200,
                backgroundColor: 'var(--adm-color-background)'
            }}>
                <SpinLoading color='primary' style={{ '--size': '40px' }} />
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: 'var(--adm-color-fill-content)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
                {/* Filter Fields */}
                {fields.length > 0 && (
                    <Card style={{ marginBottom: 12, borderRadius: 12 }}>
                        <Form layout='vertical'>
                            {fields.map((field, index) => renderField(field, index))}

                            {/* Date Range */}
                            <Form.Item label='Tarix aralığı'>
                                <Space style={{ '--gap': '8px', width: '100%' }}>
                                    <Button
                                        size='small'
                                        onClick={() => setStartDateVisible(true)}
                                        style={{ flex: 1 }}
                                    >
                                        {tempFilter.sd || 'Başlanğıc'}
                                    </Button>
                                    <span>-</span>
                                    <Button
                                        size='small'
                                        onClick={() => setEndDateVisible(true)}
                                        style={{ flex: 1 }}
                                    >
                                        {tempFilter.ed || 'Son'}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                )}

                {/* Sort Options */}
                {sortOptions.length > 0 && (
                    <Card style={{ marginBottom: 12, borderRadius: 12 }}>
                        <div style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: 'var(--adm-color-text)',
                            marginBottom: 12
                        }}>
                            Sıralama
                        </div>
                        <Radio.Group
                            value={tempFilter.sr}
                            onChange={handleSortChange}
                        >
                            <Space direction='vertical' style={{ '--gap': '12px', width: '100%' }}>
                                {sortOptions.map((option, index) => (
                                    <Radio
                                        key={`sort-${index}`}
                                        value={option.value}
                                        style={{
                                            '--icon-size': '20px',
                                            '--font-size': '15px'
                                        }}
                                    >
                                        {option.label}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </Card>
                )}
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div style={{
                padding: 12,
                borderTop: '1px solid var(--adm-color-border)',
                backgroundColor: 'var(--adm-color-background)'
            }}>
                <Space style={{ '--gap': '12px', width: '100%' }} justify='between'>
                    <Button
                        fill='none'
                        onClick={handleResetClick}
                        style={{ color: 'var(--adm-color-danger)' }}
                    >
                        <Space align='center' style={{ '--gap': '4px' }}>
                            <CloseCircleOutlined />
                            <span>Təmizlə</span>
                        </Space>
                    </Button>
                    <Button
                        color='primary'
                        onClick={handleApplyClick}
                        style={{ minWidth: 120 }}
                    >
                        <Space align='center' style={{ '--gap': '4px' }}>
                            <SearchOutlined />
                            <span>Axtar</span>
                        </Space>
                    </Button>
                </Space>
            </div>

            {/* Date Pickers */}
            <DatePicker
                visible={startDateVisible}
                onClose={() => setStartDateVisible(false)}
                value={tempFilter.sd ? parseDate(tempFilter.sd) : new Date()}
                onConfirm={(val) => {
                    changeTempFiltersState('sd', formatDate(val));
                    setStartDateVisible(false);
                }}
                title='Başlanğıc tarixi'
                confirmText='Təsdiq'
                cancelText='Ləğv et'
            />
            <DatePicker
                visible={endDateVisible}
                onClose={() => setEndDateVisible(false)}
                value={tempFilter.ed ? parseDate(tempFilter.ed) : new Date()}
                onConfirm={(val) => {
                    changeTempFiltersState('ed', formatDate(val));
                    setEndDateVisible(false);
                }}
                title='Son tarix'
                confirmText='Təsdiq'
                cancelText='Ləğv et'
            />
        </div>
    );
};

export default Filter;
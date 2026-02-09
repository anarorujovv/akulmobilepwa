import React, { useEffect, useRef, useState } from 'react';
import { NavBar, SearchBar, Space, Popup } from 'antd-mobile';
import { SearchOutlined, FilterOutlined, ScanOutlined, ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Filter from './Filter';

const ListPagesHeader = ({
    header,
    isSearch,
    processScannerClick,
    filterSearchKey,
    filter,
    setFilter,
    isFilter,
    filterParams,  // New prop: { searchParams, sortList, customFields }
    searchM,
}) => {
    const navigate = useNavigate();
    const [searchMode, setSearchMode] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (searchMode && searchRef.current) {
            searchRef.current.focus();
        }
    }, [searchMode]);

    useEffect(() => {
        if (searchM) {
            setSearchMode(true);
        }
    }, [searchM]);

    useEffect(() => {
        if (filter && filter[filterSearchKey] && filter[filterSearchKey].length > 0) {
            setSearchMode(true);
        }
    }, [filter, filterSearchKey]);

    const handleBack = () => {
        if (searchMode) {
            setSearchMode(false);
            let myFilter = { ...filter };
            myFilter[filterSearchKey] = '';
            myFilter.pg = 1;
            setFilter(myFilter);
        } else {
            navigate(-1);
        }
    };

    const handleSearchChange = (val) => {
        let myFilter = { ...filter };
        myFilter[filterSearchKey] = val;
        myFilter.pg = 1;
        setFilter(myFilter);
    };

    const handleFilterClick = () => {
        setFilterVisible(true);
    };

    const handleFilterApply = (appliedFilter) => {
        console.log('ListPagesHeader received filter:', appliedFilter);
        // Use the applied filter directly (don't merge with old filter)
        // This ensures reset properly clears all filter values
        const newFilter = {
            ...appliedFilter,
            pg: 1 // Reset page when filter changes
        };
        console.log('Setting new filter:', newFilter);
        setFilter(newFilter);
        setFilterVisible(false);
    };

    const rightContent = () => {
        if (searchMode) {
            return isFilter && filterParams ? (
                <FilterOutlined
                    style={{ fontSize: 20, color: '#fff' }}
                    onClick={handleFilterClick}
                />
            ) : null;
        }

        return (
            <Space style={{ '--gap': '16px' }}>
                {isSearch && (
                    <SearchOutlined
                        style={{ fontSize: 20, color: '#fff', cursor: 'pointer' }}
                        onClick={() => setSearchMode(true)}
                    />
                )}
                {isFilter && filterParams && (
                    <FilterOutlined
                        style={{ fontSize: 20, color: '#fff', cursor: 'pointer' }}
                        onClick={handleFilterClick}
                    />
                )}
                {processScannerClick && (
                    <ScanOutlined
                        style={{ fontSize: 20, color: '#fff', cursor: 'pointer' }}
                        onClick={processScannerClick}
                    />
                )}
            </Space>
        );
    };

    const renderHeader = () => {
        if (searchMode) {
            return (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--adm-color-primary)',
                    padding: '8px 12px',
                    gap: 8,
                    minHeight: 50
                }}>
                    <ArrowLeftOutlined
                        style={{ fontSize: 20, color: '#fff', cursor: 'pointer', flexShrink: 0 }}
                        onClick={handleBack}
                    />
                    <SearchBar
                        ref={searchRef}
                        placeholder='Axtarış...'
                        value={filter[filterSearchKey] || ''}
                        onChange={handleSearchChange}
                        style={{
                            flex: 1,
                            '--background': 'rgba(255,255,255,0.2)',
                            '--border-radius': '8px',
                            '--height': '36px',
                            '--placeholder-color': 'rgba(255,255,255,0.7)'
                        }}
                    />
                    {isFilter && filterParams && (
                        <FilterOutlined
                            style={{ fontSize: 20, color: '#fff', cursor: 'pointer', flexShrink: 0 }}
                            onClick={handleFilterClick}
                        />
                    )}
                </div>
            );
        }

        return (
            <NavBar
                backArrow={<ArrowLeftOutlined style={{ fontSize: 20, color: '#fff' }} />}
                onBack={handleBack}
                right={rightContent()}
                style={{
                    '--height': '50px',
                    '--border-bottom': 'none',
                    backgroundColor: 'var(--adm-color-primary)',
                    color: '#fff'
                }}
            >
                {header}
            </NavBar>
        );
    };

    return (
        <>
            {renderHeader()}

            {/* Filter Modal */}
            <Popup
                visible={filterVisible}
                onMaskClick={() => setFilterVisible(false)}
                position='right'
                bodyStyle={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Filter Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: 'var(--adm-color-primary)',
                    color: '#fff'
                }}>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>Filtrlər</span>
                    <CloseOutlined
                        style={{ fontSize: 20, cursor: 'pointer' }}
                        onClick={() => setFilterVisible(false)}
                    />
                </div>

                {/* Filter Content */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    {filterParams && (
                        <Filter
                            filter={filter}
                            searchParams={filterParams.searchParams}
                            sortList={filterParams.sortList}
                            customFields={filterParams.customFields}
                            onApply={handleFilterApply}
                            onClose={() => setFilterVisible(false)}
                        />
                    )}
                </div>
            </Popup>
        </>
    );
};

export default ListPagesHeader;

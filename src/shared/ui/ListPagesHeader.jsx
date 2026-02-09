import React, { useEffect, useRef, useState } from 'react';
import { IoArrowBack, IoFilter, IoSearch, IoScan } from 'react-icons/io5';
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

    const styles = {
        container: {
            backgroundColor: theme.primary,
            width: '100%',
            height: 55,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingRight: 10,
            alignItems: 'center',
            boxSizing: 'border-box'
        },
        right: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: 150,
            alignItems: 'center'
        },
        text: {
            fontSize: 18,
            color: theme.stable.white,
            fontWeight: 500
        },
        right_active: {
            width: '10%'
        },
        left: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '80%',
            gap: 10
        },
        input: {
            color: theme.stable.white,
            fontSize: 18,
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            width: '100%',
            '::placeholder': {
                color: theme.whiteGrey
            }
        }
    };

    useEffect(() => {
        if (searchMode && inputRef.current) {
            inputRef.current.focus();
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

    return (
        <div style={styles.container}>
            {searchMode ? (
                <>
                    <div style={styles.left}>
                        <IconButton size={40} onPress={() => {
                            setSearchMode(false);
                            let myFilter = { ...filter };
                            myFilter[filterSearchKey] = '';
                            myFilter.pg = 1;
                            setFilter(myFilter);
                        }}>
                            <IoArrowBack size={20} color={theme.stable.white} />
                        </IconButton>

                        <input
                            value={filter[filterSearchKey] || ''}
                            onChange={(e) => {
                                let myFilter = { ...filter };
                                myFilter[filterSearchKey] = e.target.value;
                                myFilter.pg = 1;
                                setFilter(myFilter);
                            }}
                            ref={inputRef}
                            placeholder='Axtarış...'
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.right_active}>
                        {isFilter &&
                            <IconButton size={40}>
                                <IoFilter size={20} color={theme.stable.white} />
                            </IconButton>
                        }
                    </div>
                </>
            ) : (
                <>
                    <span style={styles.text}>{header}</span>

                    <div style={styles.right}>
                        {isSearch && (
                            <IconButton onPress={() => setSearchMode(true)} size={40}>
                                <IoSearch size={20} color={theme.stable.white} />
                            </IconButton>
                        )}

                        {isFilter && (
                            <IconButton size={40} onPress={() => {
                                processFilterClick();
                            }}>
                                <IoFilter size={20} color={theme.stable.white} />
                            </IconButton>
                        )}

                        {processScannerClick && (
                            <IconButton onPress={processScannerClick} size={40}>
                                <IoScan size={20} color={theme.stable.white} />
                            </IconButton>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ListPagesHeader;

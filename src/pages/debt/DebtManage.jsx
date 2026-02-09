import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import useTheme from '../../shared/theme/useTheme';
import Line from './../../shared/ui/Line';
import translateDebtTerm from './../../services/report/debtType';
import { formatPrice } from '../../services/formatPrice';
import ListItem from '../../shared/ui/list/ListItem';
import DateRangePicker from '../../shared/ui/DateRangePicker';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import { useNavigate, useLocation } from 'react-router-dom';

const DebtManage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {}; // Get id from state
    let theme = useTheme();

    const [document, setDocument] = useState(null);
    const [documentList, setDocumentList] = useState([]);

    let [filter, setFilter] = useState({
        cus: id,
    });

    const [selectedTime, setSelectedTime] = useState(4);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.bg,
            overflow: 'hidden'
        },
        loadingContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        headerText: {
            color: theme.black,
            fontSize: 15,
            textAlign: 'center',
            marginTop: 30,
            fontWeight: 'bold'
        },
        subHeaderText: {
            textAlign: 'center',
            color: theme.input.grey,
        },
        separator: {
            height: 1,
            backgroundColor: theme.whiteGrey,
            width: '100%',
            margin: '10px 0'
        },
        listContainer: {
            flex: 1,
            overflowY: 'auto'
        }
    };

    const fethingInformation = async () => {
        await api('documents/get.php', {
            ...filter,
            token: await AsyncStorageWrapper.getItem('token')
        }).then(async element => {
            let objData = { ...element };
            // Note: element might be null if no data, logic below assumes element exists
            if (objData) {
                let initalDebt = formatPrice((objData.AllSum) - formatPrice(objData.Credits)) + formatPrice(Math.abs(objData.Debits));
                objData.initalDebt = String(initalDebt);
                setDocument(objData);
                setDocumentList(objData.List);
            }
        }).catch(err => {
            ErrorMessage(err);
        });
    };

    useEffect(() => {
        setDocument(null);
        fethingInformation();
    }, [filter]);

    useEffect(() => {
        if (id) {
            setFilter(prev => ({ ...prev, cus: id }));
        }
    }, [id]);

    return (
        document == null ? (
            <div style={styles.loadingContainer}>
                <div className="spinner"></div> // Assuming global spinner
            </div>
        ) : (
            <div style={styles.container}>
                <span style={styles.headerText}>{document.CustomerName}</span>
                <span style={styles.subHeaderText}>Üzləşmə aktı</span>

                <div style={styles.separator} />

                <DocumentInfo
                    data={[
                        { title: "İlkin borc", value: document.initalDebt },
                        { title: 'Alınıb', value: formatPrice(document.Debits) },
                        { title: 'Verilib', value: document.Credits },
                        { title: 'Yekun Borc', value: formatPrice(document.AllSum) }
                    ]}
                />

                <div style={styles.separator} />
                <Line width={'90%'} />

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <DateRangePicker
                        submit={true}
                        width={'100%'}
                        filter={filter}
                        setFilter={setFilter}
                    />
                </div>

                <div style={{ margin: 10 }} />
                <DocumentTimes
                    filter={filter}
                    setFilter={setFilter}
                    selected={selectedTime}
                    setSelected={setSelectedTime}
                />

                <div style={styles.listContainer}>
                    {documentList && documentList.length > 0 ? (
                        documentList.map((item, index) => {
                            return (
                                <div key={index}>
                                    <ListItem
                                        onPress={() => {
                                            // Converted route:
                                            navigate('/demands/demand-return-manage', {
                                                state: { id: item.LinkId }
                                            });
                                        }}
                                        index={index + 1}
                                        iconBasket={true}
                                        firstText={translateDebtTerm(item.DocType).title}
                                        centerText={item.Moment}
                                        priceText={formatPrice(item.Amount)}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div style={styles.loadingContainer}>
                            {/* Or empty state */}
                            {/* <div className="spinner"></div> */}
                            <span>No document items found</span>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default DebtManage;

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import useTheme from '../../shared/theme/useTheme';
import translateDebtTerm from './../../services/report/debtType';
import { formatPrice } from '../../services/formatPrice';
import DateRangePicker from '../../shared/ui/DateRangePicker';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar, SpinLoading, List } from 'antd-mobile';

const DebtManage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const [document, setDocument] = useState(null);
    const [documentList, setDocumentList] = useState([]);

    const [filter, setFilter] = useState({});

    const [selectedTime, setSelectedTime] = useState(4);

    const fethingInformation = async (params = {}) => {
        await api('documents/get.php', {
            ...filter,
            ...params,
            cus: id,
            token: await AsyncStorageWrapper.getItem('token')
        }).then(async element => {
            let objData = { ...element };
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

    const reload = (params) => {
        setDocument(null);
        fethingInformation(params);
    }

    useEffect(() => {
        fethingInformation();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: theme.bg, overflow: 'hidden' }}>
            <NavBar onBack={() => navigate(-1)} style={{ background: '#fff' }}>
                {document?.CustomerName}
            </NavBar>

            <div style={{ padding: '10px 0', textAlign: 'center', color: theme.input.grey }}>
                Üzləşmə aktı
            </div>

            <DocumentInfo
                data={[
                    { title: "İlkin borc", value: document?.initalDebt },
                    { title: 'Alınıb', value: formatPrice(document?.Debits) },
                    { title: 'Verilib', value: document?.Credits },
                    { title: 'Yekun Borc', value: formatPrice(document?.AllSum) }
                ]}
            />

            <div style={{ margin: '10px 0', borderBottom: `1px solid ${theme.whiteGrey}` }} />

            <div style={{ padding: '0 10px' }}>
                <DateRangePicker
                    submit={true}
                    width={'100%'}
                    filter={filter}
                    setFilter={(e) => {
                        setFilter(e);
                        reload(e);
                    }}
                />
            </div>

            <div style={{ margin: 10 }} />
            <DocumentTimes
                filter={filter}
                setFilter={(item) => {
                    setFilter(item);
                    reload(item)
                }}
                selected={selectedTime}
                setSelected={setSelectedTime}
            />

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {!documentList || documentList.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
                        <span style={{ color: theme.input.grey }}>Məlumat yoxdur</span>
                    </div>
                ) : (
                    <List>
                        {documentList.map((item, index) => (
                            <List.Item
                                key={index}
                                onClick={() => {
                                    navigate(`/demands/demand-return-manage/${item.LinkId}`);
                                }}
                                description={item.Moment}
                                extra={formatPrice(item.Amount)}
                                clickable
                            >
                                {translateDebtTerm(item.DocType).title}
                            </List.Item>
                        ))}
                    </List>
                )}
            </div>
        </div>
    );
};

export default DebtManage;

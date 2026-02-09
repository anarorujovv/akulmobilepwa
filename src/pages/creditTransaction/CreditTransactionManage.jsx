import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import getDateByIndex from '../../services/report/getDateByIndex';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import { useLocation, useNavigate } from 'react-router-dom';

const CreditTransactionManage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let { id } = location.state || {}; // Get ID from state

    let theme = useTheme();

    const [filter, setFilter] = useState({
        lm: 100,
        pg: 0,
        ...getDateByIndex(4)
    })

    const [list, setList] = useState([]);
    const [sum, setSum] = useState(null);
    const [dateByIndex, setDateByIndex] = useState(4)

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.bg,
            overflow: 'hidden'
        },
        listContainer: {
            flex: 1,
            overflowY: 'auto'
        },
        loadingContainer: {
            width: '100%',
            height: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    };

    const makeApiRequest = async () => {
        let obj = {
            ...filter,
            cus: id,
            token: await AsyncStorageWrapper.getItem('token')
        }

        await api('documents/get.php', obj)
            .then(element => {
                if (element != null) {
                    if (filter.agrigate == 1) {
                        setSum(element);
                    }
                    setList(element.List);
                }
            })
            .catch(err => {
                ErrorMessage(err);
            })

    }

    useEffect(() => {
        if (id) {
            makeApiRequest();
        }
    }, [id])

    return (
        <div style={styles.container}>

            <DocumentTimes
                filter={filter}
                setFilter={setFilter}
                selected={dateByIndex}
                setSelected={setDateByIndex}
            />

            {
                sum == null ?
                    <div style={styles.loadingContainer}>
                        <div className="spinner" style={{ width: 20, height: 20 }}></div>
                    </div>
                    :
                    <div>
                        <DocumentInfo
                            data={[
                                {
                                    title: "İlkin borc",
                                    value: sum.InSum
                                },
                                {
                                    title: "Alınıb",
                                    value: Math.abs(sum.Debits)
                                },
                                {
                                    title: "Verilib",
                                    value: sum.Credits
                                },
                                {
                                    title: 'Yekun borc',
                                    value: sum.AllSum
                                }
                            ]}
                        />
                    </div>
            }

            <div style={styles.listContainer}>
                {list && list.map((item, index) => (
                    <div key={index}>
                        <ListItem
                            onPress={() => {
                                navigate('/creditTransaction/credit-transaction-manage', {
                                    state: { id: item.Id }
                                })
                            }}
                            centerText={item.CustomerName}
                            endText={item.Moment}
                            firstText={<span style={{
                                color: theme.primary
                            }}>{item.SalePoint}</span>}
                            notIcon={true}
                            index={index + 1}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CreditTransactionManage;
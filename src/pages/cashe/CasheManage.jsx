import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import Line from '../../shared/ui/Line';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import { useLocation } from 'react-router-dom';

const CasheManage = ({ route }) => {
  const location = useLocation();
  // route.params react router'da location.state olur
  let params = location.state || {}; // Fallback to empty object
  let { id, name, balance } = params;

  let theme = useTheme();

  const [casheData, setCasheData] = useState([]);
  const [cashe, setCashe] = useState(null);
  const [selectedTime, setSelectedTime] = useState(4);

  const [filter, setFilter] = useState({
    pg: 0,
    dr: 1,
    lm: 100,
    sr: "Moment",
  });

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    },
    headerText: {
      color: theme.black,
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10,
      fontWeight: 'bold'
    },
    subHeaderText: {
      textAlign: 'center',
      color: theme.input.grey,
    },
    listContainer: {
      width: '100%',
      padding: 10,
      overflowY: 'auto',
      flex: 1
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  };

  let fetchingCasheData = async () => {
    let obj = {
      ...filter,
      cashid: id,
      token: await AsyncStorageWrapper.getItem('token')
    };
    await api('transactions/history.php', obj).then(res => {
      if (res != null) {
        setCasheData([...res.List]);
        let obj = { ...res };
        delete obj.List;
        setCashe(obj);
      }
    }).catch(err => {
      ErrorMessage(err);
    });
  };

  useEffect(() => {
    if (id) {
      fetchingCasheData();
    }
  }, [filter, id]);

  return (
    <div style={styles.container}>
      <span style={styles.headerText}>{name}</span>
      <span style={styles.subHeaderText}>Üzləşmə aktı</span>
      <div style={{ margin: 5 }} />
      <Line width={'90%'} />

      <DocumentTimes
        filter={filter}
        setFilter={setFilter}
        selected={selectedTime}
        setSelected={setSelectedTime}
      />
      {
        cashe == null ?
          ""
          :
          <DocumentInfo data={[
            {
              title: "Alınıb",
              value: formatPrice(cashe.InSum)
            },
            {
              title: "Verilib",
              value: formatPrice(cashe.OutSum)
            },
            {
              title: "Balans",
              value: formatPrice(balance)
            }
          ]} />
      }

      {
        casheData !== null ?
          casheData[0] ?
            <div style={styles.listContainer}>
              {
                casheData.map((item, index) => {
                  return (
                    <div key={index}>
                      <ListItem
                        notIcon={true}
                        centerText={formatPrice(item.Amount)}
                        endText={item.Moment}
                        index={index + 1}
                        priceText={formatPrice(item.Balance)}
                      />
                    </div>
                  )
                })
              }
            </div>
            :
            <div style={styles.centerContent}>
              <div className="spinner"></div>
            </div>
          :
          <div style={styles.centerContent}>
            <span style={{
              fontWeight: 'bold',
              color: theme.red
            }}>List boşdur!</span>
          </div>
      }
    </div>
  );
};

export default CasheManage;

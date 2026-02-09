import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import CardItem from '../../shared/ui/list/CardItem';
import { useNavigate } from 'react-router-dom';

const ShiftList = () => {
  const navigate = useNavigate();
  let theme = useTheme();
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState({
    dr: 1,
    lm: 100,
    pg: 0
  });

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: theme.bg,
      padding: 10,
      overflowY: 'auto'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
      flex: 1
    }
  };

  const fetchingData = async () => {
    let obj = {
      ...filter,
      token: await AsyncStorageWrapper.getItem('token')
    };
    await api('shifts/get.php', obj)
      .then(element => {
        if (element != null) {
          setList(element.List);
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  useEffect(() => {
    fetchingData();
  }, []);

  return (
    <div style={styles.container}>
      {list === null || list.length === 0 ? (
        <div style={styles.loadingContainer}>
          {list === null ? (
            <div className="spinner"></div> // Assuming spinner class exists globally
          ) : (
            <span style={{ color: theme.text }}>List boşdur</span>
          )}
        </div>
      ) : (
        list.map((item, index) => (
          <div key={item.Id} onClick={() => {
            navigate('/shifts/shift-manage', { state: { id: item.Id } });
          }} style={{ marginBottom: 10, cursor: 'pointer' }}>
            <CardItem
              title={item.SalePointName}
              items={[
                {
                  key: 'Status', // Corrected typo 'Satus'
                  value: item.Status == 1 ? <span style={{ color: theme.green }}>Açıqdır</span> : 'Bağlıdır'
                },
                {
                  key: 'Növbəni açıb',
                  value: item.OpenOwnerName
                },
                {
                  key: 'Növbəni bağlayıb',
                  value: item.CloseOwnerName
                },
                {
                  key: 'Açılma tarixi',
                  value: item.OpenMoment
                },
                {
                  key: 'Bağlanma tarixi',
                  value: item.CloseMoment
                },
              ]}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ShiftList;
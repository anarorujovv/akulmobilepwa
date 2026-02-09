import React, { useEffect, useState } from 'react';
import { SpinLoading } from 'antd-mobile';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import CardItem from '../../shared/ui/list/CardItem';
import { useNavigate } from 'react-router-dom';

const ShiftList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [filter, setFilter] = useState({
    dr: 1,
    lm: 100,
    pg: 0
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'var(--adm-color-background)',
      overflowY: 'auto'
    }}>
      <ListPagesHeader
        header={'Növbələr'}
      />

      {list === null || list.length === 0 ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 50,
          flex: 1
        }}>
          {list === null ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <SpinLoading color='primary' style={{ '--size': '40px' }} />
            </div>
          ) : (
            <span style={{ color: 'var(--adm-color-weak)' }}>List boşdur</span>
          )}
        </div>
      ) : (
        <div style={{ padding: 10 }}>
          {list.map((item, index) => (
            <div key={item.Id} onClick={() => {
              navigate('/shifts/shift-manage', { state: { id: item.Id } });
            }} style={{ marginBottom: 10, cursor: 'pointer' }}>
              <CardItem
                title={item.SalePointName}
                items={[
                  {
                    key: 'Status',
                    value: item.Status == 1 ? <span style={{ color: 'var(--adm-color-success)' }}>Açıqdır</span> : 'Bağlıdır'
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ShiftList;
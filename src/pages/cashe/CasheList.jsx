import React, { useEffect, useState, useCallback } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import FabButton from '../../shared/ui/FabButton';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from './../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import ListItem from '../../shared/ui/list/ListItem';
import Line from '../../shared/ui/Line';
import { useNavigate } from 'react-router-dom';

const CasheList = () => {
  const theme = useTheme();
  const permissions = useGlobalStore(state => state.permissions);
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    docNumber: "",
    dr: 1,
    pg: 1,
    lm: 20,
    agrigate: 1
  });

  const [documents, setDocuments] = useState([]);
  const [documentsInfo, setDocumentsInfo] = useState(null);
  const [itemSize, setItemSize] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.bg,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    },
    listContainer: {
      flex: 1,
      overflowY: 'auto'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    },
    emptyContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      flex: 1
    }
  };

  const fetchingDocumentData = useCallback(async () => {
    setIsRefreshing(true);
    let obj = { ...filter, token: await AsyncStorageWrapper.getItem('token') };
    obj.pg = obj.pg - 1;

    try {
      const element = await api('cashes/get.php', obj);
      if (element != null) {
        setItemSize(element.Count);
        if (filter.agrigate == 1) {
          setDocumentsInfo(element);
        }
        setDocuments([...element.List]);
      }
    } catch (err) {
      ErrorMessage(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [filter]);

  const handleDelete = async (id) => {
    if (permission_ver(permissions, 'cashes', 'D')) {
      await api('cashes/del.php?id=' + id, {
        token: await AsyncStorageWrapper.getItem('token')
      }).then(element => {
        if (element != null) {
          setDocuments([]);
          fetchingDocumentData();
        }
      }).catch(err => {
        ErrorMessage(err);
      });
    } else {
      ErrorMessage("İcazə yoxdur!");
    }
  };

  const RenderFooter = () => {
    return (
      (documents.length == 20 || filter.pg != 1) ?
        <MyPagination
          pageSize={20}
          page={filter.pg}
          setPage={(e) => {
            let filterData = { ...filter };
            filterData.agrigate = 0;
            filterData.pg = e;
            setFilter(filterData);
          }}
          itemSize={itemSize}
        />
        : null
    );
  };

  useEffect(() => {
    let time = setTimeout(() => {
      fetchingDocumentData();
    }, 300);

    return () => clearTimeout(time);
  }, [filter, fetchingDocumentData]);

  const renderItem = (item, index) => (
    <div key={item.Id}>
      <ListItem
        index={index + 1}
        firstText={item.Name}
        priceText={formatPrice(item.Balance)}
        onPress={() => {
          if (permission_ver(permissions, 'cashes', 'R')) {
            navigate('/cashes/cashe-manage', { state: { id: item.Id, name: item.Name, balance: item.Balance } });
          } else {
            ErrorMessage('İcazəniz yoxdur!');
          }
        }}
        onLongPress={() => {
          if (window.confirm('Hesabı silməyə əminsiniz ?')) {
            handleDelete(item.Id);
          }
        }}
      />
    </div>
  );

  return (
    <div style={styles.container}>
      <ListPagesHeader
        isSearch={true}
        filter={filter}
        setFilter={setFilter}
        filterSearchKey={'docNumber'}
        header={'Hesablar'}
      />

      {documentsInfo != null ? (
        <DocumentInfo
          data={[
            {
              title: "Məbləğ",
              value: formatPrice(documentsInfo.AllSum)
            }
          ]}
        />
      ) : (
        <div style={{ width: '100%', height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="spinner" style={{ width: 15, height: 15 }}></div>
          <Line width={'100%'} />
        </div>
      )}

      {documents == null ? (
        <div style={styles.loadingContainer}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {documents.length === 0 ? (
            <div style={styles.emptyContainer}>
              <span style={{ color: theme.text }}>List boşdur</span>
            </div>
          ) : (
            <>
              {documents.map((item, index) => renderItem(item, index))}
              <RenderFooter />
            </>
          )}
        </div>
      )}

      <FabButton
        onPress={() => {
          if (permission_ver(permissions, 'cashes', 'C')) {
            navigate('/cashes/cashe-create');
          }
        }}
      />
    </div>
  );
};

export default CasheList;

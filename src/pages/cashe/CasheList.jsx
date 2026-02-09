import React, { useEffect, useState, useCallback } from 'react';
import { SpinLoading, FloatingBubble } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import api from './../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import permission_ver from '../../services/permissionVerification';
import useGlobalStore from '../../shared/data/zustand/useGlobalStore';
import MyPagination from '../../shared/ui/MyPagination';
import DocumentInfo from './../../shared/ui/DocumentInfo';
import { formatPrice } from '../../services/formatPrice';
import ListItem from '../../shared/ui/list/ListItem';
import { useNavigate } from 'react-router-dom';

const CasheList = () => {
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
  }, [filter]);

  const renderItem = (item, index) => (
    <React.Fragment key={item.Id}>
      <ListItem
        index={index + 1}
        firstText={item.Name}
        priceText={formatPrice(item.Balance)}
        notIcon={true}
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
    </React.Fragment>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'var(--adm-color-background)',
      overflow: 'hidden'
    }}>
      <ListPagesHeader
        isSearch={true}
        filter={filter}
        setFilter={setFilter}
        filterSearchKey={'docNumber'}
        header={'Hesablar'}
        isFilter={false} // CasheList usually doesn't have many filters, or I can add basic sorting if needed? The original code had no filter params.
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
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 0',
          borderBottom: '1px solid var(--adm-color-border)'
        }}>
          <SpinLoading color='primary' style={{ '--size': '20px' }} />
        </div>
      )}

      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: 80,
        padding: '0 12px 80px 12px'
      }}>
        {documents == null ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <SpinLoading color='primary' style={{ '--size': '40px' }} />
          </div>
        ) : (
          <>
            {documents.length === 0 ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                color: 'var(--adm-color-weak)'
              }}>
                <span>List boşdur</span>
              </div>
            ) : (
              <>
                {documents.map((item, index) => renderItem(item, index))}
                <RenderFooter />
              </>
            )}
          </>
        )}
      </div>

      <FloatingBubble
        style={{
          '--initial-position-bottom': '24px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
          '--background': 'var(--adm-color-primary)',
          '--size': '56px'
        }}
        onClick={() => {
          if (permission_ver(permissions, 'cashes', 'C')) {
            navigate('/cashes/cashe-create');
          }
        }}
      >
        <AddOutline fontSize={28} color='#fff' />
      </FloatingBubble>
    </div>
  );
};

export default CasheList;

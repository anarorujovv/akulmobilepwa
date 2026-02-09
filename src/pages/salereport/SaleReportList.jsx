import React, { useState, useCallback, useEffect } from 'react';
import useTheme from '../../shared/theme/useTheme';
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
import Line from '../../shared/ui/Line';
import DocumentTimes from './../../shared/ui/DocumentTimes';
import getDateByIndex from '../../services/report/getDateByIndex';
import { useNavigate } from 'react-router-dom';

const SaleReportList = () => {
  const navigate = useNavigate();
  let theme = useTheme();
  let permissions = useGlobalStore(state => state.permissions);

  const [selectedTime, setSelectedTime] = useState(4);
  const [filter, setFilter] = useState({
    dr: 0,
    sr: "Profit",
    pg: 1,
    gp: null,
    zeros: null,
    ar: null,
    lm: 100,
    own: null,
    showc: null,
    showh: null,
    pricetype: null,
    quick: null,
    docNumber: "",
    ...getDateByIndex(4)
  })

  const [documents, setDocuments] = useState([]);
  const [documentsInfo, setDocumentsInfo] = useState(null);
  const [itemSize, setItemSize] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      overflowY: 'auto',
      paddingBottom: 80
    },
    loadingContainer: {
      width: '100%',
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex'
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      paddingTop: 50
    }
  }

  const fetchingDocumentData = async () => {
    setIsRefreshing(true);
    let obj = { ...filter, token: await AsyncStorageWrapper.getItem('token') }
    obj.pg = obj.pg - 1;
    try {
      const element = await api('salereports/get.php', obj);
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
  }

  const RenderFooter = () => {
    return (
      documents.length == 100 || filter.pg != 1 ?
        <MyPagination
          pageSize={100}
          page={filter.pg}
          setPage={(e) => {
            let filterData = { ...filter };
            filterData.agrigate = 0;
            filterData.pg = e;
            setFilter(filterData);
          }}
          itemSize={itemSize}
        />
        : ""
    )
  }

  useEffect(() => {
    setDocuments(null);
    let time = setTimeout(() => {
      fetchingDocumentData();
    }, 300);

    return () => clearTimeout(time);
  }, [filter]);

  const renderItem = (item, index) => (
    <div key={item.ProductId || index}>
      <ListItem
        firstText={item.ProductName}
        priceText={formatPrice(item.SumPrice)}
        centerText={`${formatPrice(item.Quantity)} əd x ${formatPrice(formatPrice(item.SumPrice) / formatPrice(item.Quantity))}`}
        endText={formatPrice(item.Profit)}
        notIcon={true}
        onPress={() => {
          if (permission_ver(permissions, 'salereports', 'R')) {
            navigate('/salereport/sale-report-manage', { state: { id: item.ProductId, name: item.ProductName } });
          } else {
            ErrorMessage('İcazəniz yoxdur!');
          }
        }}
        index={index + 1}
      />
    </div>
  );

  return (
    <div style={styles.container}>
      <ListPagesHeader
        header={"Mənfəət"}
        isSearch={true}
        filter={filter}
        setFilter={setFilter}
        filterSearchKey={'docNumber'}
        isFilter={true}
        processFilterClick={() => {
          navigate('/filter', {
            state: {
              filter: filter,
              // setFilter: setFilter,
              searchParams: [
                'product',
                'groups',
                'customers',
                'stocks',
                'salePoint',
                'customerGroups'
              ],
              customFields: {
                groups: {
                  title: "Qrup",
                  name: 'gp',
                  api: 'productfolders',
                  type: 'select'
                },
                product: {
                  title: "Məhsul",
                  api: 'products',
                  name: "productName",
                  type: 'select',
                  searchApi: 'products/getfast.php',
                  searchKey: 'fast'
                },
              },
              isDate: true
            }
          })
        }}
      />

      <DocumentTimes
        selected={selectedTime}
        setSelected={setSelectedTime}
        filter={filter}
        setFilter={setFilter}
      />

      {documentsInfo != null ? (
        <DocumentInfo
          data={[
            {
              title: "Satış",
              value: formatPrice(documentsInfo.AllAmount)
            },
            {
              title: "Qaytarma",
              value: formatPrice(documentsInfo.RetAllAmount)
            },
            {
              title: 'Maya',
              value: formatPrice(documentsInfo.AllCost)
            },
            {
              title: "Qazanc",
              value: formatPrice(documentsInfo.AllProfit)
            },
            {
              title: "Miqdar",
              value: formatPrice(documentsInfo.AllSaleQuantity)
            },
            {
              title: "Marja",
              value: formatPrice(documentsInfo.Margin)
            },
            {
              title: "Qaytarma mayası",
              value: formatPrice(documentsInfo.RetAllCost)
            }
          ]}
        />
      ) : (
        <div style={styles.loadingContainer}>
          <div className="spinner" style={{ width: 15, height: 15 }}></div>
          <Line width={'100%'} />
        </div>
      )}

      <div style={styles.listContainer}>
        {documents == null ? (
          <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex'
          }}>
            <div className="spinner"></div> // Web spinner
          </div>
        ) : (
          <>
            {documents.length === 0 ? (
              <div style={styles.emptyContainer}>
                <span style={{ color: theme.text }}>List boşdur</span>
              </div>
            ) : (
              documents.map((item, index) => renderItem(item, index))
            )}
            <RenderFooter />
          </>
        )}
      </div>
    </div>
  );
};

export default SaleReportList;

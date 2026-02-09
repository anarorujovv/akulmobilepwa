import React, { useCallback, useState, useEffect } from 'react';
import useTheme from '../../shared/theme/useTheme';
import getDateByIndex from '../../services/report/getDateByIndex';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import DocumentTimes from '../../shared/ui/DocumentTimes';
import ListItem from '../../shared/ui/list/ListItem';
import { formatPrice } from '../../services/formatPrice';
import ListPagesHeader from '../../shared/ui/ListPagesHeader';
import DocumentInfo from '../../shared/ui/DocumentInfo';
import { useNavigate } from 'react-router-dom';

const SaleList = () => {
  const navigate = useNavigate();
  let theme = useTheme();
  let [filter, setFilter] = useState({
    dr: 1,
    lm: 100,
    pg: 0,
    sr: 'Moment',
    ...getDateByIndex(0),
  });
  const [sales, setSales] = useState([]);
  const [saleSum, setSaleSum] = useState(null);
  const [selectedTime, setSelectedTime] = useState(0);

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
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      paddingTop: 50
    }
  };

  const makeApiRequest = async () => {
    let obj = {
      ...filter,
      token: await AsyncStorageWrapper.getItem('token'),
    };

    await api('sales/get.php', obj)
      .then(element => {
        if (element != null) {
          if (filter.agrigate == 1) {
            setSaleSum(element);
          }
          setSales(element.List);
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  const renderItem = (item, index) => {
    return (
      <div key={item.Id}>
        <ListItem
          centerText={item.CustomerName}
          firstText={item.SalePointName}
          endText={`${item.Moment} - ${item.EmployeeName || ''}`}
          notIcon={true}
          index={index + 1}
          priceText={formatPrice(item.Amount)}
          onPress={() => {
            navigate('/sale/sale-manage', {
              state: { id: item.Id }
            });
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    makeApiRequest();
  }, [filter]);

  return (
    <div style={styles.container}>
      <ListPagesHeader
        filter={filter}
        setFilter={setFilter}
        header={'Satış'}
        isSearch={true}
        filterSearchKey={'docNumber'}
        isFilter={true}
        processFilterClick={() => {
          navigate('/filter', {
            state: {
              filter: filter,
              // setFilter: setFilter,
              searchParams: [
                'documentName',
                'product',
                'customers',
                'stocks',
                'salePoint',
                'odenis',
                'owners',
              ],
              sortList: [
                {
                  id: 1,
                  label: 'Ad',
                  value: 'Name',
                },
                {
                  id: 2,
                  label: 'Satış nöqtəsi',
                  value: 'SalePointName',
                },
                {
                  id: 3,
                  label: 'Tarix',
                  value: 'Moment',
                },
                {
                  id: 4,
                  label: 'Tərəf-Müqabil',
                  value: 'customerName',
                },
                {
                  id: 5,
                  label: 'Nağd',
                  value: 'Cash',
                },
                {
                  id: 6,
                  label: 'Bonus',
                  value: 'UseBonus',
                },
                {
                  id: 7,
                  label: 'Borca',
                  value: 'Credit',
                },
                {
                  id: 8,
                  label: 'Qazanc',
                  value: 'Profit',
                },
              ],
              customFields: {
                odenis: {
                  title: 'Ödəniş',
                  name: 'paytype',
                  type: 'select',
                  customSelection: true,
                  options: [
                    {
                      key: 'p',
                      value: 'Nağd',
                    },
                    {
                      key: 'i',
                      value: 'Köçürmə',
                    },
                    {
                      key: '',
                      value: 'Hamısı',
                    },
                  ],
                },
                owners: {
                  title: 'Satıcı',
                  type: 'select',
                  api: 'employees',
                  name: 'employeeId',
                },
              },
            }
          });
        }}
      />
      <DocumentTimes
        filter={filter}
        setFilter={setFilter}
        selected={selectedTime}
        setSelected={setSelectedTime}
      />
      {saleSum == null ? (
        <div style={styles.loadingContainer}>
          <div className="spinner" style={{ width: 20, height: 20 }}></div>
        </div>
      ) : (
        <DocumentInfo
          data={[
            {
              value: formatPrice(saleSum.CashSum),
              title: 'Nağd',
            },
            {
              title: 'Nağdız',
              value: formatPrice(saleSum.BankSum),
            },
            {
              title: 'Bonus',
              value: formatPrice(saleSum.BonusSum),
            },
            {
              title: 'Borc',
              value: formatPrice(saleSum.CreditSum),
            },
            {
              title: 'Yenuk məbləö',
              value: formatPrice(saleSum.AmountSum),
            },
            {
              title: 'Maya',
              value: formatPrice(saleSum.AllCost),
            },
            {
              title: 'Qazanc',
              value: formatPrice(saleSum.AllProfit),
            },
          ]}
        />
      )}

      <div style={styles.listContainer}>
        {sales == null || sales.length === 0 ? (
          <div style={styles.emptyContainer}>
            {sales === null ? (
              <div className="spinner"></div> // List loading
            ) : (
              <span style={{ color: theme.text }}>List boşdur</span>
            )}
          </div>
        ) : (
          sales.map((item, index) => renderItem(item, index))
        )}
      </div>
    </div>
  );
};

export default SaleList;

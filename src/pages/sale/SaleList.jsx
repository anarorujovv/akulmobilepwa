import React, { useState, useEffect } from 'react';
import { SpinLoading, FloatingBubble, Divider } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
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

  const makeApiRequest = async () => {
    let obj = {
      ...filter,
      token: await AsyncStorageWrapper.getItem('token'),
    };

    await sales_get(obj);
  };

  const sales_get = async (obj) => {
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
  }

  const renderItem = (item, index) => {
    return (
      <React.Fragment key={item.Id}>
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
      </React.Fragment>
    );
  };

  useEffect(() => {
    makeApiRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'var(--adm-color-background)',
      overflow: 'hidden'
    }}>
      <ListPagesHeader
        filter={filter}
        setFilter={setFilter}
        header={'Satış'}
        isSearch={true}
        filterSearchKey={'docNumber'}
        isFilter={true}
        filterParams={{
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
            { id: 1, label: 'Ad', value: 'Name' },
            { id: 2, label: 'Satış nöqtəsi', value: 'SalePointName' },
            { id: 3, label: 'Tarix', value: 'Moment' },
            { id: 4, label: 'Tərəf-Müqabil', value: 'customerName' },
            { id: 5, label: 'Nağd', value: 'Cash' },
            { id: 6, label: 'Bonus', value: 'UseBonus' },
            { id: 7, label: 'Borca', value: 'Credit' },
            { id: 8, label: 'Qazanc', value: 'Profit' },
          ],
          customFields: {
            odenis: {
              title: 'Ödəniş',
              name: 'paytype',
              type: 'select',
              customSelection: true,
              options: [
                { key: 'p', value: 'Nağd' },
                { key: 'i', value: 'Köçürmə' },
                { key: '', value: 'Hamısı' },
              ],
            },
            owners: {
              title: 'Satıcı',
              type: 'select',
              api: 'employees',
              name: 'employeeId',
            },
          },
        }}
      />
      <DocumentTimes
        filter={filter}
        setFilter={setFilter}
        selected={selectedTime}
        setSelected={setSelectedTime}
      />
      {saleSum == null ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 0',
          borderBottom: '1px solid var(--adm-color-border)'
        }}>
          <SpinLoading color='primary' style={{ '--size': '20px' }} />
        </div>
      ) : (
        <DocumentInfo
          data={[
            { value: formatPrice(saleSum.CashSum), title: 'Nağd' },
            { title: 'Nağdız', value: formatPrice(saleSum.BankSum) },
            { title: 'Bonus', value: formatPrice(saleSum.BonusSum) },
            { title: 'Borc', value: formatPrice(saleSum.CreditSum) },
            { title: 'Yenuk məbləö', value: formatPrice(saleSum.AmountSum) },
            { title: 'Maya', value: formatPrice(saleSum.AllCost) },
            { title: 'Qazanc', value: formatPrice(saleSum.AllProfit) },
          ]}
        />
      )}

      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: 80,
        padding: '0 12px 80px 12px'
      }}>
        {sales == null || sales.length === 0 ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: 'var(--adm-color-weak)'
          }}>
            {sales === null ? (
              <SpinLoading color='primary' style={{ '--size': '40px' }} />
            ) : (
              <span>List boşdur</span>
            )}
          </div>
        ) : (
          sales.map((item, index) => renderItem(item, index))
        )}
      </div>

      {/* Floating Bubble for Add is currently hidden/not implemented in original SaleList? 
          Checking original code: No FabButton was present in the original code I read! 
          Wait, let me double check Step 117 output. 
          Ah, I see no FabButton usage in SaleList (Step 117). 
          However, usually Sales list might have a create button? 
          The user said "all list pages... like ProductList". 
          If there was no Create button before, maybe I shouldn't add one blindly. 
          But ProductList has one. 
          Actually, let me check if there is a 'CSale' permission check usually?
          The original code did NOT have a FabButton. 
          I will NOT add a FloatingBubble if there was no FabButton, to be safe.
          Except... I see `navigate('/sale/sale-manage')` in `renderItem`.
          Usually there IS a create button. 
          Let me re-read Step 117 carefully.
          Lines 242-254 list container. Line 255 closed div. Line 257 end component. 
          Indeed, NO FabButton in SaleList.jsx. 
          This is strange for a List page, but maybe Sales are created elsewhere (POS?).
          I will stick to the original functionality and NOT add FloatingBubble if it wasn't there.
      */}
    </div>
  );
};

export default SaleList;

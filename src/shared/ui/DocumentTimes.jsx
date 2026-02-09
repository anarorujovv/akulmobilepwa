import React, { useEffect } from 'react';
import { CapsuleTabs } from 'antd-mobile';
import moment from 'moment';

const DocumentTimes = ({ selected, setSelected, filter, setFilter }) => {
  const data = [
    { title: 'Bu gün', value: 'day' },
    { title: 'Dünən', value: 'yesterday' },
    { title: 'Bu ay', value: 'month' },
    // { title: '30 gün', value: '30' },
    { title: 'Keçən ay', value: 'lastMonth' },
    { title: 'Müddətsiz', value: 'all' }
  ];

  useEffect(() => {
    const updateDate = () => {
      // If selected is null, do nothing or handle default
      if (selected === null || selected === undefined) return;

      const today = new Date();
      let filterInfo = { ...filter };
      // Remove any previously set date filters first if needed, 
      // but the switch cases overwrite or delete them.

      // agrigate=1 is logic from original code
      filterInfo.agrigate = 1;

      const selectedValue = data[selected].value;

      switch (selectedValue) {
        case 'day':
          filterInfo.momb = moment(today).format('YYYY-MM-DD 00:00:00');
          filterInfo.mome = moment(today).format('YYYY-MM-DD 23:59:59');
          break;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          filterInfo.momb = moment(yesterday).format('YYYY-MM-DD 00:00:00');
          filterInfo.mome = moment(yesterday).format('YYYY-MM-DD 23:59:59');
          break;
        case 'month':
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          filterInfo.momb = moment(firstDayOfMonth).format('YYYY-MM-DD 00:00:00');
          filterInfo.mome = moment(today).format("YYYY-MM-DD 23:59:59");
          break;
        case 'lastMonth':
          const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          filterInfo.momb = moment(firstDayLastMonth).format("YYYY-MM-DD 00:00:00");
          filterInfo.mome = moment(lastDayLastMonth).format("YYYY-MM-DD 23:59:59");
          break;
        case 'all':
          delete filterInfo.momb;
          delete filterInfo.mome;
          break;
        default:
          break;
      }

      setFilter(filterInfo);
    };

    updateDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div style={{
      backgroundColor: 'var(--adm-color-background)',
      padding: '4px 0',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <CapsuleTabs
        activeKey={selected !== null ? selected.toString() : ''}
        onChange={(key) => setSelected(parseInt(key))}
        style={{
          '--title-font-size': '11px',
          '--padding': '4px 8px',
          '--gap': '6px'
        }}
      >
        {data.map((item, index) => (
          <CapsuleTabs.Tab title={item.title} key={index.toString()} />
        ))}
      </CapsuleTabs>
    </div>
  );
};

export default DocumentTimes;

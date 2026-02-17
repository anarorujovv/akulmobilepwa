import React, { useEffect, useState } from 'react';
import { DatePicker, Button, Input, ConfigProvider } from 'antd-mobile';
import moment from 'moment';
import enUS from 'antd-mobile/es/locales/en-US';

// Custom locale definition
const locale = {
  ...enUS,
  DatePicker: {
    ...enUS.DatePicker,
    tillNow: 'İndiyə qədər',
    ok: 'Təsdiq',
    cancel: 'Ləğv',
    year: 'il',
    month: 'ay',
    day: 'gün',
    hour: 'saat',
    minute: 'dəq'
  },
  common: {
    ...enUS.common,
    confirm: 'Təsdiq',
    cancel: 'Ləğv',
    loading: 'Yüklənir'
  }
}

const DateRangePicker = ({
  submit,
  width,
  filter,
  setFilter
}) => {
  let [firstDate, setFirstData] = useState(null);
  let [lastDate, setLastDate] = useState(null);

  let [firstDateModal, setFirstDateModal] = useState(false);
  let [lastDateModal, setLastDateModal] = useState(false);

  const handleConfirmFirstDate = (date) => {
    setFirstDateModal(false);
    if (!submit) {
      setFilter(rel => ({ ...rel, ['momb']: moment(date).format("YYYY-MM-DD 00:00:00") }));
    }
    setFirstData(new Date(date));
  };

  const handleConfirmLastDate = (date) => {
    setLastDateModal(false);
    if (!submit) {
      setFilter(rel => ({ ...rel, ['mome']: moment(date).format('YYYY-MM-DD 23:59:59') }));
    }
    setLastDate(new Date(date));
  };

  const onSubmit = (fDate, lDate) => {
    if (fDate != null) {
      setFilter(rel => ({ ...rel, ['momb']: moment(fDate).format("YYYY-MM-DD 00:00:00") }));
    }
    if (lDate != null) {
      setFilter(rel => ({ ...rel, ['mome']: moment(lDate).format('YYYY-MM-DD 23:59:59') }));
    }
  };

  const fetchingMomentData = () => {
    let filterObject = { ...filter };
    if (filterObject.momb && filterObject.mome) {
      setFirstData(new Date(filterObject.momb));
      setLastDate(new Date(filterObject.mome));
    } else {
      setFirstData(null);
      setLastDate(null);
    }
  };

  useEffect(() => {
    fetchingMomentData();
  }, [filter]);

  const labelRenderer = (type, data) => {
    switch (type) {
      case 'year': return data + ' il'
      case 'month': return data
      case 'day': return data
      default: return data
    }
  }

  return (
    <ConfigProvider locale={locale}>
      <div style={{ display: 'flex', gap: '10px', width: width || '100%', alignItems: 'center' }}>
        <div onClick={() => setFirstDateModal(true)} style={{ flex: 1 }}>
          <Input
            readOnly
            value={firstDate ? moment(firstDate).format('DD-MM-YYYY') : ''}
            placeholder='Başlama Tarixi'
            style={{
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '6px 10px',
              backgroundColor: '#fff',
              textAlign: 'center',
              '--font-size': '14px'
            }}
          />
        </div>

        <div onClick={() => setLastDateModal(true)} style={{ flex: 1 }}>
          <Input
            readOnly
            value={lastDate ? moment(lastDate).format('DD-MM-YYYY') : ''}
            placeholder='Bitmə Tarixi'
            style={{
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '6px 10px',
              backgroundColor: '#fff',
              textAlign: 'center',
              '--font-size': '14px'
            }}
          />
        </div>

        {submit && (
          <Button
            color='primary'
            onClick={() => {
              onSubmit(firstDate, lastDate);
            }}
            size='middle'
            style={{ flexShrink: 0 }}
          >
            Axtar
          </Button>
        )}

        <DatePicker
          visible={firstDateModal}
          onClose={() => setFirstDateModal(false)}
          value={firstDate}
          onConfirm={handleConfirmFirstDate}
          title="Başlama Tarixi"
          confirmText='Təsdiq'
          cancelText='Ləğv'
          renderLabel={labelRenderer}
        />

        <DatePicker
          visible={lastDateModal}
          onClose={() => setLastDateModal(false)}
          value={lastDate}
          onConfirm={handleConfirmLastDate}
          title="Bitmə Tarixi"
          confirmText='Təsdiq'
          cancelText='Ləğv'
          renderLabel={labelRenderer}
        />
      </div>
    </ConfigProvider>
  );
};

export default DateRangePicker;

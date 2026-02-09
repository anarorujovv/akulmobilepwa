import React, { useEffect, useState } from 'react';
import Input from './Input';
import moment from 'moment';
import Button from './Button';
import MyModal from './MyModal';
import useTheme from '../theme/useTheme';

const DateRangePicker = ({
  submit,
  width,
  filter,
  setFilter
}) => {
  const theme = useTheme();
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

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      width: width,
      gap: 10,
      alignItems: 'center'
    },
    pressable: {
      width: submit ? '40%' : '50%',
      cursor: 'pointer'
    },
    modalContent: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      alignItems: 'center',
      justifyContent: 'center'
    },
    dateInput: {
      padding: 10,
      fontSize: 16,
      borderRadius: 5,
      border: `1px solid ${theme.input.greyWhite}`,
      width: '100%',
      boxSizing: 'border-box'
    }
  };

  return (
    <div style={styles.container}>

      <div
        style={styles.pressable}
        onClick={() => {
          setFirstDateModal(true);
        }}
      >
        <Input
          width={'100%'}
          value={firstDate == null ? "" : moment(firstDate).format('DD-MM-YYYY')}
          disabled={true}
          type={'text'}
          placeholder={'Başlama Tarixi'}
          onChange={() => { }}
        />
      </div>

      <div style={styles.pressable}
        onClick={() => {
          setLastDateModal(true);
        }}
      >
        <Input
          width={'100%'}
          value={lastDate == null ? "" : moment(lastDate).format('DD-MM-YYYY')}
          disabled={true}
          type={'text'}
          placeholder={'Bitmə Tarixi'}
          onChange={() => { }}
        />
      </div>

      {submit ?
        <Button
          width={'20%'}
          onClick={() => {
            onSubmit(firstDate, lastDate);
          }}
        >
          Axtar
        </Button>
        :
        null
      }

      <MyModal
        modalVisible={firstDateModal}
        setModalVisible={setFirstDateModal}
        center={true}
        width={'300px'}
        height={'auto'}
      >
        <div style={styles.modalContent}>
          <h3>Başlama Tarixi</h3>
          <input
            type="date"
            style={styles.dateInput}
            onChange={(e) => handleConfirmFirstDate(e.target.value)}
          />
          <Button onClick={() => setFirstDateModal(false)} width="100%">Bağla</Button>
        </div>
      </MyModal>

      <MyModal
        modalVisible={lastDateModal}
        setModalVisible={setLastDateModal}
        center={true}
        width={'300px'}
        height={'auto'}
      >
        <div style={styles.modalContent}>
          <h3>Bitmə Tarixi</h3>
          <input
            type="date"
            style={styles.dateInput}
            onChange={(e) => handleConfirmLastDate(e.target.value)}
          />
          <Button onClick={() => setLastDateModal(false)} width="100%">Bağla</Button>
        </div>
      </MyModal>

    </div>
  );
};

export default DateRangePicker;

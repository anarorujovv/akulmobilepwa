import React, { useContext, useState } from 'react';
import ManageCard from '../../../shared/ui/ManageCard';
import Input from '../../../shared/ui/Input';
import { PaymentGlobalContext } from '../../../shared/data/PaymentGlobalState';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';

const MainCard = ({ changeInput, changeSelection }) => {
  const theme = useTheme();
  const { document, setDocument, types } = useContext(PaymentGlobalContext);
  const [momentModal, setMomentModal] = useState(false);

  const styles = {
    header: {
      width: '100%',
      padding: 15,
      textAlign: 'center'
    },
    headerText: {
      fontSize: 20,
      color: theme.primary,
      fontWeight: 'bold'
    },
    content: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 15
    }
  };

  return (
    <ManageCard>
      <div style={styles.header}>
        <span style={styles.headerText}>{`${types.direct == "ins" ? "Mədaxil" : "Məxaric"} - (${types.type == "payment" ? "nağd" : "köçürmə"})`}</span>
      </div>

      <div style={styles.content}>
        <Input
          width={'70%'}
          placeholder={'Ad'}
          value={document.Name}
          type={'string'}
          onChange={(e) => {
            changeInput('Name', e);
          }}
        />

        <SelectionDate
          change={() => {
            changeSelection();
          }}
          document={document}
          setDocument={setDocument}
          modalVisible={momentModal}
          setModalVisible={setMomentModal}
        />
      </div>
    </ManageCard>
  );
};

export default MainCard;

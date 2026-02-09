import React, { useContext, useState } from 'react';
import ManageCard from './../../../shared/ui/ManageCard';
import { SupplyGlobalContext } from '../../../shared/data/SupplyGlobalState';
import Input from '../../../shared/ui/Input';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';

const MainCard = ({ id, changeInput, changeSelection }) => {

  const { document, setDocument } = useContext(SupplyGlobalContext);
  const [momentModal, setMomentModal] = useState(false);

  let theme = useTheme();

  return (
    <ManageCard>

      <div style={{
        width: '100%',
        padding: 15,
        boxSizing: 'border-box'
      }}>
        <span style={{
          fontSize: 20,
          color: theme.primary,
          fontWeight: 'bold',
          display: 'block'
        }}>Alış</span>
      </div>

      <div style={{
        marginTop: 20,
        gap: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 20
      }}>

        <Input
          placeholder={'Ad'}
          type={'string'}
          width={'70%'}
          value={document.Name}
          onChange={(e) => {
            changeInput('Name', e);
          }}
        />

        <SelectionDate
          change={changeSelection}
          document={document}
          setDocument={setDocument}
          modalVisible={momentModal}
          setModalVisible={setMomentModal}
        />

      </div>

    </ManageCard>
  )
}

export default MainCard;

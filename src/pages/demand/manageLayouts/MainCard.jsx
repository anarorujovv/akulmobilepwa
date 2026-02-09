import React, { useContext, useState } from 'react';
import ManageCard from './../../../shared/ui/ManageCard';
import Input from '../../../shared/ui/Input';
import { DemandGlobalContext } from '../../../shared/data/DemandGlobalState';
import useTheme from '../../../shared/theme/useTheme';
import SelectionDate from '../../../shared/ui/SelectionDate';
import CustomSelection from '../../../shared/ui/CustomSelection';
import paymethdemo from '../../../paymethdem';
import useGlobalStore from '../../../shared/data/zustand/useGlobalStore';

const MainCard = ({ changeInput, changeSelection }) => {

  const local = useGlobalStore(state => state.local);
  let theme = useTheme();

  const { document, setDocument } = useContext(DemandGlobalContext);
  const [momentModal, setMomentModal] = useState(false);


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
          display: 'block'
        }}>Satış</span>
      </div>
      <div style={{
        marginTop: 20,
        gap: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Input
          placeholder={'Ad'}
          type={'text'} // 'string' -> 'text' for web input
          width={'70%'}
          value={document.Name}
          onChange={(e) => {
            changeInput('Name', e);
          }}
        />

        <SelectionDate
          disabled={local.demands.demand.date ? false : true}
          change={changeSelection}
          document={document}
          setDocument={setDocument}
          modalVisible={momentModal}
          setModalVisible={setMomentModal}
        />

        <div style={{
          width: '70%'
        }}>
          <CustomSelection
            value={document.PaymentMethod}
            options={paymethdemo}
            onChange={(e) => {
              changeSelection('PaymentMethod', e);
            }}
            placeholder={'Satış novü'}
            title={'Satış növü'}
          />
        </div>
      </div>

    </ManageCard>
  )
}

export default MainCard;

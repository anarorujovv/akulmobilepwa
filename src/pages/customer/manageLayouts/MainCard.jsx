import React, { useContext, useState } from 'react';
import ManageCard from './../../../shared/ui/ManageCard';
import useTheme from '../../../shared/theme/useTheme';
import { CustomerGlobalContext } from '../../../shared/data/CustomerGlobalState';
import Input from './../../../shared/ui/Input';
import api from '../../../services/api';
import AsyncStorageWrapper from '../../../services/AsyncStorageWrapper';
import ErrorMessage from '../../../shared/ui/RepllyMessage/ErrorMessage';
import IconButton from '../../../shared/ui/IconButton';
import { FaUser, FaSync } from 'react-icons/fa';
import CustomerGroupsModal from '../../../shared/ui/modals/CustomerGroups';
import PricesModal from './../../../shared/ui/modals/PricesModal';
import Selection from '../../../shared/ui/Selection';

const MainCard = ({ changeInput, changeSelection }) => {
  let theme = useTheme();

  const { document, setDocument } = useContext(CustomerGlobalContext);
  const [groupModal, setGrouoModal] = useState(false);
  const [pricesModal, setPricesModal] = useState(false);

  const styles = {
    header: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      padding: 15,
      alignItems: 'center',
      width: '100%'
    },
    content: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10
    }
  };

  const handleChange = (type, value) => {
    changeInput(type, value);
  };

  const fetchingBarCode = async () => {
    let obj = {
      w: 2,
      token: await AsyncStorageWrapper.getItem('token')
    };
    await api('barcode/get.php', obj)
      .then(element => {
        if (element != null) {
          handleChange('Card', element);
        }
      })
      .catch(err => {
        ErrorMessage(err);
      });
  };

  return (
    <>
      <ManageCard>
        <div style={styles.header}>
          <FaUser color={theme.grey} size={20} />
          <span style={{ color: theme.grey }}>Tərəf-müqabil</span>
        </div>

        <div style={styles.content}>
          <Input
            isRequired={true}
            placeholder={"Tərəf müqabilinin adı"}
            width={'70%'}
            type={'string'}
            value={document.Name}
            onChange={(e) => {
              handleChange('Name', e);
            }}
          />

          <Selection
            isRequired={true}
            apiBody={{}}
            apiName={'customergroups/get.php'}
            change={(item) => {
              handleChange('GroupId', item.Id);
            }}
            title={'Qrup'}
            value={document.GroupId}
            defaultValue={document.GroupName}
          />

          <Selection
            apiBody={{}}
            apiName={'pricetypes/get.php'}
            value={document.PriceTypeId}
            defaultValue={document.PriceTypeName}
            change={(e) => {
              handleChange('PriceTypeId', e.Id);
            }}
            title={'Qiymət'}
          />

          <Input
            placeholder={"Telefon"}
            width={'70%'}
            type={'number'}
            value={document.Phone}
            onChange={(e) => {
              handleChange('Phone', e);
            }}
          />

          <div style={{ position: 'relative', width: '70%' }}>
            <Input
              placeholder={'Kart'}
              width={'100%'}
              type={'number'}
              value={document.Card}
              onChange={(e) => {
                handleChange("Card", e);
              }}
            />
            <div style={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)' }}>
              <IconButton size={25} onPress={fetchingBarCode}>
                <FaSync size={15} color={theme.black} />
              </IconButton>
            </div>
          </div>

          <Input
            placeholder={'Endirim %'}
            width={'70%'}
            type={'number'}
            value={document.Discount}
            onChange={(e) => {
              handleChange('Discount', e);
            }}
          />

          <Input
            placeholder={'Bonus'}
            width={'70%'}
            type={'number'}
            value={document.Bonus}
            onChange={(e) => {
              handleChange('Bonus', e);
            }}
          />

          <Input
            placeholder={'Email'}
            width={'70%'}
            type={'string'}
            value={document.Mail}
            onChange={(e) => {
              handleChange('Mail', e);
            }}
          />
        </div>
      </ManageCard>

      <CustomerGroupsModal modalVisible={groupModal} setModalVisible={setGrouoModal} setProduct={setDocument} />
      <PricesModal modalVisible={pricesModal} setModalVisible={setPricesModal} setProduct={setDocument} />
    </>
  );
};

export default MainCard;

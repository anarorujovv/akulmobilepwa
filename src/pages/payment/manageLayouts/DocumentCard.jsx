import React, { useContext } from 'react';
import ManageCard from '../../../shared/ui/ManageCard';
import { MdInsertDriveFile } from 'react-icons/md';
import Input from '../../../shared/ui/Input';
import { PaymentGlobalContext } from '../../../shared/data/PaymentGlobalState';

const DocumentCard = ({ cost, changeInput }) => {
  const { document } = useContext(PaymentGlobalContext);

  const styles = {
    header: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      padding: 15,
      alignItems: 'center'
    },
    content: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  };

  return (
    <ManageCard>
      <div style={styles.header}>
        <MdInsertDriveFile size={20} />
        <span>Digər</span>
      </div>

      <div style={styles.content}>
        <Input
          value={document.Description}
          placeholder={'Açıqlama'}
          onChange={(e) => {
            changeInput('Description', e);
          }}
          type={'string'}
          width={'70%'}
        />
      </div>
    </ManageCard>
  );
};

export default DocumentCard;

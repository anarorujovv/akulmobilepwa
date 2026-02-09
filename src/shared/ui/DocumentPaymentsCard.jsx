import React, { useEffect, useState } from 'react';
import ManageCard from './ManageCard';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import ErrorMessage from './RepllyMessage/ErrorMessage';
import useTheme from '../theme/useTheme';
import ListItem from './list/ListItem';
import { formatPrice } from '../../services/formatPrice';
import { IoCashOutline } from 'react-icons/io5';

const DocumentPaymentsCard = ({ target, id, navigation }) => {

  let theme = useTheme();
  const [documents, setDocuments] = useState([]);

  const styles = {
    header: {
      width: '100%',
      padding: 15,
      gap: 10,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      boxSizing: 'border-box'
    },
    text: {
      color: theme.grey,
      fontWeight: 500
    }
  };

  let fetchApi = async () => {
    let obj = {
      doctype: target,
      id: id,
      token: await AsyncStorageWrapper.getItem("token")
    }
    await api('links/get.php', obj)
      .then(element => {
        if (element != null) {
          if (element.List[0]) {
            setDocuments(element.List);
          } else {
            setDocuments(null)
          }
        }
      })
      .catch(err => {
        ErrorMessage(err)
      })
  }

  useEffect(() => {
    fetchApi();
  }, []) // Remove useFocusEffect unless strictly needed for navigation focus. If needed, can add event listener.

  return (
    documents != null && (
      <ManageCard
        customPadding={{
          paddingTop: 10
        }}
      >
        <div style={styles.header}>
          <IoCashOutline size={20} color={theme.grey} />
          <span style={styles.text}>Ödənişlər</span>
        </div>

        {
          documents.map((element, index) => {
            return (
              <ListItem
                key={index}
                firstText={element.Moment}
                centerText={element.Name}
                priceText={formatPrice(element.Amount)}
                index={index + 1}
                onPress={() => {
                  navigation.navigate('payment', {
                    id: element.Id,
                    type: element.DocType,
                    direct: 's',
                  })
                }}
              />
            );
          })
        }
      </ManageCard>
    )
  );
};

export default DocumentPaymentsCard;
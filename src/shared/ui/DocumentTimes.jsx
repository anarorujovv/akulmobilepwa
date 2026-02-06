import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Pressable } from '@react-native-material/core';
import useTheme from '../theme/useTheme';
import moment from 'moment';

const DocumentTimes = ({ selected, setSelected, filter, setFilter }) => {
  let data = [
    { title: 'Bu gün', value: 'day' },
    { title: 'Dünən', value: 'yesterday' },
    { title: 'Bu ay', value: 'month' },
    // { title: '30 gün', value: '30' },
    { title: 'Keçən ay', value: 'lastMonth' },
    { title: 'Müddətsiz', value: 'all' }
  ];

  let theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      padding: 5,
      justifyContent: 'space-around',
      marginTop: 5,
    },
    button: {
      minWidth: 60,
      height: 25,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 3,
    },
    text: {
      color: theme.primary,
      fontSize: 12,
      marginRight: 10,
      marginLeft: 10,
    },
    buttonActive: {
      backgroundColor: theme.primary,
      minWidth: 60,
      height: 25,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    textActive: {
      color: theme.stable.white,
      fontSize: 12,
      marginLeft: 10,
      marginRight: 10,
    },
  });

  useEffect(() => {
    const updateDate = () => {
      const today = new Date();
      let filterInfo = { ...filter };
      filterInfo.agrigate = 1;

      switch (data[selected].value) {
        case 'day':
          filterInfo.momb = moment(today).format('YYYY-MM-DD 00:00:00');
          filterInfo.mome = moment(today).format('YYYY-MM-DD 23:59:59');
          break;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          filterInfo.momb = moment(yesterday).format('YYYY-MM-DD 00:00:00')
          filterInfo.mome = moment(yesterday).format('YYYY-MM-DD 23:59:59')
          break;
        case 'month':
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          filterInfo.momb = moment(firstDayOfMonth).format('YYYY-MM-DD 00:00:00');
          filterInfo.mome = moment(today).format("YYYY-MM-DD 23:59:59");
          break;
          
        // case '30':
        //   const thirtyDaysAgo = new Date(today);
        //   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        //   filterInfo.momb = moment(thirtyDaysAgo).format("YYYY-MM-DD 00:00:00");
        //   filterInfo.mome = moment(thirtyDaysAgo).format("YYYY-MM-DD 23:59:59");
        //   break;
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
      }

      setFilter(filterInfo);
    };

    if (selected != null) {
      updateDate();
    }
  }, [selected]);


  return (
    <View style={styles.container}>
      {data.map((element, index) => (
        <Pressable
          onPress={() => setSelected(index)}
          style={{}}
          pressEffectColor={theme.input.grey}
          key={element.value}
        >
          <View style={index === selected ? styles.buttonActive : styles.button}>
            <Text style={index === selected ? styles.textActive : styles.text}>{element.title}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default DocumentTimes;

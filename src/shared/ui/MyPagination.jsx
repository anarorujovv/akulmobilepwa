import { StyleSheet, View } from 'react-native'
import React from 'react'
import Pagination from '@cherry-soft/react-native-basic-pagination'
import useTheme from '../theme/useTheme'

const MyPagination = ({itemSize,page,setPage,pageSize}) => {
  let theme =  useTheme();
  return (
    <>
      <Pagination
        pageSize={pageSize}
        totalItems={itemSize}
        currentPage={page}
        onPageChange={setPage}
        showLastPagesButtons
        btnStyle={{
          backgroundColor: theme.bg,
          borderWidth: 0,
          borderRadius:2,
          padding:5,
          borderWidth:1,
          borderColor:theme.primary
        }}
        textStyle={{
          fontSize:8,
          color:theme.primary,
        }}
        activeBtnStyle={{
          backgroundColor: theme.primary,
        }}
        activeTextStyle={{
          fontSize:8,
          color:theme.bg
        }}
      />
      <View style={{ margin: 40 }} />
    </>
  )
}

export default MyPagination

const styles = StyleSheet.create({})
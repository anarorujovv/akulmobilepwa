import React from 'react'
import { InventoryGlobalProvider } from '../../shared/data/InventoryGlobalState'
import InventoryManage from './InventoryManage'

const InventoryManageProvider = ({route,navigation}) => {
  return (
    <InventoryGlobalProvider>
      <InventoryManage route={route} navigation={navigation}/>
    </InventoryGlobalProvider>
  )
}

export default InventoryManageProvider
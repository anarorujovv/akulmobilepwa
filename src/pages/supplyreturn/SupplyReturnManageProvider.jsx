import React from 'react'
import { SupplyReturnGlobalProvider } from '../../shared/data/SupplyReturnGlobalState'
import SupplyReturnManage from './SupplyReturnManage'

const SupplyReturnManageProvider = ({route,navigation}) => {
  return (
    <SupplyReturnGlobalProvider>
      <SupplyReturnManage route={route} navigation={navigation}/>
    </SupplyReturnGlobalProvider>
  )
}

export default SupplyReturnManageProvider
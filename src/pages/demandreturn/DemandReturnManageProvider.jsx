import React from 'react'
import { DemandReturnGlobalProvider } from '../../shared/data/DemandReturnGlobalState'
import DemandReturnManage from './DemandReturnManage'

const DemandReturnManageProvider = ({route,navigation}) => {
  return (
    <DemandReturnGlobalProvider>
      <DemandReturnManage route={route} navigation={navigation}/>
    </DemandReturnGlobalProvider>
  )
}

export default DemandReturnManageProvider
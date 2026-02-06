import React from 'react'
import { DemandGlobalProvider } from '../../shared/data/DemandGlobalState'
import DemandManage from './DemandManage'

const DemandManageProvider = ({route,navigation}) => {
  return (
    <DemandGlobalProvider>
      <DemandManage route={route} navigation={navigation}/>
    </DemandGlobalProvider>
  )
}

export default DemandManageProvider
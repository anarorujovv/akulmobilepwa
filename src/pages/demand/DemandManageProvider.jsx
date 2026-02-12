import React from 'react'
import { DemandGlobalProvider } from '../../shared/data/DemandGlobalState'
import DemandManage from './DemandManage'

const DemandManageProvider = () => {
  return (
    <DemandGlobalProvider>
      <DemandManage />
    </DemandGlobalProvider>
  )
}

export default DemandManageProvider
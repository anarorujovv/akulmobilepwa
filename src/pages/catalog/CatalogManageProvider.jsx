import React from 'react'
import { CatalogGlobalProvider } from '../../shared/data/CatalogGlobalState'
import CatalogManage from './CatalogManage'

const CatalogManageProvider = ({route,navigation}) => {
  return (
    <CatalogGlobalProvider>
      <CatalogManage route={route} navigation={navigation}/>
    </CatalogGlobalProvider>
  )
}

export default CatalogManageProvider
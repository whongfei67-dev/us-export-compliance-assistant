import React, { createContext, useContext, useState } from 'react'

const ComplianceContext = createContext()

export const useCompliance = () => {
  const context = useContext(ComplianceContext)
  if (!context) {
    throw new Error('useCompliance must be used within ComplianceProvider')
  }
  return context
}

export const ComplianceProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // 企业信息
    companyName: '',
    companyLocation: '',
    companyType: '',
    memberState: '', // 欧盟成员国

    // 买家信息
    buyerName: '',
    buyerCountry: '',
    buyerType: '',
    endUser: '',

    // 产品信息
    productName: '',
    productCategory: '',
    eccnCode: '',
    cnlCode: '', // 欧盟管制清单编码
    techPercentage: '',
    value: '',
    hasUSTechnology: false,
    hasTechTransfer: false,
    techDescription: '',
    dualUse: false,

    // 运输信息
    destination: '',
    transportRoute: '',

    // 最终用途
    endUse: '',
    endUserCertificate: false,
  })

  const [euFormData, setEuFormData] = useState({
    // 欧盟专用字段
    exporterCountry: '',
    memberState: '',
    buyerCountry: '',
    buyerType: '',
    productCategory: '',
    cnlCode: '',
    dualUse: false,
    hasTechTransfer: false,
    techDescription: '',
    endUse: '',
    endUserCertificate: false,
    destination: '',
    transportRoute: '',
  })

  const [complianceHistory, setComplianceHistory] = useState([])
  const [euComplianceHistory, setEuComplianceHistory] = useState([])

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const updateEuFormData = (key, value) => {
    setEuFormData(prev => ({ ...prev, [key]: value }))
  }

  const addToHistory = (result) => {
    if (result.region === 'EU') {
      setEuComplianceHistory(prev => [{
        id: Date.now(),
        ...result,
        timestamp: new Date().toISOString()
      }, ...prev].slice(0, 50))
    } else {
      setComplianceHistory(prev => [{
        id: Date.now(),
        ...result,
        timestamp: new Date().toISOString()
      }, ...prev].slice(0, 50))
    }
  }

  return (
    <ComplianceContext.Provider value={{
      formData,
      updateFormData,
      euFormData,
      updateEuFormData,
      complianceHistory,
      euComplianceHistory,
      addToHistory
    }}>
      {children}
    </ComplianceContext.Provider>
  )
}

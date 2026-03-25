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
  // 美国出口表单数据
  const [formData, setFormData] = useState({
    // 企业信息
    companyName: '',
    companyLocation: '',
    companyType: '',

    // 原产国和买方信息
    originCountry: '',
    buyerName: '',
    buyerType: '',

    // 产品信息
    productName: '',
    productCategory: '',
    hsCode: '',
    productValue: '',
    fccApproval: false,
    fdaApproval: false,

    // 文件和认证
    hasCertificate: false,
    hasCommercialInvoice: false,
    hasTestReport: false,
  })

  // 欧盟出口表单数据
  const [euFormData, setEuFormData] = useState({
    // 出口商信息
    exporterName: '',
    exporterAddress: '',
    memberState: '',
    eoriNumber: '',

    // 买方信息
    buyerName: '',
    buyerCountry: '',
    buyerType: '',
    endUser: '',

    // 产品信息
    productName: '',
    productCategory: '',
    cnlCode: '',
    value: '',
    techDescription: '',
    dualUse: false,
    hasTechTransfer: false,

    // 最终用途
    endUse: '',
    endUserCertificate: false,

    // 运输
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

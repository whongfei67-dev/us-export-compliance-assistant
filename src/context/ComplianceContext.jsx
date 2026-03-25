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
    
    // 买家信息
    buyerName: '',
    buyerCountry: '',
    buyerType: '',
    endUser: '',
    
    // 产品信息
    productName: '',
    productCategory: '',
    eccnCode: '',
    techPercentage: '',
    value: '',
    hasUSTechnology: false,
    
    // 运输信息
    destination: '',
    transportRoute: '',
  })

  const [complianceHistory, setComplianceHistory] = useState([])

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const addToHistory = (result) => {
    setComplianceHistory(prev => [{
      id: Date.now(),
      ...result,
      timestamp: new Date().toISOString()
    }, ...prev].slice(0, 50))
  }

  return (
    <ComplianceContext.Provider value={{
      formData,
      updateFormData,
      complianceHistory,
      addToHistory
    }}>
      {children}
    </ComplianceContext.Provider>
  )
}

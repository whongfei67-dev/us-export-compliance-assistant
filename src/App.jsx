import React, { useState } from 'react'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ComplianceCheck from './pages/ComplianceCheck'
import ResultsPage from './pages/ResultsPage'
import DocumentGenerator from './pages/DocumentGenerator'
import EUComplianceCheck from './pages/EUComplianceCheck'
import EUResultsPage from './pages/EUResultsPage'
import EUDocumentGenerator from './pages/EUDocumentGenerator'
import { ComplianceProvider } from './context/ComplianceContext'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [complianceResult, setComplianceResult] = useState(null)
  const [region, setRegion] = useState('US')

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion)
    setCurrentPage('home')
    setComplianceResult(null)
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
    if (page !== 'results' && page !== 'document') {
      setComplianceResult(null)
    }
  }

  const renderPage = () => {
    // US Region Pages
    if (region === 'US') {
      switch(currentPage) {
        case 'home':
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} />
        case 'check':
          return <ComplianceCheck onResultsReady={(results) => {
            setComplianceResult(results)
            handleNavigate('results')
          }} />
        case 'results':
          return <ResultsPage 
            results={complianceResult} 
            onBack={() => handleNavigate('home')} 
            onGenerateDoc={() => handleNavigate('document')} 
          />
        case 'document':
          return <DocumentGenerator results={complianceResult} onBack={() => handleNavigate('results')} />
        default:
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} />
      }
    }

    // EU Region Pages
    if (region === 'EU') {
      switch(currentPage) {
        case 'home':
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} />
        case 'check':
          return <EUComplianceCheck onResultsReady={(results) => {
            setComplianceResult(results)
            handleNavigate('results')
          }} />
        case 'results':
          return <EUResultsPage 
            results={complianceResult} 
            onBack={() => handleNavigate('home')} 
            onGenerateDoc={() => handleNavigate('document')} 
          />
        case 'document':
          return <EUDocumentGenerator results={complianceResult} onBack={() => handleNavigate('results')} />
        default:
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} />
      }
    }
  }

  return (
    <ComplianceProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header currentPage={currentPage} onNavigate={handleNavigate} region={region} onRegionChange={handleRegionChange} />
        <main className="pt-20">
          {renderPage()}
        </main>
      </div>
    </ComplianceProvider>
  )
}

export default App

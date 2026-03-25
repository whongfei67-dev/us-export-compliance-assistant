import React, { useState } from 'react'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ComplianceCheck from './pages/ComplianceCheck'
import ResultsPage from './pages/ResultsPage'
import DocumentGenerator from './pages/DocumentGenerator'
import { ComplianceProvider } from './context/ComplianceContext'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [complianceResult, setComplianceResult] = useState(null)

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage onStartCheck={() => setCurrentPage('check')} />
      case 'check':
        return <ComplianceCheck onResultsReady={(results) => {
          setComplianceResult(results)
          setCurrentPage('results')
        }} />
      case 'results':
        return <ResultsPage 
          results={complianceResult} 
          onBack={() => setCurrentPage('home')} 
          onGenerateDoc={() => setCurrentPage('document')} 
        />
      case 'document':
        return <DocumentGenerator results={complianceResult} onBack={() => setCurrentPage('results')} />
      default:
        return <HomePage onStartCheck={() => setCurrentPage('check')} />
    }
  }

  return (
    <ComplianceProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="pt-20">
          {renderPage()}
        </main>
      </div>
    </ComplianceProvider>
  )
}

export default App

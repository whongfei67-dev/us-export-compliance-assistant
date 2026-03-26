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
  const [direction, setDirection] = useState('export')

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion)
    setCurrentPage('home')
    setComplianceResult(null)
  }

  const handleDirectionChange = (newDirection) => {
    setDirection(newDirection)
    setCurrentPage('home')
    setComplianceResult(null)
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
    if (page !== 'results' && page !== 'document') {
      setComplianceResult(null)
    }
  }

  const getPageKey = () => `${region}-${direction}`

  const renderPage = () => {
    const pageKey = getPageKey()

    // US Export Pages
    if (pageKey === 'US-export') {
      switch(currentPage) {
        case 'home':
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} direction={direction} />
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
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} direction={direction} />
      }
    }

    // EU Export Pages
    if (pageKey === 'EU-export') {
      switch(currentPage) {
        case 'home':
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} direction={direction} />
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
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} direction={direction} />
      }
    }

    // US Import Pages
    if (pageKey === 'US-import') {
      switch(currentPage) {
        case 'home':
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} direction={direction} />
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
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} direction={direction} />
      }
    }

    // EU Import Pages
    if (pageKey === 'EU-import') {
      switch(currentPage) {
        case 'home':
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} direction={direction} />
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
          return <HomePage onStartCheck={() => handleNavigate('check')} region={region} direction={direction} />
      }
    }
  }

  return (
    <ComplianceProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header currentPage={currentPage} onNavigate={handleNavigate} region={region} direction={direction} onRegionChange={handleRegionChange} onDirectionChange={handleDirectionChange} />
        <main className="pt-20">
          {renderPage()}
        </main>
      </div>
    </ComplianceProvider>
  )
}

export default App

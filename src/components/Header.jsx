import React from 'react'
import { Shield, CheckCircle, FileText, AlertTriangle, Building, Globe, Package, Flag } from 'lucide-react'

const Header = ({ currentPage, onNavigate, region, onRegionChange }) => {
  const navItems = [
    { id: 'home', label: '首页', icon: Shield },
    { id: 'check', label: '合规检测', icon: CheckCircle },
    { id: 'document', label: '文件生成', icon: FileText },
  ]

  const regions = [
    { id: 'US', label: '美国出口', color: 'bg-blue-100 text-blue-700' },
    { id: 'EU', label: '欧盟出口', color: 'bg-indigo-100 text-indigo-700' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">进出口合规助手</h1>
              <p className="text-xs text-gray-500">智能决策系统</p>
            </div>
          </div>

          {/* Region Selector */}
          <div className="flex items-center space-x-2 mr-4">
            <Flag className="w-4 h-4 text-gray-400" />
            <div className="flex bg-gray-100 rounded-lg p-1">
              {regions.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onRegionChange(r.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    region === r.id
                      ? r.color
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? region === 'EU' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

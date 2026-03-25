import React from 'react'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Shield,
  Clock,
  Building,
  Globe,
  Package,
  Truck,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

const ResultsPage = ({ results, onBack, onGenerateDoc }) => {
  const [expandedChecks, setExpandedChecks] = React.useState({})

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">暂无检测结果</h2>
        <button onClick={onBack} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          返回首页
        </button>
      </div>
    )
  }

  const toggleCheck = (index) => {
    setExpandedChecks(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PASS': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'FAIL': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getRiskBadge = (level) => {
    const badges = {
      'HIGH': { bg: 'bg-red-100 text-red-800', label: '高风险' },
      'MEDIUM': { bg: 'bg-yellow-100 text-yellow-800', label: '中等风险' },
      'LOW': { bg: 'bg-green-100 text-green-800', label: '低风险' }
    }
    const badge = badges[level] || badges['LOW']
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${badge.bg}`}>
        {badge.label}
      </span>
    )
  }

  const getVerdictIcon = (icon) => {
    switch(icon) {
      case 'XCircle': return <XCircle className="w-12 h-12" />
      case 'AlertTriangle': return <AlertTriangle className="w-12 h-12" />
      case 'AlertCircle': return <AlertCircle className="w-12 h-12" />
      case 'CheckCircle': return <CheckCircle className="w-12 h-12" />
      default: return <Shield className="w-12 h-12" />
    }
  }

  const getVerdictColor = (status) => {
    switch(status) {
      case 'PROHIBITED': return 'text-red-600 bg-red-50'
      case 'HIGH_RISK': return 'text-orange-600 bg-orange-50'
      case 'MEDIUM_RISK': return 'text-yellow-600 bg-yellow-50'
      case 'LOW_RISK': return 'text-green-600 bg-green-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  const getActionIcon = (type) => {
    switch(type) {
      case 'STOP': return <XCircle className="w-5 h-5 text-red-500" />
      case 'LICENSE': return <FileText className="w-5 h-5 text-blue-500" />
      case 'DUE_DILIGENCE': return <Shield className="w-5 h-5 text-green-500" />
      case 'TECH_REVIEW': return <Package className="w-5 h-5 text-purple-500" />
      case 'DOCUMENTATION': return <FileText className="w-5 h-5 text-gray-500" />
      case 'CONSULTATION': return <Building className="w-5 h-5 text-orange-500" />
      default: return <Clock className="w-5 h-5 text-blue-500" />
    }
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      'URGENT': 'bg-red-100 text-red-700 border-red-200',
      'HIGH': 'bg-orange-100 text-orange-700 border-orange-200',
      'MEDIUM': 'bg-blue-100 text-blue-700 border-blue-200',
      'LOW': 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return `px-2 py-1 text-xs rounded border ${badges[priority] || badges['LOW']}`
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回首页
        </button>
      </div>

      {/* Verdict Card */}
      <div className={`rounded-2xl p-8 mb-8 ${getVerdictColor(results.verdict.status)}`}>
        <div className="flex items-start space-x-6">
          <div className={results.verdict.status === 'PROHIBITED' ? 'text-red-600' : ''}>
            {getVerdictIcon(results.verdict.icon)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold">{results.verdict.title}</h2>
              {getRiskBadge(results.riskLevel)}
            </div>
            <p className="text-lg opacity-90">{results.verdict.summary}</p>
            <div className="mt-4 flex items-center text-sm opacity-75">
              <Clock className="w-4 h-4 mr-2" />
              检测时间: {new Date(results.timestamp).toLocaleString('zh-CN')}
              <span className="mx-4">|</span>
              风险评分: <span className="font-bold ml-1">{results.riskScore}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">交易信息摘要</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <Building className="w-10 h-10 text-blue-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500">企业</p>
              <p className="font-medium text-gray-900 truncate">{results.formData.companyName || '未填写'}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <Globe className="w-10 h-10 text-green-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500">买家</p>
              <p className="font-medium text-gray-900 truncate">{results.formData.buyerName || '未填写'}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <Package className="w-10 h-10 text-purple-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500">产品</p>
              <p className="font-medium text-gray-900 truncate">{results.formData.productName || '未填写'}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <Truck className="w-10 h-10 text-orange-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500">目的地</p>
              <p className="font-medium text-gray-900 truncate">{results.formData.destination || '未填写'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">风险评估详情</h3>
        <div className="space-y-3">
          {results.checks.map((check, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCheck(index)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  {getStatusIcon(check.status)}
                  <span className="ml-3 font-medium text-gray-900">{check.name}</span>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium mr-3 ${
                    check.status === 'PASS' ? 'bg-green-100 text-green-700' :
                    check.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {check.status === 'PASS' ? '通过' : check.status === 'WARNING' ? '警告' : '失败'}
                  </span>
                  {expandedChecks[index] ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </button>
              {expandedChecks[index] && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <p className="mt-4 text-gray-700">{check.details}</p>
                  {check.recommendations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">建议措施:</h4>
                      <ul className="space-y-1">
                        {check.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {check.legalBasis.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">法规依据:</h4>
                      <ul className="space-y-1">
                        {check.legalBasis.map((law, i) => (
                          <li key={i} className="text-sm text-gray-600 italic">
                            {law}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Basis */}
      {results.regulatoryBasis.length > 0 && (
        <div className="bg-blue-50 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">适用法规</h3>
          <div className="flex flex-wrap gap-2">
            {[...new Set(results.regulatoryBasis)].map((law, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {law}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">行动建议</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {results.actions.map((action, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  {getActionIcon(action.type)}
                  <h4 className="ml-2 font-medium text-gray-900">{action.title}</h4>
                </div>
                {getPriorityBadge(action.priority)}
              </div>
              <p className="text-sm text-gray-600 mb-2">{action.description}</p>
              <p className="text-xs text-gray-500">
                <Clock className="w-3 h-3 inline mr-1" />
                建议时间: {action.deadline}
                {action.template && (
                  <span className="ml-2 text-blue-600">[{action.template}]</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回首页
        </button>
        <button
          onClick={onGenerateDoc}
          className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText className="w-5 h-5 mr-2" />
          生成合规文件
        </button>
      </div>
    </div>
  )
}

export default ResultsPage

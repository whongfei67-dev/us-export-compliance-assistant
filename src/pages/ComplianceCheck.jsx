import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Building, Globe, Package, Truck, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { useCompliance } from '../context/ComplianceContext'
import { runComplianceCheck } from '../utils/complianceEngine'

const ComplianceCheck = ({ onResultsReady }) => {
  const { formData, updateFormData } = useCompliance()
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const steps = [
    { id: 1, title: '企业信息', icon: Building },
    { id: 2, title: '买家信息', icon: Globe },
    { id: 3, title: '产品信息', icon: Package },
    { id: 4, title: '运输信息', icon: Truck },
  ]

  const handleSubmit = async () => {
    setIsAnalyzing(true)
    
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const results = runComplianceCheck(formData)
    setIsAnalyzing(false)
    onResultsReady(results)
  }

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                企业基本信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    企业名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请输入企业全称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    企业所在地 *
                  </label>
                  <select
                    value={formData.companyLocation}
                    onChange={(e) => updateFormData('companyLocation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="CN">中国</option>
                    <option value="HK">香港</option>
                    <option value="TW">台湾</option>
                    <option value="SG">新加坡</option>
                    <option value="OTHER">其他</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    企业类型 *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['国有企业', '民营企业', '外资企业', '合资企业'].map((type) => (
                      <label key={type} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                        <input
                          type="radio"
                          name="companyType"
                          value={type}
                          checked={formData.companyType === type}
                          onChange={(e) => updateFormData('companyType', e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-green-600" />
                买家/收货方信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    买家名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.buyerName}
                    onChange={(e) => updateFormData('buyerName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="请输入买家公司名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    买家所在国家/地区 *
                  </label>
                  <select
                    value={formData.buyerCountry}
                    onChange={(e) => updateFormData('buyerCountry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="CN">中国</option>
                    <option value="HK">香港</option>
                    <option value="TW">台湾</option>
                    <option value="IR">伊朗</option>
                    <option value="RU">俄罗斯</option>
                    <option value="KP">朝鲜</option>
                    <option value="SY">叙利亚</option>
                    <option value="OTHER">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    买家类型
                  </label>
                  <select
                    value={formData.buyerType}
                    onChange={(e) => updateFormData('buyerType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="government">政府机构</option>
                    <option value="military">军事/防务</option>
                    <option value="civilian">民用企业</option>
                    <option value="unknown">不详</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最终用户
                  </label>
                  <input
                    type="text"
                    value={formData.endUser}
                    onChange={(e) => updateFormData('endUser', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="如已知最终用户请填写"
                  />
                </div>
              </div>
              {['IR', 'RU', 'KP', 'SY'].includes(formData.buyerCountry) && (
                <div className="mt-4 p-4 bg-red-100 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    警告：您选择的目的地国家/地区在美国出口管制制裁名单上，此交易可能需要特别许可或被禁止。请谨慎操作。
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-600" />
                产品信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => updateFormData('productName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="如：先进制程芯片、无人机等"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品类别 *
                  </label>
                  <select
                    value={formData.productCategory}
                    onChange={(e) => updateFormData('productCategory', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="chip">芯片/半导体</option>
                    <option value="computer">计算机/服务器</option>
                    <option value="telecom">通信设备</option>
                    <option value="sensor">传感器/雷达</option>
                    <option value="missile">导弹/航天</option>
                    <option value="laser">激光/光学</option>
                    <option value="material">先进材料</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ECCN编码（如已知）
                  </label>
                  <input
                    type="text"
                    value={formData.eccnCode}
                    onChange={(e) => updateFormData('eccnCode', e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="如：3A001, 5A002"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品预估价值（美元）
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => updateFormData('value', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="请输入金额"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    美国技术含量估计
                  </label>
                  <select
                    value={formData.techPercentage}
                    onChange={(e) => updateFormData('techPercentage', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="0">无美国技术</option>
                    <option value="<10">小于10%</option>
                    <option value="10-25">10%-25%</option>
                    <option value="25-50">25%-50%</option>
                    <option value=">50">大于50%</option>
                    <option value="unknown">不确定</option>
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 w-full transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.hasUSTechnology}
                      onChange={(e) => updateFormData('hasUSTechnology', e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      产品含有美国技术或组件
                    </span>
                  </label>
                </div>
              </div>
              {['chip', 'missile', 'sensor', 'laser'].includes(formData.productCategory) && (
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    注意：您选择的产品类别属于美国出口管制的敏感类别，可能需要额外的许可或审查。
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-orange-600" />
                运输信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最终目的地 *
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => updateFormData('destination', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="CN">中国</option>
                    <option value="HK">香港</option>
                    <option value="TW">台湾</option>
                    <option value="SG">新加坡</option>
                    <option value="OTHER">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    运输路线
                  </label>
                  <select
                    value={formData.transportRoute}
                    onChange={(e) => updateFormData('transportRoute', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="direct">直运（中美直达）</option>
                    <option value="transit-asia">亚洲中转</option>
                    <option value="transit-europe">欧洲中转</option>
                    <option value="unknown">路线待定</option>
                  </select>
                </div>
              </div>
              {formData.transportRoute === 'transit-asia' && (
                <div className="mt-4 p-4 bg-blue-100 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    提示：途经亚洲转运时，系统将额外评估转运风险。部分产品可能在转运国也需要合规许可。
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-gray-600" />
                信息确认
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">企业：</span>
                  <span className="text-gray-900 font-medium">{formData.companyName || '未填写'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">买家：</span>
                  <span className="text-gray-900 font-medium">{formData.buyerName || '未填写'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">产品：</span>
                  <span className="text-gray-900 font-medium">{formData.productName || '未填写'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">目的地：</span>
                  <span className="text-gray-900 font-medium">{formData.destination || '未填写'}</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-600 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          上一步
        </button>

        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            下一步
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                提交检测
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default ComplianceCheck

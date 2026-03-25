import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Building, Globe, Package, Truck, CheckCircle, AlertTriangle, Loader2, FileCheck } from 'lucide-react'
import { useCompliance } from '../context/ComplianceContext'
import { runComplianceCheck } from '../utils/complianceEngine'

const ComplianceCheck = ({ onResultsReady }) => {
  const { formData, updateFormData } = useCompliance()
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const steps = [
    { id: 1, title: '企业信息', icon: Building },
    { id: 2, title: '原产国信息', icon: Globe },
    { id: 3, title: '产品信息', icon: Package },
    { id: 4, title: '文件确认', icon: FileCheck },
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
                出口企业信息
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
                    <option value="JP">日本</option>
                    <option value="KR">韩国</option>
                    <option value="VN">越南</option>
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
                产品原产国信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品原产国/地区 *
                  </label>
                  <select
                    value={formData.originCountry}
                    onChange={(e) => updateFormData('originCountry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <optgroup label="亚洲">
                      <option value="CN">中国</option>
                      <option value="HK">香港</option>
                      <option value="TW">台湾</option>
                      <option value="JP">日本</option>
                      <option value="KR">韩国</option>
                      <option value="VN">越南</option>
                      <option value="IN">印度</option>
                      <option value="TH">泰国</option>
                      <option value="MY">马来西亚</option>
                      <option value="SG">新加坡</option>
                    </optgroup>
                    <optgroup label="美洲">
                      <option value="MX">墨西哥</option>
                      <option value="CA">加拿大</option>
                      <option value="BR">巴西</option>
                    </optgroup>
                    <optgroup label="其他">
                      <option value="DE">德国</option>
                      <option value="FR">法国</option>
                      <option value="UK">英国</option>
                      <option value="AU">澳大利亚</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    美国买方名称
                  </label>
                  <input
                    type="text"
                    value={formData.buyerName}
                    onChange={(e) => updateFormData('buyerName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="请输入美国买方公司名称"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    美国买方类型
                  </label>
                  <select
                    value={formData.buyerType}
                    onChange={(e) => updateFormData('buyerType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="civilian">民用企业</option>
                    <option value="government">政府机构</option>
                    <option value="military">军事/防务机构</option>
                    <option value="retail">零售商</option>
                    <option value="unknown">不详</option>
                  </select>
                </div>
              </div>
              {['IR', 'KP', 'SY', 'CU'].includes(formData.originCountry) && (
                <div className="mt-4 p-4 bg-red-100 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    警告：您选择的产品原产国受美国制裁，此类产品出口到美国可能受到严格限制或被禁止。
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
                    placeholder="请输入产品名称"
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
                    <option value="electronics">电子产品</option>
                    <option value="machinery">机械设备</option>
                    <option value="textile">纺织品/服装</option>
                    <option value="food">食品</option>
                    <option value="medical">医疗设备</option>
                    <option value="cosmetic">化妆品</option>
                    <option value="chemical">化学品</option>
                    <option value="toy">玩具</option>
                    <option value="automobile">汽车配件</option>
                    <option value="telecom">通信设备</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    美国海关HS编码
                  </label>
                  <input
                    type="text"
                    value={formData.hsCode}
                    onChange={(e) => updateFormData('hsCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="如：8471.30, 8517.12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品预估价值（美元）
                  </label>
                  <input
                    type="number"
                    value={formData.productValue}
                    onChange={(e) => updateFormData('productValue', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="请输入金额"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.fccApproval}
                    onChange={(e) => updateFormData('fccApproval', e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    产品已获得FCC认证（电子/通信产品）
                  </span>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.fdaApproval}
                    onChange={(e) => updateFormData('fdaApproval', e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    产品已获得FDA注册/批准（食品/医疗/化妆品）
                  </span>
                </label>
              </div>

              {['electronics', 'telecom', 'wireless', 'food', 'medical', 'cosmetic', 'chemical'].includes(formData.productCategory) && (
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    注意：您选择的产品类别可能需要特殊的美国进口许可或认证（如FCC、FDA、EPA等）。
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
                <FileCheck className="w-5 h-5 mr-2 text-orange-600" />
                文件和认证确认
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasCertificate}
                    onChange={(e) => updateFormData('hasCertificate', e.target.checked)}
                    className="w-5 h-5 text-orange-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    拥有原产地证书 (Certificate of Origin)
                  </span>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasCommercialInvoice}
                    onChange={(e) => updateFormData('hasCommercialInvoice', e.target.checked)}
                    className="w-5 h-5 text-orange-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    准备商业发票和装箱单
                  </span>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasTestReport}
                    onChange={(e) => updateFormData('hasTestReport', e.target.checked)}
                    className="w-5 h-5 text-orange-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    拥有产品测试报告或质量证书
                  </span>
                </label>
              </div>
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
                  <span className="text-gray-500">原产国：</span>
                  <span className="text-gray-900 font-medium">{formData.originCountry || '未填写'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">产品：</span>
                  <span className="text-gray-900 font-medium">{formData.productName || '未填写'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">HS编码：</span>
                  <span className="text-gray-900 font-medium">{formData.hsCode || '未填写'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">价值：</span>
                  <span className="text-gray-900 font-medium">${formData.productValue || '0'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">FCC认证：</span>
                  <span className="text-gray-900 font-medium">{formData.fccApproval ? '是' : '否'}</span>
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
      {/* US Export Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
          <Globe className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">出口美国合规检测</span>
        </div>
      </div>

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

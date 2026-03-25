import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Building, Globe, Package, Truck, CheckCircle, AlertTriangle, Loader2, Flag } from 'lucide-react'
import { useCompliance } from '../context/ComplianceContext'
import { runEUComplianceCheck } from '../utils/euComplianceEngine'

const EUComplianceCheck = ({ onResultsReady }) => {
  const { euFormData, updateEuFormData } = useCompliance()
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const steps = [
    { id: 1, title: '出口商信息', icon: Building },
    { id: 2, title: '买家信息', icon: Globe },
    { id: 3, title: '产品信息', icon: Package },
    { id: 4, title: '最终用途', icon: Flag },
  ]

  const handleSubmit = async () => {
    setIsAnalyzing(true)
    
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const results = runEUComplianceCheck(euFormData)
    setIsAnalyzing(false)
    onResultsReady(results)
  }

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-indigo-600" />
                欧盟出口商信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出口商公司名称 *
                  </label>
                  <input
                    type="text"
                    value={euFormData.exporterName}
                    onChange={(e) => updateEuFormData('exporterName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="请输入企业全称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出口商所在欧盟成员国 *
                  </label>
                  <select
                    value={euFormData.memberState}
                    onChange={(e) => updateEuFormData('memberState', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="DE">德国</option>
                    <option value="FR">法国</option>
                    <option value="IT">意大利</option>
                    <option value="ES">西班牙</option>
                    <option value="NL">荷兰</option>
                    <option value="BE">比利时</option>
                    <option value="PL">波兰</option>
                    <option value="SE">瑞典</option>
                    <option value="AT">奥地利</option>
                    <option value="IE">爱尔兰</option>
                    <option value="DK">丹麦</option>
                    <option value="FI">芬兰</option>
                    <option value="PT">葡萄牙</option>
                    <option value="CZ">捷克</option>
                    <option value="HU">匈牙利</option>
                    <option value="RO">罗马尼亚</option>
                    <option value="BG">保加利亚</option>
                    <option value="GR">希腊</option>
                    <option value="SK">斯洛伐克</option>
                    <option value="LT">立陶宛</option>
                    <option value="LV">拉脱维亚</option>
                    <option value="EE">爱沙尼亚</option>
                    <option value="HR">克罗地亚</option>
                    <option value="SI">斯洛文尼亚</option>
                    <option value="MT">马耳他</option>
                    <option value="CY">塞浦路斯</option>
                    <option value="LU">卢森堡</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出口商地址
                  </label>
                  <input
                    type="text"
                    value={euFormData.exporterAddress}
                    onChange={(e) => updateEuFormData('exporterAddress', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="请输入详细地址"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出口商EORI编号
                  </label>
                  <input
                    type="text"
                    value={euFormData.eoriNumber}
                    onChange={(e) => updateEuFormData('eoriNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="如：DE123456789"
                  />
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                注：欧盟出口商需要在各国主管部门注册，并获取EORI编号用于进出口申报。
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-emerald-600" />
                买家/收货方信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    买家公司名称 *
                  </label>
                  <input
                    type="text"
                    value={euFormData.buyerName}
                    onChange={(e) => updateEuFormData('buyerName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="请输入买家公司名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    买家所在国家/地区 *
                  </label>
                  <select
                    value={euFormData.buyerCountry}
                    onChange={(e) => updateEuFormData('buyerCountry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <optgroup label="高风险地区">
                      <option value="CN">中国</option>
                      <option value="RU">俄罗斯</option>
                      <option value="IR">伊朗</option>
                      <option value="KP">朝鲜</option>
                      <option value="SY">叙利亚</option>
                      <option value="BY">白俄罗斯</option>
                      <option value="CU">古巴</option>
                      <option value="VE">委内瑞拉</option>
                      <option value="MM">缅甸</option>
                      <option value="SD">苏丹</option>
                      <option value="UA">乌克兰</option>
                    </optgroup>
                    <optgroup label="其他地区">
                      <option value="US">美国</option>
                      <option value="JP">日本</option>
                      <option value="KR">韩国</option>
                      <option value="IN">印度</option>
                      <option value="AU">澳大利亚</option>
                      <option value="CA">加拿大</option>
                      <option value="BR">巴西</option>
                      <option value="OTHER">其他</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    买家类型
                  </label>
                  <select
                    value={euFormData.buyerType}
                    onChange={(e) => updateEuFormData('buyerType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="civilian">民用企业</option>
                    <option value="government">政府机构</option>
                    <option value="military">军事/防务机构</option>
                    <option value="unknown">不详</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最终收货人
                  </label>
                  <input
                    type="text"
                    value={euFormData.endUser}
                    onChange={(e) => updateEuFormData('endUser', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="如与买家不同请填写"
                  />
                </div>
              </div>
              {['CN', 'RU', 'BY', 'IR', 'KP', 'SY', 'CU', 'VE', 'MM', 'SD'].includes(euFormData.buyerCountry) && (
                <div className="mt-4 p-4 bg-red-100 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    警告：您选择的目的地国家/地区涉及武器禁运或特殊限制。此类出口需要向主管部门申请特别许可。
                  </p>
                </div>
              )}
              {euFormData.buyerCountry === 'UA' && (
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    注意：乌克兰需要特殊审查。请确保产品不会用于军事目的，并准备相关文件证明民用用途。
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-violet-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-violet-600" />
                产品信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品名称 *
                  </label>
                  <input
                    type="text"
                    value={euFormData.productName}
                    onChange={(e) => updateEuFormData('productName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="请输入产品名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品类别 *
                  </label>
                  <select
                    value={euFormData.productCategory}
                    onChange={(e) => updateEuFormData('productCategory', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="computing">计算机/高性能计算</option>
                    <option value="telecommunications">通信设备</option>
                    <option value="sensors">传感器/雷达</option>
                    <option value="electronics">电子元器件</option>
                    <option value="aerospace">航空/航天设备</option>
                    <option value="naval">海军设备</option>
                    <option value="materials">先进材料</option>
                    <option value="cryptography">加密/信息安全</option>
                    <option value="civil">民用物资</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    欧盟管制清单编码 CNL（如已知）
                  </label>
                  <input
                    type="text"
                    value={euFormData.cnlCode}
                    onChange={(e) => updateEuFormData('cnlCode', e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="如：3A001, 5A002"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品预估价值（欧元）
                  </label>
                  <input
                    type="number"
                    value={euFormData.value}
                    onChange={(e) => updateEuFormData('value', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="请输入金额"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    技术参数（用于判断是否属于管制范围）
                  </label>
                  <textarea
                    value={euFormData.techDescription}
                    onChange={(e) => updateEuFormData('techDescription', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    rows={3}
                    placeholder="请描述产品的关键技术参数，如处理速度、存储容量、通信频率等"
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-violet-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={euFormData.dualUse}
                    onChange={(e) => updateEuFormData('dualUse', e.target.checked)}
                    className="w-5 h-5 text-violet-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    产品可能属于双重用途物项（军民两用）
                  </span>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-violet-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={euFormData.hasTechTransfer}
                    onChange={(e) => updateEuFormData('hasTechTransfer', e.target.checked)}
                    className="w-5 h-5 text-violet-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    交易涉及技术转让或技术服务（软件、源代码、技术支持等）
                  </span>
                </label>
              </div>

              {['computing', 'aerospace', 'sensors', 'electronics'].includes(euFormData.productCategory) && (
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    注意：您选择的产品类别可能属于欧盟双重用途物项管制范围。请仔细核对技术参数是否超过控制阈值。
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-teal-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Flag className="w-5 h-5 mr-2 text-teal-600" />
                最终用途信息
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最终用途 *
                  </label>
                  <select
                    value={euFormData.endUse}
                    onChange={(e) => updateEuFormData('endUse', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="civilian">民用（非军事、非核）</option>
                    <option value="military">军事用途</option>
                    <option value="wmd">大规模杀伤性武器</option>
                    <option value="nuclear">核用途</option>
                    <option value="unknown">不确定</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    运输路线
                  </label>
                  <select
                    value={euFormData.transportRoute}
                    onChange={(e) => updateEuFormData('transportRoute', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">请选择</option>
                    <option value="direct">直达</option>
                    <option value="transit-risk">途经高风险国家</option>
                    <option value="transit-safe">途经其他国家</option>
                    <option value="unknown">路线待定</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-teal-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={euFormData.endUserCertificate}
                    onChange={(e) => updateEuFormData('endUserCertificate', e.target.checked)}
                    className="w-5 h-5 text-teal-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    已有买方签发的最终用途声明/保证函
                  </span>
                </label>
              </div>

              {euFormData.endUse === 'military' && (
                <div className="mt-4 p-4 bg-red-100 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    警告：军事用途的出口需要特殊许可。强烈建议在继续此交易前咨询专业律师。
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
                  <span className="text-gray-500">成员国：</span>
                  <span className="text-gray-900 font-medium">{euFormData.memberState || '未填写'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">买家国家：</span>
                  <span className="text-gray-900 font-medium">{euFormData.buyerCountry || '未填写'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">产品类别：</span>
                  <span className="text-gray-900 font-medium">{euFormData.productCategory || '未填写'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">双重用途：</span>
                  <span className="text-gray-900 font-medium">{euFormData.dualUse ? '是' : '否'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">技术转让：</span>
                  <span className="text-gray-900 font-medium">{euFormData.hasTechTransfer ? '是' : '否'}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-gray-500">最终用途：</span>
                  <span className="text-gray-900 font-medium">{euFormData.endUse || '未填写'}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4">
              <h4 className="font-medium text-indigo-900 mb-2">法律依据提示</h4>
              <p className="text-sm text-indigo-700">
                本系统基于《欧盟双重用途物品出口、中间贸易、技术援助 brokering 和转让管制条例》(EU) 2021/821 
                和各成员国国家法规进行评估。具体许可要求请咨询当地主管部门。
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* EU Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full">
          <Flag className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">欧盟出口合规检测</span>
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
                    isActive ? 'bg-indigo-600 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    isActive ? 'text-indigo-600' : 'text-gray-500'
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
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all"
          >
            下一步
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="flex items-center px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all disabled:opacity-50"
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

export default EUComplianceCheck

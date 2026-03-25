import React, { useState } from 'react'
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Copy, 
  CheckCircle,
  AlertTriangle,
  Flag
} from 'lucide-react'

const EUDocumentGenerator = ({ results, onBack }) => {
  const [selectedDoc, setSelectedDoc] = useState('license')
  const [copied, setCopied] = useState(false)

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">请先完成合规检测</h2>
        <button onClick={onBack} className="px-6 py-3 bg-indigo-600 text-white rounded-lg">
          返回
        </button>
      </div>
    )
  }

  const documents = [
    { 
      id: 'license', 
      title: '出口许可申请表', 
      description: '欧盟出口许可申请模板',
      icon: FileText
    },
    { 
      id: 'enduse', 
      title: '最终用途声明', 
      description: 'End-Use Certificate 欧盟版',
      icon: CheckCircle
    },
    { 
      id: 'brokering', 
      title: '中介服务申报表', 
      description: '中间贸易和技术援助申报模板',
      icon: Flag
    }
  ]

  const getMemberStateName = (code) => {
    const states = {
      'DE': '德国', 'FR': '法国', 'IT': '意大利', 'ES': '西班牙',
      'NL': '荷兰', 'BE': '比利时', 'PL': '波兰', 'SE': '瑞典',
      'AT': '奥地利', 'IE': '爱尔兰', 'DK': '丹麦', 'FI': '芬兰',
      'PT': '葡萄牙', 'CZ': '捷克', 'HU': '匈牙利', 'RO': '罗马尼亚',
      'BG': '保加利亚', 'GR': '希腊', 'SK': '斯洛伐克', 'LT': '立陶宛',
      'LV': '拉脱维亚', 'EE': '爱沙尼亚', 'HR': '克罗地亚', 'SI': '斯洛文尼亚',
      'MT': '马耳他', 'CY': '塞浦路斯', 'LU': '卢森堡'
    }
    return states[code] || code || '[成员国]'
  }

  const getCountryName = (code) => {
    const countries = {
      'CN': '中国', 'RU': '俄罗斯', 'BY': '白俄罗斯', 'IR': '伊朗',
      'KP': '朝鲜', 'SY': '叙利亚', 'CU': '古巴', 'VE': '委内瑞拉',
      'MM': '缅甸', 'SD': '苏丹', 'UA': '乌克兰', 'US': '美国',
      'JP': '日本', 'KR': '韩国', 'IN': '印度', 'AU': '澳大利亚',
      'CA': '加拿大', 'BR': '巴西'
    }
    return countries[code] || code || '[国家]'
  }

  const getCategoryName = (code) => {
    const categories = {
      'computing': '计算机/高性能计算',
      'telecommunications': '通信设备',
      'sensors': '传感器/雷达',
      'electronics': '电子元器件',
      'aerospace': '航空/航天设备',
      'naval': '海军设备',
      'materials': '先进材料',
      'cryptography': '加密/信息安全',
      'civil': '民用物资',
      'other': '其他'
    }
    return categories[code] || code || '[类别]'
  }

  const generateLicenseApplication = () => {
    const data = results.formData
    return `
================================================================================
                     欧盟双重用途物项出口许可申请表
                EU EXPORT AUTHORIZATION APPLICATION FORM
                   (基于 Regulation (EU) 2021/821)
================================================================================

申请日期: ${new Date().toLocaleDateString('zh-CN')}
申请编号: EU-EXP-${Date.now().toString().slice(-8)}
审批成员国: ${getMemberStateName(data.memberState)}

--------------------------------------------------------------------------------
一、出口商信息 (EXPORTER INFORMATION)
--------------------------------------------------------------------------------

1. 公司名称 (Company Name):
   ${data.exporterName || '[请填写]'}

2. 公司地址 (Company Address):
   ${data.exporterAddress || '[请填写]'}

3. EORI编号 (EORI Number):
   ${data.eoriNumber || '[请填写]'}

4. 联系人 (Contact Person):
   [请填写]

5. 电话 (Telephone):
   [请填写]

6. 邮箱 (Email):
   [请填写]

--------------------------------------------------------------------------------
二、买方/收货方信息 (BUYER/RECEIVER INFORMATION)
--------------------------------------------------------------------------------

1. 买方名称 (Buyer Name):
   ${data.buyerName || '[请填写]'}

2. 买方国家 (Buyer Country):
   ${getCountryName(data.buyerCountry) || '[请填写]'}

3. 买方类型 (Buyer Type):
   ${data.buyerType === 'civilian' ? '民用企业' : 
     data.buyerType === 'government' ? '政府机构' :
     data.buyerType === 'military' ? '军事/防务机构' : '[请填写]'}

4. 最终收货人 (End-Consignee):
   ${data.endUser || '[如与买方不同请填写]'}

--------------------------------------------------------------------------------
三、产品信息 (PRODUCT INFORMATION)
--------------------------------------------------------------------------------

1. 产品名称 (Product Description):
   ${data.productName || '[请填写]'}

2. 产品类别 (Category):
   ${getCategoryName(data.productCategory) || '[请填写]'}

3. CNL编码 (EU Control List Number):
   ${data.cnlCode || '待确定'}

4. 产品价值 (Value in EUR):
   EUR ${data.value || '[请填写]'}

5. 产品技术参数 (Technical Specifications):
   ${data.techDescription || '[请详细描述]'}

6. 数量 (Quantity):
   [请填写]

--------------------------------------------------------------------------------
四、最终用途信息 (END-USE INFORMATION)
--------------------------------------------------------------------------------

1. 最终用途 (End-Use):
   ${data.endUse === 'civilian' ? '民用（非军事、非核）' :
     data.endUse === 'military' ? '军事用途' :
     data.endUse === 'wmd' ? '大规模杀伤性武器' :
     data.endUse === 'nuclear' ? '核用途' : '[请填写]'}

2. 最终用途详细说明 (Detailed End-Use Description):
   [请详细描述产品的预期用途]

3. 最终使用地点 (Place of Ultimate Use):
   [请填写]

4. 最终用户声明 (End-User Certificate):
   ${data.endUserCertificate ? '已提供' : '待提供'}

--------------------------------------------------------------------------------
五、技术转让信息 (TECHNOLOGY TRANSFER INFORMATION)
--------------------------------------------------------------------------------

1. 是否涉及技术转让:
   ${data.hasTechTransfer ? '是' : '否'}

2. 技术转让详细说明:
   ${data.techDescription || '[如涉及请详细填写]'}

--------------------------------------------------------------------------------
六、运输信息 (TRANSPORTATION INFORMATION)
--------------------------------------------------------------------------------

1. 运输路线 (Transport Route):
   ${data.transportRoute === 'direct' ? '直达' :
     data.transportRoute === 'transit-risk' ? '途经高风险国家' :
     data.transportRoute === 'transit-safe' ? '途经其他国家' : '[请填写]'}

2. 预计出口日期:
   [请填写]

--------------------------------------------------------------------------------
七、双重用途物项声明 (DUAL-USE DECLARATION)
--------------------------------------------------------------------------------

本公司/组织特此声明:

1. 上述产品将仅用于声明的最终用途，不会用于任何大规模杀伤性武器
   (WMD)、其运载系统或军事最终用途。

2. 本公司将遵守《欧盟双重用途物品出口、中间贸易、技术援助 brokering 
   和转让管制条例》(EU) 2021/821 的所有适用规定。

3. 本公司将确保产品和/或相关技术不会转运至任何被禁止的目的地或最终用户。

4. 本公司将保持完整的出口记录以备主管部门审查。

5. 本公司将配合主管部门对最终用途进行核实。

签署人声明上述信息均真实准确。

签署人: _______________________

职位: _______________________

日期: _______________________

公司盖章: _______________________

================================================================================
                         文件生成时间: ${new Date().toLocaleString('zh-CN')}
                         合规风险评估评分: ${results.riskScore}/100
                         风险等级: ${results.riskLevel === 'HIGH' ? '高风险' : 
                                   results.riskLevel === 'MEDIUM' ? '中等风险' : '低风险'}
================================================================================
`
  }

  const generateEndUseCertificate = () => {
    const data = results.formData
    return `
================================================================================
                    最终用途声明书 (EU VERSION)
                  END-USE CERTIFICATE / END-USE STATEMENT
         (依据 EU Regulation (EU) 2021/821 制定)
================================================================================

签署日期: ${new Date().toLocaleDateString('zh-CN')}
证书编号: EU-EUC-${Date.now().toString().slice(-8)}

--------------------------------------------------------------------------------
一、出口商信息 (EXPORTER)
--------------------------------------------------------------------------------

公司名称: ${data.exporterName || '[请填写]'}
地    址: ${data.exporterAddress || '[请填写]'}
EORI编号: ${data.eoriNumber || '[请填写]'}
审批成员国: ${getMemberStateName(data.memberState)}

--------------------------------------------------------------------------------
二、买方/收货方信息 (BUYER/CONSIGNEE)
--------------------------------------------------------------------------------

公司名称: ${data.buyerName || '[请填写]'}
国    家: ${getCountryName(data.buyerCountry) || '[请填写]'}
联系地址: [请填写]

--------------------------------------------------------------------------------
三、产品信息 (GOODS)
--------------------------------------------------------------------------------

产品名称: ${data.productName || '[请填写]'}
CNL编码:  ${data.cnlCode || '[如适用]' }
数    量: [请填写]
用    途: [请详细描述产品用途]

--------------------------------------------------------------------------------
四、最终用户信息 (END-USER)
--------------------------------------------------------------------------------

最终用户: ${data.endUser || '[请填写]'}
使用地点: [请填写具体使用地址]
最终用途: [请详细描述产品将如何被使用]

--------------------------------------------------------------------------------
五、最终用途承诺 (END-USE UNDERTAKINGS)
--------------------------------------------------------------------------------

买方/最终用户特此承诺:

1. 所采购的产品和/或相关技术将仅用于上述声明的民用（非军事、非核）用途。

2. 未经出口商事先书面同意，不会将产品或技术转运、再转让或用于任何其他目的。

3. 产品和技术不会用于开发或制造任何大规模杀伤性武器(WMD)、其运载系统
   或导弹技术。

4. 若产品或技术的最终用途、最终用户或转运目的地发生变化，将立即书面
   通知出口商。

5. 同意出口商和/或相关主管部门对最终用途进行核实检查。

6. 配合提供必要的文件和信息以证明产品的民用用途。

--------------------------------------------------------------------------------
六、法律声明 (LEGAL DECLARATION)
--------------------------------------------------------------------------------

本声明受 ${getMemberStateName(data.memberState)} 法律管辖。

本声明中提供的所有信息均真实、准确、完整。

买方/最终用户承担因违反上述承诺而产生的一切法律责任。

--------------------------------------------------------------------------------
七、签署 (SIGNATURE)
--------------------------------------------------------------------------------

买方授权代表签字: _______________________

职    位: _______________________

日    期: _______________________

公    司: _______________________

地    址: _______________________

(加盖公章)

--------------------------------------------------------------------------------
八、公证人或见证人 (NOTARY/WITNESS) [可选]
--------------------------------------------------------------------------------

见证人签字: _______________________

日    期: _______________________

================================================================================
                         文件生成时间: ${new Date().toLocaleString('zh-CN')}
================================================================================
`
  }

  const generateBrokeringDeclaration = () => {
    const data = results.formData
    return `
================================================================================
                    中间贸易和技术援助申报表
           BROKERING AND TECHNICAL ASSISTANCE DECLARATION FORM
              (依据 EU Regulation (EU) 2021/821 Article 5 & 6)
================================================================================

申报日期: ${new Date().toLocaleDateString('zh-CN')}
申报编号: EU-BRK-${Date.now().toString().slice(-8)}
申报成员国: ${getMemberStateName(data.memberState)}

--------------------------------------------------------------------------------
一、中介商/服务提供商信息 (BROKER/SERVICE PROVIDER)
--------------------------------------------------------------------------------

1. 公司名称:
   ${data.exporterName || '[请填写]'}

2. 公司地址:
   ${data.exporterAddress || '[请填写]'}

3. EORI编号:
   ${data.eoriNumber || '[请填写]'}

4. 联系人:
   [请填写]

5. 联系方式:
   [请填写]

--------------------------------------------------------------------------------
二、交易信息 (TRANSACTION DETAILS)
--------------------------------------------------------------------------------

1. 涉及国家:
   - 供应商所在国: [请填写]
   - 买方所在国: ${getCountryName(data.buyerCountry) || '[请填写]'}
   - 最终目的地: ${getCountryName(data.buyerCountry) || '[请填写]'}

2. 产品信息:
   - 产品名称: ${data.productName || '[请填写]'}
   - CNL编码: ${data.cnlCode || '[如适用]'}
   - 产品类别: ${getCategoryName(data.productCategory) || '[请填写]'}

3. 服务类型:
   [ ] 中间贸易服务 (Brokering Services)
   [ ] 技术援助 (Technical Assistance)
   [ ] 其他: [请说明]

--------------------------------------------------------------------------------
三、技术转让信息 (如适用)
--------------------------------------------------------------------------------

1. 是否涉及技术转让:
   ${data.hasTechTransfer ? '是' : '否'}

2. 技术描述:
   ${data.techDescription || '[请详细填写]'}

--------------------------------------------------------------------------------
四、合规声明 (COMPLIANCE DECLARATION)
--------------------------------------------------------------------------------

本公司特此声明:

1. 已核实此交易不涉及受联合国安理会决议禁止的武器或军事物资。

2. 已核实买方/最终用户不在欧盟制裁名单上。

3. 已评估交易是否符合 ${getMemberStateName(data.memberState)} 国家出口管制法规。

4. 将配合主管部门的核查要求。

签署人: _______________________

职位: _______________________

日期: _______________________

================================================================================
                         文件生成时间: ${new Date().toLocaleString('zh-CN')}
================================================================================
`
  }

  const getDocumentContent = () => {
    switch(selectedDoc) {
      case 'license': return generateLicenseApplication()
      case 'enduse': return generateEndUseCertificate()
      case 'brokering': return generateBrokeringDeclaration()
      default: return ''
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getDocumentContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const content = getDocumentContent()
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `eu_compliance_document_${selectedDoc}_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
          返回检测结果
        </button>
        <div className="flex items-center">
          <Flag className="w-8 h-8 text-indigo-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">欧盟合规文件生成器</h1>
            <p className="text-gray-600 mt-1">基于欧盟出口管制法规生成专业合规文档</p>
          </div>
        </div>
      </div>

      {/* Document Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">选择文档类型</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const Icon = doc.icon
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc.id)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedDoc === doc.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${selectedDoc === doc.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                <h4 className={`font-semibold ${selectedDoc === doc.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                  {doc.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Document Preview */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">文档预览</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? '已复制' : '复制'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              下载
            </button>
          </div>
        </div>
        <div className="p-6">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed max-h-96 overflow-y-auto">
            {getDocumentContent()}
          </pre>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-amber-50 rounded-xl p-4 flex items-start">
        <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-amber-900">重要提示</h4>
          <p className="text-sm text-amber-800 mt-1">
            本文档为基于《欧盟双重用途物品出口管制条例》(EU) 2021/821 自动生成的模板，仅供参考。
            在提交任何正式文件前，请务必咨询具有欧盟出口管制经验的专业律师进行审核和修改。
            各成员国的具体要求和流程可能有所不同。
          </p>
        </div>
      </div>
    </div>
  )
}

export default EUDocumentGenerator

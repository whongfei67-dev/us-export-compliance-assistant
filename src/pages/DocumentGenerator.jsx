import React, { useState } from 'react'
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Copy, 
  CheckCircle,
  AlertTriangle,
  Globe
} from 'lucide-react'

const DocumentGenerator = ({ results, onBack }) => {
  const [selectedDoc, setSelectedDoc] = useState('customs')
  const [copied, setCopied] = useState(false)

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">请先完成合规检测</h2>
        <button onClick={onBack} className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          返回
        </button>
      </div>
    )
  }

  const documents = [
    { 
      id: 'customs', 
      title: '海关申报文件', 
      description: '美国海关进口申报模板 (CBP Form 3461)',
      icon: FileText
    },
    { 
      id: 'certificate', 
      title: '原产地证书', 
      description: 'Certificate of Origin 模板',
      icon: Globe
    },
    { 
      id: 'commercial', 
      title: '商业发票', 
      description: 'Commercial Invoice 模板',
      icon: CheckCircle
    }
  ]

  const getCountryName = (code) => {
    const countries = {
      'CN': '中国', 'HK': '香港', 'TW': '台湾', 'JP': '日本',
      'KR': '韩国', 'VN': '越南', 'IN': '印度', 'MX': '墨西哥',
      'CA': '加拿大', 'DE': '德国', 'FR': '法国', 'UK': '英国',
      'AU': '澳大利亚', 'KP': '朝鲜', 'IR': '伊朗', 'SY': '叙利亚', 'CU': '古巴'
    }
    return countries[code] || code || '[国家]'
  }

  const getCategoryName = (code) => {
    const categories = {
      'electronics': '电子产品', 'machinery': '机械设备', 'textile': '纺织品',
      'food': '食品', 'medical': '医疗设备', 'cosmetic': '化妆品',
      'chemical': '化学品', 'toy': '玩具', 'automobile': '汽车配件',
      'telecom': '通信设备', 'other': '其他'
    }
    return categories[code] || code || '[类别]'
  }

  const getBuyerTypeName = (code) => {
    const types = {
      'civilian': '民用企业', 'government': '政府机构',
      'military': '军事/防务机构', 'retail': '零售商', 'unknown': '不详'
    }
    return types[code] || code || '[类型]'
  }

  const generateCustomsDeclaration = () => {
    const data = results.formData
    return `
================================================================================
                    美国海关进口申报文件
                  CBP ENTRY SUMMARY (CBP Form 3461)
================================================================================

生成日期: ${new Date().toLocaleDateString('zh-CN')}
申报编号: CBP-${Date.now().toString().slice(-8)}

--------------------------------------------------------------------------------
一、进口商信息 (IMPORTER OF RECORD)
--------------------------------------------------------------------------------

1. 进口商名称 (Importer Name):
   ${data.companyName || '[请填写]'}

2. 进口商地址 (Importer Address):
   ${data.companyLocation || '[请填写]'}

3. 进口商税号 (IRS/SS Number):
   [请填写]

4. 联系人 (Contact Person):
   [请填写]

5. 电话 (Telephone):
   [请填写]

6. 邮箱 (Email):
   [请填写]

--------------------------------------------------------------------------------
二、原产国信息 (COUNTRY OF ORIGIN)
--------------------------------------------------------------------------------

1. 原产国 (Country of Origin):
   ${getCountryName(data.originCountry) || '[请填写]'}

2. 制造厂商名称 (Manufacturer):
   [请填写]

3. 制造厂商地址 (Manufacturer Address):
   [请填写]

--------------------------------------------------------------------------------
三、美国买方信息 (U.S. BUYER INFORMATION)
--------------------------------------------------------------------------------

1. 买方名称 (Buyer Name):
   ${data.buyerName || '[请填写]'}

2. 买方类型 (Buyer Type):
   ${getBuyerTypeName(data.buyerType) || '[请填写]'}

--------------------------------------------------------------------------------
四、产品信息 (MERCHANDISE DESCRIPTION)
--------------------------------------------------------------------------------

1. 产品名称 (Description of Goods):
   ${data.productName || '[请填写]'}

2. 产品类别 (Product Category):
   ${getCategoryName(data.productCategory) || '[请填写]'}

3. 美国海关HS编码 (HTSUS Number):
   ${data.hsCode || '[请填写]'}

4. 产品数量 (Quantity):
   [请填写]

5. 产品单位 (Unit of Measure):
   [请填写]

6. 产品价值 (Value):
   USD ${data.productValue || '[请填写]'}

7. 货币类型 (Currency):
   USD (美元)

--------------------------------------------------------------------------------
五、关税信息 (DUTY INFORMATION)
--------------------------------------------------------------------------------

1. 关税税率 (Rate of Duty):
   [根据HS编码确定]

2. 预估关税 (Estimated Duty):
   [请计算或留空]

--------------------------------------------------------------------------------
六、认证和许可 (CERTIFICATIONS & PERMITS)
--------------------------------------------------------------------------------

FCC认证: ${data.fccApproval ? '已获得' : '未获得/不适用'}
FDA注册: ${data.fdaApproval ? '已获得' : '未获得/不适用'}

--------------------------------------------------------------------------------
七、合规声明 (COMPLIANCE STATEMENT)
--------------------------------------------------------------------------------

本公司/组织特此声明:

1. 上述产品符合美国海关和边境保护局 (CBP) 的所有进口要求。

2. 产品不违反美国贸易法和相关制裁法规。

3. 提供的产品描述和价值信息真实准确。

4. 如产品需要特殊许可，已获得相应批准。

签署人声明上述信息均真实准确。

签署人: _______________________

职位: _______________________

日期: _______________________

================================================================================
                              文件生成时间: ${new Date().toLocaleString('zh-CN')}
                              合规风险评估评分: ${results.riskScore}/100
                              风险等级: ${results.riskLevel === 'HIGH' ? '高风险' : 
                                        results.riskLevel === 'MEDIUM' ? '中等风险' : '低风险'}
================================================================================
`
  }

  const generateCertificateOfOrigin = () => {
    const data = results.formData
    return `
================================================================================
                        原产地证书
                    CERTIFICATE OF ORIGIN
              (用于出口到美国的商品)
================================================================================

证书编号: COO-${Date.now().toString().slice(-8)}
签发日期: ${new Date().toLocaleDateString('zh-CN')}

--------------------------------------------------------------------------------
一、出口商信息 (EXPORTER)
--------------------------------------------------------------------------------

出口商名称: ${data.companyName || '[请填写]'}
出口商地址: ${data.companyLocation || '[请填写]'}
联系电话: [请填写]
邮箱: [请填写]

--------------------------------------------------------------------------------
二、生产商信息 (MANUFACTURER/PRODUCER) [如与出口商不同]
--------------------------------------------------------------------------------

生产商名称: [请填写]
生产商地址: [请填写]

--------------------------------------------------------------------------------
三、美国进口商信息 (IMPORTER)
--------------------------------------------------------------------------------

进口商名称: ${data.buyerName || '[请填写]'}
进口商地址: [请填写]

--------------------------------------------------------------------------------
四、产品信息 (GOODS)
--------------------------------------------------------------------------------

产品描述: ${data.productName || '[请填写]'}
产品类别: ${getCategoryName(data.productCategory) || '[请填写]'}
HS编码: ${data.hsCode || '[请填写]'}
数量: [请填写]
价值(USD): ${data.productValue || '[请填写]'}

--------------------------------------------------------------------------------
五、原产地信息 (ORIGIN INFORMATION)
--------------------------------------------------------------------------------

原产国: ${getCountryName(data.originCountry) || '[请填写]'}

生产/制造国家: ${getCountryName(data.originCountry) || '[请填写]'}

原产地标准: [请选择]
[ ] 完全获得或生产 (Wholly Obtained or Produced)
[ ] 实质性改变 (Substantially Transformed)
[ ] 区域价值含量 (Regional Value Content)

--------------------------------------------------------------------------------
六、声明 (DECLARATION)

我方声明上述产品原产于 ${getCountryName(data.originCountry) || '[原产国]'}，
符合中美贸易协定中的原产地规则要求。

签署人: _______________________

职位: _______________________

日期: _______________________

公司盖章: _______________________

================================================================================
`
  }

  const generateCommercialInvoice = () => {
    const data = results.formData
    return `
================================================================================
                          商业发票
                    COMMERCIAL INVOICE
================================================================================

发票编号: INV-${Date.now().toString().slice(-8)}
发票日期: ${new Date().toLocaleDateString('zh-CN')}

--------------------------------------------------------------------------------
一、卖方信息 (SELLER/EXPORTER)
--------------------------------------------------------------------------------

公司名称: ${data.companyName || '[请填写]'}
地址: ${data.companyLocation || '[请填写]'}
电话: [请填写]
邮箱: [请填写]

--------------------------------------------------------------------------------
二、买方信息 (BUYER/IMPORTER)
--------------------------------------------------------------------------------

公司名称: ${data.buyerName || '[请填写]'}
地址: [请填写]
电话: [请填写]
邮箱: [请填写]

--------------------------------------------------------------------------------
三、运输信息 (SHIPMENT DETAILS)
--------------------------------------------------------------------------------

原产国: ${getCountryName(data.originCountry) || '[请填写]'}
目的地: 美国
运输方式: [空运/海运/陆运]
预计到港日期: [请填写]

--------------------------------------------------------------------------------
四、产品明细 (GOODS DESCRIPTION)
--------------------------------------------------------------------------------

产品名称: ${data.productName || '[请填写]'}
产品类别: ${getCategoryName(data.productCategory) || '[请填写]'}
HS编码: ${data.hsCode || '[请填写]'}

--------------------------------------------------------------------------------
五、价格信息 (PRICING)
--------------------------------------------------------------------------------

单价 (USD): [请填写]
数量: [请填写]
总价 (USD): ${data.productValue || '[请填写]'}

FOB价格: [请填写]
运费: [请填写]
保险: [请填写]
CIF总值: [请填写]

--------------------------------------------------------------------------------
六、付款条件 (PAYMENT TERMS)
--------------------------------------------------------------------------------

付款方式: [T/T, L/C, O/A等]
付款期限: [请填写]

--------------------------------------------------------------------------------
七、认证信息 (CERTIFICATIONS)
--------------------------------------------------------------------------------

FCC认证: ${data.fccApproval ? '已获得' : '不适用'}
FDA注册: ${data.fdaApproval ? '已获得' : '不适用'}

产品符合美国相关法规要求。

--------------------------------------------------------------------------------
八、签署 (SIGNATURE)

卖方授权代表签字: _______________________

日期: _______________________

公司盖章: _______________________

================================================================================
`
  }

  const getDocumentContent = () => {
    switch(selectedDoc) {
      case 'customs': return generateCustomsDeclaration()
      case 'certificate': return generateCertificateOfOrigin()
      case 'commercial': return generateCommercialInvoice()
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
    a.download = `us_export_document_${selectedDoc}_${Date.now()}.txt`
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
          <Globe className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">出口美国文件生成器</h1>
            <p className="text-gray-600 mt-1">基于检测结果生成美国进口所需文件</p>
          </div>
        </div>
      </div>

      {/* US Export Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
          <Globe className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">出口美国合规文件</span>
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
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${selectedDoc === doc.id ? 'text-blue-600' : 'text-gray-400'}`} />
                <h4 className={`font-semibold ${selectedDoc === doc.id ? 'text-blue-900' : 'text-gray-900'}`}>
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
              className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
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
            本文档为自动生成的模板，仅供参考。在提交任何正式文件前，请务必咨询专业人士进行审核和修改。
          </p>
        </div>
      </div>
    </div>
  )
}

export default DocumentGenerator

import React, { useState } from 'react'
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Copy, 
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react'

const DocumentGenerator = ({ results, onBack }) => {
  const [selectedDoc, setSelectedDoc] = useState('license')
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

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
      id: 'license', 
      title: '出口许可证申请表', 
      description: 'Form BIS-748P 许可证申请模板',
      icon: FileText
    },
    { 
      id: 'enduse', 
      title: '最终用途声明', 
      description: 'End-Use Certificate 模板',
      icon: CheckCircle
    },
    { 
      id: 'memo', 
      title: '情况说明函', 
      description: '向 BIS 提交的情况说明模板',
      icon: FileText
    }
  ]

  const generateLicenseApplication = () => {
    const data = results.formData
    return `
================================================================================
                        美国商务部工业与安全局
                    出口许可证申请表 (FORM BIS-748P)
                           SUPPLEMENTARY VENDOR FORM
================================================================================

申请日期: ${new Date().toLocaleDateString('zh-CN')}
申请编号: APP-${Date.now().toString().slice(-8)}

--------------------------------------------------------------------------------
一、申请人信息 (APPLICANT INFORMATION)
--------------------------------------------------------------------------------

1. 公司名称 (Company Name):
   ${data.companyName || '[请填写]'}

2. 公司地址 (Company Address):
   ${data.companyLocation || '[请填写]'}

3. 企业类型 (Business Type):
   ${data.companyType || '[请填写]'}

4. 联系人 (Contact Person):
   [请填写]

5. 电话 (Telephone):
   [请填写]

6. 邮箱 (Email):
   [请填写]

--------------------------------------------------------------------------------
二、买家/收货方信息 (BUYER/RECEIVER INFORMATION)
--------------------------------------------------------------------------------

1. 买家名称 (Buyer Name):
   ${data.buyerName || '[请填写]'}

2. 买家地址 (Buyer Address):
   ${data.buyerCountry || '[请填写]'}

3. 买家类型 (Buyer Type):
   ${data.buyerType || '[请填写]'}

4. 最终用户 (End-User):
   ${data.endUser || '[请填写]'}

--------------------------------------------------------------------------------
三、产品信息 (COMMODITY INFORMATION)
--------------------------------------------------------------------------------

1. 产品名称 (Commodity Description):
   ${data.productName || '[请填写]'}

2. 产品类别 (Category):
   ${data.productCategory || '[请填写]'}

3. ECCN编码 (ECCN):
   ${data.eccnCode || '待确定'}

4. 产品价值 (Value):
   USD ${data.value || '[请填写]'}

5. 技术含量 (US Technology Content):
   ${data.techPercentage || '[请填写]'}

--------------------------------------------------------------------------------
四、运输信息 (TRANSPORTATION INFORMATION)
--------------------------------------------------------------------------------

1. 最终目的地 (Ultimate Destination):
   ${data.destination || '[请填写]'}

2. 运输路线 (Route):
   ${data.transportRoute || '[请填写]'}

--------------------------------------------------------------------------------
五、合规声明 (COMPLIANCE STATEMENT)
--------------------------------------------------------------------------------

本公司/组织特此声明:

1. 上述产品将仅用于所述的最终用途，不会用于任何大规模杀伤性武器
   或其运载系统的开发、制造或使用。

2. 本公司将遵守美国出口管理条例 (EAR) 的所有适用规定。

3. 本公司未经美国政府有关部门的适当授权，不会将受管制的美国产品
   再出口到任何被禁止的目的地或最终用户。

4. 本公司将保持完整的出口记录至少五年，以备美国政府审查。

签署人声明上述信息均真实准确。

签署人: _______________________

职位: _______________________

日期: _______________________

================================================================================
                              文件生成时间: ${new Date().toLocaleString('zh-CN')}
                              合规风险评估评分: ${results.riskScore}/100
                              风险等级: ${results.riskLevel}
================================================================================
`
  }

  const generateEndUseCertificate = () => {
    const data = results.formData
    return `
================================================================================
                          END-USE CERTIFICATE
                           最终用途声明书
================================================================================

签署日期: ${new Date().toLocaleDateString('zh-CN')}

--------------------------------------------------------------------------------
一、采购方信息
--------------------------------------------------------------------------------

公司名称: ${data.buyerName || '[请填写]'}
地    址: ${data.buyerCountry || '[请填写]'}
联 系 人: [请填写]
联系电话: [请填写]

--------------------------------------------------------------------------------
二、产品信息
--------------------------------------------------------------------------------

产品名称: ${data.productName || '[请填写]'}
数    量: [请填写]
型    号: [请填写]
用    途: [请详细描述产品用途]

--------------------------------------------------------------------------------
三、最终用户信息
--------------------------------------------------------------------------------

最终用户: ${data.endUser || '[请填写]'}
最终用途: [请详细描述产品将如何被使用]
使用地点: [请填写具体使用地址]

--------------------------------------------------------------------------------
四、最终用途承诺
--------------------------------------------------------------------------------

采购方特此承诺:

1. 所采购的产品将仅用于上述声明的最终用途，不会转售、转让或用于任何
   军事、核武器或导弹相关用途。

2. 未经供应商事先书面同意，不会将产品转运至任何第三方。

3. 产品不会用于开发或制造任何大规模杀伤性武器或其运载系统。

4. 若产品最终用途或最终用户发生变化，将立即通知供应商。

5. 同意供应商对产品最终用途进行核实检查。

--------------------------------------------------------------------------------
五、法律声明
--------------------------------------------------------------------------------

本声明受 [适用法律管辖区] 法律管辖。

本声明中提供的信息均真实、准确、完整。

采购方承担因违反上述承诺而产生的一切法律责任。

--------------------------------------------------------------------------------
六、签署
--------------------------------------------------------------------------------

采购方授权代表签字: _______________________

职    位: _______________________

日    期: _______________________

公    司: _______________________

(加盖公章)

================================================================================
`
  }

  const generateMemo = () => {
    const data = results.formData
    return `
================================================================================
                        MEMORANDUM
                       情况说明函
================================================================================

日期: ${new Date().toLocaleDateString('zh-CN')}
收件: 美国商务部工业与安全局 (BIS)
发件: [公司名称]

--------------------------------------------------------------------------------

主题: 就拟议出口 [${data.productName || '产品名称'}] 至 [${data.buyerCountry || '目的地'}] 
       的情况说明

--------------------------------------------------------------------------------

敬启者:

本人/本公司特此提交本情况说明，就拟议向 [${data.buyerName || '买家名称'}] 出口
[${data.productName || '产品名称'}] 的事宜向贵局提供以下信息:

一、交易概述
--------------------------------------------------------------------------------

出口产品: ${data.productName || '[产品名称]'}
产品类别: ${data.productCategory || '[类别]'}
ECCN编码: ${data.eccnCode || '[待确定]'}
预估价值: USD ${data.value || '[金额]'}
目的地:   ${data.destination || '[目的地]'}
买家:     ${data.buyerName || '[买家名称]'}
买家类型: ${data.buyerType || '[类型]'}

二、合规评估结果
--------------------------------------------------------------------------------

根据本次合规检测分析:
- 风险评分: ${results.riskScore}/100
- 风险等级: ${results.riskLevel}
- 主要关注点: ${results.checks.filter(c => c.status !== 'PASS').map(c => c.name).join('、') || '无'}

三、出口必要性说明
--------------------------------------------------------------------------------

[请在此详细说明为何此出口对贵公司业务至关重要，以及替代方案的不可行性]

四、最终用途保证
--------------------------------------------------------------------------------

本公司保证:

1. 所出口产品将仅用于民用/商业用途。

2. 产品不会转运至任何其他目的地或最终用户。

3. 本公司将配合贵局对最终用途进行跟踪核实。

五、请求
--------------------------------------------------------------------------------

基于以上说明，恳请贵局考虑:

[请说明您希望 BIS 提供何种指导或决定]

六、联系方式
--------------------------------------------------------------------------------

公司名称: [公司名称]
联系人:   [姓名]
电话:     [电话]
邮箱:     [邮箱]
地址:     [地址]

如需进一步信息，请随时与本人联系。

此致

敬礼

签名: _______________________

日期: _______________________

================================================================================
`
  }

  const getDocumentContent = () => {
    switch(selectedDoc) {
      case 'license': return generateLicenseApplication()
      case 'enduse': return generateEndUseCertificate()
      case 'memo': return generateMemo()
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
    a.download = `compliance_document_${selectedDoc}_${Date.now()}.txt`
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
        <h1 className="text-3xl font-bold text-gray-900">合规文件生成器</h1>
        <p className="text-gray-600 mt-2">基于检测结果生成专业合规文档</p>
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
      <div className="bg-yellow-50 rounded-xl p-4 flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-yellow-900">重要提示</h4>
          <p className="text-sm text-yellow-800 mt-1">
            本文档为自动生成的模板，仅供参考。在提交任何正式文件前，请务必咨询具有美国出口管制经验的专业律师进行审核和修改。
          </p>
        </div>
      </div>
    </div>
  )
}

export default DocumentGenerator

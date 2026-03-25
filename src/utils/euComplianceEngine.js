// 欧盟出口合规判断引擎
// 核心逻辑：基于欧盟 Dual-Use 法规 (EC 428/2009) 和各国国家法规

// 高风险国家/地区 (武器禁运或全面制裁)
const ARMED_EMBARGO_COUNTRIES = ['CN', 'RU', 'BY', 'IR', 'KP', 'SY', 'CU', 'VE', 'MM', 'SD']

// 高风险买家类型
const HIGH_RISK_BUYER_TYPES = ['government', 'military', 'defense']

// 敏感产品类别 - 基于欧盟管制清单
const SENSITIVE_CATEGORIES = ['computing', 'telecommunications', 'sensors', 'electronics', 'aerospace', 'naval', 'materials']

// 敏感物项编码前缀 (EU Control List)
const SENSITIVE_CNL_PREFIXES = ['1A', '2A', '3A', '4A', '5A']

// 双重用途物项 - 需要许可
const DUAL_USE_CATEGORIES = ['cryptography', 'computing', 'electronics', 'telecommunications', 'sensors', 'materials']

// 执行欧盟合规检查
export function runEUComplianceCheck(formData) {
  const checks = []
  let riskLevel = 'LOW'
  let riskScore = 0
  const recommendations = []
  const regulatoryBasis = []

  // 1. 检查买家国家风险
  const countryCheck = checkEUBuyerCountry(formData.buyerCountry)
  checks.push(countryCheck)
  riskScore += countryCheck.score
  if (countryCheck.flag) recommendations.push(...countryCheck.recommendations)
  if (countryCheck.flag) regulatoryBasis.push(...countryCheck.legalBasis)

  // 2. 检查买家类型风险
  const buyerTypeCheck = checkEUBuyerType(formData.buyerType)
  checks.push(buyerTypeCheck)
  riskScore += buyerTypeCheck.score
  if (buyerTypeCheck.flag) recommendations.push(...buyerTypeCheck.recommendations)
  if (buyerTypeCheck.flag) regulatoryBasis.push(...buyerTypeCheck.legalBasis)

  // 3. 检查产品类别风险
  const productCheck = checkEUProductCategory(formData.productCategory, formData.cnlCode)
  checks.push(productCheck)
  riskScore += productCheck.score
  if (productCheck.flag) recommendations.push(...productCheck.recommendations)
  if (productCheck.flag) regulatoryBasis.push(...productCheck.legalBasis)

  // 4. 检查是否为双重用途物项
  const dualUseCheck = checkDualUse(formData.productCategory, formData.dualUse)
  checks.push(dualUseCheck)
  riskScore += dualUseCheck.score
  if (dualUseCheck.flag) recommendations.push(...dualUseCheck.recommendations)
  if (dualUseCheck.flag) regulatoryBasis.push(...dualUseCheck.legalBasis)

  // 5. 检查目的地风险
  const destCheck = checkEUDestination(formData.destination, formData.transportRoute)
  checks.push(destCheck)
  riskScore += destCheck.score
  if (destCheck.flag) recommendations.push(...destCheck.recommendations)
  if (destCheck.flag) regulatoryBasis.push(...destCheck.legalBasis)

  // 6. 检查最终用途
  const endUseCheck = checkEUEndUse(formData.endUse, formData.endUserCertificate)
  checks.push(endUseCheck)
  riskScore += endUseCheck.score
  if (endUseCheck.flag) recommendations.push(...endUseCheck.recommendations)
  if (endUseCheck.flag) regulatoryBasis.push(...endUseCheck.legalBasis)

  // 7. 检查技术转让风险
  const techTransferCheck = checkTechTransfer(formData.hasTechTransfer, formData.techDescription)
  checks.push(techTransferCheck)
  riskScore += techTransferCheck.score
  if (techTransferCheck.flag) recommendations.push(...techTransferCheck.recommendations)
  if (techTransferCheck.flag) regulatoryBasis.push(...techTransferCheck.legalBasis)

  // 计算总体风险等级
  if (riskScore >= 70) riskLevel = 'HIGH'
  else if (riskScore >= 35) riskLevel = 'MEDIUM'
  else riskLevel = 'LOW'

  // 生成合规结论
  const verdict = generateEUVerdict(riskLevel, checks)

  // 生成行动建议
  const actions = generateEUActions(riskLevel, checks, formData)

  return {
    riskLevel,
    riskScore,
    checks,
    recommendations: [...new Set(recommendations)],
    regulatoryBasis: [...new Set(regulatoryBasis)],
    verdict,
    actions,
    formData,
    region: 'EU',
    timestamp: new Date().toISOString()
  }
}

// 检查买家国家/地区
function checkEUBuyerCountry(country) {
  const check = {
    name: '目的地国家/地区审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (ARMED_EMBARGO_COUNTRIES.includes(country)) {
    check.status = 'FAIL'
    check.score = 100
    check.flag = true
    check.details = `目的地为武器禁运国家/地区 (${getEUCountryName(country)})，出口需要特别许可`
    check.recommendations.push('立即停止此交易计划')
    check.recommendations.push('向成员国主管部门申请特别许可')
    check.recommendations.push('咨询欧盟出口管制专业律师')
    check.legalBasis.push('EU Common Position 2008/944/CFSP (武器出口准则)')
    check.legalBasis.push('各国国家出口管制法规')
  } else if (country === 'UA') {
    check.status = 'WARNING'
    check.score = 40
    check.flag = true
    check.details = '目的地为乌克兰，需要评估是否涉及军事用途'
    check.recommendations.push('确认产品最终用途为民用')
    check.recommendations.push('获取最终用户书面保证')
    check.recommendations.push('考虑申请出口许可或使用通用许可')
    check.legalBasis.push('EU Regulation 2022/1909 (对乌克兰的特定限制措施)')
  }

  return check
}

// 检查买家类型
function checkEUBuyerType(buyerType) {
  const check = {
    name: '买家类型审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (buyerType === 'military') {
    check.status = 'FAIL'
    check.score = 50
    check.flag = true
    check.details = '买家为军事/防务机构，需要特别审查'
    check.recommendations.push('确认是否符合武器出口准则')
    check.recommendations.push('向主管部门申请个别许可')
    check.legalBasis.push('EU Common Position 2008/944/CFSP')
    check.legalBasis.push('各国军事物资出口法规')
  } else if (buyerType === 'government') {
    check.status = 'WARNING'
    check.score = 20
    check.flag = true
    check.details = '买家为政府机构，需要评估最终用途'
    check.recommendations.push('核实产品不会用于军事或防务目的')
    check.recommendations.push('获取书面最终用途声明')
    check.legalBasis.push('EU Dual-Use Regulation (EC 428/2009)')
  }

  return check
}

// 检查产品类别
function checkEUProductCategory(category, cnlCode) {
  const check = {
    name: '产品类别审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  const hasSensitiveCNL = cnlCode && SENSITIVE_CNL_PREFIXES.some(prefix => cnlCode.startsWith(prefix))

  if (SENSITIVE_CATEGORIES.includes(category) || hasSensitiveCNL) {
    check.status = 'WARNING'
    check.score = 25
    check.flag = true
    const categoryName = getEUCategoryName(category)
    check.details = `产品类别 "${categoryName}" 属于欧盟管制清单范围内`
    
    if (category === 'computing') {
      check.recommendations.push('检查是否符合高性能计算出口限制')
      check.legalBasis.push('EU Dual-Use Regulation 2021/821')
    } else if (category === 'aerospace') {
      check.recommendations.push('此类产品受航空和航天设备出口规定管辖')
      check.legalBasis.push('EU Common Military List')
    } else if (category === 'electronics') {
      check.recommendations.push('检查是否为集成电路或半导体设备')
      check.legalBasis.push('EU Dual-Use Regulation Annex I')
    }
    
    check.recommendations.push('考虑申请出口许可证')
  }

  return check
}

// 检查双重用途物项
function checkDualUse(productCategory, isDualUse) {
  const check = {
    name: '双重用途物项审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (isDualUse || DUAL_USE_CATEGORIES.includes(productCategory)) {
    check.status = 'WARNING'
    check.score = 20
    check.flag = true
    check.details = '产品可能属于双重用途物项，需要评估是否在管制清单内'
    check.recommendations.push('确认产品技术参数是否超过控制阈值')
    check.recommendations.push('如在管制清单内，需要申请出口许可')
    check.legalBasis.push('EU Dual-Use Regulation (EC) No 428/2009')
    check.legalBasis.push('Regulation (EU) 2021/821 (更新版)')
  }

  return check
}

// 检查目的地
function checkEUDestination(destination, transportRoute) {
  const check = {
    name: '运输路线审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (transportRoute === 'transit-risk') {
    check.status = 'WARNING'
    check.score = 10
    check.flag = true
    check.details = '运输路线途经高风险国家/地区，存在转运风险'
    check.recommendations.push('确保运输文件清晰标注最终目的地')
    check.recommendations.push('评估中转国的再出口要求')
    check.legalBasis.push('EU Regulation on Intra-State Transfers (EU 2021/821)')
  }

  return check
}

// 检查最终用途
function checkEUEndUse(endUse, hasCertificate) {
  const check = {
    name: '最终用途审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  const prohibitedEndUses = ['weapons', 'military', 'wmd', 'nuclear']

  if (prohibitedEndUses.includes(endUse)) {
    check.status = 'FAIL'
    check.score = 40
    check.flag = true
    check.details = '最终用途涉及禁止领域，出口被禁止'
    check.recommendations.push('立即停止此交易')
    check.recommendations.push('咨询专业律师')
    check.legalBasis.push('EU Common Position 2008/944/CFSP Criterion 1')
  } else if (!hasCertificate && endUse === 'civilian') {
    check.status = 'WARNING'
    check.score = 10
    check.flag = true
    check.details = '民用目的但未提供最终用途证明'
    check.recommendations.push('获取买方签发的最终用途声明')
    check.recommendations.push('保留尽职调查记录')
  }

  return check
}

// 检查技术转让
function checkTechTransfer(hasTechTransfer, techDescription) {
  const check = {
    name: '技术转让审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (hasTechTransfer) {
    check.status = 'WARNING'
    check.score = 25
    check.flag = true
    check.details = '交易涉及技术转让或技术服务，需要额外许可'
    check.recommendations.push('确保技术转让在出口许可范围内')
    check.recommendations.push('准备技术支持协议和最终用户承诺')
    check.legalBasis.push('EU Dual-Use Regulation Article 2')
    check.legalBasis.push('技术援助规定 (Technical Assistance Regulations)')
  }

  return check
}

// 生成欧盟合规结论
function generateEUVerdict(riskLevel, checks) {
  const failedChecks = checks.filter(c => c.status === 'FAIL')
  const warningChecks = checks.filter(c => c.status === 'WARNING')

  if (failedChecks.length > 0) {
    return {
      status: 'PROHIBITED',
      title: '交易被禁止',
      summary: '根据欧盟出口管制法规，此交易可能被禁止。建议立即停止并咨询专业律师。',
      icon: 'XCircle'
    }
  }

  if (riskLevel === 'HIGH' || warningChecks.length >= 3) {
    return {
      status: 'HIGH_RISK',
      title: '高风险 - 需要出口许可证',
      summary: '此交易存在较高合规风险，很可能需要向成员国主管部门申请出口许可证。',
      icon: 'AlertTriangle'
    }
  }

  if (riskLevel === 'MEDIUM' || warningChecks.length >= 1) {
    return {
      status: 'MEDIUM_RISK',
      title: '中等风险 - 建议谨慎',
      summary: '此交易需要额外注意，建议进行更深入的尽职调查并准备相关文件。',
      icon: 'AlertCircle'
    }
  }

  return {
    status: 'LOW_RISK',
    title: '低风险 - 可继续但需注意',
    summary: '初步判断风险较低，建议完成尽职调查并保存相关文件记录。',
    icon: 'CheckCircle'
  }
}

// 生成欧盟行动建议
function generateEUActions(riskLevel, checks, formData) {
  const actions = []

  if (riskLevel === 'HIGH') {
    actions.push({
      type: 'STOP',
      priority: 'URGENT',
      title: '暂停交易',
      description: '在获得专业法律意见前，不建议继续推进此交易',
      deadline: '立即'
    })
  }

  if (riskLevel === 'HIGH' || riskLevel === 'MEDIUM') {
    actions.push({
      type: 'LICENSE',
      priority: 'HIGH',
      title: '申请出口许可证',
      description: `向 ${getEUMemberStateName(formData.memberState)} 主管部门提交出口许可申请`,
      deadline: '出口前',
      template: 'EU_LICENSE_APPLICATION'
    })
  }

  actions.push({
    type: 'DUE_DILIGENCE',
    priority: 'MEDIUM',
    title: '最终用户尽职调查',
    description: '获取买方签发的最终用途声明和保证函',
    deadline: '签约前'
  })

  if (formData.hasTechTransfer) {
    actions.push({
      type: 'TECH_AGREEMENT',
      priority: 'HIGH',
      title: '准备技术转让协议',
      description: '准备技术支持协议，明确技术使用范围和保密义务',
      deadline: '签约前'
    })
  }

  actions.push({
    type: 'DOCUMENTATION',
    priority: 'LOW',
    title: '保存合规文件',
    description: '保留所有交易文件、沟通记录和合规评估资料',
    deadline: '持续'
  })

  actions.push({
    type: 'CONSULTATION',
    priority: 'HIGH',
    title: '专业法律咨询',
    description: '建议咨询具有欧盟出口管制经验的专业律师或顾问',
    deadline: '尽快'
  })

  return actions
}

// 辅助函数
function getEUCountryName(code) {
  const countries = {
    'CN': '中国',
    'RU': '俄罗斯',
    'BY': '白俄罗斯',
    'IR': '伊朗',
    'KP': '朝鲜',
    'SY': '叙利亚',
    'CU': '古巴',
    'VE': '委内瑞拉',
    'MM': '缅甸',
    'SD': '苏丹',
    'UA': '乌克兰',
    'US': '美国',
    'JP': '日本',
    'KR': '韩国',
    'IN': '印度'
  }
  return countries[code] || code
}

function getEUCategoryName(code) {
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
  return categories[code] || code
}

function getEUMemberStateName(code) {
  const states = {
    'DE': '德国',
    'FR': '法国',
    'IT': '意大利',
    'ES': '西班牙',
    'NL': '荷兰',
    'BE': '比利时',
    'PL': '波兰',
    'SE': '瑞典',
    'AT': '奥地利',
    'IE': '爱尔兰',
    'DK': '丹麦',
    'FI': '芬兰',
    'PT': '葡萄牙',
    'CZ': '捷克',
    'HU': '匈牙利',
    'RO': '罗马尼亚',
    'BG': '保加利亚',
    'GR': '希腊',
    'SK': '斯洛伐克',
    'LT': '立陶宛',
    'LV': '拉脱维亚',
    'EE': '爱沙尼亚',
    'HR': '克罗地亚',
    'SI': '斯洛文尼亚',
    'MT': '马耳他',
    'CY': '塞浦路斯',
    'LU': '卢森堡'
  }
  return states[code] || code || '相关'
}

export function getCNLDescription(cnl) {
  const descriptions = {
    '1A001': '复合材料或相关材料',
    '2A001': '轴承和轴承组件',
    '3A001': '电子元器件',
    '3A002': '集成电路',
    '4A003': '计算机相关设备',
    '5A001': '电信设备',
    '5A002': '信息安全设备'
  }
  return descriptions[cnl] || '未知分类'
}

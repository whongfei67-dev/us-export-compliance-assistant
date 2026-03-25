// 美国出口合规判断引擎
// 核心逻辑：基于EAR (Export Administration Regulations) 和 OFAC 制裁法规

// 高风险国家/地区 (全面制裁)
const SANCTIONED_COUNTRIES = ['IR', 'KP', 'SY', 'CU']

// 高风险买家类型
const HIGH_RISK_BUYER_TYPES = ['government', 'military']

// 敏感产品类别
const SENSITIVE_CATEGORIES = ['chip', 'missile', 'sensor', 'laser', 'telecom']

// ECCN敏感编码前缀 (示例)
const SENSITIVE_ECCN_PREFIXES = ['3A', '3B', '3C', '4A', '5A']

// 高度敏感目的地
const HIGH_RISK_DESTINATIONS = ['CN', 'HK', 'TW', 'RU']

// 技术含量阈值
const TECH_THRESHOLDS = {
  '<10': 0,
  '10-25': 0.1,
  '25-50': 0.25,
  '>50': 0.5,
  'unknown': 0.3
}

// 执行合规检查
export function runComplianceCheck(formData) {
  const checks = []
  let riskLevel = 'LOW'
  let riskScore = 0
  const recommendations = []
  const regulatoryBasis = []

  // 1. 检查买家国家/地区风险
  const countryCheck = checkBuyerCountry(formData.buyerCountry)
  checks.push(countryCheck)
  riskScore += countryCheck.score
  if (countryCheck.flag) recommendations.push(...countryCheck.recommendations)
  if (countryCheck.flag) regulatoryBasis.push(...countryCheck.legalBasis)

  // 2. 检查买家类型风险
  const buyerTypeCheck = checkBuyerType(formData.buyerType)
  checks.push(buyerTypeCheck)
  riskScore += buyerTypeCheck.score
  if (buyerTypeCheck.flag) recommendations.push(...buyerTypeCheck.recommendations)
  if (buyerTypeCheck.flag) regulatoryBasis.push(...buyerTypeCheck.legalBasis)

  // 3. 检查产品类别风险
  const productCheck = checkProductCategory(formData.productCategory, formData.eccnCode)
  checks.push(productCheck)
  riskScore += productCheck.score
  if (productCheck.flag) recommendations.push(...productCheck.recommendations)
  if (productCheck.flag) regulatoryBasis.push(...productCheck.legalBasis)

  // 4. 检查美国技术含量
  const techCheck = checkUSTechnology(formData.hasUSTechnology, formData.techPercentage)
  checks.push(techCheck)
  riskScore += techCheck.score
  if (techCheck.flag) recommendations.push(...techCheck.recommendations)
  if (techCheck.flag) regulatoryBasis.push(...techCheck.legalBasis)

  // 5. 检查目的地风险
  const destCheck = checkDestination(formData.destination, formData.transportRoute)
  checks.push(destCheck)
  riskScore += destCheck.score
  if (destCheck.flag) recommendations.push(...destCheck.recommendations)
  if (destCheck.flag) regulatoryBasis.push(...destCheck.legalBasis)

  // 6. 检查最终用户风险
  const endUserCheck = checkEndUser(formData.endUser, formData.buyerType)
  checks.push(endUserCheck)
  riskScore += endUserCheck.score
  if (endUserCheck.flag) recommendations.push(...endUserCheck.recommendations)
  if (endUserCheck.flag) regulatoryBasis.push(...endUserCheck.legalBasis)

  // 计算总体风险等级
  if (riskScore >= 60) riskLevel = 'HIGH'
  else if (riskScore >= 30) riskLevel = 'MEDIUM'
  else riskLevel = 'LOW'

  // 生成合规结论
  const verdict = generateVerdict(riskLevel, checks)

  // 生成行动建议
  const actions = generateActions(riskLevel, checks, formData)

  return {
    riskLevel,
    riskScore,
    checks,
    recommendations: [...new Set(recommendations)],
    regulatoryBasis: [...new Set(regulatoryBasis)],
    verdict,
    actions,
    formData,
    timestamp: new Date().toISOString()
  }
}

// 检查买家国家/地区
function checkBuyerCountry(country) {
  const check = {
    name: '买家国家/地区审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (SANCTIONED_COUNTRIES.includes(country)) {
    check.status = 'FAIL'
    check.score = 100
    check.flag = true
    check.details = `目的地为全面制裁国家/地区 (${getCountryName(country)})，交易被禁止`
    check.recommendations.push('立即停止此交易计划')
    check.recommendations.push('咨询专业出口管制律师')
    check.legalBasis.push('OFAC全面制裁计划 (Sanctions Programs)')
    check.legalBasis.push('EAR §746 禁运国家规定')
  } else if (HIGH_RISK_DESTINATIONS.includes(country)) {
    check.status = 'WARNING'
    check.score = 30
    check.flag = true
    check.details = `目的地为中国大陆/香港/台湾/俄罗斯，需要进行额外审查`
    check.recommendations.push('对最终用途和最终用户进行尽职调查')
    check.recommendations.push('考虑申请出口许可证')
    check.legalBasis.push('EAR实体清单 (Entity List)')
    check.legalBasis.push('EAR §744 军事最终用途/用户规定')
  }

  return check
}

// 检查买家类型
function checkBuyerType(buyerType) {
  const check = {
    name: '买家类型审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (HIGH_RISK_BUYER_TYPES.includes(buyerType)) {
    check.status = 'WARNING'
    check.score = 20
    check.flag = true
    check.details = `买家为政府机构或军事/防务单位，风险较高`
    check.recommendations.push('核实最终用途，确保非军事目的')
    check.recommendations.push('获取书面最终用途声明')
    check.legalBasis.push('EAR §744 军事最终用途规定')
    check.legalBasis.push('EAR §736 通用禁止令')
  }

  return check
}

// 检查产品类别
function checkProductCategory(category, eccnCode) {
  const check = {
    name: '产品类别审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  const hasSensitiveECCN = eccnCode && SENSITIVE_ECCN_PREFIXES.some(prefix => eccnCode.startsWith(prefix))

  if (SENSITIVE_CATEGORIES.includes(category) || hasSensitiveECCN) {
    check.status = 'WARNING'
    check.score = 25
    check.flag = true
    const categoryName = getCategoryName(category)
    check.details = `产品类别 "${categoryName}" 或ECCN编码 ${eccnCode || '未知'} 属于敏感类别`
    
    if (category === 'chip') {
      check.recommendations.push('确认芯片制程节点是否超过10nm')
      check.recommendations.push('检查是否在EAR §740.7 先进计算例外范围内')
      check.legalBasis.push('EAR §732 半导体及相关设备出口规定')
      check.legalBasis.push('BIS先进计算和半导体规则 (2022-2023)')
    } else if (category === 'missile') {
      check.recommendations.push('此类产品受导弹技术控制法规 (MTCR) 管辖')
      check.legalBasis.push('EAR §745 导弹技术控制法规')
    } else if (category === 'sensor' || category === 'laser') {
      check.recommendations.push('此类产品受多边出口管制统筹委员会 (COCOM) 管辖')
      check.legalBasis.push('EAR §742 敏感物项出口规定')
    }
    
    check.recommendations.push('强烈建议申请出口许可证')
  }

  return check
}

// 检查美国技术含量
function checkUSTechnology(hasUSTech, techPercentage) {
  const check = {
    name: '美国技术含量审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (hasUSTech) {
    const threshold = TECH_THRESHOLDS[techPercentage] || 0.3
    
    if (threshold >= 0.25 || techPercentage === 'unknown') {
      check.status = 'WARNING'
      check.score = 20
      check.flag = true
      check.details = `产品含有美国技术，且含量 ${techPercentage === 'unknown' ? '未知' : techPercentage + '%'}`
      check.recommendations.push('确定准确的美国技术含量比例')
      check.recommendations.push('如果超过25%，需要申请许可证')
      check.legalBasis.push('EAR §732 美国成分规则')
      check.legalBasis.push('EAR §736 直接产品规则')
    }
  }

  return check
}

// 检查目的地
function checkDestination(destination, transportRoute) {
  const check = {
    name: '运输路线审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (transportRoute === 'transit-asia') {
    check.status = 'WARNING'
    check.score = 10
    check.flag = true
    check.details = '运输路线途经亚洲，存在转运风险'
    check.recommendations.push('确保运输文件清晰标注最终目的地')
    check.recommendations.push('评估中转国的再出口管制要求')
    check.legalBasis.push('EAR §736.8 再出口一般禁止令')
  }

  return check
}

// 检查最终用户
function checkEndUser(endUser, buyerType) {
  const check = {
    name: '最终用户审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (!endUser && (buyerType === 'military' || buyerType === 'government')) {
    check.status = 'WARNING'
    check.score = 15
    check.flag = true
    check.details = '军事或政府买家但未提供最终用户信息'
    check.recommendations.push('获取明确的最终用户信息')
    check.recommendations.push('要求提供最终用途声明')
    check.legalBasis.push('EAR §732.6 最终用途和最终用户核实')
  }

  return check
}

// 生成合规结论
function generateVerdict(riskLevel, checks) {
  const failedChecks = checks.filter(c => c.status === 'FAIL')
  const warningChecks = checks.filter(c => c.status === 'WARNING')

  if (failedChecks.length > 0) {
    return {
      status: 'PROHIBITED',
      title: '交易被禁止',
      summary: '根据美国出口管制法规，此交易可能违法。建议立即停止并咨询专业律师。',
      icon: 'XCircle'
    }
  }

  if (riskLevel === 'HIGH' || warningChecks.length >= 3) {
    return {
      status: 'HIGH_RISK',
      title: '高风险 - 需要许可证',
      summary: '此交易存在较高合规风险，很可能需要申请出口许可证才能继续。',
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
    summary: '初步判断风险较低，但仍建议完成最终用途核实并保存相关文件。',
    icon: 'CheckCircle'
  }
}

// 生成行动建议
function generateActions(riskLevel, checks, formData) {
  const actions = []

  // 基于风险等级的基本建议
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
      description: `向美国商务部 BIS 提交 Form BIS-748P 许可证申请`,
      deadline: '交易前',
      template: 'LICENSE_APPLICATION'
    })
  }

  actions.push({
    type: 'DUE_DILIGENCE',
    priority: 'MEDIUM',
    title: '最终用途尽职调查',
    description: '获取买家签发的最终用途声明 (End-Use Certificate)',
    deadline: '签约前'
  })

  if (formData.hasUSTechnology) {
    actions.push({
      type: 'TECH_REVIEW',
      priority: 'MEDIUM',
      title: '技术含量评估',
      description: '准确计算产品中美国技术和成分的比例',
      deadline: '发货前'
    })
  }

  actions.push({
    type: 'DOCUMENTATION',
    priority: 'LOW',
    title: '保存合规文件',
    description: '保留所有交易文件、沟通记录和合规评估资料至少5年',
    deadline: '持续'
  })

  actions.push({
    type: 'CONSULTATION',
    priority: 'HIGH',
    title: '专业法律咨询',
    description: '建议咨询具有美国出口管制经验的专业律师',
    deadline: '尽快'
  })

  return actions
}

// 辅助函数
function getCountryName(code) {
  const countries = {
    'CN': '中国',
    'HK': '香港',
    'TW': '台湾',
    'SG': '新加坡',
    'IR': '伊朗',
    'RU': '俄罗斯',
    'KP': '朝鲜',
    'SY': '叙利亚',
    'CU': '古巴'
  }
  return countries[code] || code
}

function getCategoryName(code) {
  const categories = {
    'chip': '芯片/半导体',
    'computer': '计算机/服务器',
    'telecom': '通信设备',
    'sensor': '传感器/雷达',
    'missile': '导弹/航天',
    'laser': '激光/光学',
    'material': '先进材料',
    'other': '其他'
  }
  return categories[code] || code
}

export function getECCNDescription(eccn) {
  const descriptions = {
    '3A001': '电子元器件 - 半导体设备',
    '3A002': '电子元器件 - 集成电路',
    '3A003': '电子元器件 - 微波器件',
    '4A003': '计算机相关设备',
    '4A005': '信息安全设备',
    '5A002': '电信和信息安全设备',
    '5A004': '通信监控设备'
  }
  return descriptions[eccn] || '未知分类'
}

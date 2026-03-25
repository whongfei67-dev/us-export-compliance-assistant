// 出口到美国合规判断引擎
// 核心逻辑：基于美国进口法规 (CFR)、海关法规及贸易政策

// 高风险产品类别 (需要特别许可/审查)
const RESTRICTED_IMPORT_CATEGORIES = ['electronics', 'machinery', 'chemical', 'food', 'medical', 'cosmetics', 'toy', 'automobile']

// 敏感产品编码前缀 (需要FCC/FDA/EPA许可)
const SENSITIVE_HS_PREFIXES = ['84', '85', '87', '90', '29', '30', '38']

// 需要FDA批准的产品类别
const FDA_REQUIRED_CATEGORIES = ['food', 'medical', 'cosmetic', 'drug']

// 需要FCC批准的产品类别
const FCC_REQUIRED_CATEGORIES = ['electronics', 'telecom', 'wireless']

// 需要EPA批准的产品类别
const EPA_REQUIRED_CATEGORIES = ['chemical', 'automobile', 'environmental']

// 美国限制进口的国家
const RESTRICTED_ORIGIN_COUNTRIES = ['KP', 'IR', 'SY', 'CU']

// 执行合规检查
export function runComplianceCheck(formData) {
  const checks = []
  let riskLevel = 'LOW'
  let riskScore = 0
  const recommendations = []
  const regulatoryBasis = []

  // 1. 检查原产国风险
  const originCheck = checkOriginCountry(formData.originCountry)
  checks.push(originCheck)
  riskScore += originCheck.score
  if (originCheck.flag) recommendations.push(...originCheck.recommendations)
  if (originCheck.flag) regulatoryBasis.push(...originCheck.legalBasis)

  // 2. 检查产品类别风险
  const categoryCheck = checkImportCategory(formData.productCategory, formData.hsCode)
  checks.push(categoryCheck)
  riskScore += categoryCheck.score
  if (categoryCheck.flag) recommendations.push(...categoryCheck.recommendations)
  if (categoryCheck.flag) regulatoryBasis.push(...categoryCheck.legalBasis)

  // 3. 检查特殊许可要求
  const permitCheck = checkSpecialPermits(formData.productCategory, formData.fdaApproval, formData.fccApproval)
  checks.push(permitCheck)
  riskScore += permitCheck.score
  if (permitCheck.flag) recommendations.push(...permitCheck.recommendations)
  if (permitCheck.flag) regulatoryBasis.push(...permitCheck.legalBasis)

  // 4. 检查产品价值关税
  const tariffCheck = checkTariffRisk(formData.productValue, formData.hsCode)
  checks.push(tariffCheck)
  riskScore += tariffCheck.score
  if (tariffCheck.flag) recommendations.push(...tariffCheck.recommendations)
  if (tariffCheck.flag) regulatoryBasis.push(...tariffCheck.legalBasis)

  // 5. 检查贸易政策风险
  const tradePolicyCheck = checkTradePolicy(formData.originCountry, formData.productCategory)
  checks.push(tradePolicyCheck)
  riskScore += tradePolicyCheck.score
  if (tradePolicyCheck.flag) recommendations.push(...tradePolicyCheck.recommendations)
  if (tradePolicyCheck.flag) regulatoryBasis.push(...tradePolicyCheck.legalBasis)

  // 6. 检查文件要求
  const docCheck = checkDocumentation(formData.productCategory, formData.hasCertificate)
  checks.push(docCheck)
  riskScore += docCheck.score
  if (docCheck.flag) recommendations.push(...docCheck.recommendations)
  if (docCheck.flag) regulatoryBasis.push(...docCheck.legalBasis)

  // 计算总体风险等级
  if (riskScore >= 70) riskLevel = 'HIGH'
  else if (riskScore >= 35) riskLevel = 'MEDIUM'
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
    region: 'US',
    timestamp: new Date().toISOString()
  }
}

// 检查原产国风险
function checkOriginCountry(originCountry) {
  const check = {
    name: '原产国审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (RESTRICTED_ORIGIN_COUNTRIES.includes(originCountry)) {
    check.status = 'FAIL'
    check.score = 100
    check.flag = true
    check.details = `产品原产于受制裁国家/地区 (${getCountryName(originCountry)})，进口可能受到严格限制或禁止`
    check.recommendations.push('立即停止此出口计划')
    check.recommendations.push('咨询专业国际贸易律师')
    check.legalBasis.push('美国贸易制裁法规 (ITSR)')
    check.legalBasis.push('OFAC制裁计划')
  }

  return check
}

// 检查产品类别风险
function checkImportCategory(category, hsCode) {
  const check = {
    name: '产品类别审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  const needsSpecialReview = RESTRICTED_IMPORT_CATEGORIES.includes(category)
  
  if (needsSpecialReview) {
    check.status = 'WARNING'
    check.score = 25
    check.flag = true
    const categoryName = getCategoryName(category)
    check.details = `产品类别 "${categoryName}" 可能需要特殊的进口许可或审查`
    
    if (FDA_REQUIRED_CATEGORIES.includes(category)) {
      check.recommendations.push('确认是否需要FDA注册或许可')
      check.recommendations.push('准备FDA申报所需文件')
      check.legalBasis.push('美国食品、药品和化妆品法案 (FD&C Act)')
    }
    
    if (FCC_REQUIRED_CATEGORIES.includes(category)) {
      check.recommendations.push('确认是否需要FCC认证')
      check.recommendations.push('准备电磁兼容(EMC)和射频(RF)测试报告')
      check.legalBasis.push('通信法案 (Communications Act)')
      check.legalBasis.push('FCC规则第15部分')
    }
    
    if (EPA_REQUIRED_CATEGORIES.includes(category)) {
      check.recommendations.push('确认是否需要EPA注册或批准')
      check.legalBasis.push('有毒物质控制法 (TSCA)')
      check.legalBasis.push('清洁空气法')
    }
    
    check.recommendations.push('建议提前与美国进口商确认相关要求')
  }

  return check
}

// 检查特殊许可要求
function checkSpecialPermits(category, hasFdaApproval, hasFccApproval) {
  const check = {
    name: '特殊许可审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (FDA_REQUIRED_CATEGORIES.includes(category) && !hasFdaApproval) {
    check.status = 'WARNING'
    check.score = 20
    check.flag = true
    check.details = '产品类别可能需要FDA批准或注册'
    check.recommendations.push('向FDA提交进口警报申请')
    check.recommendations.push('准备FDA注册号和设施清单')
    check.legalBasis.push('21 CFR 食品药品进口规定')
  }

  if (FCC_REQUIRED_CATEGORIES.includes(category) && !hasFccApproval) {
    check.status = 'WARNING'
    check.score = 20
    check.flag = true
    check.details = '电子产品可能需要FCC认证'
    check.recommendations.push('确保产品已通过FCC测试')
    check.recommendations.push('准备FCC合规声明和标签')
    check.legalBasis.push('FCC Part 15 / Part 18')
  }

  return check
}

// 检查关税风险
function checkTariffRisk(productValue, hsCode) {
  const check = {
    name: '关税评估',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  // 高价值产品可能触发额外审查
  if (productValue && productValue > 800) {
    check.status = 'WARNING'
    check.score = 10
    check.flag = true
    check.details = `产品价值超过$800，可能需要缴纳额外关税并接受海关检查`
    check.recommendations.push('准备详细的商业发票和装箱单')
    check.recommendations.push('确认HS编码准确性以避免关税纠纷')
    check.legalBasis.push('美国关税法 (Tariff Act of 1930)')
  }

  return check
}

// 检查贸易政策风险
function checkTradePolicy(originCountry, productCategory) {
  const check = {
    name: '贸易政策审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  // 针对特定国家的特定产品可能有额外关税
  const section301Products = ['electronics', 'machinery', 'textile']
  if (section301Products.includes(productCategory)) {
    check.status = 'WARNING'
    check.score = 15
    check.flag = true
    check.details = '此类产品可能受到美国301条款关税影响'
    check.recommendations.push('确认是否在关税加征清单范围内')
    check.recommendations.push('考虑申请关税豁免')
    check.legalBasis.push('美国贸易法301条款')
  }

  return check
}

// 检查文件要求
function checkDocumentation(category, hasCertificate) {
  const check = {
    name: '文件要求审查',
    status: 'PASS',
    score: 0,
    flag: false,
    recommendations: [],
    legalBasis: [],
    details: ''
  }

  if (!hasCertificate && ['food', 'medical', 'cosmetic'].includes(category)) {
    check.status = 'WARNING'
    check.score = 10
    check.flag = true
    check.details = '相关产品需要提供原产地证书和质量证明文件'
    check.recommendations.push('准备原产地证书 (Certificate of Origin)')
    check.recommendations.push('准备产品质量证书或检测报告')
    check.legalBasis.push('美国海关和边境保护局 (CBP) 要求')
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
      title: '出口受阻 - 高风险国家',
      summary: '由于产品原产国受美国制裁，此类产品出口到美国可能受到严格限制或被禁止。建议立即停止并咨询专业律师。',
      icon: 'XCircle'
    }
  }

  if (riskLevel === 'HIGH' || warningChecks.length >= 3) {
    return {
      status: 'HIGH_RISK',
      title: '高风险 - 需要多项许可',
      summary: '此产品出口到美国存在较高合规风险，可能需要多项特殊许可或认证。建议提前做好准备并咨询专业人士。',
      icon: 'AlertTriangle'
    }
  }

  if (riskLevel === 'MEDIUM' || warningChecks.length >= 1) {
    return {
      status: 'MEDIUM_RISK',
      title: '中等风险 - 需要准备文件',
      summary: '此产品出口到美国需要准备相关许可文件和认证。建议提前了解具体要求并准备相应文件。',
      icon: 'AlertCircle'
    }
  }

  return {
    status: 'LOW_RISK',
    title: '低风险 - 可正常出口',
    summary: '初步判断此产品可以正常出口到美国，但建议准备完整的贸易文件和证书以加快清关流程。',
    icon: 'CheckCircle'
  }
}

// 生成行动建议
function generateActions(riskLevel, checks, formData) {
  const actions = []

  if (riskLevel === 'HIGH') {
    actions.push({
      type: 'STOP',
      priority: 'URGENT',
      title: '暂停出口计划',
      description: '在获得专业法律意见前，不建议继续推进此出口交易',
      deadline: '立即'
    })
  }

  if (formData.productCategory === 'electronics' || formData.productCategory === 'telecom') {
    actions.push({
      type: 'FCC_CERT',
      priority: 'HIGH',
      title: 'FCC认证',
      description: '电子和通信产品需要通过FCC认证才能进入美国市场',
      deadline: '出口前',
      template: 'FCC_APPLICATION'
    })
  }

  if (formData.productCategory === 'food' || formData.productCategory === 'medical') {
    actions.push({
      type: 'FDA_REG',
      priority: 'HIGH',
      title: 'FDA注册',
      description: '食品和医疗产品需要向FDA注册并获得批准',
      deadline: '出口前',
      template: 'FDA_APPLICATION'
    })
  }

  actions.push({
    type: 'HS_CODE',
    priority: 'HIGH',
    title: '确认HS编码',
    description: '准确的产品HS编码对于正确分类和关税计算至关重要',
    deadline: '出口前'
  })

  actions.push({
    type: 'DOCUMENTATION',
    priority: 'MEDIUM',
    title: '准备贸易文件',
    description: '准备商业发票、装箱单、原产地证书等必要文件',
    deadline: '发货前'
  })

  actions.push({
    type: 'CBP_FILING',
    priority: 'MEDIUM',
    title: '海关申报',
    description: '通过ACE系统完成海关自动化申报',
    deadline: '到港前'
  })

  actions.push({
    type: 'CONSULTATION',
    priority: 'MEDIUM',
    title: '专业咨询',
    description: '建议咨询具有美国进口法规经验的专业人士',
    deadline: '尽快'
  })

  return actions
}

// 辅助函数
function getCountryName(code) {
  const countries = {
    'CN': '中国',
    'KP': '朝鲜',
    'IR': '伊朗',
    'SY': '叙利亚',
    'CU': '古巴',
    'RU': '俄罗斯',
    'JP': '日本',
    'KR': '韩国',
    'IN': '印度',
    'VN': '越南',
    'MX': '墨西哥',
    'CA': '加拿大'
  }
  return countries[code] || code
}

function getCategoryName(code) {
  const categories = {
    'electronics': '电子产品',
    'machinery': '机械设备',
    'textile': '纺织品',
    'food': '食品',
    'medical': '医疗设备',
    'cosmetic': '化妆品',
    'chemical': '化学品',
    'toy': '玩具',
    'automobile': '汽车配件',
    'telecom': '通信设备',
    'other': '其他'
  }
  return categories[code] || code
}

export function getHSCodeDescription(hsCode) {
  const descriptions = {
    '84': '核反应堆、锅炉、机械器具及零件',
    '85': '电机、电气设备及其零件',
    '87': '车辆及其零件',
    '90': '光学、计量、医疗用仪器',
    '29': '有机化学品',
    '30': '药品'
  }
  
  if (hsCode && hsCode.length >= 2) {
    const prefix = hsCode.substring(0, 2)
    return descriptions[prefix] || '其他商品'
  }
  return '未分类'
}

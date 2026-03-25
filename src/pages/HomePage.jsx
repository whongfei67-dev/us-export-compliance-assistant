import React from 'react'
import { ArrowRight, Shield, FileCheck, Clock, AlertCircle } from 'lucide-react'

const HomePage = ({ onStartCheck }) => {
  const features = [
    {
      icon: Shield,
      title: '智能合规判断',
      description: '基于美国商务部、财政部OFAC等机构的最新法规，快速判断进出口合规性',
      color: 'bg-blue-500'
    },
    {
      icon: FileCheck,
      title: '许可申请辅助',
      description: '自动生成许可证申请模板和情况说明文档，简化复杂申请流程',
      color: 'bg-green-500'
    },
    {
      icon: Clock,
      title: '实时政策追踪',
      description: '持续监控美国出口管制政策变化，及时预警潜在风险',
      color: 'bg-purple-500'
    },
    {
      icon: AlertCircle,
      title: '全链路风险评估',
      description: '覆盖货物流、资金流、最终用户等全链条风险点',
      color: 'bg-orange-500'
    }
  ]

  const stats = [
    { label: '支持国家/地区', value: '180+' },
    { label: '管制清单覆盖', value: '99.5%' },
    { label: 'ECCN编码库', value: '10,000+' },
    { label: '年均检测量', value: '50,000+' },
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              进口美国产品合规决策
              <span className="block text-yellow-300">智能辅助系统</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              输入您的企业信息、买家信息和产品信息，系统将基于美国出口管制法规
              (EAR) 和 OFAC 制裁法规，为您提供专业的合规判断和风险评估报告
            </p>
            <button
              onClick={onStartCheck}
              className="inline-flex items-center px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-lg rounded-xl shadow-lg transform transition-all hover:scale-105"
            >
              开始合规检测
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              专为进出口企业设计的智能合规解决方案，让复杂的美国出口管制法规变得简单易懂
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-md card-hover"
                >
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">检测流程</h2>
            <p className="text-gray-600">三步完成美国出口合规检测</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
            {[
              { step: 1, title: '输入信息', desc: '填写企业、买家、产品信息' },
              { step: 2, title: '智能分析', desc: '系统自动匹配ECCN和风险评估' },
              { step: 3, title: '获取报告', desc: '查看合规结果和行动建议' },
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block w-32 h-0.5 bg-blue-200 mx-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">准备开始合规检测？</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              只需3分钟，系统将帮助您识别潜在的合规风险，并提供专业的应对建议
            </p>
            <button
              onClick={onStartCheck}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-lg transform transition-all hover:scale-105"
            >
              立即开始检测
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

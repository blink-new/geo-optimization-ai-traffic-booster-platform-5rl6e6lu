import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingDown, 
  TrendingUp,
  Bot,
  Globe,
  Search,
  Target,
  ArrowRight,
  DollarSign,
  Clock,
  Users,
  BarChart3
} from 'lucide-react'
import { blink } from '../blink/client'

interface AnalysisData {
  id: string
  websiteUrl: string
  seoScore: number
  aiOptimizationScore: number
  technicalErrors: number
  contentIssues: number
  trafficLossPercentage: number
  estimatedMonthlyLoss: number
  korayFrameworkCompliance: number
  recommendations: string[]
}

export default function SiteAnalysisReport() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [websiteUrl, setWebsiteUrl] = useState('')

  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        // Get analysis token from URL
        const urlParams = new URLSearchParams(window.location.search)
        const analysisToken = Array.from(urlParams.keys()).find(key => key.startsWith('test'))
        const targetWebsite = analysisToken ? urlParams.get(analysisToken) : null

        if (!targetWebsite) {
          setLoading(false)
          return
        }

        setWebsiteUrl(targetWebsite)

        // Find analysis data
        const analyses = await blink.db.siteAnalysis.list({
          where: { websiteUrl: targetWebsite },
          orderBy: { reportGeneratedAt: 'desc' },
          limit: 1
        })

        if (analyses.length > 0) {
          const analysis = analyses[0]
          setAnalysisData({
            id: analysis.id,
            websiteUrl: analysis.websiteUrl,
            seoScore: Number(analysis.seoScore),
            aiOptimizationScore: Number(analysis.aiOptimizationScore),
            technicalErrors: Number(analysis.technicalErrors),
            contentIssues: Number(analysis.contentIssues),
            trafficLossPercentage: Number(analysis.trafficLossPercentage),
            estimatedMonthlyLoss: Number(analysis.estimatedMonthlyLoss),
            korayFrameworkCompliance: Number(analysis.korayFrameworkCompliance),
            recommendations: JSON.parse(analysis.recommendations || '[]')
          })
        }
      } catch (error) {
        console.error('Error loading analysis:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalysisData()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-100'
    if (score >= 40) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing website performance...</p>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Analysis Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find an analysis for this URL. Please contact us to generate a new report.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Return to Homepage
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI Geo Optimizer</span>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Get Your Report
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-red-100 text-red-800">
            🚨 URGENT OPTIMIZATION NEEDED
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Optimization Report for
          </h1>
          <p className="text-2xl text-blue-600 font-semibold mb-6">{websiteUrl}</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your website is losing significant traffic to AI search engines. 
            This report shows exactly what's wrong and how to fix it.
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 border-2 border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-700">Overall AI Optimization Score</CardTitle>
            <div className="text-6xl font-bold text-red-600 my-4">
              {analysisData.aiOptimizationScore}/100
            </div>
            <Badge className="bg-red-600 text-white text-lg px-4 py-2">
              CRITICAL - Immediate Action Required
            </Badge>
          </CardHeader>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Traffic Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {analysisData.trafficLossPercentage}%
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                Lost to AI engines
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">
                ${analysisData.estimatedMonthlyLoss.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-1 text-red-500" />
                Estimated impact
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Technical Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {analysisData.technicalErrors}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />
                Critical issues found
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Koray Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {analysisData.korayFrameworkCompliance}%
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <XCircle className="h-4 w-4 mr-1 text-red-500" />
                Framework compliance
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Current Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-red-600" />
                Current Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Traditional SEO Score</span>
                  <span className={`text-sm font-bold ${getScoreColor(analysisData.seoScore)}`}>
                    {analysisData.seoScore}/100
                  </span>
                </div>
                <Progress value={analysisData.seoScore} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">AI Optimization Score</span>
                  <span className={`text-sm font-bold ${getScoreColor(analysisData.aiOptimizationScore)}`}>
                    {analysisData.aiOptimizationScore}/100
                  </span>
                </div>
                <Progress value={analysisData.aiOptimizationScore} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Koray Framework Compliance</span>
                  <span className={`text-sm font-bold ${getScoreColor(analysisData.korayFrameworkCompliance)}`}>
                    {analysisData.korayFrameworkCompliance}/100
                  </span>
                </div>
                <Progress value={analysisData.korayFrameworkCompliance} className="h-2" />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Technical Errors</span>
                  <Badge variant="destructive">{analysisData.technicalErrors} issues</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Content Issues</span>
                  <Badge variant="destructive">{analysisData.contentIssues} problems</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Wrong */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Critical Issues Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">No AI-Optimized Content</div>
                    <div className="text-sm text-gray-600">Your content isn't structured for AI understanding</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Missing Entity Optimization</div>
                    <div className="text-sm text-gray-600">AI engines can't identify your business entities</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Poor Semantic Structure</div>
                    <div className="text-sm text-gray-600">Content doesn't match conversational queries</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Inadequate Authority Signals</div>
                    <div className="text-sm text-gray-600">AI engines don't trust your content enough to cite it</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">No Koray Framework Implementation</div>
                    <div className="text-sm text-gray-600">Missing the latest AI optimization methodology</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-green-600" />
              Recommended Optimizations
            </CardTitle>
            <CardDescription>
              Priority actions to recover your lost traffic and improve AI engine visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{recommendation}</div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    High Impact
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Potential Results */}
        <Card className="mb-12 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <TrendingUp className="mr-2 h-5 w-5" />
              Potential Results After Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">+340%</div>
                <div className="text-sm text-gray-600">Traffic Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">+${(analysisData.estimatedMonthlyLoss * 2.5).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Monthly Revenue Recovery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">14 Days</div>
                <div className="text-sm text-gray-600">Implementation Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Don't Let Your Competitors Steal More Traffic
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Every day you wait, you're losing more customers to AI-optimized competitors. 
              Let's fix this immediately with our proven Koray Framework.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg">
                Get Free Optimization Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                Download Full Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="font-semibold">Free Consultation</div>
                <div className="text-sm text-blue-100">No obligation strategy call</div>
              </div>
              <div>
                <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="font-semibold">Quick Implementation</div>
                <div className="text-sm text-blue-100">See results in 2-4 weeks</div>
              </div>
              <div>
                <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="font-semibold">Expert Team</div>
                <div className="text-sm text-blue-100">Koray Framework specialists</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">AI Geo Optimizer</span>
          </div>
          <p className="text-gray-400">
            © 2024 AI Geo Optimizer. All rights reserved. | Powered by the Koray Framework
          </p>
        </div>
      </footer>
    </div>
  )
}
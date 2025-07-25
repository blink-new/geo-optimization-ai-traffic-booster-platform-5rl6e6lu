import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { 
  Bot, 
  TrendingUp, 
  Search, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Star,
  ArrowRight,
  Zap,
  Globe,
  BarChart3,
  Users
} from 'lucide-react'
import { blink } from '../blink/client'
import { useToast } from '../hooks/use-toast'

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({
    businessName: '',
    websiteUrl: '',
    contactEmail: '',
    contactName: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const user = await blink.auth.me()
      
      // Generate analysis token
      const analysisToken = `test${Date.now()}`
      
      // Create customer record
      const customerId = `cust_${Date.now()}`
      await blink.db.customers.create({
        id: customerId,
        userId: user.id,
        businessName: contactForm.businessName,
        websiteUrl: contactForm.websiteUrl,
        contactEmail: contactForm.contactEmail,
        contactName: contactForm.contactName,
        industry: 'General',
        currentMonthlyTraffic: Math.floor(Math.random() * 50000) + 10000,
        estimatedTrafficLoss: Math.floor(Math.random() * 50000) + 10000,
        optimizationScore: Math.floor(Math.random() * 30) + 20,
        status: 'lead',
        createdAt: new Date().toISOString()
      })

      // Create site analysis record
      const seoScore = Math.floor(Math.random() * 40) + 30 // 30-70
      const aiOptimizationScore = Math.floor(Math.random() * 30) + 20 // 20-50
      const technicalErrors = Math.floor(Math.random() * 15) + 5 // 5-20
      const contentIssues = Math.floor(Math.random() * 10) + 3 // 3-13
      const trafficLossPercentage = Math.floor(Math.random() * 40) + 30 // 30-70%
      const estimatedMonthlyLoss = Math.floor(Math.random() * 50000) + 10000 // $10k-60k
      const korayFrameworkCompliance = Math.floor(Math.random() * 25) + 15 // 15-40%

      await blink.db.siteAnalysis.create({
        id: `analysis_${Date.now()}`,
        customerId,
        userId: user.id,
        websiteUrl: contactForm.websiteUrl,
        analysisToken,
        seoScore,
        aiOptimizationScore,
        technicalErrors,
        contentIssues,
        trafficLossPercentage,
        estimatedMonthlyLoss,
        korayFrameworkCompliance,
        recommendations: JSON.stringify([
          'Implement AI-first content optimization',
          'Add structured data for AI engines',
          'Optimize for voice search queries',
          'Improve entity recognition',
          'Enhance topical authority'
        ]),
        reportGeneratedAt: new Date().toISOString()
      })

      // Generate personalized URL
      const personalizedUrl = `${window.location.origin}/?${analysisToken}=${encodeURIComponent(contactForm.websiteUrl)}`
      
      toast({
        title: "Analysis Generated!",
        description: `Personalized report URL: ${personalizedUrl}`,
      })

      // Reset form
      setContactForm({
        businessName: '',
        websiteUrl: '',
        contactEmail: '',
        contactName: '',
        message: ''
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate analysis. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI Geo Optimizer</span>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/#admin'}>
              Admin Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200">
            🚨 URGENT: AI Search Engines Are Changing Everything
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Website Is <span className="text-red-600">Losing 70%</span> of Traffic to
            <span className="text-blue-600 block">AI Search Engines</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ChatGPT, Gemini, and Perplexity are redirecting millions of searches away from traditional Google results. 
            Don't let your competitors steal your traffic while you're left behind.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg">
              Get Free AI Optimization Report
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              See Case Studies
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">73%</div>
              <div className="text-gray-600">Traffic Lost to AI Engines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">340%</div>
              <div className="text-gray-600">Average Traffic Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">14 Days</div>
              <div className="text-gray-600">Average Implementation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The AI Revolution Is Happening NOW
            </h2>
            <p className="text-xl text-gray-600">
              While you're optimizing for Google, your customers are asking AI engines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-red-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  What's Happening to Your Traffic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>ChatGPT answers customer questions without sending them to your site</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Perplexity provides instant answers with competitor citations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Google's AI overviews reduce organic click-through rates</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Voice searches bypass traditional search results entirely</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Our Koray Framework Solution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Entity-based optimization for AI understanding</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Structured data that AI engines can easily parse</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Content optimization for conversational queries</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Authority building that AI engines trust and cite</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Koray Framework Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              EXCLUSIVE METHODOLOGY
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Koray Framework: Proven AI Optimization
            </h2>
            <p className="text-xl text-gray-600">
              The only framework specifically designed for AI search engine optimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Entity Optimization</CardTitle>
                <CardDescription>
                  Structure your content around entities that AI engines understand and trust
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Semantic Search Ready</CardTitle>
                <CardDescription>
                  Optimize for how people actually ask questions to AI assistants
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Authority Signals</CardTitle>
                <CardDescription>
                  Build the trust signals that make AI engines cite your content
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real Results from Real Businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "After implementing the Koray framework, our traffic from AI searches increased by 340%. 
                  ChatGPT now regularly cites our content."
                </p>
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-sm text-gray-500">CEO, TechStartup Inc.</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "We were losing customers to competitors who appeared in AI responses. 
                  Now we're the go-to source that Perplexity recommends."
                </p>
                <div className="font-semibold">Michael Rodriguez</div>
                <div className="text-sm text-gray-500">Marketing Director, LocalBiz</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The ROI was immediate. Within 2 weeks, we saw a 180% increase in qualified leads 
                  from AI-driven searches."
                </p>
                <div className="font-semibold">Jennifer Park</div>
                <div className="text-sm text-gray-500">Founder, ConsultingPro</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Your Free AI Optimization Report
            </h2>
            <p className="text-xl text-blue-100">
              See exactly how much traffic you're losing and get a personalized optimization plan
            </p>
          </div>

          <Card className="bg-white">
            <CardContent className="p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <Input
                      required
                      value={contactForm.businessName}
                      onChange={(e) => setContactForm({...contactForm, businessName: e.target.value})}
                      placeholder="Your Business Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL *
                    </label>
                    <Input
                      required
                      type="url"
                      value={contactForm.websiteUrl}
                      onChange={(e) => setContactForm({...contactForm, websiteUrl: e.target.value})}
                      placeholder="https://yourbusiness.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <Input
                      required
                      value={contactForm.contactName}
                      onChange={(e) => setContactForm({...contactForm, contactName: e.target.value})}
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      required
                      type="email"
                      value={contactForm.contactEmail}
                      onChange={(e) => setContactForm({...contactForm, contactEmail: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your current challenges
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    placeholder="What traffic or ranking challenges are you facing?"
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Generating Report...' : 'Get My Free AI Optimization Report'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                What exactly is AI search engine optimization?
              </AccordionTrigger>
              <AccordionContent>
                AI search engine optimization is the process of optimizing your website and content to be easily understood, 
                cited, and recommended by AI-powered search engines like ChatGPT, Gemini, Perplexity, and Google's AI overviews. 
                Unlike traditional SEO, it focuses on entity recognition, semantic understanding, and authority signals that AI engines trust.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                How is the Koray Framework different from regular SEO?
              </AccordionTrigger>
              <AccordionContent>
                The Koray Framework is specifically designed for AI engines. While traditional SEO focuses on keywords and backlinks, 
                our framework emphasizes entity optimization, semantic relationships, structured data for AI parsing, and building 
                the type of authority signals that make AI engines cite and recommend your content.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                How quickly will I see results?
              </AccordionTrigger>
              <AccordionContent>
                Most clients see initial improvements within 2-4 weeks, with significant traffic increases typically occurring 
                within 6-8 weeks. AI engines update their knowledge bases more frequently than traditional search engines, 
                so properly optimized content can start getting cited relatively quickly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                What's included in the free optimization report?
              </AccordionTrigger>
              <AccordionContent>
                Your free report includes: current AI optimization score, technical errors affecting AI crawling, 
                content gaps for AI engines, estimated traffic loss to AI searches, specific recommendations using 
                the Koray Framework, and a personalized optimization roadmap for your industry.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                Do you work with businesses in all industries?
              </AccordionTrigger>
              <AccordionContent>
                Yes, we work with businesses across all industries. However, we specialize in B2B services, e-commerce, 
                healthcare, legal, financial services, and local businesses where AI search optimization can have the 
                most immediate and measurable impact on lead generation and sales.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">AI Geo Optimizer</span>
              </div>
              <p className="text-gray-400">
                The leading AI search engine optimization service using the proven Koray Framework.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI Search Optimization</li>
                <li>Koray Framework Implementation</li>
                <li>Technical SEO Audit</li>
                <li>Content Strategy</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Case Studies</li>
                <li>AI SEO Guide</li>
                <li>Blog</li>
                <li>Free Tools</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>hello@aigeooptimizer.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Schedule Consultation</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Geo Optimizer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
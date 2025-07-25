import { useState, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { 
  Mail, 
  Send, 
  CheckCircle, 
  DollarSign, 
  Clock,
  Package,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { blink } from '../blink/client'
import { useToast } from '../hooks/use-toast'

interface Service {
  id: string
  serviceName: string
  serviceDescription: string
  priceRange: string
  deliveryTime: string
  features: string[]
  isActive: boolean
}

interface Customer {
  id: string
  businessName: string
  websiteUrl: string
  contactEmail: string
  contactName: string
  estimatedTrafficLoss: number
}

interface ProposalModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
  analysisData?: {
    trafficLossPercentage: number
    estimatedMonthlyLoss: number
    technicalErrors: number
    contentIssues: number
  }
}

export default function ProposalModal({ isOpen, onClose, customer, analysisData }: ProposalModalProps) {
  const [services, setServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [customMessage, setCustomMessage] = useState('')
  const [proposalType, setProposalType] = useState<'email' | 'whatsapp'>('email')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  const loadServices = useCallback(async () => {
    try {
      setLoading(true)
      const serviceData = await blink.db.services.list({
        where: { isActive: "1" },
        orderBy: { createdAt: 'desc' }
      })

      setServices(serviceData.map(s => ({
        id: s.id,
        serviceName: s.serviceName,
        serviceDescription: s.serviceDescription,
        priceRange: s.priceRange,
        deliveryTime: s.deliveryTime,
        features: JSON.parse(s.features || '[]'),
        isActive: Number(s.isActive) > 0
      })))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const generateDefaultMessage = useCallback(() => {
    if (!customer || !analysisData) return

    const message = `Hi ${customer.contactName},

I've completed a comprehensive AI optimization analysis for ${customer.websiteUrl} and found some critical issues that are costing you significant traffic and revenue.

🚨 KEY FINDINGS:
• Your website is losing ${analysisData.trafficLossPercentage}% of potential traffic to AI search engines
• Estimated monthly revenue loss: $${analysisData.estimatedMonthlyLoss.toLocaleString()}
• ${analysisData.technicalErrors + analysisData.contentIssues} critical optimization issues detected
• Your site isn't optimized for ChatGPT, Gemini, or Perplexity searches

The good news? These issues are completely fixable with our proven AI optimization framework.

I'd love to show you exactly how we can recover this lost traffic and potentially increase your revenue by 2-3x within 30 days.

Would you be interested in a 15-minute call to discuss the specific opportunities I've identified for ${customer.businessName}?

Best regards,
AI Geo Optimization Team`

    setCustomMessage(message)
  }, [customer, analysisData])

  useEffect(() => {
    if (isOpen) {
      loadServices()
      generateDefaultMessage()
    }
  }, [isOpen, customer, loadServices, generateDefaultMessage])

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const calculateTotalValue = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId)
      if (!service) return total
      
      // Extract minimum price from range (e.g., "$2,500 - $5,000" -> 2500)
      const priceMatch = service.priceRange.match(/\$?([\d,]+)/)
      const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0
      return total + price
    }, 0)
  }

  const sendProposal = async () => {
    if (!customer || selectedServices.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one service",
        variant: "destructive"
      })
      return
    }

    try {
      setSending(true)
      const user = await blink.auth.me()

      // Create proposal record
      const proposalId = `prop_${Date.now()}`
      await blink.db.proposals.create({
        id: proposalId,
        customerId: customer.id,
        userId: user.id,
        selectedServices: JSON.stringify(selectedServices),
        customMessage: customMessage,
        totalValue: calculateTotalValue(),
        proposalType: proposalType,
        status: 'sent',
        sentAt: new Date().toISOString()
      })

      // Send email if email type
      if (proposalType === 'email') {
        const selectedServiceDetails = services.filter(s => selectedServices.includes(s.id))
        
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563EB, #7C3AED); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">AI Optimization Proposal</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">For ${customer.businessName}</p>
            </div>
            
            <div style="padding: 30px; background: white;">
              <div style="white-space: pre-line; line-height: 1.6; margin-bottom: 30px;">
                ${customMessage}
              </div>
              
              <h2 style="color: #2563EB; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px;">Recommended Services</h2>
              
              ${selectedServiceDetails.map(service => `
                <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 15px 0;">
                  <h3 style="color: #1F2937; margin: 0 0 10px 0;">${service.serviceName}</h3>
                  <p style="color: #6B7280; margin: 0 0 15px 0;">${service.serviceDescription}</p>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <span style="font-weight: bold; color: #059669;">Investment: ${service.priceRange}</span>
                    <span style="color: #6B7280;">Delivery: ${service.deliveryTime}</span>
                  </div>
                  <div style="background: #F9FAFB; padding: 15px; border-radius: 6px;">
                    <strong style="color: #374151;">What's Included:</strong>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                      ${service.features.map(feature => `<li style="margin: 5px 0; color: #4B5563;">${feature}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              `).join('')}
              
              <div style="background: linear-gradient(135deg, #059669, #10B981); color: white; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <h3 style="margin: 0 0 10px 0;">Total Investment</h3>
                <div style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0;">$${calculateTotalValue().toLocaleString()}+</div>
                <p style="margin: 0; opacity: 0.9;">Potential ROI: 300-500% within 6 months</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${user.email}?subject=Re: AI Optimization Proposal for ${customer.businessName}" 
                   style="background: #2563EB; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Accept Proposal & Schedule Call
                </a>
              </div>
            </div>
            
            <div style="background: #F9FAFB; padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
              <p style="margin: 0;">© 2024 AI Geo Optimizer. All rights reserved.</p>
            </div>
          </div>
        `

        await blink.notifications.email({
          to: customer.contactEmail,
          subject: `AI Optimization Proposal for ${customer.businessName} - Recover $${analysisData?.estimatedMonthlyLoss.toLocaleString()}/month`,
          html: emailHtml,
          text: customMessage
        })
      }

      // Update customer status
      await blink.db.customers.update(customer.id, { 
        status: 'proposal_sent' 
      })

      toast({
        title: "Success",
        description: `Proposal sent successfully via ${proposalType}!`
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send proposal",
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
  }

  const generateWhatsAppMessage = () => {
    const selectedServiceNames = services
      .filter(s => selectedServices.includes(s.id))
      .map(s => s.serviceName)
      .join(', ')

    const message = `${customMessage}\n\nRecommended Services: ${selectedServiceNames}\nTotal Investment: $${calculateTotalValue().toLocaleString()}+\n\nReply to this message to schedule your free consultation!`
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (!customer) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5 text-blue-600" />
            Send Proposal to {customer.businessName}
          </DialogTitle>
          <DialogDescription>
            Create and send a customized optimization proposal with service packages
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Proposal Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Method
            </label>
            <Select value={proposalType} onValueChange={(value: 'email' | 'whatsapp') => setProposalType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Proposal
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    WhatsApp Message
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Services to Include
            </label>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all ${
                      selectedServices.includes(service.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center">
                            <Checkbox 
                              checked={selectedServices.includes(service.id)}
                              onChange={() => toggleService(service.id)}
                              className="mr-3"
                            />
                            {service.serviceName}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {service.serviceDescription}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-green-600 font-semibold">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {service.priceRange}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.deliveryTime}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Key Features:</div>
                          <div className="space-y-1">
                            {service.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </div>
                            ))}
                            {service.features.length > 3 && (
                              <div className="text-sm text-gray-500">
                                +{service.features.length - 3} more features
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Selected Services Summary */}
          {selectedServices.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700">Proposal Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Selected Services:</span>
                    <span>{selectedServices.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Investment:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${calculateTotalValue().toLocaleString()}+
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Potential monthly ROI: ${(analysisData?.estimatedMonthlyLoss || 0) * 2.5}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposal Message
            </label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={8}
              placeholder="Enter your personalized message..."
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={proposalType === 'email' ? sendProposal : generateWhatsAppMessage}
              disabled={selectedServices.length === 0 || sending}
              className="flex-1"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : proposalType === 'email' ? (
                <Mail className="h-4 w-4 mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {sending ? 'Sending...' : `Send via ${proposalType === 'email' ? 'Email' : 'WhatsApp'}`}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
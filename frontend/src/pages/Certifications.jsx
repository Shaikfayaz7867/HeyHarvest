import React from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  Shield, 
  Globe, 
  CheckCircle,
  FileText,
  Star,
  Leaf,
  Users
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const Certifications = () => {
  const certifications = [
    {
      title: "FSSAI License",
      number: "12345678901234",
      description: "Food Safety and Standards Authority of India certification ensuring food safety compliance",
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      validUntil: "2025-12-31",
      features: [
        "Food safety compliance",
        "Hygiene standards",
        "Quality assurance",
        "Regular audits"
      ]
    },
    {
      title: "ISO 22000:2018",
      number: "ISO-22000-2024-001",
      description: "International food safety management system certification",
      icon: <Globe className="h-12 w-12 text-green-600" />,
      validUntil: "2026-06-30",
      features: [
        "Food safety management",
        "Hazard analysis",
        "Critical control points",
        "Continuous improvement"
      ]
    },
    {
      title: "GI Certification",
      number: "GI-2019-0123",
      description: "Geographical Indication tag for authentic Mithila makhana",
      icon: <Award className="h-12 w-12 text-purple-600" />,
      validUntil: "2029-03-15",
      features: [
        "Authentic origin verification",
        "Traditional methods",
        "Regional quality",
        "Heritage protection"
      ]
    },
    {
      title: "Organic Certification",
      number: "ORG-2024-789",
      description: "Certified organic farming practices and processing methods",
      icon: <Leaf className="h-12 w-12 text-green-500" />,
      validUntil: "2025-09-30",
      features: [
        "No chemical pesticides",
        "Natural farming",
        "Soil health maintenance",
        "Biodiversity conservation"
      ]
    }
  ]

  const testingParameters = [
    { parameter: "Moisture Content", standard: "< 12%", result: "8.5%" },
    { parameter: "Protein Content", standard: "> 9%", result: "9.7%" },
    { parameter: "Aflatoxin", standard: "< 15 ppb", result: "Not Detected" },
    { parameter: "Heavy Metals", standard: "Within limits", result: "Compliant" },
    { parameter: "Pesticide Residue", standard: "Not Detected", result: "Not Detected" },
    { parameter: "Microbiological", standard: "Safe limits", result: "Compliant" }
  ]

  const awards = [
    {
      year: "2024",
      title: "Best Organic Food Product",
      organization: "India Organic Trade Fair",
      description: "Recognized for excellence in organic makhana production"
    },
    {
      year: "2023", 
      title: "Export Excellence Award",
      organization: "Bihar State Government",
      description: "Outstanding contribution to Bihar's agricultural exports"
    },
    {
      year: "2022",
      title: "Quality Innovation Award",
      organization: "Food Processing Industry",
      description: "Innovation in traditional food processing methods"
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-kraft via-white to-kraft py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
              Quality{' '}
              <span className="text-gradient">Certifications</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our commitment to quality is backed by prestigious certifications and rigorous testing standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        {cert.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{cert.title}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                          {cert.number}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Valid until: {new Date(cert.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      {cert.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Key Features:</h4>
                      <ul className="space-y-1">
                        {cert.features.map((feature, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testing Standards */}
      <section className="py-16 bg-kraft dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Laboratory Testing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Every batch undergoes comprehensive testing to ensure safety and quality
            </p>
          </motion.div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center">Quality Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Parameter
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">
                        Standard
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">
                        Our Result
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {testingParameters.map((test, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {test.parameter}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-400">
                          {test.standard}
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-medium text-gray-900 dark:text-white">
                          {test.result}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Passed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Awards & Recognition
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our commitment to quality has been recognized by industry leaders
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full card-hover">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-primary">{award.year}</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {award.title}
                      </h3>
                      <p className="text-sm text-primary font-medium">
                        {award.organization}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {award.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Certificates */}
      <section className="py-16 bg-kraft dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
              Download Certificates
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              View and download our official certification documents
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                FSSAI Certificate
              </Button>
              <Button variant="outline" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                ISO 22000 Certificate
              </Button>
              <Button variant="outline" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                GI Tag Certificate
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Certifications

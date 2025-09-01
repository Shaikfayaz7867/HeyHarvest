import React from 'react'
import { motion } from 'framer-motion'
import {
  Droplets,
  Sun,
  Package,
  Truck,
  CheckCircle,
  Leaf,
  Award,
  Users,
  Shield
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'

const Process = () => {
  const processSteps = [
    {
      step: 1,
      title: "Pond Cultivation",
      description: "Lotus seeds are cultivated in pristine natural ponds of Mithilanchal, Bihar",
      icon: <Droplets className="h-8 w-8 text-blue-500" />,
      details: [
        "Natural pond ecosystem",
        "No chemical fertilizers",
        "Traditional farming methods",
        "Seasonal harvesting"
      ],
      image: "/Makhana.png"
    },
    {
      step: 2,
      title: "Hand Harvesting",
      description: "Skilled farmers hand-pick mature lotus seeds at the perfect time",
      icon: <Users className="h-8 w-8 text-green-500" />,
      details: [
        "Early morning collection",
        "Selective picking",
        "Gentle handling",
        "Quality assessment"
      ],
      image: "/Makhana.png"
    },
    {
      step: 3,
      title: "Sun Drying",
      description: "Seeds are naturally dried under the Bihar sun to preserve nutrients",
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      details: [
        "Natural sun drying",
        "Optimal moisture removal",
        "Nutrient preservation",
        "Traditional methods"
      ],
      image: "/Makhana.png"
    },
    {
      step: 4,
      title: "Processing & Grading",
      description: "Careful processing and grading based on size and quality standards",
      icon: <Package className="h-8 w-8 text-purple-500" />,
      details: [
        "Size-based grading",
        "Quality inspection",
        "Cleaning process",
        "Packaging preparation"
      ],
      image: "/Makhana.png"
    },
    {
      step: 5,
      title: "Quality Testing",
      description: "Rigorous quality checks ensure only the best makhana reaches you",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      details: [
        "Moisture content testing",
        "Contamination screening",
        "Nutritional analysis",
        "Final quality approval"
      ],
      image: "/Makhana.png"
    },
    {
      step: 6,
      title: "Packaging & Delivery",
      description: "Hygienic packaging and swift delivery to maintain freshness",
      icon: <Truck className="h-8 w-8 text-indigo-500" />,
      details: [
        "Food-grade packaging",
        "Moisture protection",
        "Tamper-proof sealing",
        "Quick delivery"
      ],
      image: "/Makhana.png"
    }
  ]

  const qualityStandards = [
    {
      title: "FSSAI Certified",
      description: "Licensed food business operator with FSSAI certification",
      icon: <Award className="h-6 w-6 text-primary" />
    },
    {
      title: "ISO 22000",
      description: "International food safety management system certification",
      icon: <Shield className="h-6 w-6 text-primary" />
    },
    {
      title: "GI Tagged",
      description: "Geographical Indication tag for authentic Mithila makhana",
      icon: <Leaf className="h-6 w-6 text-primary" />
    },
    {
      title: "Export Quality",
      description: "Meeting international standards for global markets",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-kraft via-white to-kraft dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              From Pond to{' '}
              <span className="text-gradient dark:bg-gradient-to-r dark:from-green-400 dark:to-lime-300 dark:text-transparent dark:bg-clip-text">
                Pack
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the meticulous process behind every pack of Hey Harvest makhana,
              from traditional farming to modern quality standards.
            </p>
          </motion.div>
        </div>
      </section>


      {/* Process Steps */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-primary mb-1">
                        Step {step.step}
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-80 object-cover rounded-2xl shadow-xl"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16 bg-kraft dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Quality Standards
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We maintain the highest quality standards at every step
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityStandards.map((standard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full card-hover">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      {standard.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {standard.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {standard.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
              Sustainable & Ethical
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Our process not only ensures premium quality but also supports sustainable
              farming practices and fair trade with local farmers. We believe in creating
              value for the entire ecosystem - from the environment to the communities we work with.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Eco-Friendly</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Zero-waste processing with natural methods
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Fair Trade</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Direct partnerships with farmers
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Community Impact</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Supporting rural livelihoods in Bihar
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Process

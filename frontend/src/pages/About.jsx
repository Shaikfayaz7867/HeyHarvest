import React from 'react'
import { motion } from 'framer-motion'
import {
  Leaf,
  Award,
  Users,
  Globe,
  Heart,
  Shield,
  Truck,
  Star
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'

const About = () => {
  const stats = [
    { number: "10,000+", label: "Happy Customers", icon: <Users className="h-6 w-6" /> },
    { number: "5+", label: "Years Experience", icon: <Award className="h-6 w-6" /> },
    { number: "100+", label: "Tons Processed", icon: <Leaf className="h-6 w-6" /> },
    { number: "20+", label: "States Served", icon: <Globe className="h-6 w-6" /> }
  ]

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Quality First",
      description: "We never compromise on quality. Every batch is carefully inspected and tested to meet our premium standards."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Trust & Transparency",
      description: "Complete transparency in our sourcing, processing, and pricing. What you see is what you get."
    },
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Sustainability",
      description: "Supporting local farmers and sustainable farming practices that preserve our environment."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Customer Delight",
      description: "Your satisfaction is our success. We go the extra mile to ensure you're happy with every purchase."
    }
  ]

  const team = [
    {
      name: "Rahul Kumar",
      role: "Founder & CEO",
      image: "/Rahul.png",
      description: "Agricultural engineer with 10+ years in food processing"
    },
    {
      name: "Priya Singh",
      role: "Quality Head",
      image: "/Priya.png",
      description: "Food scientist ensuring premium quality standards"
    },
    {
      name: "Amit Sharma",
      role: "Operations Manager",
      image: "/Amith.png",
      description: "Supply chain expert managing farmer relationships"
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-kraft via-white to-kraft dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              About Hey Harvest
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Born from the fertile lands of Bihar, Hey Harvest brings you the finest makhana
              with a commitment to quality, tradition, and health.
            </p>
          </motion.div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-kraft dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="/Makhana.png"
                alt="Makhana farming in Bihar"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Hey Harvest was born from a simple belief: everyone deserves access to pure,
                  premium quality makhana that honors the rich agricultural heritage of Bihar.
                </p>
                <p>
                  Founded in 2019, we started as a small family business with a mission to
                  bridge the gap between traditional farmers and health-conscious consumers.
                  Today, we're proud to be one of India's leading premium makhana brands.
                </p>
                <p>
                  Our journey began in the pristine ponds of Mithilanchal, where generations
                  of farmers have perfected the art of lotus seed cultivation. We work directly
                  with these farmers, ensuring fair prices while maintaining the highest quality standards.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These core values guide everything we do, from sourcing to delivery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-kraft dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The passionate people behind Hey Harvest, dedicated to bringing you the best makhana.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center card-hover">
                  <CardContent className="p-6">
                    <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              To make premium, authentic makhana accessible to health-conscious consumers
              worldwide while supporting the traditional farming communities of Bihar.
              We believe in creating value for everyone in our supply chain - from farmers
              to customers.
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span className="font-medium">Health Focus</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="font-medium">Community Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Certifications Preview */}
      <section className="py-16 bg-kraft dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-8">
              Quality Certifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['FSSAI', 'ISO 22000', 'GI Tag', 'Organic'].map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {cert}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Certified
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About

import React from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  Brain,
  Shield,
  Zap,
  Leaf,
  Award,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

const HealthBenefits = () => {
  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Heart Health",
      description: "Rich in magnesium and potassium, makhana supports cardiovascular health and helps regulate blood pressure.",
      details: [
        "Low in sodium, high in potassium",
        "Helps reduce cholesterol levels",
        "Supports healthy blood circulation"
      ]
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Brain Function",
      description: "Contains thiamine and other B-vitamins that support cognitive function and nervous system health.",
      details: [
        "Improves memory and concentration",
        "Supports nervous system function",
        "Rich in thiamine (Vitamin B1)"
      ]
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Antioxidant Power",
      description: "Packed with antioxidants that fight free radicals and support overall immune system health.",
      details: [
        "High in flavonoids and phenolic compounds",
        "Fights oxidative stress",
        "Supports immune system"
      ]
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Energy Boost",
      description: "Complex carbohydrates provide sustained energy without blood sugar spikes.",
      details: [
        "Low glycemic index",
        "Sustained energy release",
        "Perfect pre-workout snack"
      ]
    }
  ]

  const nutritionalFacts = [
    { nutrient: "Protein", value: "9.7g", percentage: "19%" },
    { nutrient: "Carbohydrates", value: "76.9g", percentage: "26%" },
    { nutrient: "Fat", value: "0.1g", percentage: "0%" },
    { nutrient: "Fiber", value: "14.5g", percentage: "58%" },
    { nutrient: "Calcium", value: "60mg", percentage: "6%" },
    { nutrient: "Iron", value: "1.4mg", percentage: "8%" },
    { nutrient: "Magnesium", value: "210mg", percentage: "50%" },
    { nutrient: "Phosphorus", value: "540mg", percentage: "77%" }
  ]

  const comparisons = [
    {
      food: "Almonds",
      protein: "21g",
      calories: "579",
      fiber: "12g"
    },
    {
      food: "Makhana",
      protein: "9.7g",
      calories: "347",
      fiber: "14.5g"
    },
    {
      food: "Popcorn",
      protein: "11g",
      calories: "387",
      fiber: "15g"
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-kraft via-white to-kraft dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Health Benefits of{' '}
              <span className="text-gradient">Makhana</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover why makhana is considered a superfood and how it can transform your health journey.
            </p>
          </motion.div>
        </div>
      </section>


      {/* Benefits Grid */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Why Makhana is a Superfood
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Packed with essential nutrients and health benefits that make it perfect for modern lifestyles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
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
                      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        {benefit.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{benefit.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                    <ul className="space-y-2">
                      {benefit.details.map((detail, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutritional Facts */}
      <section className="py-16 bg-kraft dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Nutritional Facts
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Per 100g serving of roasted makhana
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-center">Nutrition Label</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-b-2 border-black pb-2">
                      <div className="text-2xl font-bold">Nutrition Facts</div>
                      <div className="text-sm">Per 100g serving</div>
                    </div>

                    <div className="border-b border-gray-300 pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Calories</span>
                        <span className="font-bold text-lg">347</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {nutritionalFacts.map((fact, index) => (
                        <div key={index} className="flex justify-between items-center text-sm border-b border-gray-200 pb-1">
                          <span>{fact.nutrient}</span>
                          <div className="text-right">
                            <span className="font-medium">{fact.value}</span>
                            <span className="text-gray-600 ml-2">{fact.percentage}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-gray-600 pt-2 border-t">
                      * Percent Daily Values are based on a 2,000 calorie diet
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                Key Nutritional Highlights
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">High Protein Content</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      9.7g protein per 100g makes it an excellent plant-based protein source
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Leaf className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Rich in Fiber</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      14.5g fiber supports digestive health and keeps you feeling full
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Low Fat</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Only 0.1g fat per 100g, making it a guilt-free snack option
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-6 w-6 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Essential Minerals</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      High in magnesium, phosphorus, and other vital minerals
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              How Makhana Compares
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              See how makhana stacks up against other popular snacks (per 100g)
            </p>
          </motion.div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Snack</th>
                      <th className="px-6 py-4 text-center">Protein</th>
                      <th className="px-6 py-4 text-center">Calories</th>
                      <th className="px-6 py-4 text-center">Fiber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((item, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-200 dark:border-gray-700 ${item.food === 'Makhana' ? 'bg-primary/5' : ''
                          }`}
                      >
                        <td className="px-6 py-4 font-medium">
                          {item.food === 'Makhana' && (
                            <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                          )}
                          {item.food}
                        </td>
                        <td className="px-6 py-4 text-center">{item.protein}</td>
                        <td className="px-6 py-4 text-center">{item.calories}</td>
                        <td className="px-6 py-4 text-center">{item.fiber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Who Should Eat */}
      <section className="py-16 bg-kraft dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Perfect For Everyone
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Makhana is suitable for all ages and dietary preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Fitness Enthusiasts",
                description: "High protein, low fat - perfect post-workout snack",
                icon: "💪"
              },
              {
                title: "Weight Watchers",
                description: "Low calorie, high fiber keeps you full longer",
                icon: "⚖️"
              },
              {
                title: "Diabetics",
                description: "Low glycemic index helps manage blood sugar",
                icon: "🩺"
              },
              {
                title: "Children",
                description: "Natural, healthy alternative to processed snacks",
                icon: "👶"
              },
              {
                title: "Pregnant Women",
                description: "Rich in folate and other essential nutrients",
                icon: "🤱"
              },
              {
                title: "Elderly",
                description: "Easy to digest, supports bone and heart health",
                icon: "👴"
              }
            ].map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full card-hover">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-4xl mb-4">{group.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {group.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {group.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scientific Backing */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
              Scientifically Proven Benefits
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                "Makhana (Euryale ferox) has been recognized in numerous scientific studies for its
                exceptional nutritional profile and health benefits. Research published in various
                journals highlights its antioxidant properties, protein quality, and potential in
                managing diabetes and cardiovascular health."
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <span>• Journal of Food Science</span>
                <span>• International Journal of Food Properties</span>
                <span>• Food Chemistry Research</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HealthBenefits

'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Utensils, 
  Activity, 
  LineChart, 
  Brain, 
  ArrowRight, 
  CheckCircle, 
  MessageCircle,

  Zap 
} from 'lucide-react'

const features = [      
  {
    title: 'Smart Meal Planning',
    description: 'Personalized nutrition tailored to your unique goals and preferences.',
    icon: <Utensils className="h-8 w-8" />,
    path: '/meal-planner',
    color: 'bg-blue-50 text-blue-600',
    gradient: 'from-blue-100 to-blue-200'
  },
  {
    title: 'Comprehensive Health Tracking',
    description: 'Holistic insights into your wellness journey with detailed analytics.',
    icon: <Activity className="h-8 w-8" />,
    path: '/health-profile',
    color: 'bg-green-50 text-green-600',
    gradient: 'from-green-100 to-green-200'
  },
  {
    title: 'Progress Visualization',
    description: 'Intuitive dashboards that make tracking your progress effortless.',
    icon: <LineChart className="h-8 w-8" />,
    path: '/progress',
    color: 'bg-purple-50 text-purple-600',
    gradient: 'from-purple-100 to-purple-200'
  },
  {
    title: 'AI Nutrition Coaching',
    description: 'Get intelligent, personalized recommendations powered by advanced AI.',
    icon: <Brain className="h-8 w-8" />,
    path: '/nutrition',
    color: 'bg-orange-50 text-orange-600',
    gradient: 'from-orange-100 to-orange-200'
  }
]

const heroSections = [
  {
    title: 'Transform Your Health Journey',
    subtitle: 'Personalized Nutrition, Simplified',
    description: 'Unlock your potential with intelligent, data-driven wellness solutions.',
    cta: 'Start Your Transformation',
    background: 'bg-gradient-to-r from-blue-500 to-purple-600',
    icon: <Zap className="h-16 w-16 text-white" />
  }
]

const carouselImages = [
  {
    url: '/placeholder.svg?height=500&width=1000',
    title: 'Personalized Nutrition Plans',
    description: 'Tailored strategies for your unique health goals'
  },
  {
    url: '/placeholder.svg?height=500&width=1000',
    title: 'Advanced Progress Tracking',
    description: 'Visualize your wellness journey with precision'
  },
  {
    url: '/placeholder.svg?height=500&width=1000',
    title: 'Expert AI Guidance',
    description: 'Intelligent insights for optimal health'
  }
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative bg-white shadow-sm">
        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[600px] w-full">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-12 left-12 max-w-xl">
                    <h2 className="text-4xl font-bold text-white mb-4">{image.title}</h2>
                    <p className="text-xl text-white/90 mb-6">{image.description}</p>
                    <Button variant="secondary" size="lg" className="shadow-lg">
                      Explore Now
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

{/* Features Section */}
<section className="container py-20">
  <div className="text-center mb-16">
    <h2 className="text-5xl font-extrabold mb-6 text-gray-900">
      Your Wellness, Reimagined
    </h2>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
      Powerful, intelligent tools designed to transform your approach to health and nutrition.
    </p>
  </div>
  <div className="flex justify-center">
    <div 
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-6 
        max-w-5xl 
        mx-auto 
        sm:justify-items-center"
        
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to={feature.path} className="block h-full">
            <Card
              className={`h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${feature.gradient}`}
            >
              <CardHeader className="pb-4">
                <div
                  className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-4 shadow-md`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-700">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full flex justify-center items-center group"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
</section>



      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Health?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who have revolutionized their wellness journey with our intelligent platform.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="secondary" size="lg" className="shadow-lg">
                <CheckCircle className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
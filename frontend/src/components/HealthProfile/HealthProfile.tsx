'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Scale, Ruler, Heart, Apple, Dumbbell, TrendingUp, Calendar } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
}

const mockWeightData = [
  { date: '2023-01', value: 75 },
  { date: '2023-02', value: 74 },
  { date: '2023-03', value: 73.5 },
  { date: '2023-04', value: 72.8 },
  { date: '2023-05', value: 72 },
  { date: '2023-06', value: 71.5 },
]

const StatCard = ({ icon: Icon, title, value, change, color = "primary" }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 bg-${color}/10 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <p className="text-sm text-green-500">↑ {change}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function HealthProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8 space-y-8"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Health Profile</h1>
          <p className="text-muted-foreground">Track your health metrics and progress</p>
        </div>
        <Button className="gap-2">
          <Calendar className="h-4 w-4" />
          Schedule Check-in
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              icon={Scale}
              title="Current Weight"
              value="71.5 kg"
              change="2.5 kg lost"
            />
            <StatCard
              icon={Ruler}
              title="Height"
              value="175 cm"
            />
            <StatCard
              icon={Heart}
              title="Resting Heart Rate"
              value="68 bpm"
              change="5% improved"
              color="red"
            />
            <StatCard
              icon={Activity}
              title="Daily Activity"
              value="7,500 steps"
              change="12% increase"
              color="green"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockWeightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Apple className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Daily Calories</span>
                          </div>
                          <span>2000 kcal</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Protein Intake</span>
                          </div>
                          <span>120g</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                            <span className="font-medium">Carbohydrates</span>
                          </div>
                          <span>250g</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: '65%' }} />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Fitness Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Dumbbell className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">Weekly Workouts</span>
                          </div>
                          <span>4/5 completed</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '80%' }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-red-500" />
                            <span className="font-medium">Daily Steps</span>
                          </div>
                          <span>7,500/10,000</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-pink-500" />
                            <span className="font-medium">Active Minutes</span>
                          </div>
                          <span>45/60 min</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-pink-500 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          {/* Measurements content here */}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {/* Goals content here */}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}


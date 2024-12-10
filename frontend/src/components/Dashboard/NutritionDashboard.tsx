'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from 'date-fns'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Apple, Beef, Fish, Wheat, Coffee, Utensils, TrendingUp, Calendar, Plus } from 'lucide-react'
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

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

const nutritionData = [
  { date: '2024-02-01', calories: 2100, protein: 120, carbs: 200, fat: 70 },
  { date: '2024-02-02', calories: 2200, protein: 130, carbs: 210, fat: 75 },
  { date: '2024-02-03', calories: 1950, protein: 115, carbs: 180, fat: 65 },
  { date: '2024-02-04', calories: 2300, protein: 135, carbs: 220, fat: 80 },
  { date: '2024-02-05', calories: 2150, protein: 125, carbs: 205, fat: 72 },
  { date: '2024-02-06', calories: 2400, protein: 140, carbs: 230, fat: 85 },
  { date: '2024-02-07', calories: 2000, protein: 118, carbs: 190, fat: 68 }
]

const macroGoals = [
  { name: 'Protein', value: 130, goal: 150 },
  { name: 'Carbs', value: 210, goal: 250 },
  { name: 'Fat', value: 75, goal: 80 }
]

const COLORS = {
  protein: 'hsl(var(--primary))',
  carbs: 'hsl(var(--blue))',
  fat: 'hsl(var(--destructive))'
}

const recentMeals = [
  {
    name: 'Breakfast',
    time: '8:30 AM',
    items: 'Oatmeal with berries and protein shake',
    calories: 450,
    macros: { protein: 35, carbs: 65, fat: 12 }
  },
  {
    name: 'Lunch',
    time: '12:45 PM',
    items: 'Grilled chicken salad with quinoa',
    calories: 550,
    macros: { protein: 45, carbs: 48, fat: 22 }
  },
  {
    name: 'Snack',
    time: '3:30 PM',
    items: 'Greek yogurt with almonds',
    calories: 250,
    macros: { protein: 18, carbs: 12, fat: 16 }
  },
  {
    name: 'Dinner',
    time: '7:00 PM',
    items: 'Salmon with roasted vegetables',
    calories: 650,
    macros: { protein: 42, carbs: 35, fat: 38 }
  }
]

const StatCard = ({ icon: Icon, title, value, target, color = "primary" }: any) => (
  <motion.div variants={itemVariants}>
    <Card>
      <CardContent className="flex items-center p-6">
        <div className={`p-4 bg-${color}/10 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {target && (
            <p className="text-sm text-muted-foreground">
              Target: {target}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

const MacroProgress = ({ macro, value, goal, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium">{macro}</span>
      <span className="text-muted-foreground">{value}g / {goal}g</span>
    </div>
    <div className="h-2 bg-muted rounded-full">
      <div
        className="h-full rounded-full transition-all duration-300 ease-in-out"
        style={{
          width: `${Math.min(100, (value / goal) * 100)}%`,
          backgroundColor: color
        }}
      />
    </div>
  </div>
)

export default function NutritionDashboard() {
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
          <h1 className="text-3xl font-bold">Nutrition Dashboard</h1>
          <p className="text-muted-foreground">Track your nutritional progress and goals</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            History
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Log Meal
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Apple}
          title="Daily Calories"
          value="1,900 / 2,200"
          color="primary"
        />
        <StatCard
          icon={Beef}
          title="Protein"
          value="140g"
          target="150g"
          color="primary"
        />
        <StatCard
          icon={Wheat}
          title="Carbohydrates"
          value="210g"
          target="250g"
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          title="Fats"
          value="75g"
          target="80g"
          color="destructive"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nutrition Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Weekly Overview</TabsTrigger>
              <TabsTrigger value="macros">Macro Breakdown</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ChartContainer
                config={{
                  calories: {
                    label: "Calories",
                    color: "hsl(var(--primary))",
                  },
                  protein: {
                    label: "Protein",
                    color: "hsl(var(--blue))",
                  },
                  carbs: {
                    label: "Carbs",
                    color: "hsl(var(--destructive))",
                  },
                  fat: {
                    label: "Fat",
                    color: "hsl(var(--orange))",
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={nutritionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    />
                    <YAxis />
                    <ChartTooltip />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="protein"
                      stroke="hsl(var(--blue))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="carbs"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fat"
                      stroke="hsl(var(--orange))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>

            <TabsContent value="macros">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <MacroProgress
                    macro="Protein"
                    value={130}
                    goal={150}
                    color={COLORS.protein}
                  />
                  <MacroProgress
                    macro="Carbohydrates"
                    value={210}
                    goal={250}
                    color={COLORS.carbs}
                  />
                  <MacroProgress
                    macro="Fats"
                    value={75}
                    goal={80}
                    color={COLORS.fat}
                  />
                </div>

                <ChartContainer config={{
    calories: {
      label: "Calories",
      color: "hsl(var(--primary))",
    },
    protein: {
      label: "Protein",
      color: "hsl(var(--blue))",
    },
    carbs: {
      label: "Carbs",
      color: "hsl(var(--destructive))",
    },
    fat: {
      label: "Fat",
      color: "hsl(var(--orange))",
    }
  }}
  className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroGoals}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill={COLORS.protein} />
                        <Cell fill={COLORS.carbs} />
                        <Cell fill={COLORS.fat} />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentMeals.map((meal, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Utensils className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground">{meal.time}</p>
                    <p className="text-sm">{meal.items}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{meal.calories} kcal</p>
                  <p className="text-sm text-muted-foreground">
                    P: {meal.macros.protein}g C: {meal.macros.carbs}g F: {meal.macros.fat}g
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Plus, Utensils, Clock, Filter, ChevronRight, CalendarDays } from 'lucide-react'

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

export default function MealPlanCreator() {
  const [duration, setDuration] = useState('7')
  const [dietType, setDietType] = useState('')
  const [calorieGoal, setCalorieGoal] = useState('')

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8 space-y-8"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create Meal Plan</h1>
          <p className="text-muted-foreground">Design your personalized meal plan</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          View Calendar
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietType">Diet Type</Label>
                  <Select value={dietType} onValueChange={setDietType}>
                    <SelectTrigger>
                      <Utensils className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="lowCarb">Low Carb</SelectItem>
                      <SelectItem value="highProtein">High Protein</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calorieGoal">Daily Calorie Goal</Label>
                  <Input
                    id="calorieGoal"
                    type="number"
                    placeholder="e.g., 2000"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value)}
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealsPerDay">Meals Per Day</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select meals per day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 meals</SelectItem>
                      <SelectItem value="4">4 meals</SelectItem>
                      <SelectItem value="5">5 meals</SelectItem>
                      <SelectItem value="6">6 meals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dietary Restrictions</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Gluten Free', 'Dairy Free', 'Nut Free', 'Shellfish Free'].map((restriction) => (
                    <Button
                      key={restriction}
                      variant="outline"
                      className="justify-start gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {restriction}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="w-full gap-2">
                <Utensils className="h-4 w-4" />
                Generate Meal Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meal Schedule Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                  <motion.div
                    key={meal}
                    variants={itemVariants}
                    className="p-4 rounded-lg border bg-muted/50 hover:bg-muted/75 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Utensils className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{meal}</h3>
                          <p className="text-sm text-muted-foreground">Not yet planned</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Calories</span>
                    <span className="font-medium">0 / {calorieGoal || '2000'} kcal</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Protein</span>
                    <span className="font-medium">0g</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Carbs</span>
                    <span className="font-medium">0g</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fat</span>
                    <span className="font-medium">0g</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shopping List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Generate a meal plan to see your shopping list</p>
                <Button variant="outline" className="mt-4 gap-2">
                  <Filter className="h-4 w-4" />
                  Filter Items
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}


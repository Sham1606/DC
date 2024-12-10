'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Scale, Activity, Heart, TrendingUp, CalendarIcon, Plus } from 'lucide-react'

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

// Mock data for demonstration
const weightData = [
  { date: '2024-01-01', value: 75 },
  { date: '2024-01-08', value: 74.5 },
  { date: '2024-01-15', value: 73.8 },
  { date: '2024-01-22', value: 73.2 },
  { date: '2024-01-29', value: 72.7 },
  { date: '2024-02-05', value: 72.1 },
]

const bodyCompositionData = [
  { date: '2024-01-01', fatPercentage: 25, muscleMass: 55, water: 60 },
  { date: '2024-01-08', fatPercentage: 24.5, muscleMass: 55.2, water: 60.2 },
  { date: '2024-01-15', fatPercentage: 24.1, muscleMass: 55.5, water: 60.5 },
  { date: '2024-01-22', fatPercentage: 23.8, muscleMass: 55.8, water: 60.8 },
  { date: '2024-01-29', fatPercentage: 23.4, muscleMass: 56.1, water: 61 },
  { date: '2024-02-05', fatPercentage: 23, muscleMass: 56.5, water: 61.2 },
]

const measurementsData = [
  { date: '2024-01-01', chest: 95, waist: 85, hips: 100 },
  { date: '2024-01-15', chest: 94, waist: 84, hips: 99 },
  { date: '2024-01-29', chest: 93, waist: 83, hips: 98 },
  { date: '2024-02-05', chest: 92, waist: 82, hips: 97 },
]

const StatCard = ({ icon: Icon, title, value, change, changeType }: any) => (
  <motion.div variants={itemVariants}>
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="p-4 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <p className={`text-sm ${changeType === 'decrease' ? 'text-green-500' : 'text-red-500'}`}>
              {changeType === 'decrease' ? '↓' : '↑'} {change}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

export default function ProgressTracking() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8 space-y-8"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor your fitness journey and achievements</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Log Measurement
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Scale}
          title="Current Weight"
          value="72.1 kg"
          change="2.9 kg"
          changeType="decrease"
        />
        <StatCard
          icon={Activity}
          title="Body Fat"
          value="23%"
          change="2%"
          changeType="decrease"
        />
        <StatCard
          icon={TrendingUp}
          title="Muscle Mass"
          value="56.5 kg"
          change="1.5 kg"
          changeType="increase"
        />
        <StatCard
          icon={Heart}
          title="Average HR"
          value="68 bpm"
          change="5 bpm"
          changeType="decrease"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weight Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                weight: {
                  label: "Weight (kg)",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <ChartTooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary)/.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Body Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="composition" className="space-y-4">
            <TabsList>
              <TabsTrigger value="composition">Body Composition</TabsTrigger>
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
            </TabsList>
            <TabsContent value="composition" className="space-y-4">
              <ChartContainer
                config={{
                  fatPercentage: {
                    label: "Body Fat %",
                    color: "hsl(var(--destructive))",
                  },
                  muscleMass: {
                    label: "Muscle Mass",
                    color: "hsl(var(--primary))",
                  },
                  water: {
                    label: "Water %",
                    color: "hsl(var(--blue))",
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bodyCompositionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    />
                    <YAxis />
                    <ChartTooltip />
                    <Line
                      type="monotone"
                      dataKey="fatPercentage"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="muscleMass"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="water"
                      stroke="hsl(var(--blue))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="measurements">
              <ChartContainer
                config={{
                  chest: {
                    label: "Chest (cm)",
                    color: "hsl(var(--primary))",
                  },
                  waist: {
                    label: "Waist (cm)",
                    color: "hsl(var(--destructive))",
                  },
                  hips: {
                    label: "Hips (cm)",
                    color: "hsl(var(--blue))",
                  },
                }}
                className="h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={measurementsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    />
                    <YAxis />
                    <ChartTooltip />
                    <Line
                      type="monotone"
                      dataKey="chest"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="waist"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hips"
                      stroke="hsl(var(--blue))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}


import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const NutritionAnalyzer: React.FC = () => {
  const nutritionData = [
    { name: 'Monday', calories: 2000, protein: 100, carbs: 250, fat: 65 },
    { name: 'Tuesday', calories: 2200, protein: 110, carbs: 280, fat: 70 },
    { name: 'Wednesday', calories: 1900, protein: 95, carbs: 220, fat: 60 },
    { name: 'Thursday', calories: 2100, protein: 105, carbs: 260, fat: 68 },
    { name: 'Friday', calories: 2300, protein: 115, carbs: 290, fat: 75 },
    { name: 'Saturday', calories: 2400, protein: 120, carbs: 300, fat: 80 },
    { name: 'Sunday', calories: 2000, protein: 100, carbs: 250, fat: 65 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Nutrition Analyzer</h2>
      <Card>
        <CardHeader>
          <CardTitle>Weekly Nutrition Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={nutritionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calories" fill="#8884d8" />
              <Bar dataKey="protein" fill="#82ca9d" />
              <Bar dataKey="carbs" fill="#ffc658" />
              <Bar dataKey="fat" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default NutritionAnalyzer


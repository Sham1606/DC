import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SymptomLogger: React.FC = () => {
  const [symptom, setSymptom] = useState({
    name: '',
    severity: '',
    duration: '',
    notes: '',
  })

  const handleChange = (field: string, value: string) => {
    setSymptom({ ...symptom, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Symptom logged:', symptom)
    // Here you would typically send the symptom data to your backend
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Symptom Logger</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Symptom Name</Label>
            <Input
              id="name"
              value={symptom.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Headache, Nausea, Fatigue"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select value={symptom.severity} onValueChange={(value) => handleChange('severity', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={symptom.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              placeholder="e.g., 2 hours, 1 day"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={symptom.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional details or observations"
            />
          </div>
          <Button type="submit" className="w-full">Log Symptom</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default SymptomLogger


import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Question {
  id: string
  text: string
  options: string[]
}

const AdaptiveQuestionnaire: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const questions: Question[] = [
    {
      id: 'q1',
      text: 'How would you describe your current diet?',
      options: ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Other'],
    },
    {
      id: 'q2',
      text: 'How often do you exercise?',
      options: ['Never', '1-2 times a week', '3-4 times a week', '5+ times a week'],
    },
    {
      id: 'q3',
      text: 'Do you have any food allergies or intolerances?',
      options: ['No', 'Gluten', 'Dairy', 'Nuts', 'Other'],
    },
  ]

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestionIndex].id]: value })
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      console.log('Questionnaire completed:', answers)
      // Here you would typically send the answers to your backend
    }
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Health Questionnaire</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
        <RadioGroup onValueChange={handleAnswer} value={answers[currentQuestion.id]}>
          {currentQuestion.options.map((option, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button onClick={handleNext} className="mt-4 w-full">
          {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default AdaptiveQuestionnaire


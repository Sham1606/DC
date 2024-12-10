'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Clock, Flame, Utensils, Plus, Heart, Filter, ChevronRight } from 'lucide-react'

interface Recipe {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  image: string
  tags: string[]
}

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

const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Grilled Chicken Salad',
    calories: 350,
    protein: 30,
    carbs: 10,
    fat: 20,
    time: '25 mins',
    difficulty: 'Easy',
    image: '/placeholder.svg?height=200&width=200',
    tags: ['High Protein', 'Low Carb', 'Keto']
  },
  {
    id: '2',
    name: 'Vegetarian Stir Fry',
    calories: 300,
    protein: 15,
    carbs: 40,
    fat: 10,
    time: '20 mins',
    difficulty: 'Medium',
    image: '/placeholder.svg?height=200&width=200',
    tags: ['Vegetarian', 'Quick', 'Low Fat']
  },
  {
    id: '3',
    name: 'Salmon with Roasted Vegetables',
    calories: 400,
    protein: 35,
    carbs: 20,
    fat: 25,
    time: '30 mins',
    difficulty: 'Medium',
    image: '/placeholder.svg?height=200&width=200',
    tags: ['High Protein', 'Omega 3', 'Gluten Free']
  }
]

export default function RecipeSelector() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const filteredRecipes = mockRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedDifficulty || recipe.difficulty === selectedDifficulty)
  )

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8 space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recipe Selector</h1>
          <p className="text-muted-foreground">Find and add recipes to your meal plan</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Custom Recipe
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 transition-all duration-200 focus:scale-[1.02]"
          />
        </div>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              variants={itemVariants}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/75"
                    onClick={() => toggleFavorite(recipe.id)}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.has(recipe.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{recipe.name}</span>
                    <Badge variant={
                      recipe.difficulty === 'Easy' ? 'secondary' :
                      recipe.difficulty === 'Medium' ? 'default' : 'destructive'
                    }>
                      {recipe.difficulty}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>{recipe.calories} kcal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{recipe.time}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Protein</span>
                        <span className="font-medium">{recipe.protein}g</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Carbs</span>
                        <span className="font-medium">{recipe.carbs}g</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fat</span>
                        <span className="font-medium">{recipe.fat}g</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full gap-2">
                      <Utensils className="h-4 w-4" />
                      Add to Meal Plan
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredRecipes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No recipes found matching your criteria.</p>
        </motion.div>
      )}
    </motion.div>
  )
}


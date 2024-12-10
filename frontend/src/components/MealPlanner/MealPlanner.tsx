'use client'

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { createMealPlan } from '../../redux/slices/mealPlanSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Utensils, Clock, ChevronRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0
  }
};

export default function MealPlanner() {
  const [duration, setDuration] = useState(7);
  const [activeTab, setActiveTab] = useState('create');
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, currentPlan, mealPlans } = useSelector((state: RootState) => state.mealPlan);

  const handleCreatePlan = () => {
    dispatch(createMealPlan(duration));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Meal Planner</h1>
            <p className="text-muted-foreground mt-2">Create and manage your meal plans</p>
          </div>
        </motion.div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div variants={itemVariants}>
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="create" className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Plan
              </TabsTrigger>
              <TabsTrigger value="current" className="gap-2">
                <Calendar className="h-4 w-4" />
                Current Plans
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="create">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Meal Plan</CardTitle>
                  <CardDescription>
                    Customize your meal plan duration and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                          min={1}
                          max={30}
                          className="transition-all duration-200 focus:scale-[1.02]"
                        />
                      </div>
                      <span className="text-muted-foreground">days</span>
                      <Button 
                        onClick={handleCreatePlan} 
                        disabled={isLoading}
                        className="ml-auto gap-2"
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Clock className="h-4 w-4" />
                            </motion.div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Utensils className="h-4 w-4" />
                            Create Plan
                          </>
                        )}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {currentPlan && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-secondary/10 rounded-lg p-6 space-y-4"
                        >
                          <h3 className="text-lg font-semibold">Your New Meal Plan</h3>
                          <pre className="bg-background p-4 rounded-md overflow-x-auto">
                            {JSON.stringify(currentPlan, null, 2)}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="current">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Your Meal Plans</CardTitle>
                  <CardDescription>
                    View and manage your existing meal plans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mealPlans.map((plan, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
    className="group relative bg-secondary/10 rounded-lg p-4 hover:bg-secondary/20 transition-all duration-200"
  >
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h4 className="font-medium">{plan.name}</h4>
        <p className="text-sm text-muted-foreground">
          {plan.duration} days • Created {new Date(plan.createdAt).toLocaleDateString()}
        </p>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </motion.div>
))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}


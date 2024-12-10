'use client'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMealPlans } from '../../redux/slices/mealPlanSlice';
import { getHealthProfile } from '../../redux/slices/healthProfileSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Utensils, User, Calendar, TrendingUp, ClipboardList } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export interface HealthProfile {
  dailySteps: number;
  activeMinutes: number;
  age: number;
  height: number;
  weight: number;
  name: string;
}


export interface MealPlan {
  name: string;
  createdAt: string; // or Date
}

const StatCard = ({ icon: Icon, title, value, color }: any) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`bg-${color}/10 p-6 rounded-xl border border-${color}/20`}
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full bg-${color}/20`}>
        <Icon className={`h-6 w-6 text-${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mealPlans } = useSelector((state: RootState) => state.mealPlan);
  const { profile } = useSelector((state: RootState) => state.healthProfile);

  useEffect(() => {
    dispatch(getMealPlans());
    dispatch(getHealthProfile());
  }, [dispatch]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's an overview of your health journey
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/health-profile">
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link to="/meal-planner">
              <Button className="gap-2">
                <Utensils className="h-4 w-4" />
                Plan Meals
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <StatCard
            icon={Activity}
            title="Daily Steps"
            value={profile?.dailySteps || '0'}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            title="Active Minutes"
            value={profile?.activeMinutes || '0'}
            color="green"
          />
          <StatCard
            icon={ClipboardList}
            title="Meal Plans"
            value={mealPlans.length}
            color="purple"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Health Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/10">
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="text-xl font-semibold">{profile.age} years</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/10">
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p className="text-xl font-semibold">{profile.height} cm</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/10">
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="text-xl font-semibold">{profile.weight} kg</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/10">
                        <p className="text-sm text-muted-foreground">BMI</p>
                        <p className="text-xl font-semibold">
                          {((profile.weight / (profile.height * profile.height)) * 10000).toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <Link to="/health-profile">
                      <Button variant="outline" className="w-full">Update Profile</Button>
                    </Link>
                  </motion.div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No health profile data available.</p>
                    <Link to="/health-profile">
                      <Button>Create Health Profile</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Meal Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mealPlans.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {mealPlans.slice(0, 3).map((plan, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(plan.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </motion.div>
                    ))}
                    <Link to="/meal-planner">
                      <Button variant="outline" className="w-full">View All Plans</Button>
                    </Link>
                  </motion.div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No meal plans available.</p>
                    <Link to="/meal-planner">
                      <Button>Create Meal Plan</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}


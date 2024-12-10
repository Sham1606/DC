import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Layout/Navbar';
import HomePage from './components/Home/HomePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PasswordReset from './components/Auth/PasswordReset';
import Dashboard from './components/Dashboard/Dashboard';
import MealPlanner from './components/MealPlanner/MealPlanner';
import HealthProfile from './components/HealthProfile/HealthProfile';
import PrivateRoute from './components/PrivateRoute';
import HealthPlan from './components/HealthPlan/HealthPlan';
import NutritionDashboard from './components/Dashboard/NutritionDashboard';
import ProgressTracking from './components/Tracking/ProgressTracking';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<PasswordReset />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/meal-planner" element={<PrivateRoute><MealPlanner /></PrivateRoute>} />
              <Route path="/health-profile" element={<PrivateRoute><HealthProfile /></PrivateRoute>} />
              <Route path="/health-plan" element={<PrivateRoute><HealthPlan /></PrivateRoute>} />
              <Route path="/nutrition" element={<PrivateRoute><NutritionDashboard /></PrivateRoute>} />
              <Route path="/progress" element={<PrivateRoute><ProgressTracking /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;


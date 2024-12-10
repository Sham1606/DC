import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HealthPlan() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Your Health Plan</CardTitle>
          <CardDescription>Here's your personalized health plan based on your profile and goals.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add your health plan content here */}
          <p className="mb-4">Your personalized health plan will be displayed here.</p>
          
          <Button onClick={handleLogout} variant="destructive">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


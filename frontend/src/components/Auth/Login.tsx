'use client'

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login, oauthLogin } from '../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Loader2, Mail, Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [oauthLoading, setOauthLoading] = useState({ google: false, github: false });
  const [oauthError, setOauthError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setRegistrationSuccess(true);
    }

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const oauthError = params.get('error');

    if (token) {
      dispatch(oauthLogin(token));
    }

    if (oauthError) {
      setOauthError('OAuth authentication failed. Please try again.');
      setOauthLoading({ google: false, github: false });
    }
  }, [location, dispatch]);


  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // useEffect(() => {
  //   if (token) {
  //     const from = location.state?.from?.pathname || '/';
  //     navigate(from, { replace: true });
  //   }
  // }, [token, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    setOauthLoading(prev => ({ ...prev, [provider]: true }));
    setOauthError(null);


    window.location.href = `${API_URL}/auth/${provider}`;
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10 p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription>
              Choose your preferred way to sign in
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {registrationSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert className="bg-green-50 text-green-700 border-green-200">
                  <AlertDescription>
                    Registration successful! Please log in with your new account.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
            {oauthError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>{oauthError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              disabled={oauthLoading.google}
              className="w-full transition-all duration-200 hover:scale-[1.02]"
            >
              {oauthLoading.google ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FaGoogle className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              disabled={oauthLoading.github}
              className="w-full transition-all duration-200 hover:scale-[1.02]"
            >
              {oauthLoading.github ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FaGithub className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9 transition-all duration-200 focus:scale-[1.02]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 transition-all duration-200 focus:scale-[1.02]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline hover:text-primary/90 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full transition-all duration-200 hover:scale-[1.02]"
            >
              {isLoading ? (
                <motion.div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </motion.div>
              ) : (
                'Sign in'
              )}
            </Button>
          </motion.form>
        </CardContent>
        <CardFooter>
          <motion.p 
            variants={itemVariants}
            className="text-sm text-muted-foreground text-center w-full"
          >
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-primary hover:underline hover:text-primary/90 transition-colors"
            >
              Create account
            </Link>
          </motion.p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}


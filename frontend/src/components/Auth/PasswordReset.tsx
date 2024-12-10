'use client'

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '../../redux/store';
import { initiatePasswordReset, verifyOTP, resetPassword } from '../../redux/slices/authSlice';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Loader2, Mail, Key, Lock } from 'lucide-react'

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

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Correct useSelector to retrieve `auth` slice
  const {
    isLoading = false,
    error = null,
    passwordResetStatus = null,
    passwordResetError = null
  } = useSelector((state: RootState) => state.auth || {});

  const handleInitiateReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(initiatePasswordReset(email)).unwrap();
    } catch (err) {
      console.error('Password reset initiation failed:', err);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(verifyOTP({ email, otp }));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    const result = await dispatch(resetPassword({ email, newPassword }));
    if (resetPassword.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10 p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
            <CardDescription>
              {passwordResetStatus === null && "Enter your email to receive a password reset OTP"}
              {passwordResetStatus === 'OTP_SENT' && "Enter the OTP sent to your email"}
              {passwordResetStatus === 'OTP_VERIFIED' && "Enter your new password"}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {passwordResetStatus === null && (
              <motion.form 
                key="email-form"
                variants={itemVariants}
                onSubmit={handleInitiateReset} 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full transition-all duration-200 hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </motion.div>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </motion.form>
            )}

            {passwordResetStatus === 'OTP_SENT' && (
              <motion.form 
                key="otp-form"
                variants={itemVariants}
                onSubmit={handleVerifyOTP} 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="relative group">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="pl-9 transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full transition-all duration-200 hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </motion.div>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </motion.form>
            )}

            {passwordResetStatus === 'OTP_VERIFIED' && (
              <motion.form 
                key="password-form"
                variants={itemVariants}
                onSubmit={handleResetPassword} 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pl-9 transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-9 transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full transition-all duration-200 hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resetting...
                    </motion.div>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(error || passwordResetError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4"
              >
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{passwordResetError || error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

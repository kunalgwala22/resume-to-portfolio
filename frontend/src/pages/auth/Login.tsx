import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertCircle } from 'lucide-react';
import AuroraBackground from '../../components/landing/AuroraBackground';

export const Login: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    }
  };

  return (
    <AuroraBackground>
      <div className="flex-grow flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-surface/40 border-border/80 p-8 shadow-2xl flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white font-display">Welcome Back</h2>
            <p className="text-gray-400 text-xs mt-1.5">Sign in to edit your resume and portfolio settings</p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-xs p-3 rounded-lg flex gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button type="submit" isLoading={isLoggingIn} fullWidth className="mt-2">
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one here
            </Link>
          </p>
        </Card>
      </div>
    </AuroraBackground>
  );
};

export default Login;

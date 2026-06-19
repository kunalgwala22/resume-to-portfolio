import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertCircle } from 'lucide-react';
import AuroraBackground from '../../components/landing/AuroraBackground';

export const Register: React.FC = () => {
  const { register, isRegistering } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple length and content validation matching backend criteria
    if (!email || !username || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      await register({
        email,
        username,
        fullName: fullName || null,
        password
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Try different values.');
    }
  };

  return (
    <AuroraBackground>
      <div className="flex-grow flex items-center justify-center p-6 py-12">
        <Card className="w-full max-w-md bg-surface/40 border-border/80 p-8 shadow-2xl flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white font-display">Create Account</h2>
            <p className="text-gray-400 text-xs mt-1.5">Sign up to build your zero-code portfolio now</p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-xs p-3 rounded-lg flex gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label="Email Address *"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Username *"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Password *"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="At least 8 characters with 1 capital, 1 lowercase, 1 number, and 1 special character."
              required
            />
            
            <Button type="submit" isLoading={isRegistering} fullWidth className="mt-2">
              Get Started
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in instead
            </Link>
          </p>
        </Card>
      </div>
    </AuroraBackground>
  );
};

export default Register;

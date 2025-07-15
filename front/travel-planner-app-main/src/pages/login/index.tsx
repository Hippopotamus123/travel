import { useState, FormEvent, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const userId = response.data.user.id;
      console.log('Logged-in user ID:', userId);
      // Afficher le toast de succès
      toast.success('Connexion réussie !', { position: 'top-right', autoClose: 3000 });

      // Stocker le token et rediriger après un petit délai
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', userId);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error: any) {
      // Afficher un toast d'erreur
      toast.error(
        error.response?.data?.message || 'Une erreur est survenue lors de la connexion',
        { position: 'top-right', autoClose: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer /> {/* S'assurer que le ToastContainer est bien présent */}
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/hero/background.jpg')" }}
      >
        <div className="absolute inset-0 backdrop-blur-xs bg-black/30"></div>

        <Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to log in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;

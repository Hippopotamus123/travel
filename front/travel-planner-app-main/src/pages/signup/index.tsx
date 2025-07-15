import { useState, FormEvent, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios'; // Importer Axios

const Signup: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // État pour gérer les erreurs
  const [loading, setLoading] = useState<boolean>(false); // État pour gérer le chargement

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Réinitialiser les erreurs
    setLoading(true); // Activer l'état de chargement

    // Vérification de base des mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
      });

      // Stocker le token dans localStorage ou cookies
      localStorage.setItem('token', response.data.token);
      // Rediriger vers la page de connexion ou tableau de bord
      window.location.href = '/login';
    } catch (error: any) {
      // Axios encapsule les erreurs dans error.response
      if (error.response) {
        setError(error.response.data.message || 'Une erreur est survenue lors de l\'inscription');
      } else {
        setError('Erreur serveur. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false); // Désactiver l'état de chargement
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/hero/background.jpg')" }}
    >
      <div className="absolute inset-0 backdrop-blur-xs bg-black/30"></div>

      <Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Fill in the details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Afficher les erreurs s'il y en a */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setName(e.target.value)}
                required
                className="w-full"
                disabled={loading} // Désactiver pendant le chargement
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={loading} // Désactiver pendant le chargement
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
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                  disabled={loading} // Désactiver pendant le chargement
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading} // Désactiver pendant le chargement
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                  disabled={loading} // Désactiver pendant le chargement
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  disabled={loading} // Désactiver pendant le chargement
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
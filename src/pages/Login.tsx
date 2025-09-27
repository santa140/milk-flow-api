import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Milk, User, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDummyUser, setSelectedDummyUser] = useState<string>('');
  
  const { login, dummyLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  // Fetch dummy credentials for development
  const { data: dummyCredentials } = useQuery({
    queryKey: ['dummy-credentials'],
    queryFn: authApi.getDummyCredentials,
    retry: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in the login function
    } finally {
      setIsLoading(false);
    }
  };

  const handleDummyLogin = async (user: any) => {
    setIsLoading(true);
    try {
      await dummyLogin(user.username, user.password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in the dummyLogin function
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (user: any) => {
    setUsername(user.username);
    setPassword(user.password);
    setSelectedDummyUser(user.username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4 shadow-glow"
          >
            <Milk className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text">DairyChain Pro</h1>
          <p className="text-muted-foreground mt-2">Welcome back to your dairy management dashboard</p>
        </div>

        <Card className="glass-card shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your preferred login method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="production" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="production">Production</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
              </TabsList>

              {/* Production Login */}
              <TabsContent value="production" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Development Login */}
              <TabsContent value="development" className="space-y-4 mt-6">
                {dummyCredentials ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Choose a test account:
                    </p>
                    {Object.values(dummyCredentials.credentials).map((user: any) => (
                      <motion.div
                        key={user.username}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={selectedDummyUser === user.username ? "default" : "outline"}
                          className="w-full justify-start text-left h-auto p-4"
                          onClick={() => handleQuickLogin(user)}
                          disabled={isLoading}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center text-white text-sm font-semibold">
                              {user.full_name.charAt(0)}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium">{user.full_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {user.role} • {user.portal}
                              </p>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                    
                    <Button
                      onClick={() => handleDummyLogin({ username, password })}
                      className="w-full mt-4"
                      disabled={isLoading || !username || !password}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        'Login with Selected Account'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading test accounts...</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Secure dairy supply chain management platform
        </p>
      </motion.div>
    </div>
  );
}
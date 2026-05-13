import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { Logo } from '../components/Logo';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ShieldCheck, User } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for identifier (Email or 10-digit phone)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(formData.identifier) && !phoneRegex.test(formData.identifier)) {
      toast.error('Please enter a valid email or 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const user = response.data.user;
      
      // Verification if trying to login as admin but user doesn't have the role
      if (isAdmin && user.role !== 'admin') {
        toast.error('This account does not have admin privileges');
        setLoading(false);
        return;
      }

      setAuth(user, response.data.token);
      
      let roleName = 'User';
      if (user.role === 'admin') roleName = 'Administrator';
      else if (user.role === 'service_provider') roleName = 'Service Provider';
      else roleName = 'Customer';

      toast.success(`Login successful! Signed in as ${roleName}`);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'service_provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none transition-all duration-700 ${
        isAdmin 
          ? "bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')]" 
          : "bg-[url('https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')]"
      }`} />
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className={`absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-[120px] transition-colors duration-700 ${isAdmin ? 'bg-secondary-500/20' : 'bg-primary-500/20'}`} />
        <div className={`absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-[120px] transition-colors duration-700 ${isAdmin ? 'bg-indigo-500/10' : 'bg-amber-500/10'}`} />
      </div>

      <Navbar />

      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-12">
        <div className={`max-w-md w-full glass-card p-8 rounded-2xl animate-fade-in border-t-2 transition-all duration-500 ${isAdmin ? 'border-t-secondary-500 shadow-secondary-500/10' : 'border-t-primary-500 shadow-primary-500/10'}`}>
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center text-dark-400 hover:text-white mb-6 transition-colors group">
              <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full transition-all duration-500 transform hover:scale-110 ${isAdmin ? 'bg-secondary-500/20 text-secondary-400' : 'bg-primary-500/20 text-primary-500'}`}>
                {isAdmin ? <ShieldCheck className="h-10 w-10" /> : <Logo className="h-10 w-10" />}
              </div>
            </div>
            
            <h2 className={`text-3xl font-bold font-heading mb-2 transition-colors duration-500 ${isAdmin ? 'text-secondary-400' : 'text-white'}`}>
              {isAdmin ? 'Admin Console' : 'Welcome Back'}
            </h2>
            <p className="text-dark-300">
              {isAdmin ? 'Access the management dashboard' : 'Sign in to manage your services'}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-dark-800/50 rounded-xl mb-8 border border-dark-600/50 relative overflow-hidden">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out ${
                isAdmin ? 'left-[calc(50%+2px)] bg-secondary-600 shadow-lg shadow-secondary-900/40' : 'left-1 bg-primary-600 shadow-lg shadow-primary-900/40'
              }`}
            />
            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors duration-300 relative z-10 ${
                !isAdmin ? 'text-white' : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <User className={`h-4 w-4 mr-2 transition-transform duration-300 ${!isAdmin ? 'scale-110' : 'scale-100'}`} />
              User
            </button>
            <button
              type="button"
              onClick={() => setIsAdmin(true)}
              className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors duration-300 relative z-10 ${
                isAdmin ? 'text-white' : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <ShieldCheck className={`h-4 w-4 mr-2 transition-transform duration-300 ${isAdmin ? 'scale-110' : 'scale-100'}`} />
              Admin
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-dark-200 mb-1.5 ml-1">
                  Email or Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className={`h-4.5 w-4.5 transition-colors duration-300 ${isAdmin ? 'text-secondary-500' : 'text-dark-400 group-focus-within:text-primary-500'}`} />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className={`block w-full pl-11 pr-3 py-3.5 border rounded-xl leading-5 bg-dark-800/80 text-white placeholder-dark-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isAdmin 
                        ? 'border-dark-600 focus:border-secondary-500 focus:ring-secondary-500/20' 
                        : 'border-dark-600 focus:border-primary-500 focus:ring-primary-500/20'
                    }`}
                    placeholder="Enter email or phone"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-200 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className={`h-4.5 w-4.5 transition-colors duration-300 ${isAdmin ? 'text-secondary-500' : 'text-dark-400 group-focus-within:text-primary-500'}`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`block w-full pl-11 pr-11 py-3.5 border rounded-xl leading-5 bg-dark-800/80 text-white placeholder-dark-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isAdmin 
                        ? 'border-dark-600 focus:border-secondary-500 focus:ring-secondary-500/20' 
                        : 'border-dark-600 focus:border-primary-500 focus:ring-primary-500/20'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-dark-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a href="#" className={`text-xs font-semibold transition-colors duration-300 ${isAdmin ? 'text-secondary-400 hover:text-secondary-300' : 'text-primary-400 hover:text-primary-300'}`}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3.5 px-4 rounded-xl shadow-xl text-sm font-bold text-white transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                isAdmin 
                  ? 'bg-gradient-to-r from-secondary-600 to-indigo-600 hover:from-secondary-500 hover:to-indigo-500 shadow-secondary-500/20' 
                  : 'bg-gradient-to-r from-primary-600 to-amber-500 hover:from-primary-500 hover:to-amber-400 shadow-primary-500/20'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isAdmin ? 'Enter Admin Dashboard' : 'Sign in to Account'
              )}
            </button>

            {!isAdmin && (
              <div className="text-center mt-6">
                <p className="text-sm text-dark-400 font-medium">
                  New to Service Connect?{' '}
                  <Link to="/register" className="text-primary-400 hover:text-primary-300 font-bold ml-1 transition-colors">
                    Join now
                  </Link>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


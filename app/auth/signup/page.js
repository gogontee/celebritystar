// /app/auth/signup/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Star, 
  Shield,
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  Award
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
    minLength: false,
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Cooldown countdown effect
  useEffect(() => {
    if (!cooldownUntil) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
      
      if (remaining <= 0) {
        setCooldownUntil(null);
        setCooldownSeconds(0);
        clearInterval(interval);
      } else {
        setCooldownSeconds(remaining);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  // Check password strength
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      score: password.length > 0 ? Math.min(4, Math.floor(password.length / 2)) : 0,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
      minLength: password.length >= 8,
    });
  };

  // Check username availability with proper debouncing and error handling
  useEffect(() => {
    let isMounted = true;
    
    const checkUsername = async () => {
      const usernameToCheck = formData.username.trim();
      
      // Don't check if username is too short
      if (usernameToCheck.length < 3) {
        if (isMounted) {
          setUsernameAvailable(null);
          setCheckingUsername(false);
        }
        return;
      }

      // Validate username format before checking
      if (!/^[a-zA-Z0-9_]+$/.test(usernameToCheck)) {
        if (isMounted) {
          setUsernameAvailable(null);
          setCheckingUsername(false);
        }
        return;
      }

      // Don't check if it looks like an email
      if (usernameToCheck.includes('@')) {
        if (isMounted) {
          setUsernameAvailable(null);
          setCheckingUsername(false);
        }
        return;
      }

      setCheckingUsername(true);
      
      try {
        // Case-insensitive username check using ilike
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .ilike('username', usernameToCheck)
          .maybeSingle();

        if (error) {
          console.error('Username check error:', error);
          if (isMounted) {
            setUsernameAvailable(null);
          }
        } else if (data) {
          // Username is taken (case-insensitive match found)
          if (isMounted) setUsernameAvailable(false);
        } else {
          // Username is available
          if (isMounted) setUsernameAvailable(true);
        }
      } catch (error) {
        console.error('Username check error:', error);
        if (isMounted) {
          setUsernameAvailable(null);
        }
      } finally {
        if (isMounted) setCheckingUsername(false);
      }
    };

    // Debounce the check
    const timer = setTimeout(() => {
      checkUsername();
    }, 800);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [formData.username, supabase]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    } else if (usernameAvailable === false) {
      newErrors.username = 'Username is already taken. Please choose a different one.';
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    const { hasLower, hasUpper, hasNumber, minLength } = passwordStrength;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!minLength || !hasLower || !hasUpper || !hasNumber) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Auto-format username: replace spaces with underscores and remove invalid chars
    if (name === 'username') {
      const formattedValue = value
        .replace(/\s+/g, '_') // Replace spaces with underscore
        .replace(/[^a-zA-Z0-9_]/g, ''); // Remove any other invalid characters
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData(prev => ({ ...prev, password }));
    checkPasswordStrength(password);
    
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Final username availability check before submission
    if (usernameAvailable !== true) {
      setErrors(prev => ({
        ...prev,
        username: 'Please wait for username availability check or choose a different username.'
      }));
      return;
    }
    
    // Check if in cooldown
    if (cooldownSeconds > 0) {
      setErrors(prev => ({
        ...prev,
        submit: `Please wait ${cooldownSeconds} seconds before trying again.`
      }));
      return;
    }
    
    setLoading(true);
    setErrors(prev => ({ ...prev, submit: '' }));
    
    try {
      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.fullName,
            phone: formData.phone || '',
            country: formData.country || ''
          }
        }
      });
      
      if (signUpError) {
        console.error('Signup error details:', signUpError);
        
        // Handle rate limiting
        if (signUpError.status === 429 || signUpError.message.includes('security purposes') || signUpError.message.includes('rate limit')) {
          const waitTime = 60;
          setCooldownUntil(Date.now() + (waitTime * 1000));
          
          setErrors(prev => ({
            ...prev,
            submit: `Too many signup attempts. Please wait ${waitTime} seconds.`
          }));
          setLoading(false);
          return;
        }
        
        if (signUpError.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please log in instead.');
        } else if (signUpError.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 8 characters long.');
        } else if (signUpError.message.includes('Database error')) {
          throw new Error('There was an issue creating your account. Please try again.');
        }
        throw signUpError;
      }
      
      if (!authData?.user) {
        throw new Error('Failed to create user account');
      }

      // Wait a bit for the trigger to complete and profile to be created
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Fetch the newly created profile to get the username
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // If we can't get the profile, try to sign in and redirect to home
        try {
          await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });
        } catch (loginError) {
          console.error('Auto-login error:', loginError);
        }
        
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
        return;
      }

      // Auto-login the user (email confirmation is disabled in Supabase)
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          console.error('Auto-login error:', signInError);
          // Still show success and redirect to login
          setSuccess(true);
          setTimeout(() => {
            router.push('/auth/login?email=' + encodeURIComponent(formData.email));
          }, 2000);
          return;
        }
      } catch (loginError) {
        console.error('Auto-login error:', loginError);
      }

      setSuccess(true);
      
      // Redirect to the user's profile page using their username
      setTimeout(() => {
        router.push(`/${profile.username}`);
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'An error occurred during signup. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    const { hasLower, hasUpper, hasNumber, minLength } = passwordStrength;
    const checks = [hasLower, hasUpper, hasNumber, minLength].filter(Boolean).length;
    
    if (checks <= 2) return "bg-orange-500";
    if (checks <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    const { hasLower, hasUpper, hasNumber, minLength } = passwordStrength;
    const checks = [hasLower, hasUpper, hasNumber, minLength].filter(Boolean).length;
    
    if (checks <= 2) return "Weak";
    if (checks <= 3) return "Medium";
    return "Strong";
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-burnt-orange-700 via-yellow-100 to-burnt-orange-800 flex items-center justify-center px-3 py-4 md:px-4 md:py-6 relative overflow-hidden">
      {/* Animated Background Stars */}
      {Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: (i * 13) % 90 + 5,
        y: (i * 17) % 90 + 5,
        size: (i % 3) * 6 + 8,
        duration: (i % 5) * 2 + 10,
        delay: (i % 4) * 0.3,
      })).map((star) => (
        <motion.div
          key={star.id}
          className="absolute pointer-events-none text-yellow-100/20 hidden md:block"
          initial={{ 
            x: `${star.x}vw`, 
            y: `${star.y}vh`,
            scale: 0,
            opacity: 0.2
          }}
          animate={{ 
            y: [`${star.y}vh`, `${star.y - 15}vh`, `${star.y}vh`],
            x: [`${star.x}vw`, `${star.x + 8}vw`, `${star.x}vw`],
            rotate: [0, 180, 360],
            scale: [0, 0.8, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Star 
            size={star.size} 
            className="text-yellow-100/20"
            fill="currentColor"
          />
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
          className="relative backdrop-blur-xl bg-white/95 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-yellow-200/30"
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 15px rgba(249, 115, 22, 0.2), inset 0 0 15px rgba(234, 179, 8, 0.05)",
                "0 0 25px rgba(249, 115, 22, 0.3), inset 0 0 20px rgba(234, 179, 8, 0.1)",
                "0 0 15px rgba(249, 115, 22, 0.2), inset 0 0 15px rgba(234, 179, 8, 0.05)",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Header with Logo */}
          <div className="bg-black flex items-center justify-center py-2">
            <motion.div
              initial={{ y: -2, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-40 h-16 md:w-48 md:h-20">
                <Image
                  src="https://vfpyefrlecyrdvbmeyty.supabase.co/storage/v1/object/public/brand-assets/G.png"
                  alt="Celebrity Star"
                  fill
                  sizes="(max-width: 768px) 160px, 192px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Form Content */}
          <div className="p-4 md:p-5 space-y-3 md:space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center"
            >
              <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-burnt-orange-600 to-yellow-500 bg-clip-text text-transparent">
                Join Celebrity Star
              </h2>
              <p className="text-[10px] md:text-xs text-gray-500">Create your account to get started</p>
            </motion.div>

            {/* Rate Limit Warning */}
            <AnimatePresence>
              {cooldownSeconds > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center"
                >
                  <p className="text-orange-600 text-xs">
                    ⚠️ Too many signup attempts. Please wait {cooldownSeconds} seconds.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-3">
              {/* Username - Updated placeholder to avoid email confusion */}
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="username" className="block text-[10px] md:text-xs font-medium text-gray-600 mb-0.5 ml-1 flex items-center gap-1">
                  <User className="w-2.5 h-2.5 md:w-3 md:h-3" /> Username *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="e.g. John, stargirl, celeb_joe"
                    className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 bg-orange-50/50 border rounded-lg md:rounded-xl text-xs md:text-sm text-gray-800 focus:ring-1 focus:ring-burnt-orange-500 focus:border-transparent transition-all outline-none placeholder:text-gray-400 pr-8 ${
                      errors.username ? 'border-red-300 bg-red-50' : 
                      usernameAvailable === true ? 'border-green-300 bg-green-50' :
                      usernameAvailable === false ? 'border-red-300 bg-red-50' : 
                      formData.username.length >= 3 ? 'border-orange-200' : 'border-orange-200'
                    }`}
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    disabled={cooldownSeconds > 0}
                  />
                  
                  {checkingUsername && (
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <div className="w-3 h-3 border-2 border-burnt-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {!checkingUsername && usernameAvailable === true && (
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                  )}
                  
                  {!checkingUsername && usernameAvailable === false && formData.username.length >= 3 && (
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <X className="w-3 h-3 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.username && (
                  <p className="mt-0.5 text-[8px] md:text-[10px] text-red-600">{errors.username}</p>
                )}
                {!checkingUsername && usernameAvailable === true && (
                  <p className="mt-0.5 text-[8px] md:text-[10px] text-green-600">Username available</p>
                )}
                {!checkingUsername && usernameAvailable === false && formData.username.length >= 3 && (
                  <p className="mt-0.5 text-[8px] md:text-[10px] text-red-600">Username taken - please choose another</p>
                )}
                {formData.username.length > 0 && formData.username.length < 3 && (
                  <p className="mt-0.5 text-[8px] md:text-[10px] text-orange-500">Minimum 3 characters</p>
                )}
                {formData.username.includes(' ') && (
                  <p className="mt-0.5 text-[8px] md:text-[10px] text-blue-500">Spaces will be replaced with _</p>
                )}
              </motion.div>

              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label htmlFor="fullName" className="block text-[10px] md:text-xs font-medium text-gray-600 mb-0.5 ml-1 flex items-center gap-1">
                  <Award className="w-2.5 h-2.5 md:w-3 md:h-3" /> Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 bg-orange-50/50 border rounded-lg md:rounded-xl text-xs md:text-sm text-gray-800 focus:ring-1 focus:ring-burnt-orange-500 focus:border-transparent transition-all outline-none placeholder:text-gray-400 ${
                    errors.fullName ? 'border-red-300 bg-red-50' : 'border-orange-200'
                  }`}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={cooldownSeconds > 0}
                />
                {errors.fullName && (
                  <p className="mt-0.5 text-[8px] md:text-[10px] text-red-600">{errors.fullName}</p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="email" className="block text-[10px] md:text-xs font-medium text-gray-600 mb-0.5 ml-1 flex items-center gap-1">
                  <Mail className="w-2.5 h-2.5 md:w-3 md:h-3" /> Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 bg-orange-50/50 border rounded-lg md:rounded-xl text-xs md:text-sm text-gray-800 focus:ring-1 focus:ring-burnt-orange-500 focus:border-transparent transition-all outline-none placeholder:text-gray-400 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-orange-200'
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={cooldownSeconds > 0}
                />
                {errors.email && (
                  <p className="mt-0.5 text-[8px] md:text-[10px] text-red-600">{errors.email}</p>
                )}
              </motion.div>

              {/* Phone and Country */}
              <div className="grid grid-cols-2 gap-2">
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label htmlFor="phone" className="block text-[10px] md:text-xs font-medium text-gray-600 mb-0.5 ml-1 flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5 md:w-3 md:h-3" /> Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+123 456 7890"
                    className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 bg-orange-50/50 border rounded-lg md:rounded-xl text-xs md:text-sm text-gray-800 focus:ring-1 focus:ring-burnt-orange-500 focus:border-transparent transition-all outline-none placeholder:text-gray-400 ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-orange-200'
                    }`}
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={cooldownSeconds > 0}
                  />
                  {errors.phone && (
                    <p className="mt-0.5 text-[8px] md:text-[10px] text-red-600">{errors.phone}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="country" className="block text-[10px] md:text-xs font-medium text-gray-600 mb-0.5 ml-1 flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5 md:w-3 md:h-3" /> Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="e.g. United States, Nigeria, UK"
                    className="w-full px-2.5 py-1.5 md:px-3 md:py-2 bg-orange-50/50 border border-orange-200 rounded-lg md:rounded-xl text-xs md:text-sm text-gray-800 focus:ring-1 focus:ring-burnt-orange-500 focus:border-transparent transition-all outline-none placeholder:text-gray-400"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={cooldownSeconds > 0}
                  />
                </motion.div>
              </div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label htmlFor="password" className="block text-[10px] md:text-xs font-medium text-gray-600 mb-0.5 ml-1 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 md:w-3 md:h-3" /> Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create password"
                    className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 bg-orange-50/50 border rounded-lg md:rounded-xl text-xs md:text-sm text-gray-800 focus:ring-1 focus:ring-burnt-orange-500 focus:border-transparent transition-all outline-none pr-8 ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-orange-200'
                    }`}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    required
                    disabled={cooldownSeconds > 0}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-burnt-orange-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    disabled={cooldownSeconds > 0}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-0.5 text-[8px] md:text-[10px] text-red-600">{errors.password}</p>
                )}

                <AnimatePresence>
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 space-y-1"
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1 bg-orange-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                            className={`h-full ${getStrengthColor()}`}
                          />
                        </div>
                        <span className="text-[8px] md:text-[9px] font-medium text-gray-600">
                          {getStrengthText()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-0.5 text-[7px] md:text-[8px]">
                        <div className="flex items-center gap-1">
                          {passwordStrength.minLength ? (
                            <Check className="w-2 h-2 text-green-500" />
                          ) : (
                            <div className="w-2 h-2 rounded-full border border-gray-300" />
                          )}
                          <span className="text-gray-600">8+ chars</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {passwordStrength.hasLower ? (
                            <Check className="w-2 h-2 text-green-500" />
                          ) : (
                            <div className="w-2 h-2 rounded-full border border-gray-300" />
                          )}
                          <span className="text-gray-600">Lowercase</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {passwordStrength.hasUpper ? (
                            <Check className="w-2 h-2 text-green-500" />
                          ) : (
                            <div className="w-2 h-2 rounded-full border border-gray-300" />
                          )}
                          <span className="text-gray-600">Uppercase</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {passwordStrength.hasNumber ? (
                            <Check className="w-2 h-2 text-green-500" />
                          ) : (
                            <div className="w-2 h-2 rounded-full border border-gray-300" />
                          )}
                          <span className="text-gray-600">Number</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="confirmPassword" className="block text-[10px] md:text-xs font-medium text-gray-600 mb-0.5 ml-1 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 md:w-3 md:h-3" /> Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 bg-orange-50/50 border rounded-lg md:rounded-xl text-xs md:text-sm text-gray-800 focus:ring-1 focus:ring-burnt-orange-500 focus:border-transparent transition-all outline-none pr-8 ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-orange-200'
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={cooldownSeconds > 0}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-burnt-orange-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    disabled={cooldownSeconds > 0}
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                <AnimatePresence>
                  {formData.confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -2 }}
                      className="mt-0.5"
                    >
                      {formData.password === formData.confirmPassword ? (
                        <p className="text-[8px] md:text-[9px] text-green-600 flex items-center gap-1">
                          <Check className="w-2 h-2" /> Passwords match
                        </p>
                      ) : (
                        <p className="text-[8px] md:text-[9px] text-red-500">Passwords do not match</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.confirmPassword && (
                  <p className="mt-0.5 text-[8px] md:text-[10px] text-red-600">{errors.confirmPassword}</p>
                )}
              </motion.div>

              {/* Terms Acceptance */}
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
                className="bg-orange-50/50 rounded-lg p-2"
              >
                <label htmlFor="terms" className="flex items-start gap-1.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-3 h-3 opacity-0 absolute cursor-pointer"
                      disabled={cooldownSeconds > 0}
                    />
                    <div className={`w-3 h-3 border rounded flex items-center justify-center transition-all ${
                      formData.agreeTerms 
                        ? 'bg-burnt-orange-500 border-burnt-orange-500' 
                        : 'border-orange-300 group-hover:border-burnt-orange-500'
                    }`}>
                      {formData.agreeTerms && <Check className="w-2 h-2 text-white" />}
                    </div>
                  </div>
                  <span className="text-[9px] md:text-[10px] text-gray-700 leading-tight">
                    I agree to the{' '}
                    <Link 
                      href="/terms" 
                      className="text-burnt-orange-600 font-semibold hover:text-yellow-600 hover:underline transition-colors"
                      target="_blank"
                    >
                      Terms
                    </Link>{' '}
                    &{' '}
                    <Link 
                      href="/privacy" 
                      className="text-burnt-orange-600 font-semibold hover:text-yellow-600 hover:underline transition-colors"
                      target="_blank"
                    >
                      Privacy
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-0.5 text-[8px] md:text-[10px] text-red-600">{errors.agreeTerms}</p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || !formData.agreeTerms || cooldownSeconds > 0 || usernameAvailable !== true}
                whileHover={{ scale: (loading || !formData.agreeTerms || cooldownSeconds > 0 || usernameAvailable !== true) ? 1 : 1.01 }}
                whileTap={{ scale: (loading || !formData.agreeTerms || cooldownSeconds > 0 || usernameAvailable !== true) ? 1 : 0.99 }}
                className={`w-full py-2 md:py-2.5 rounded-lg md:rounded-xl font-semibold text-white shadow-md transition-all relative overflow-hidden group ${
                  loading || !formData.agreeTerms || cooldownSeconds > 0 || usernameAvailable !== true
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-burnt-orange-600 to-yellow-500 hover:from-burnt-orange-700 hover:to-yellow-600'
                }`}
              >
                {!cooldownSeconds && usernameAvailable === true && (
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatDelay: 0.8,
                    }}
                  />
                )}
                
                {loading ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span className="text-xs md:text-sm">Creating...</span>
                  </div>
                ) : cooldownSeconds > 0 ? (
                  <span className="text-xs md:text-sm relative z-10">
                    Wait {cooldownSeconds}s
                  </span>
                ) : usernameAvailable !== true ? (
                  <span className="text-xs md:text-sm relative z-10 flex items-center justify-center gap-1.5">
                    <X className="w-3 h-3" />
                    Choose Available Username
                  </span>
                ) : (
                  <span className="text-xs md:text-sm relative z-10 flex items-center justify-center gap-1.5">
                    <Star className="w-3 h-3 md:w-4 md:h-4" />
                    Join Celebrity Star
                    <Star className="w-3 h-3 md:w-4 md:h-4" />
                  </span>
                )}
              </motion.button>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <p className="text-[9px] md:text-[10px] text-gray-500">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-burnt-orange-600 font-semibold hover:text-yellow-600 hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="flex items-center justify-center gap-1"
              >
                <Shield className="w-2.5 h-2.5 text-gray-400" />
                <span className="text-[6px] md:text-[7px] text-gray-400">Secure • Encrypted</span>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Centered Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-green-800 mb-3">
                Welcome to Celebrity Star!
              </h2>
              
              <p className="text-green-700 text-base mb-6">
                Your account has been created successfully
              </p>
              
              <div className="space-y-3">
                <div className="bg-white/50 rounded-lg p-3 text-sm text-green-600">
                  <p>You're now signed in as <span className="font-bold">@{formData.username}</span></p>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Taking you to your profile...</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
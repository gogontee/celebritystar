// components/GlobalNavigation.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Home, Users, Images, Bell, Trophy, Tv, User, Flame, Crown, Star, LogIn, LogOut, Info, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';

const GlobalNavigation = () => {
  const [activeMobileTab, setActiveMobileTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hoveringRegister, setHoveringRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Fetch current user and profile - non-blocking
  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;
        
        setCurrentUser(user);
        setIsLoggedIn(!!user);

        if (user) {
          // Fetch user profile - don't await, let it happen in background
          supabase
            .from('profiles')
            .select('username, avatar_url, full_name')
            .eq('id', user.id)
            .maybeSingle()
            .then(({ data: profile }) => {
              if (isMounted) setUserProfile(profile);
            });
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        if (isMounted) setAuthLoaded(true);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        setIsLoggedIn(true);
        setCurrentUser(session.user);
        
        // Fetch profile after sign in
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url, full_name')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (isMounted) setUserProfile(profile);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Get active tab from pathname - synchronous, no delay
  const getActiveTab = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/candidates')) return 'candidates';
    if (pathname.startsWith('/event-gallery')) return 'gallery';
    if (pathname.startsWith('/updates')) return 'updates';
    if (pathname.startsWith('/vote')) return 'vote';
    if (pathname.startsWith('/about')) return 'about';
    const usernameMatch = pathname.match(/^\/([^\/]+)$/);
    if (usernameMatch && !['candidates', 'event-gallery', 'updates', 'vote', 'ranking', 'live-tv', 'login', 'auth', 'profile', 'about'].includes(usernameMatch[1])) {
      return 'profile';
    }
    return 'home';
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setCurrentUser(null);
      setUserProfile(null);
      setShowUserDropdown(false);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle profile click
  const handleProfileClick = () => {
    setShowUserDropdown(false);
    if (userProfile?.username) {
      const profilePath = `/${userProfile.username}`;
      if (pathname === profilePath) {
        router.refresh();
      } else {
        router.push(profilePath);
      }
    }
  };

  // Handle user circle click
  const handleUserCircleClick = () => {
    if (isLoggedIn) {
      setShowUserDropdown(!showUserDropdown);
    } else {
      router.push('/auth/login');
    }
  };

  // Handle register button click
  const handleRegisterClick = (e) => {
    e.preventDefault();
    router.push('/auth/signup');
  };

  // Handle mobile register button click
  const handleMobileRegisterClick = (e) => {
    e.preventDefault();
    setHoveringRegister(true);
    router.push('/auth/signup');
  };

  // Handle profile tab click (bottom navigation)
  const handleProfileTabClick = (e) => {
    e.preventDefault();
    if (isLoggedIn && userProfile?.username) {
      const profilePath = `/${userProfile.username}`;
      if (pathname === profilePath) {
        router.refresh();
      } else {
        router.push(profilePath);
      }
    } else {
      router.push('/auth/login');
    }
  };

  // Navigation items for mobile menu
  const mobileMenuItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'candidates', label: 'Housemates', icon: Users, href: '/candidates' },
    { id: 'gallery', label: 'Gallery', icon: Images, href: '/event-gallery' },
    { id: 'updates', label: 'Updates', icon: Bell, href: '/updates' },
    { id: 'vote', label: 'Vote', icon: Flame, href: '/vote' },
    { id: 'about', label: 'About', icon: Info, href: '/about' },
  ];

  const logoUrl = 'https://vfpyefrlecyrdvbmeyty.supabase.co/storage/v1/object/public/brand-assets/G.png';
  const activeTab = getActiveTab();

  // Mobile bottom navigation items (simplified)
  const mobileNavItems = [
    { id: 'home', icon: Home, label: 'Home', href: '/' },
    { id: 'updates', icon: Bell, label: 'Updates', href: '/updates' },
    { id: 'vote', icon: Flame, label: 'Vote', isSpecial: true, href: '/vote' },
    { id: 'gallery', icon: Images, label: 'Gallery', href: '/event-gallery' },
    { 
      id: 'profile', 
      icon: User, 
      label: 'Profile', 
      isProfile: true,
      onClick: handleProfileTabClick
    },
  ];

  // Desktop navigation items
  const desktopNavItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'candidates', label: 'Housemates', icon: Users, href: '/candidates' },
    { id: 'gallery', label: 'Gallery', icon: Images, href: '/event-gallery' },
    { id: 'updates', label: 'Updates', icon: Bell, href: '/updates' },
    { id: 'about', label: 'About', icon: Info, href: '/about' },
  ];

  return (
    <>
      {/* ===== DESKTOP HEADER ===== */}
      <header className="hidden md:block sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo Section - Left */}
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <div className="relative group">
                <div className="h-16 w-auto overflow-hidden flex items-center justify-center">
                  <Image
                    src={logoUrl}
                    alt="G Logo"
                    width={64}
                    height={64}
                    className="h-full w-auto object-contain"
                    unoptimized
                    priority
                  />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-xl p-1 border border-white/20">
                {desktopNavItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`group relative px-4 py-2.5 rounded-lg transition-all duration-300 ${
                        isActive ? 'bg-white/10' : 'hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <item.icon className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-orange-400' : 'text-white/80 group-hover:text-orange-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          isActive ? 'text-white' : 'text-white/90 group-hover:text-white'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      } transition-opacity duration-300`}></div>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right Section - Icons */}
            <div className="flex items-center space-x-3">
              {/* Live TV Icon */}
              <Link href="/live-tv" className="relative group">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-0.5">
                  <Tv className="w-5 h-5 text-white" />
                </div>
              </Link>

              {/* Register Button - Only show for non-auth users */}
              {!authLoaded ? (
                // Show skeleton while loading auth
                <div className="w-20 h-9 bg-white/5 rounded-lg animate-pulse"></div>
              ) : !isLoggedIn ? (
                <button 
                  onClick={handleRegisterClick}
                  className="relative group"
                  onMouseEnter={() => setHoveringRegister(true)}
                  onMouseLeave={() => setHoveringRegister(false)}
                >
                  <div className="relative px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 border border-blue-400/50 flex items-center space-x-1.5 shadow-lg">
                    <LogIn className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-semibold text-white">Register</span>
                  </div>
                </button>
              ) : null}

              {/* User Auth Button */}
              <div className="relative">
                <button 
                  onClick={handleUserCircleClick}
                  className="relative group"
                >
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-0.5">
                    {isLoggedIn && userProfile?.avatar_url ? (
                      <div className="w-5 h-5 rounded-full overflow-hidden">
                        <Image
                          src={userProfile.avatar_url}
                          alt="Profile"
                          width={20}
                          height={20}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                    {isLoggedIn && (
                      <Crown className="w-3 h-3 absolute -top-1 -right-1 text-orange-400" fill="#f97316" />
                    )}
                  </div>
                </button>

                {/* User Dropdown - Only for auth users */}
                {isLoggedIn && showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="text-white font-medium">{userProfile?.full_name || 'User'}</div>
                      <div className="text-xs text-white/60">@{userProfile?.username || 'username'}</div>
                    </div>
                    
                    <button 
                      onClick={handleProfileClick}
                      className="w-full px-4 py-3 text-white hover:bg-white/10 text-left text-sm flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Your Profile</div>
                        <div className="text-xs text-white/60">View your profile</div>
                      </div>
                    </button>

                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-white hover:bg-white/10 text-left text-sm flex items-center gap-3 mt-1 border-t border-white/10 pt-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                        <LogOut className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Logout</div>
                        <div className="text-xs text-white/60">Sign out</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE HEADER ===== */}
      <header className="md:hidden sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* Mobile Logo */}
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <div className="h-12 w-auto overflow-hidden flex items-center justify-center">
                <Image
                  src={logoUrl}
                  alt="G Logo"
                  width={48}
                  height={48}
                  className="h-full w-auto object-contain"
                  unoptimized
                  priority
                />
              </div>
            </Link>

            {/* Mobile Right Icons - TV, User, and Menu */}
            <div className="flex items-center space-x-2">
              {/* Register Button - Mobile (only if not logged in) */}
              {!authLoaded ? (
                <div className="w-16 h-7 bg-white/5 rounded animate-pulse"></div>
              ) : !isLoggedIn ? (
                <button 
                  onClick={handleMobileRegisterClick}
                  className="px-2.5 py-1 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 border border-blue-400/50 flex items-center space-x-1 shadow"
                >
                  <LogIn className="w-3 h-3 text-white" />
                  <span className="text-xs font-semibold text-white">Register</span>
                </button>
              ) : null}

              {/* Live TV Icon */}
              <Link href="/live-tv" className="p-1.5 rounded-lg bg-white/10 border border-white/20">
                <Tv className="w-4 h-4 text-white" />
              </Link>

              {/* User Icon */}
              <button 
                onClick={handleUserCircleClick}
                className="p-1.5 rounded-lg bg-white/10 border border-white/20"
              >
                {isLoggedIn && userProfile?.avatar_url ? (
                  <div className="w-4 h-4 rounded-full overflow-hidden">
                    <Image
                      src={userProfile.avatar_url}
                      alt="Profile"
                      width={16}
                      height={16}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Hamburger Menu Icon */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg bg-white/10 border border-white/20"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 text-white" />
                ) : (
                  <Menu className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10 shadow-xl z-50">
            <div className="py-2 px-2">
              {mobileMenuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-l-4 border-orange-500' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-white/70'}`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/80'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-xs text-orange-400">●</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* ===== MOBILE BOTTOM TAB ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40 shadow-2xl">
        <div className="grid grid-cols-5 items-center py-2 px-1">
          {mobileNavItems.map((item) => {
            const isActive = activeTab === item.id;
            const isSpecial = item.isSpecial;
            const isProfile = item.isProfile;
            
            if (isSpecial) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveMobileTab(item.id)}
                  className="relative flex flex-col items-center justify-center col-span-1"
                >
                  <div className="absolute -top-5">
                    <div className="relative">
                      {isActive && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full animate-ping opacity-20"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full animate-ping opacity-20 delay-150"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full animate-ping opacity-20 delay-300"></div>
                        </>
                      )}
                      <div className="relative p-2.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 shadow-lg">
                        <Flame className="w-4 h-4 text-white" fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className={`mt-6 text-[10px] font-medium ${isActive ? 'text-orange-400' : 'text-white/70'}`}>
                    {item.label}
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"></div>
                  )}
                </Link>
              );
            }
            
            if (isProfile) {
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="relative flex flex-col items-center justify-center col-span-1"
                >
                  <div className={`relative p-1.5 rounded-lg transition-all duration-300 ${
                    isActive ? 'text-orange-400' : 'text-white/70 hover:text-orange-400'
                  }`}>
                    {isLoggedIn && userProfile?.avatar_url ? (
                      <div className="w-4 h-4 rounded-full overflow-hidden">
                        <Image
                          src={userProfile.avatar_url}
                          alt="Profile"
                          width={16}
                          height={16}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <item.icon size={16} />
                    )}
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className={`mt-1 text-[10px] font-medium ${
                    isActive ? 'text-orange-400' : 'text-white/70'
                  }`}>
                    {item.label}
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"></div>
                  )}
                </button>
              );
            }
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveMobileTab(item.id)}
                className="relative flex flex-col items-center justify-center col-span-1"
              >
                <div className={`relative p-1.5 rounded-lg transition-all duration-300 ${
                  isActive ? 'text-orange-400' : 'text-white/70 hover:text-orange-400'
                }`}>
                  <item.icon size={16} />
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className={`mt-1 text-[10px] font-medium ${
                  isActive ? 'text-orange-400' : 'text-white/70'
                }`}>
                  {item.label}
                </div>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer for mobile bottom tab */}
      <div className="md:hidden h-16"></div>

      {/* Mobile User Dropdown - Only for auth users */}
      {isLoggedIn && showUserDropdown && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setShowUserDropdown(false)}>
          <div className="absolute bottom-24 left-4 right-4 bg-black/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl py-2" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-white/10">
              <div className="text-white font-medium">{userProfile?.full_name || 'User'}</div>
              <div className="text-xs text-white/60">@{userProfile?.username || 'username'}</div>
            </div>
            
            <button 
              onClick={handleProfileClick}
              className="w-full px-4 py-3 text-white hover:bg-white/10 text-left text-sm flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Your Profile</div>
                <div className="text-xs text-white/60">View your profile</div>
              </div>
            </button>

            <button 
              onClick={handleLogout}
              className="w-full px-4 py-3 text-white hover:bg-white/10 text-left text-sm flex items-center gap-3 mt-1 border-t border-white/10 pt-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Logout</div>
                <div className="text-xs text-white/60">Sign out</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalNavigation;
// components/Home/Hero.js
'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Share2 } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  // Slides only
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=2400&q=80'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2400&q=80'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=2400&q=80'
    }
  ];

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Get current user and profile
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url, full_name')
          .eq('id', user.id)
          .maybeSingle();
        
        setUserProfile(profile);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url, full_name')
          .eq('id', session.user.id)
          .maybeSingle();
        setUserProfile(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);
  
  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Handle share challenge
  const handleChallenge = async () => {
    const shareMessage = "I dare you to challenge me in the forthcoming Celebrity Star Reality Show. I can't wait to overthrow you in that house! 🏆🔥";
    const shareUrl = window.location.origin;
    const avatarUrl = userProfile?.avatar_url;

    // Create share text with avatar if available
    const fullMessage = avatarUrl 
      ? `👤 Check out my profile: ${avatarUrl}\n\n${shareMessage}\n\n${shareUrl}`
      : `${shareMessage}\n\n${shareUrl}`;

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Celebrity Star Reality Show Challenge',
          text: shareMessage,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for platforms that don't support Web Share API
      const encodedMessage = encodeURIComponent(fullMessage);
      
      // Open share options (you can customize this based on platform detection)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Try WhatsApp first on mobile
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
      } else {
        // On desktop, copy to clipboard
        navigator.clipboard.writeText(fullMessage);
        alert('Challenge message copied to clipboard! Share it with your friends. 📋');
      }
    }
  };

  // Handle register click
  const handleRegister = () => {
    window.location.href = '/auth/signup';
  };

  return (
    <>
      {/* Hero Section - 5:2.3 ratio (46vh) */}
      <div className="relative w-full h-[46vh] md:h-[46vh] overflow-hidden bg-gray-900">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background image only */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${slide.image})`
              }}
            ></div>
          </div>
        ))}
        
        {/* Optional dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gray-900/30 z-5"></div>
        
        {/* Slide indicator dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentSlide 
                  ? 'bg-orange-500 w-6' 
                  : 'bg-gray-300 hover:bg-gray-100'
              }`}
            />
          ))}
        </div>

        {/* CTA Button - Desktop position (bottom-left) */}
        <div className="hidden md:block absolute bottom-4 left-4 z-20">
          {user ? (
            <button 
              onClick={handleChallenge}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              CHALLENGE SOMEONE
            </button>
          ) : (
            <button 
              onClick={handleRegister}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm"
            >
              REGISTER NOW
            </button>
          )}
        </div>
      </div>
      
      {/* CTA Button - Mobile (full width with padding) */}
      <div className="md:hidden w-full px-4 mt-4">
        {user ? (
          <button 
            onClick={handleChallenge}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            CHALLENGE SOMEONE
          </button>
        ) : (
          <button 
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-gray-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
          >
            REGISTER NOW
          </button>
        )}
      </div>
    </>
  );
};

export default Hero;
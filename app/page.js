// app/page.js
'use client';

import { useState, useEffect } from 'react';
import Hero from '../components/Home/Hero';
import Stats from '../components/Home/Stats';
import TopCandidates from '../components/Home/TopCandidates';
import HomeFeaturedPost from '../components/Home/FeaturedPost'; // This one should hide when empty
import FeaturedPost from '../components/FeaturedPost'; // This one always renders
import { createBrowserClient } from '@supabase/ssr';

export default function HomePage() {
  const [hasCandidates, setHasCandidates] = useState(null);
  const [hasHomeFeaturedPosts, setHasHomeFeaturedPosts] = useState(null); // For components/Home/FeaturedPost
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const checkContent = async () => {
      try {
        // Check if there are any active and verified candidates
        const { data: candidates, error: candidatesError } = await supabase
          .from('profiles')
          .select('id')
          .eq('account_status', 'active')
          .eq('verification_level', 'fully_verified')
          .not('username', 'is', null)
          .limit(1);

        if (candidatesError) {
          console.warn('Error checking candidates:', candidatesError.message);
          setHasCandidates(false);
        } else {
          setHasCandidates(candidates && candidates.length > 0);
        }

        // Check if there are any featured posts for HomeFeaturedPost component
        // Looking at your HomeFeaturedPost code, it uses 'news' table with 'is_featured' flag
        const { data: homeFeatured, error: homeFeaturedError } = await supabase
          .from('news')
          .select('id')
          .eq('is_featured', true)
          .limit(1);

        if (homeFeaturedError) {
          console.warn('Error checking home featured posts:', homeFeaturedError.message);
          setHasHomeFeaturedPosts(false);
        } else {
          setHasHomeFeaturedPosts(homeFeatured && homeFeatured.length > 0);
        }

      } catch (error) {
        console.error('Error checking content:', error);
        setHasCandidates(false);
        setHasHomeFeaturedPosts(false);
      } finally {
        setLoading(false);
      }
    };

    checkContent();
  }, [supabase]);

  // Show minimal loading skeleton while checking content
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <Hero />
        <Stats />
        {/* Simple loading indicator */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Hero />
      <Stats />
      
      {/* FeaturedPost from components/FeaturedPost - Always renders */}
      <FeaturedPost />
      
      {/* Only render TopCandidates if there are candidates */}
      {hasCandidates && <TopCandidates />}
      
      {/* Only render HomeFeaturedPost if there are featured news posts */}
      {hasHomeFeaturedPosts && <HomeFeaturedPost />}
      
      {/* Footer CTA with reduced spacing */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl p-5 md:p-7 text-center border border-white/10">
          <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">
            Ready to Launch Your Aspiration?
          </h3>
          <p className="text-white/70 text-sm md:text-base mb-4 md:mb-6 max-w-2xl mx-auto">
            Be part of Africa's most exciting Reality Show. Register now for exclusive access.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
            <button className="btn-primary group px-5 py-2.5 md:px-6 md:py-3 text-sm font-bold">
              Register Here
            </button>
            <button className="btn-outline-white group px-5 py-2.5 md:px-6 md:py-3 text-sm">
              LEARN MORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
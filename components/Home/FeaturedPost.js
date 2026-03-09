// components/Home/FeaturedPost.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Share2, ChevronRight } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

// Simple date formatter without date-fns
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase();
};

export default function FeaturedPost() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [allFeaturedNews, setAllFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rotationIndex, setRotationIndex] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    fetchFeaturedNews();
  }, []);

  // Rotate featured news every hour if there are more than 4
  useEffect(() => {
    if (allFeaturedNews.length <= 4) return;

    const interval = setInterval(() => {
      setRotationIndex((prev) => (prev + 4) % allFeaturedNews.length);
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [allFeaturedNews.length]);

  // Update displayed news when rotation index changes
  useEffect(() => {
    if (allFeaturedNews.length <= 4) {
      setNews(allFeaturedNews);
    } else {
      const rotatedNews = [];
      for (let i = 0; i < 4; i++) {
        const index = (rotationIndex + i) % allFeaturedNews.length;
        rotatedNews.push(allFeaturedNews[index]);
      }
      setNews(rotatedNews);
    }
  }, [allFeaturedNews, rotationIndex]);

  const fetchFeaturedNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_featured', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      
      setAllFeaturedNews(data || []);
      // Initially show first 4
      setNews((data || []).slice(0, 4));
    } catch (error) {
      console.error('Error fetching featured news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'EXCLUSIVE': 'bg-purple-500',
      'NEWS': 'bg-blue-500',
      'INSIGHT': 'bg-green-500',
      'INTERVIEW': 'bg-yellow-500',
      'BEHIND THE SCENES': 'bg-pink-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const handleShare = async (newsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.excerpt,
          url: `${window.location.origin}/updates/${newsItem.id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/updates/${newsItem.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleReadMore = (id) => {
    router.push(`/updates/${id}`);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-orange-400 text-sm font-medium tracking-wider mb-1">FEATURED</div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Latest Updates</h2>
          </div>
          <button className="text-white/70 hover:text-white text-xs font-medium flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>CALENDAR</span>
          </button>
        </div>
        
        {/* Loading skeleton - 4 columns on desktop, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl overflow-hidden border border-white/10 animate-pulse">
              <div className="h-48 md:h-56 bg-gray-800"></div>
              <div className="p-4 md:p-6 space-y-3">
                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-8 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-orange-400 text-sm font-medium tracking-wider mb-1">FEATURED</div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Latest Updates</h2>
          {allFeaturedNews.length > 4 && (
            <p className="text-xs text-white/40 mt-1">
              Rotating {allFeaturedNews.length} featured stories
            </p>
          )}
        </div>
        <button className="text-white/70 hover:text-white text-xs font-medium flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>CALENDAR</span>
        </button>
      </div>
      
      {/* News grid - 4 columns on desktop, 2 on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {news.map((item) => (
          <div key={item.id} className="group cursor-pointer" onClick={() => handleReadMore(item.id)}>
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300 h-full flex flex-col">
              
              {/* News image */}
              <div className="relative h-40 md:h-48 overflow-hidden flex-shrink-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${item.image_url})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-0.5 rounded-full ${getCategoryColor(item.category)} text-white text-[10px] font-medium`}>
                    {item.category}
                  </span>
                </div>
                
                {/* Share button */}
                <div className="absolute top-3 right-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(item);
                    }}
                    className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <Share2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
              
              {/* News content - with flex grow to push button to bottom */}
              <div className="p-3 md:p-4 flex flex-col flex-grow">
                {/* Title - reduced size on mobile */}
                <h3 className="text-sm md:text-base font-bold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                
                {/* Excerpt - hidden on mobile, shown on desktop */}
                <p className="hidden md:block text-white/70 text-xs mb-3 line-clamp-2 flex-grow">
                  {item.excerpt}
                </p>
                
                {/* Bottom row with date and read more button - opposite ends */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  {/* Published time */}
                  <div className="flex items-center gap-1 text-white/40 text-[10px] md:text-xs">
                    <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    <span className="truncate max-w-[80px] md:max-w-none">
                      {formatTimeAgo(item.published_at)}
                    </span>
                  </div>
                  
                  {/* Read More Button - smaller on mobile */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadMore(item.id);
                    }}
                    className="inline-flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors group/btn"
                  >
                    <span className="hidden md:inline">READ MORE</span>
                    <span className="inline md:hidden">READ</span>
                    <ChevronRight className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
// /components/profile/ProfileInfo.js
'use client';

import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Phone,
  CheckCircle,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Music,
  Vote,
  Eye,
  User,
  Shield
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ProfileInfo({ 
  profile, 
  isOwner, 
  stats: initialStats
}) {
  const router = useRouter();
  const [liveStats, setLiveStats] = useState(initialStats);
  const [showAbout, setShowAbout] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Check if user is admin
  const isAdmin = profile?.role === 'admin';

  // Fetch vote stats from vote_transactions (only if not admin)
  useEffect(() => {
    if (profile?.id && !isAdmin) {
      fetchVoteStats();
    }
  }, [profile?.id, isAdmin]);

  // Set up real-time subscription for vote updates (only if not admin)
  useEffect(() => {
    if (!profile?.id || isAdmin) return;

    const subscription = supabase
      .channel(`votes-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vote_transactions',
          filter: `candidate_id=eq.${profile.id}`
        },
        () => {
          fetchVoteStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [profile?.id, supabase, isAdmin]);

  const fetchVoteStats = async () => {
    try {
      const { data, error } = await supabase
        .from('vote_transactions')
        .select('votes')
        .eq('candidate_id', profile.id)
        .eq('status', 'completed');

      if (error) {
        console.error('Error fetching vote stats:', error);
        setLiveStats(prev => ({
          ...prev,
          totalVotes: 0
        }));
      } else {
        const totalVotes = data?.reduce((sum, tx) => sum + (tx.votes || 0), 0) || 0;
        setLiveStats(prev => ({
          ...prev,
          totalVotes
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      setLiveStats(prev => ({
        ...prev,
        totalVotes: 0
      }));
    }
  };

  // Update liveStats when initialStats changes
  useEffect(() => {
    setLiveStats(initialStats);
  }, [initialStats]);

  const handleAdminPanelClick = () => {
    router.push('/adminpannel');
  };

  // Burnt lemon color (combination of burnt orange and yellow)
  const burntLemonColor = 'text-amber-300'; // You can adjust this to your preferred shade

  return (
    <div className="px-4">
      {/* Profile Details - Horizontal Layout */}
      <div className="flex flex-row flex-wrap items-center gap-2 md:gap-4 mb-4">
        <div className="flex items-center gap-2">
          <h1 className="!text-2xl font-bold text-white">
            {profile.full_name}
          </h1>
          {profile.verification_level === 'fully_verified' && (
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-400 fill-current" />
          )}
          {profile.role === 'celebrity' && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white text-[10px] md:text-xs rounded-full">
              Celebrity
            </span>
          )}
          {isAdmin && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] md:text-xs rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          )}
        </div>
        
        <p className="text-white/60 text-xs md:text-sm">@{profile.username}</p>

        {/* Social Icons */}
        <div className="flex items-center gap-1 md:gap-2">
          {profile.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              title="Instagram"
            >
              <Instagram className="w-3 h-3 md:w-4 md:h-4 text-white/60 group-hover:text-pink-500 transition-colors" />
            </a>
          )}
          
          {profile.tiktok && (
            <a
              href={`https://tiktok.com/@${profile.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              title="TikTok"
            >
              <Music className="w-3 h-3 md:w-4 md:h-4 text-white/60 group-hover:text-black transition-colors" />
            </a>
          )}
          
          {profile.facebook && (
            <a
              href={`https://facebook.com/${profile.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              title="Facebook"
            >
              <Facebook className="w-3 h-3 md:w-4 md:h-4 text-white/60 group-hover:text-blue-600 transition-colors" />
            </a>
          )}
          
          {profile.youtube && (
            <a
              href={`https://youtube.com/@${profile.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              title="YouTube"
            >
              <Youtube className="w-3 h-3 md:w-4 md:h-4 text-white/60 group-hover:text-red-600 transition-colors" />
            </a>
          )}
          
          {profile.twitter && (
            <a
              href={`https://twitter.com/${profile.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 md:p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              title="Twitter/X"
            >
              <Twitter className="w-3 h-3 md:w-4 md:h-4 text-white/60 group-hover:text-blue-400 transition-colors" />
            </a>
          )}
        </div>
      </div>

      {/* Bio - Only show when about is not active or as preview */}
      {!showAbout && profile.bio && (
        <p className="text-white/80 text-xs md:text-sm max-w-2xl mb-4 line-clamp-2">
          {profile.bio}
        </p>
      )}

      {/* Profile Links */}
      <div className="flex flex-wrap gap-2 md:gap-3 text-[10px] md:text-xs text-white/60 mb-4">
        {profile.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 md:w-4 md:h-4" />
            {profile.location}
          </span>
        )}
        {profile.website && (
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-burnt-orange-400 hover:text-burnt-orange-300 transition-colors"
          >
            <LinkIcon className="w-3 h-3 md:w-4 md:h-4" />
            {profile.website.replace(/^https?:\/\//, '').substring(0, 20)}...
          </a>
        )}
        {profile.birth_date && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            {new Date(profile.birth_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        )}
      </div>

      {/* Performance Stats - Conditional rendering based on role */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 py-4 border-t border-white/10">
        {/* About Candidate - Clickable with burnt lemon hover */}
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-3 text-center hover:bg-white/10 transition-colors group relative"
        >
          <User className={`w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 transition-colors ${
            showAbout 
              ? 'text-burnt-orange-500' 
              : 'text-white/60 group-hover:text-amber-300' // Burnt lemon on hover
          }`} />
          <div className={`text-xs md:text-sm font-medium transition-colors ${
            showAbout 
              ? 'text-burnt-orange-500' 
              : 'text-white group-hover:text-amber-300' // Burnt lemon on hover
          }`}>
            About
          </div>
          <div className={`text-[8px] md:text-[10px] transition-colors ${
            showAbout 
              ? 'text-burnt-orange-500/60' 
              : 'text-white/40 group-hover:text-amber-300/60' // Burnt lemon with opacity on hover
          }`}>
            candidate
          </div>
          
          {/* About Content Popup */}
          <AnimatePresence>
            {showAbout && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 mt-2 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 text-left"
                style={{ top: '100%' }}
              >
                <h3 className="text-white font-semibold text-sm mb-2">About {profile.full_name}</h3>
                <p className="text-white/80 text-xs leading-relaxed">
                  {profile.bio || "No bio available yet."}
                </p>
                {profile.bio && (
                  <div className="mt-3 text-[10px] text-white/40">
                    Last updated: {new Date(profile.updated_at).toLocaleDateString()}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Conditional rendering: Admin Panel for admins, Votes for regular users */}
        {isAdmin ? (
          /* Admin Panel Tab */
          <button
            onClick={handleAdminPanelClick}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-lg md:rounded-xl p-2 md:p-3 text-center transition-all group border border-purple-500/30"
          >
            <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-purple-400 group-hover:scale-110 transition-transform" />
            <div className="text-xs md:text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
              Admin Panel
            </div>
            <div className="text-[8px] md:text-[10px] text-white/40">
              manage
            </div>
          </button>
        ) : (
          /* Votes Tab for regular users */
          <div className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-3 text-center">
            <motion.div 
              key={liveStats.totalVotes}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-xl md:text-2xl font-bold text-white mb-1"
            >
              {liveStats.totalVotes?.toLocaleString() || 0}
            </motion.div>
            <div className="text-[10px] md:text-xs text-white/40">Votes</div>
          </div>
        )}

        {/* Views - Removed as requested */}
      </div>
    </div>
  );
}
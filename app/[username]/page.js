// /app/[username]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { 
  ChevronLeft,
  MoreHorizontal,
  User,
  Trophy,
  Settings,
  LogOut,
  MessageCircle,
  ThumbsUp,
  Eye,
  Heart,
  Grid,
  Video,
  Bookmark,
  Plus,
  Image as ImageIcon
} from 'lucide-react';

// Import components
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileBanner from '../../components/profile/ProfileBanner';
import ProfileInfo from '../../components/profile/ProfileInfo';
import ProfileTabs from '../../components/profile/ProfileTabs';
import PostModal from '../../components/profile/PostModal';
import VideoModal from '../../components/profile/VideoModal';
import PostDetailModal from '../../components/profile/PostDetailModal';
import SettingsModal from '../../components/profile/SettingsModal';
import VoteModal from '../../components/profile/VoteModal';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username;
  
  const [profile, setProfile] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [showSettings, setShowSettings] = useState(false);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalViews: 0,
    totalLikes: 0,
    totalPosts: 0,
    rank: 0
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    fetchProfile();
    checkCurrentUser();
  }, [username]);

  useEffect(() => {
    if (isOwner && profile && !profile.avatar_url) {
      setShowPhotoPopup(true);
    } else {
      setShowPhotoPopup(false);
    }
  }, [isOwner, profile]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) {
        setProfile(null);
        setLoading(false);
        return;
      }
      
      setProfile(profileData);

      const images = profileData.image_url || [];
      const videos = profileData.video_url || [];
      const combinedPosts = [...images, ...videos].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      
      setAllPosts(combinedPosts);
      setStats(prev => ({ ...prev, totalPosts: combinedPosts.length }));

      const { count: followersCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profileData.id);

      setFollowers(followersCount || 0);

      const { count: followingCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profileData.id);

      setFollowing(followingCount || 0);

      // Fetch actual vote count from vote_transactions table
      const { data: voteData, error: voteError } = await supabase
        .from('vote_transactions')
        .select('votes')
        .eq('candidate_id', profileData.id)
        .eq('status', 'completed');

      if (voteError) {
        console.error('Error fetching votes:', voteError);
      }

      const totalVotes = voteData?.reduce((sum, tx) => sum + (tx.votes || 0), 0) || 0;

      const rank = Math.floor(Math.random() * 100) + 1;
      
      setStats({
        totalVotes: totalVotes,
        totalViews: Math.floor(Math.random() * 100000) + 10000,
        totalLikes: Math.floor(Math.random() * 50000) + 5000,
        totalPosts: combinedPosts.length,
        rank: rank
      });

    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    
    if (user && profile) {
      setIsOwner(user.id === profile.id);

      const { data: followData } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', profile.id)
        .maybeSingle();

      setIsFollowing(!!followData);
    }
  };

  useEffect(() => {
    if (profile && currentUser) {
      checkCurrentUser();
    }
  }, [profile, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    try {
      if (isFollowing) {
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', profile.id);
        setFollowers(prev => prev - 1);
      } else {
        await supabase
          .from('followers')
          .insert({
            follower_id: currentUser.id,
            following_id: profile.id
          });
        setFollowers(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !profile) return;

    setUploadingPhoto(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar_url: reader.result
        }));
      };
      reader.readAsDataURL(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
      setShowPhotoPopup(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
      fetchProfile();
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleImagePost = async (files, caption) => {
    if (!files.length || !profile) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${profile.id}/posts/image-${Date.now()}-${Math.random()}.${fileExt}`;

        await supabase.storage
          .from('posts')
          .upload(fileName, file, {
            upsert: true,
            contentType: file.type,
          });

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName);

        return { url: publicUrl };
      });

      const mediaUrls = await Promise.all(uploadPromises);

      const newPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'image',
        media: mediaUrls,
        caption: caption || '',
        created_at: new Date().toISOString()
      };

      const currentPosts = profile.image_url || [];
      const updatedPosts = [newPost, ...currentPosts];

      const { error } = await supabase
        .from('profiles')
        .update({ 
          image_url: updatedPosts,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, image_url: updatedPosts }));
      setAllPosts(prev => [newPost, ...prev]);
      setStats(prev => ({ ...prev, totalPosts: prev.totalPosts + 1 }));
      setShowPostModal(false);
    } catch (error) {
      console.error('Error uploading post:', error);
    }
  };

  const handleVideoPost = async (videoUrl, caption) => {
    if (!profile) return;

    try {
      let embedUrl = videoUrl;
      let provider = 'youtube';

      if (videoUrl.includes('youtu.be') || videoUrl.includes('youtube.com')) {
        const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || 
                       videoUrl.split('v=')[1]?.split('&')[0];
        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      }

      const newPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'video',
        media: [{
          url: videoUrl,
          embedUrl: embedUrl,
          provider: provider
        }],
        caption: caption || '',
        created_at: new Date().toISOString()
      };

      const currentPosts = profile.video_url || [];
      const updatedPosts = [newPost, ...currentPosts];

      const { error } = await supabase
        .from('profiles')
        .update({ 
          video_url: updatedPosts,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, video_url: updatedPosts }));
      setAllPosts(prev => [newPost, ...prev]);
      setStats(prev => ({ ...prev, totalPosts: prev.totalPosts + 1 }));
      setShowVideoModal(false);
    } catch (error) {
      console.error('Error adding video post:', error);
    }
  };

  const handleDeletePost = async (post) => {
    if (!profile || !isOwner) return;

    try {
      let updatedPosts;
      if (post.type === 'image') {
        updatedPosts = (profile.image_url || []).filter(p => p.id !== post.id);
        await supabase
          .from('profiles')
          .update({ 
            image_url: updatedPosts,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);
        
        setProfile(prev => ({ ...prev, image_url: updatedPosts }));
      } else {
        updatedPosts = (profile.video_url || []).filter(p => p.id !== post.id);
        await supabase
          .from('profiles')
          .update({ 
            video_url: updatedPosts,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);
        
        setProfile(prev => ({ ...prev, video_url: updatedPosts }));
      }

      setAllPosts(prev => prev.filter(p => p.id !== post.id));
      setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
      setSelectedPost(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = async (postId, newCaption) => {
    if (!profile || !isOwner) return;

    try {
      let updatedPosts;
      const post = allPosts.find(p => p.id === postId);
      
      if (post.type === 'image') {
        updatedPosts = (profile.image_url || []).map(p => 
          p.id === postId ? { ...p, caption: newCaption } : p
        );
        await supabase
          .from('profiles')
          .update({ 
            image_url: updatedPosts,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);
        
        setProfile(prev => ({ ...prev, image_url: updatedPosts }));
      } else {
        updatedPosts = (profile.video_url || []).map(p => 
          p.id === postId ? { ...p, caption: newCaption } : p
        );
        await supabase
          .from('profiles')
          .update({ 
            video_url: updatedPosts,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);
        
        setProfile(prev => ({ ...prev, video_url: updatedPosts }));
      }

      setAllPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, caption: newCaption } : p
      ));
      setSelectedPost(null);
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleSavePost = async (post) => {
    if (!currentUser || !profile) return;

    try {
      const currentSaved = profile.saved_post || [];
      const isSaved = currentSaved.some(p => p.id === post.id);
      
      let updatedSaved;
      if (isSaved) {
        updatedSaved = currentSaved.filter(p => p.id !== post.id);
      } else {
        updatedSaved = [post, ...currentSaved];
      }

      await supabase
        .from('profiles')
        .update({ 
          saved_post: updatedSaved,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (isOwner) {
        setProfile(prev => ({ ...prev, saved_post: updatedSaved }));
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  // Updated vote handler to work with vote_transactions
  const handleVoteSuccess = async (voteCount, amount) => {
    console.log(`Voted ${voteCount} times for $${amount}`);
    
    // Refresh the profile stats to get updated vote count
    try {
      const { data: voteData, error: voteError } = await supabase
        .from('vote_transactions')
        .select('votes')
        .eq('candidate_id', profile.id)
        .eq('status', 'completed');

      if (voteError) {
        console.error('Error refreshing votes:', voteError);
        return;
      }

      const totalVotes = voteData?.reduce((sum, tx) => sum + (tx.votes || 0), 0) || 0;
      
      setStats(prev => ({
        ...prev,
        totalVotes: totalVotes
      }));
    } catch (error) {
      console.error('Error refreshing vote count:', error);
    }
  };

  const getEmbedUrl = (url) => {
    if (url.includes('youtu.be') || url.includes('youtube.com')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0] || 
                     url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-burnt-orange-950 to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-burnt-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white/70 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-burnt-orange-950 to-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-burnt-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-burnt-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
          <p className="text-white/60 text-sm mb-6">
            The user @{username} doesn't exist or may have been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const savedPosts = profile.saved_post || [];
  const displayPosts = activeTab === 'saved' ? savedPosts : allPosts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-burnt-orange-950 to-black">
      {/* Modals */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            profile={profile}
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            onUpdate={fetchProfile}
            supabase={supabase}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPostModal && (
          <PostModal
            onClose={() => setShowPostModal(false)}
            onUpload={handleImagePost}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVideoModal && (
          <VideoModal
            onClose={() => setShowVideoModal(false)}
            onAdd={handleVideoPost}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVoteModal && (
          <VoteModal
            isOpen={showVoteModal}
            onClose={() => setShowVoteModal(false)}
            profile={profile}
            onVoteSuccess={handleVoteSuccess}
            onVoteError={(error) => console.error('Vote error:', error)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            profile={profile}
            isOwner={isOwner}
            onClose={() => setSelectedPost(null)}
            onDelete={() => handleDeletePost(selectedPost)}
            onEdit={(caption) => handleEditPost(selectedPost.id, caption)}
            onSave={() => handleSavePost(selectedPost)}
            getEmbedUrl={getEmbedUrl}
            allPosts={allPosts}
            initialIndex={allPosts.findIndex(p => p.id === selectedPost.id)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
        <ProfileHeader
          stats={stats}
          isOwner={isOwner}
          onSettingsClick={() => setShowSettings(true)}
          onSignOut={handleSignOut}
          onBack={() => router.back()}
        />

        <ProfileBanner
          profile={profile}
          isOwner={isOwner}
          uploadingPhoto={uploadingPhoto}
          uploadSuccess={uploadSuccess}
          showPhotoPopup={showPhotoPopup}
          onPhotoUpload={handlePhotoUpload}
          onClosePopup={() => setShowPhotoPopup(false)}
          onSettingsClick={() => setShowSettings(true)}
          onVoteClick={() => setShowVoteModal(true)}
          isVoteModalOpen={showVoteModal} // Add this line
        />

        <ProfileInfo
          profile={profile}
          isOwner={isOwner}
          isFollowing={isFollowing}
          followers={followers}
          following={following}
          stats={stats}
          onFollow={handleFollow}
          onMessage={() => {}}
        />

        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          postCount={allPosts.length}
          videoCount={allPosts.filter(p => p.type === 'video').length}
          savedCount={savedPosts.length}
          posts={displayPosts}
          isOwner={isOwner}
          onPostClick={setSelectedPost}
          onAddPhoto={() => setShowPostModal(true)}
          onAddVideo={() => setShowVideoModal(true)}
        />
      </div>
    </div>
  );
}
// /components/profile/ProfileTabs.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Grid, 
  Video, 
  Bookmark, 
  Plus, 
  Play,
  Image as ImageIcon 
} from 'lucide-react';

export default function ProfileTabs({ 
  activeTab, 
  onTabChange, 
  postCount, 
  videoCount, 
  savedCount, 
  posts, 
  isOwner, 
  onPostClick,
  onAddPhoto,
  onAddVideo
}) {
  // Filter posts based on active tab
  const getFilteredPosts = () => {
    if (activeTab === 'videos') {
      return posts.filter(post => post.type === 'video');
    }
    if (activeTab === 'saved') {
      return posts; // saved posts already filtered in parent
    }
    return posts; // 'posts' tab shows all posts (images + videos)
  };

  const filteredPosts = getFilteredPosts();
  const displayCount = activeTab === 'videos' ? videoCount : 
                       activeTab === 'saved' ? savedCount : 
                       postCount;

  return (
    <div className="px-4">
      {/* Tabs */}
      <div className="flex border-t border-white/10">
        <button
          onClick={() => onTabChange('posts')}
          className={`flex-1 py-2 md:py-3 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm transition-colors relative ${
            activeTab === 'posts' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Grid className="w-3 h-3 md:w-4 md:h-4" />
          <span>Posts ({postCount})</span>
          {activeTab === 'posts' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-burnt-orange-500 to-yellow-500"
            />
          )}
        </button>
        <button
          onClick={() => onTabChange('videos')}
          className={`flex-1 py-2 md:py-3 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm transition-colors relative ${
            activeTab === 'videos' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Video className="w-3 h-3 md:w-4 md:h-4" />
          <span>Videos ({videoCount})</span>
          {activeTab === 'videos' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-burnt-orange-500 to-yellow-500"
            />
          )}
        </button>
        <button
          onClick={() => onTabChange('saved')}
          className={`flex-1 py-2 md:py-3 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm transition-colors relative ${
            activeTab === 'saved' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Bookmark className="w-3 h-3 md:w-4 md:h-4" />
          <span>Saved ({savedCount})</span>
          {activeTab === 'saved' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-burnt-orange-500 to-yellow-500"
            />
          )}
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="py-4">
        {filteredPosts.length > 0 ? (
          <PostGrid posts={filteredPosts} onPostClick={onPostClick} />
        ) : (
          <EmptyState 
            activeTab={activeTab} 
            isOwner={isOwner} 
            onAddPhoto={onAddPhoto} 
            onAddVideo={onAddVideo} 
          />
        )}

        {/* Add Post Buttons for owners with existing posts */}
        {isOwner && filteredPosts.length > 0 && activeTab !== 'saved' && (
          <AddPostButtons onAddPhoto={onAddPhoto} onAddVideo={onAddVideo} />
        )}
      </div>
    </div>
  );
}

function PostGrid({ posts, onPostClick }) {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
          onClick={() => onPostClick(post)}
        >
          {post.type === 'image' ? (
            <Image
              src={post.media[0]?.url}
              alt={`Post ${index + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <VideoThumbnail post={post} />
          )}
          
          {/* Video indicator - only shows type, no likes/comments */}
          {post.type === 'video' && (
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5">
              <Play className="w-3 h-3 text-white" fill="white" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function VideoThumbnail({ post }) {
  const [imgError, setImgError] = useState(false);
  
  const getVideoId = (url) => {
    return url.split('youtu.be/')[1]?.split('?')[0] || 
           url.split('v=')[1]?.split('&')[0];
  };

  if (imgError) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center">
        <Play className="w-8 h-8 text-white/50" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-900/50 to-black">
      <Image
        src={`https://img.youtube.com/vi/${getVideoId(post.media[0]?.url)}/maxresdefault.jpg`}
        alt="Video thumbnail"
        fill
        sizes="(max-width: 768px) 33vw, 300px"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => setImgError(true)}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
    </div>
  );
}

function EmptyState({ activeTab, isOwner, onAddPhoto, onAddVideo }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
        {activeTab === 'posts' && <ImageIcon className="w-8 h-8 text-white/20" />}
        {activeTab === 'videos' && <Video className="w-8 h-8 text-white/20" />}
        {activeTab === 'saved' && <Bookmark className="w-8 h-8 text-white/20" />}
      </div>
      <p className="text-white/40 text-sm">
        {activeTab === 'posts' && 'No posts yet'}
        {activeTab === 'videos' && 'No videos yet'}
        {activeTab === 'saved' && 'No saved posts'}
      </p>
      {isOwner && activeTab !== 'saved' && (
        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={onAddPhoto}
            className="px-4 py-2 bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-3 h-3" />
            Add Photo
          </button>
          <button
            onClick={onAddVideo}
            className="px-4 py-2 bg-white/10 text-white rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <Video className="w-3 h-3" />
            Add Video
          </button>
        </div>
      )}
    </div>
  );
}

function AddPostButtons({ onAddPhoto, onAddVideo }) {
  return (
    <div className="flex justify-center gap-3 mt-6">
      <button
        onClick={onAddPhoto}
        className="px-4 py-2 bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
      >
        <Plus className="w-3 h-3" />
        Add Photo
      </button>
      <button
        onClick={onAddVideo}
        className="px-4 py-2 bg-white/10 text-white rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
      >
        <Video className="w-3 h-3" />
        Add Video
      </button>
    </div>
  );
}
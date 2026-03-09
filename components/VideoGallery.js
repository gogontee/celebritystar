// components/VideoGallery.js
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Play, Heart, MessageCircle, Share2, X, Clock, Eye, Grid3x3, Grid } from 'lucide-react';
import Image from 'next/image';

const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedVideos, setLikedVideos] = useState({});
  const [mobileView, setMobileView] = useState(false);
  const [gridView, setGridView] = useState(false);
  const videoRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Sample video data
  const videos = [
    {
      id: 1,
      thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: 'Grand Opening Ceremony',
      date: '2024-01-15',
      housemate: 'All Housemates',
      duration: '3:45',
      views: '125K',
      likes: 8.2,
      comments: 342,
      category: 'event',
    },
    {
      id: 2,
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-e9e3a028a4a3?w-800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      title: 'Pool Party Highlights',
      date: '2024-01-16',
      housemate: 'Sarah Miller',
      duration: '5:20',
      views: '89K',
      likes: 6.5,
      comments: 231,
      category: 'party',
    },
    {
      id: 3,
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Late Night Conversations',
      date: '2024-01-17',
      housemate: 'Michael Chen',
      duration: '12:30',
      views: '212K',
      likes: 15.2,
      comments: 856,
      category: 'daily',
    },
    {
      id: 4,
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      title: 'Epic Challenge Victory',
      date: '2024-01-18',
      housemate: 'Emma Wilson',
      duration: '8:15',
      views: '156K',
      likes: 12.8,
      comments: 478,
      category: 'task',
    },
    {
      id: 5,
      thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      title: 'Dramatic Confrontation',
      date: '2024-01-19',
      housemate: 'David Brown',
      duration: '6:40',
      views: '198K',
      likes: 9.2,
      comments: 592,
      category: 'drama',
    },
    {
      id: 6,
      thumbnail: 'https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      title: 'Celebrity Guest Entry',
      date: '2024-01-20',
      housemate: 'All Housemates',
      duration: '4:55',
      views: '267K',
      likes: 18.6,
      comments: 1024,
      category: 'event',
    },
    {
      id: 7,
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-e9e3a028a4a3?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      title: 'Kitchen Fun Moments',
      date: '2024-01-21',
      housemate: 'Lisa Taylor',
      duration: '7:30',
      views: '134K',
      likes: 7.8,
      comments: 345,
      category: 'daily',
    },
    {
      id: 8,
      thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      title: 'Nomination Special',
      date: '2024-01-22',
      housemate: 'James Wilson',
      duration: '15:20',
      views: '189K',
      likes: 13.4,
      comments: 667,
      category: 'nomination',
    },
  ];

  // Filter videos based on search only (removed date and housemate filters)
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.housemate.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikedVideos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShare = (url, title, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Watch this video from Celebrity Star Africa: ${title}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const formatLikes = (likes) => {
    return likes >= 1 ? `${likes}K` : `${likes * 1000}`;
  };

  // Determine grid columns based on view mode
  const gridColumnsClass = mobileView && gridView 
    ? 'grid-cols-2' 
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-4">
      {/* Header with Search and Mobile Grid Toggle */}
      <div className="container mx-auto px-4 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Search Bar - Compact on mobile, larger on desktop */}
            <div className="flex-1">
              <div className="relative">
                {/* Background glow - lemonish color, reduced on mobile */}
                <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-yellow-300 rounded-lg blur opacity-10 md:opacity-20"></div>
                
                {/* Search input container */}
                <div className="relative flex items-center bg-black/80 backdrop-blur-sm rounded-lg border border-lime-400/30">
                  {/* Mobile: smaller icon and padding */}
                  <div className="md:hidden">
                    <Search className="w-3.5 h-3.5 text-gray-400 ml-2.5" />
                  </div>
                  {/* Desktop: regular icon */}
                  <div className="hidden md:block">
                    <Search className="w-4 h-4 text-gray-400 ml-3" />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search videos..."
                    className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-white placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      {/* Mobile: smaller close icon */}
                      <div className="md:hidden">
                        <X className="w-2.5 h-2.5 text-gray-400" />
                      </div>
                      {/* Desktop: regular close icon */}
                      <div className="hidden md:block">
                        <X className="w-3 h-3 text-gray-400" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Grid Toggle - Only visible on mobile, small size */}
            {mobileView && (
              <button
                onClick={() => setGridView(!gridView)}
                className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-300 ${
                  gridView 
                    ? 'bg-gradient-to-r from-lime-400 to-yellow-300 text-black border-lime-400/50' 
                    : 'bg-black/40 backdrop-blur-sm border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
                aria-label={gridView ? "Switch to default view" : "Switch to grid view"}
              >
                {/* Small icons for mobile */}
                {gridView ? (
                  <Grid3x3 className="w-4 h-4" />
                ) : (
                  <Grid className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="container mx-auto px-4 pb-20">
        {filteredVideos.length > 0 ? (
          <div className={`grid ${gridColumnsClass} gap-4`}>
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-lime-400/50 transition-all duration-500 hover:-translate-y-0.5 cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Video Thumbnail Container */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Play Button - Lemonish color */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-lime-400 to-yellow-300 flex items-center justify-center transform scale-100 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-xs">
                    {video.duration}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => handleLike(video.id, e)}
                      className="p-1.5 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
                    >
                      <Heart 
                        className={`w-3 h-3 ${likedVideos[video.id] ? 'fill-red-500 text-red-500' : 'text-white'}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm line-clamp-1">{video.title}</h3>
                    {/* Lemonish category badge */}
                    <span className="px-1.5 py-0.5 bg-lime-400/20 text-lime-300 text-xs rounded-full">
                      {video.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-400 mb-2">
                    <span className="truncate">{video.housemate}</span>
                    <span className="mx-1">•</span>
                    <span>{new Date(video.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">{video.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">{formatLikes(video.likes)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">{video.comments}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleShare(video.videoUrl, video.title, e)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Share2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🎥</div>
            <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
            <p className="text-gray-400">Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 z-10 p-1.5 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            <div className="p-2">
              {/* Video Player */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              </div>
              
              {/* Video Details */}
              <div className="p-4">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                    <div className="flex items-center text-gray-400">
                      <span>{new Date(selectedVideo.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span>{selectedVideo.housemate}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{selectedVideo.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{selectedVideo.views} views</span>
                    </div>
                  </div>
                  {/* Lemonish category badge */}
                  <span className="inline-block px-2 py-0.5 bg-lime-400/20 text-lime-300 rounded-full text-xs">
                    {selectedVideo.category}
                  </span>
                </div>
                
                {/* Stats and Actions */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => handleLike(selectedVideo.id, e)}
                        className="flex items-center space-x-1.5 hover:text-red-500 transition-colors text-sm"
                      >
                        <Heart 
                          className={`w-4 h-4 ${likedVideos[selectedVideo.id] ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                        <span>{formatLikes(selectedVideo.likes + (likedVideos[selectedVideo.id] ? 0.001 : 0))}</span>
                      </button>
                      <div className="flex items-center space-x-1.5 text-sm">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <span>{selectedVideo.comments}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleShare(selectedVideo.videoUrl, selectedVideo.title, e)}
                        className="px-3 py-1.5 bg-gradient-to-r from-lime-500 to-yellow-400 hover:from-lime-400 hover:to-yellow-300 text-black rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 flex items-center space-x-1.5 text-sm"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
// components/ImageGallery.js
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Heart, MessageCircle, Share2, Download, X, Grid3x3, Grid } from 'lucide-react';
import Image from 'next/image';

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedImages, setLikedImages] = useState({});
  const [mobileView, setMobileView] = useState(false);
  const [gridView, setGridView] = useState(false);

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

  // Sample gallery images data
  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
      title: 'Grand Opening Night',
      date: '2024-01-15',
      housemate: 'Alex Johnson',
      likes: 245,
      comments: 42,
      category: 'event',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1492684223066-e9e3a028a4a3?w-800&auto=format&fit=crop',
      title: 'Pool Party Moments',
      date: '2024-01-16',
      housemate: 'Sarah Miller',
      likes: 189,
      comments: 31,
      category: 'party',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
      title: 'Late Night Conversations',
      date: '2024-01-17',
      housemate: 'Michael Chen',
      likes: 312,
      comments: 56,
      category: 'daily',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop',
      title: 'Task Challenge Victory',
      date: '2024-01-18',
      housemate: 'Emma Wilson',
      likes: 421,
      comments: 78,
      category: 'task',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop',
      title: 'Drama Unfolds',
      date: '2024-01-19',
      housemate: 'David Brown',
      likes: 198,
      comments: 92,
      category: 'drama',
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?w=800&auto=format&fit=crop',
      title: 'Special Guest Appearance',
      date: '2024-01-20',
      housemate: 'All',
      likes: 567,
      comments: 124,
      category: 'event',
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1492684223066-e9e3a028a4a3?w=800&auto=format&fit=crop',
      title: 'Kitchen Fun',
      date: '2024-01-21',
      housemate: 'Lisa Taylor',
      likes: 234,
      comments: 45,
      category: 'daily',
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop',
      title: 'Nomination Special',
      date: '2024-01-22',
      housemate: 'James Wilson',
      likes: 389,
      comments: 67,
      category: 'nomination',
    },
  ];

  // Filter images based on search
  const filteredImages = galleryImages.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.housemate.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikedImages(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDownload = (url, title, e) => {
    e.stopPropagation();
    alert(`Downloading: ${title}`);
  };

  const handleShare = (url, title, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this image from Celebrity Star Africa: ${title}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
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
                {/* Background glow - reduced on mobile */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-lg blur opacity-10 md:opacity-20"></div>
                
                {/* Search input container */}
                <div className="relative flex items-center bg-black/80 backdrop-blur-sm rounded-lg border border-orange-500/30">
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
                    placeholder="Search images..."
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
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-orange-500/50' 
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

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 pb-20">
        {filteredImages.length > 0 ? (
          <div className={`grid ${gridColumnsClass} gap-4`}>
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-0.5 cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => handleLike(image.id, e)}
                      className="p-1.5 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
                    >
                      <Heart 
                        className={`w-3 h-3 ${likedImages[image.id] ? 'fill-red-500 text-red-500' : 'text-white'}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm line-clamp-1">{image.title}</h3>
                    <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      {image.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-400 mb-2">
                    <span className="truncate">{image.housemate}</span>
                    <span className="mx-1">•</span>
                    <span>{new Date(image.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">{image.likes + (likedImages[image.id] ? 1 : 0)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">{image.comments}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => handleDownload(image.url, image.title, e)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Download className="w-3 h-3 text-gray-400" />
                      </button>
                      <button
                        onClick={(e) => handleShare(image.url, image.title, e)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Share2 className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📷</div>
            <h3 className="text-xl font-semibold mb-2">No Images Found</h3>
            <p className="text-gray-400">Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 z-10 p-1.5 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            <div className="grid md:grid-cols-2 h-full">
              {/* Image Side */}
              <div className="relative h-64 md:h-auto">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              
              {/* Details Side */}
              <div className="p-4 md:p-6 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
                  <div className="flex items-center text-gray-400 mb-3 text-sm">
                    <span>{new Date(selectedImage.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                    <span className="mx-2">•</span>
                    <span>{selectedImage.housemate}</span>
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                    {selectedImage.category}
                  </span>
                </div>
                
                <div className="flex-1">
                  <p className="text-gray-300 mb-4 text-sm">
                    This image captures a special moment from the Celebrity Star Africa house. 
                    The housemates are seen engaging in {selectedImage.category.toLowerCase()} activities, 
                    creating memorable experiences for viewers.
                  </p>
                </div>
                
                {/* Stats and Actions */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => handleLike(selectedImage.id, e)}
                        className="flex items-center space-x-1.5 hover:text-red-500 transition-colors text-sm"
                      >
                        <Heart 
                          className={`w-4 h-4 ${likedImages[selectedImage.id] ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                        <span>{selectedImage.likes + (likedImages[selectedImage.id] ? 1 : 0)}</span>
                      </button>
                      <div className="flex items-center space-x-1.5 text-sm">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <span>{selectedImage.comments}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleDownload(selectedImage.url, selectedImage.title, e)}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 flex items-center space-x-1.5 text-sm"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={(e) => handleShare(selectedImage.url, selectedImage.title, e)}
                        className="px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 flex items-center space-x-1.5 text-sm"
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

export default ImageGallery;
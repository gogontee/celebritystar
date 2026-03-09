// components/admin/CelebMedia.js
'use client';

import { useState, useEffect } from 'react';
import { 
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  Video,
  Youtube,
  Loader,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';

export default function CelebMedia() {
  const [celebData, setCelebData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeSection, setActiveSection] = useState('carousel');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({});
  const [addType, setAddType] = useState('');

  // State for each column
  const [carousel, setCarousel] = useState([]);
  const [tvVideos, setTvVideos] = useState([]);
  const [celebGallery, setCelebGallery] = useState([]);
  const [videos, setVideos] = useState([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Fetch celeb data
  useEffect(() => {
    fetchCelebData();
  }, []);

  const fetchCelebData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('celeb_star')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;

      setCelebData(data);
      
      // Initialize state with data or empty arrays
      setCarousel(data?.carousel || []);
      setTvVideos(data?.tv || []);
      setCelebGallery(data?.celeb_gallery || []);
      setVideos(data?.video || []);
      
    } catch (error) {
      console.error('Error fetching celeb data:', error);
      alert('Failed to load celeb media data');
    } finally {
      setLoading(false);
    }
  };

  // Generic save function
  const saveChanges = async (columnName, newData) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('celeb_star')
        .update({ [columnName]: newData })
        .eq('id', 1);

      if (error) throw error;
      
      // Update local state
      if (columnName === 'carousel') setCarousel(newData);
      if (columnName === 'tv') setTvVideos(newData);
      if (columnName === 'celeb_gallery') setCelebGallery(newData);
      if (columnName === 'video') setVideos(newData);
      
    } catch (error) {
      console.error(`Error saving ${columnName}:`, error);
      alert(`Failed to save ${columnName} changes`);
    } finally {
      setUpdating(false);
    }
  };

  // Generate unique ID
  const generateId = () => {
    return `post_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  };

  // Extract YouTube video ID and create embed URL
  const processYouTubeUrl = (url) => {
    let videoId = '';
    
    // youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get('v');
    }
    // youtu.be/VIDEO_ID
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    // youtube.com/embed/VIDEO_ID
    else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0];
    }
    
    if (videoId) {
      return {
        url: url,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        provider: 'youtube'
      };
    }
    return null;
  };

  // --- CAROUSEL HANDLERS ---
  const handleAddCarouselImage = (imageUrl) => {
    if (!imageUrl.trim()) return;
    
    const newImage = { url: imageUrl.trim() };
    const updatedCarousel = [...carousel, newImage];
    saveChanges('carousel', updatedCarousel);
    setShowAddModal(false);
    setAddForm({});
  };

  const handleUpdateCarouselImage = (index, newUrl) => {
    const updatedCarousel = carousel.map((item, i) => 
      i === index ? { url: newUrl } : item
    );
    saveChanges('carousel', updatedCarousel);
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteCarouselImage = (index) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      const updatedCarousel = carousel.filter((_, i) => i !== index);
      saveChanges('carousel', updatedCarousel);
    }
  };

  // --- TV HANDLERS ---
  const handleAddTvVideo = (videoUrl) => {
    if (!videoUrl.trim()) return;
    
    const newVideo = { url: videoUrl.trim() };
    const updatedTvVideos = [...tvVideos, newVideo];
    saveChanges('tv', updatedTvVideos);
    setShowAddModal(false);
    setAddForm({});
  };

  const handleUpdateTvVideo = (index, newUrl) => {
    const updatedTvVideos = tvVideos.map((item, i) => 
      i === index ? { url: newUrl } : item
    );
    saveChanges('tv', updatedTvVideos);
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteTvVideo = (index) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      const updatedTvVideos = tvVideos.filter((_, i) => i !== index);
      saveChanges('tv', updatedTvVideos);
    }
  };

  // --- GALLERY HANDLERS ---
  const handleAddGalleryImage = (imageData) => {
    if (!imageData.url?.trim()) return;
    
    const newItem = {
      id: generateId(),
      type: 'image',
      media: [{ url: imageData.url.trim() }],
      caption: imageData.caption || '',
      created_at: new Date().toISOString()
    };
    
    const updatedGallery = [...celebGallery, newItem];
    saveChanges('celeb_gallery', updatedGallery);
    setShowAddModal(false);
    setAddForm({});
  };

  const handleUpdateGalleryImage = (itemId, updates) => {
    const updatedGallery = celebGallery.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    saveChanges('celeb_gallery', updatedGallery);
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteGalleryImage = (itemId) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      const updatedGallery = celebGallery.filter(item => item.id !== itemId);
      saveChanges('celeb_gallery', updatedGallery);
    }
  };

  // --- VIDEO HANDLERS (YouTube) ---
  const handleAddVideo = (videoData) => {
    if (!videoData.url?.trim()) return;
    
    const processedVideo = processYouTubeUrl(videoData.url.trim());
    if (!processedVideo) {
      alert('Invalid YouTube URL. Please enter a valid YouTube link.');
      return;
    }
    
    const newItem = {
      id: generateId(),
      type: 'video',
      media: [{
        url: videoData.url.trim(),
        embedUrl: processedVideo.embedUrl,
        provider: 'youtube'
      }],
      caption: videoData.caption || '',
      created_at: new Date().toISOString()
    };
    
    const updatedVideos = [...videos, newItem];
    saveChanges('video', updatedVideos);
    setShowAddModal(false);
    setAddForm({});
  };

  const handleUpdateVideo = (itemId, updates) => {
    let processedUpdates = { ...updates };
    
    // If URL is being updated, reprocess it
    if (updates.url) {
      const processed = processYouTubeUrl(updates.url);
      if (processed) {
        processedUpdates.media = [{
          url: updates.url,
          embedUrl: processed.embedUrl,
          provider: 'youtube'
        }];
      } else {
        alert('Invalid YouTube URL');
        return;
      }
    }
    
    const updatedVideos = videos.map(item => 
      item.id === itemId ? { ...item, ...processedUpdates } : item
    );
    saveChanges('video', updatedVideos);
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteVideo = (itemId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      const updatedVideos = videos.filter(item => item.id !== itemId);
      saveChanges('video', updatedVideos);
    }
  };

  // Sections configuration with mobile-friendly labels
  const sections = [
    { id: 'carousel', label: 'Carousel', icon: ImageIcon, count: carousel.length },
    { id: 'tv', label: 'TV', icon: Video, count: tvVideos.length },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, count: celebGallery.length },
    { id: 'videos', label: 'YouTube', icon: Youtube, count: videos.length }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-burnt-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-burnt-orange-400" />
          Celebrity Star Media
        </h2>
        <p className="text-[10px] sm:text-xs text-white/40 mt-1">
          Manage carousel, TV, gallery & YouTube content
        </p>
      </div>

      {/* Mobile-Optimized Section Tabs - All in one row with smaller sizing */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <section.icon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">{section.label}</span>
            <span className="text-[8px] sm:text-xs bg-white/20 px-1 py-0.5 rounded-full ml-0.5">
              {section.count}
            </span>
          </button>
        ))}
      </div>

      {/* Add Button - Compact on mobile */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setAddType(activeSection);
            setShowAddModal(true);
            setAddForm({});
          }}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Add</span>
          <span className="xs:hidden">+</span>
        </button>
      </div>

      {/* Content Display - with responsive grid */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4">
        {activeSection === 'carousel' && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-white/80">Carousel Images</h3>
            {carousel.length === 0 ? (
              <p className="text-center text-white/40 py-6 sm:py-8 text-xs sm:text-sm">No carousel images</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                {carousel.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative group bg-white/5 rounded-lg overflow-hidden border border-white/10 aspect-video"
                  >
                    {editingId === `carousel-${index}` ? (
                      <div className="p-2 space-y-2">
                        <input
                          type="text"
                          value={editForm.url || item.url}
                          onChange={(e) => setEditForm({ url: e.target.value })}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-[10px] text-white"
                          placeholder="Image URL"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleUpdateCarouselImage(index, editForm.url)}
                            className="flex-1 py-1 bg-green-500/20 text-green-400 rounded text-[10px] font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 py-1 bg-red-500/20 text-red-400 rounded text-[10px] font-medium"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={item.url}
                          alt={`Carousel ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingId(`carousel-${index}`);
                              setEditForm({ url: item.url });
                            }}
                            className="p-1 bg-blue-500/20 rounded-lg hover:bg-blue-500/30"
                          >
                            <Edit className="w-3 h-3 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteCarouselImage(index)}
                            className="p-1 bg-red-500/20 rounded-lg hover:bg-red-500/30"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-white/20 rounded-lg hover:bg-white/30"
                          >
                            <ExternalLink className="w-3 h-3 text-white" />
                          </a>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'tv' && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-white/80">TV Videos</h3>
            {tvVideos.length === 0 ? (
              <p className="text-center text-white/40 py-6 sm:py-8 text-xs sm:text-sm">No TV videos</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {tvVideos.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative group bg-white/5 rounded-lg overflow-hidden border border-white/10"
                  >
                    {editingId === `tv-${index}` ? (
                      <div className="p-2 space-y-2">
                        <input
                          type="text"
                          value={editForm.url || item.url}
                          onChange={(e) => setEditForm({ url: e.target.value })}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white"
                          placeholder="Video URL"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleUpdateTvVideo(index, editForm.url)}
                            className="flex-1 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <video
                          src={item.url}
                          className="w-full aspect-video object-cover"
                          controls
                        />
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(`tv-${index}`);
                              setEditForm({ url: item.url });
                            }}
                            className="p-1 bg-blue-500/20 rounded-lg hover:bg-blue-500/30"
                          >
                            <Edit className="w-3 h-3 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteTvVideo(index)}
                            className="p-1 bg-red-500/20 rounded-lg hover:bg-red-500/30"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'gallery' && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-white/80">Celeb Gallery</h3>
            {celebGallery.length === 0 ? (
              <p className="text-center text-white/40 py-6 sm:py-8 text-xs sm:text-sm">No gallery items</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {celebGallery.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative group bg-white/5 rounded-lg overflow-hidden border border-white/10"
                  >
                    {editingId === item.id ? (
                      <div className="p-2 space-y-2">
                        <input
                          type="text"
                          value={editForm.caption || item.caption}
                          onChange={(e) => setEditForm({ caption: e.target.value })}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-[10px] text-white"
                          placeholder="Caption"
                        />
                        <input
                          type="text"
                          value={editForm.url || item.media[0]?.url || ''}
                          onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-[10px] text-white"
                          placeholder="Image URL"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              const updates = {};
                              if (editForm.caption !== undefined) updates.caption = editForm.caption;
                              if (editForm.url) {
                                updates.media = [{ url: editForm.url }];
                              }
                              handleUpdateGalleryImage(item.id, updates);
                            }}
                            className="flex-1 py-1 bg-green-500/20 text-green-400 rounded text-[10px] font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 py-1 bg-red-500/20 text-red-400 rounded text-[10px] font-medium"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="aspect-square relative">
                          <Image
                            src={item.media[0]?.url || ''}
                            alt={item.caption || 'Gallery image'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-1">
                          <p className="text-[10px] text-white/80 truncate">{item.caption || 'No caption'}</p>
                          <p className="text-[8px] text-white/40">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditForm({ caption: item.caption, url: item.media[0]?.url });
                            }}
                            className="p-1 bg-blue-500/20 rounded-lg hover:bg-blue-500/30"
                          >
                            <Edit className="w-3 h-3 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteGalleryImage(item.id)}
                            className="p-1 bg-red-500/20 rounded-lg hover:bg-red-500/30"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'videos' && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-white/80">YouTube Videos</h3>
            {videos.length === 0 ? (
              <p className="text-center text-white/40 py-6 sm:py-8 text-xs sm:text-sm">No YouTube videos</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {videos.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative group bg-white/5 rounded-lg overflow-hidden border border-white/10"
                  >
                    {editingId === item.id ? (
                      <div className="p-2 space-y-2">
                        <input
                          type="text"
                          value={editForm.caption || item.caption}
                          onChange={(e) => setEditForm({ caption: e.target.value })}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white"
                          placeholder="Caption"
                        />
                        <input
                          type="text"
                          value={editForm.url || item.media[0]?.url || ''}
                          onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                          className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white"
                          placeholder="YouTube URL"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              if (editForm.url && editForm.url !== item.media[0]?.url) {
                                handleUpdateVideo(item.id, { url: editForm.url, caption: editForm.caption });
                              } else {
                                handleUpdateVideo(item.id, { caption: editForm.caption });
                              }
                            }}
                            className="flex-1 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="aspect-video">
                          <iframe
                            src={item.media[0]?.embedUrl}
                            title={item.caption || 'YouTube video'}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-xs text-white/80 truncate">{item.caption || 'No caption'}</p>
                          <p className="text-[10px] text-white/40">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditForm({ 
                                caption: item.caption, 
                                url: item.media[0]?.url 
                              });
                            }}
                            className="p-1.5 bg-blue-500/20 rounded-lg hover:bg-blue-500/30"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(item.id)}
                            className="p-1.5 bg-red-500/20 rounded-lg hover:bg-red-500/30"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal - Mobile Optimized */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-gray-900 to-black rounded-xl border border-white/10 p-4 sm:p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
                Add New {addType === 'carousel' ? 'Image' : 
                        addType === 'tv' ? 'Video' :
                        addType === 'gallery' ? 'Gallery Item' : 'YouTube Video'}
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {addType === 'carousel' && (
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Image URL *</label>
                    <input
                      type="text"
                      value={addForm.url || ''}
                      onChange={(e) => setAddForm({ url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                    />
                  </div>
                )}

                {addType === 'tv' && (
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Video URL *</label>
                    <input
                      type="text"
                      value={addForm.url || ''}
                      onChange={(e) => setAddForm({ url: e.target.value })}
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                    />
                  </div>
                )}

                {addType === 'gallery' && (
                  <>
                    <div>
                      <label className="block text-xs text-white/60 mb-1">Image URL *</label>
                      <input
                        type="text"
                        value={addForm.url || ''}
                        onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/60 mb-1">Caption (optional)</label>
                      <input
                        type="text"
                        value={addForm.caption || ''}
                        onChange={(e) => setAddForm({ ...addForm, caption: e.target.value })}
                        placeholder="Enter caption"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                      />
                    </div>
                  </>
                )}

                {addType === 'videos' && (
                  <>
                    <div>
                      <label className="block text-xs text-white/60 mb-1">YouTube URL *</label>
                      <input
                        type="text"
                        value={addForm.url || ''}
                        onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
                        placeholder="https://youtu.be/... or https://youtube.com/watch?v=..."
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/60 mb-1">Caption (optional)</label>
                      <input
                        type="text"
                        value={addForm.caption || ''}
                        onChange={(e) => setAddForm({ ...addForm, caption: e.target.value })}
                        placeholder="Enter caption"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => {
                      if (addType === 'carousel') handleAddCarouselImage(addForm.url);
                      if (addType === 'tv') handleAddTvVideo(addForm.url);
                      if (addType === 'gallery') handleAddGalleryImage(addForm);
                      if (addType === 'videos') handleAddVideo(addForm);
                    }}
                    disabled={updating || !addForm.url}
                    className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {updating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Adding...
                      </span>
                    ) : (
                      'Add'
                    )}
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Updating Indicator */}
      <AnimatePresence>
        {updating && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500/90 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg flex items-center gap-1.5 sm:gap-2 z-50"
          >
            <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            <span className="text-xs sm:text-sm">Saving...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
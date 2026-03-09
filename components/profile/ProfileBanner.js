// /components/profile/ProfileBanner.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, User, Loader, Check, X, AlertCircle, Heart, MessageCircle, Edit3 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function ProfileBanner({ 
  profile, 
  isOwner, 
  uploadingPhoto, 
  uploadSuccess,
  showPhotoPopup,
  onPhotoUpload,
  onClosePopup,
  onSettingsClick,
  onVoteClick,
  isVoteModalOpen,
  onUpdateProfile
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [whatsAppSent, setWhatsAppSent] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Debug logging
  useEffect(() => {
    console.log('ProfileBanner mounted');
    console.log('isOwner:', isOwner);
    console.log('profile exists:', !!profile);
  }, [isOwner, profile]);

  // Check if WhatsApp popup should be shown (only for profile owner)
  useEffect(() => {
    if (profile && isOwner) {
      // Show popup if whatsapp_sent is false or doesn't exist
      const shouldShow = profile.whatsapp_sent === false || profile.whatsapp_sent === null || profile.whatsapp_sent === undefined;
      setShowWhatsAppPopup(shouldShow);
      setWhatsAppSent(profile.whatsapp_sent === true);
    } else {
      // Hide popup if not owner
      setShowWhatsAppPopup(false);
    }
  }, [profile, isOwner]);

  // If profile doesn't exist, don't render anything
  if (!profile) {
    console.log('ProfileBanner: no profile data');
    return null;
  }

  const handleWhatsAppClick = async () => {
    if (whatsAppSent) return;
    
    setSendingWhatsApp(true);
    
    // Prepare WhatsApp message with profile information including avatar URL
    const avatarInfo = profile.avatar_url ? `\n\nProfile Photo: ${profile.avatar_url}` : '';
    
    const message = encodeURIComponent(
      `Hello team, I am ${profile.full_name} and my CS username is ${profile.username}. I have just signed up to contest. Kindly walk me through how I could be selected into the next stage of the show.${avatarInfo}`
    );
    
    // WhatsApp URL
    const whatsappUrl = `https://wa.me/2349161888244?text=${message}`;
    
    try {
      // Update profile to mark whatsapp_sent as true
      const { error } = await supabase
        .from('profiles')
        .update({ 
          whatsapp_sent: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      // Update local state
      setWhatsAppSent(true);
      setShowWhatsAppPopup(false);
      
      // Refresh profile data if callback provided
      if (onUpdateProfile) {
        onUpdateProfile();
      }
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
    } catch (error) {
      console.error('Error updating whatsapp_sent status:', error);
      // Still open WhatsApp even if update fails
      window.open(whatsappUrl, '_blank');
    } finally {
      setSendingWhatsApp(false);
    }
  };

  const handleCloseWhatsAppPopup = () => {
    setShowWhatsAppPopup(false);
  };

  return (
    <div className="relative h-48 md:h-64 rounded-2xl mb-0 md:mb-0">
      {/* Banner Image Container */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <Image
          src={profile.banner_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200'}
          alt="Profile banner"
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>
      
      {/* Edit Banner Button (Owner only) - Shows only if user is profile owner */}
      {isOwner && (
        <button 
          onClick={onSettingsClick}
          className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors z-50 flex items-center gap-1"
        >
          <Edit3 className="w-4 h-4 text-white" />
          <span className="text-xs text-white hidden md:inline">Edit Banner</span>
        </button>
      )}

      {/* WhatsApp Popup - Strategic Boost Message - Centered on screen */}
      <AnimatePresence>
        {isOwner && showWhatsAppPopup && !whatsAppSent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseWhatsAppPopup}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-2xl p-6 border-2 border-white/20 max-w-md w-full"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                    Boost Your Chance! 🚀
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    Get personalized guidance on how to increase your chances of being selected for the next stage of the show!
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleWhatsAppClick}
                      disabled={sendingWhatsApp}
                      className="flex-1 px-4 py-2.5 bg-white text-green-600 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sendingWhatsApp ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4" />
                          <span>Contact Team</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCloseWhatsAppPopup}
                      className="px-4 py-2.5 bg-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors"
                    >
                      Later
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleCloseWhatsAppPopup}
                  className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vote Button - Shows for EVERYONE including owner - CONDITIONAL Z-INDEX */}
      <div className={`absolute bottom-2 right-6 ${isVoteModalOpen ? 'z-0' : 'z-[200]'}`}>
        <motion.button
          onClick={onVoteClick}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative group block scale-[0.68] origin-bottom-right hover:scale-[0.73] transition-transform duration-200"
          whileTap={{ scale: 0.65 }}
          disabled={isVoteModalOpen}
        >
          {/* Shockwave Effects */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-burnt-orange-500 to-yellow-500"
            animate={!isHovered && !isVoteModalOpen ? {
              scale: [1, 1.3, 1.5, 1.3, 1],
              opacity: [0.6, 0.4, 0.2, 0.1, 0],
            } : {
              scale: 1,
              opacity: 0
            }}
            transition={!isHovered && !isVoteModalOpen ? {
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut"
            } : {
              duration: 0.2
            }}
            style={{ borderRadius: '9999px' }}
          />
          
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-burnt-orange-400 to-yellow-400"
            animate={!isHovered && !isVoteModalOpen ? {
              scale: [1, 1.2, 1.4, 1.2, 1],
              opacity: [0.4, 0.3, 0.15, 0.05, 0],
            } : {
              scale: 1,
              opacity: 0
            }}
            transition={!isHovered && !isVoteModalOpen ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.2
            } : {
              duration: 0.2
            }}
            style={{ borderRadius: '9999px' }}
          />

          {/* Button Content */}
          <div className={`relative flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-burnt-orange-600 to-yellow-600 rounded-full text-white font-bold shadow-lg group-hover:shadow-xl transition-all border border-white/30 ${isVoteModalOpen ? 'opacity-50' : ''}`}>
            <Heart className="w-5 h-5 md:w-6 md:h-6 fill-current drop-shadow" />
            <span className="text-base md:text-lg tracking-wide drop-shadow">VOTE</span>
          </div>
        </motion.button>
      </div>

      {/* Profile Picture - Flush with banner */}
      <div className="absolute -bottom-1 left-4 md:-bottom-2 md:left-6 z-40">
        <div className="relative">
          {/* Burnt lemon outline - thinner */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 p-1">
            <div className="w-full h-full rounded-full bg-black"></div>
          </div>
          
          {/* Profile image container */}
          <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-black overflow-hidden bg-gradient-to-br from-burnt-orange-500 to-yellow-500">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                fill
                sizes="(max-width: 768px) 80px, 112px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burnt-orange-500 to-yellow-500">
                <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
            )}
            
            {/* Upload overlay */}
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader className="w-4 h-4 text-white animate-spin" />
              </div>
            )}
          </div>
          
          {/* Edit Photo Button - Only shows if user is profile owner */}
          {isOwner && !uploadingPhoto && (
            <label className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-burnt-orange-500 rounded-full flex items-center justify-center hover:bg-burnt-orange-600 transition-colors shadow-lg border-2 border-black z-50 cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoUpload}
                className="hidden"
              />
              <Camera className="w-3 h-3 md:w-4 md:h-4 text-white group-hover:scale-110 transition-transform" />
            </label>
          )}
          
          {/* Success checkmark */}
          {uploadSuccess && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-black z-50"
            >
              <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Photo Upload Popup - Only shows for owner */}
      <AnimatePresence>
        {showPhotoPopup && isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-24 md:left-32 bottom-2 z-[250]"
          >
            <div className="relative bg-gradient-to-r from-burnt-orange-600 to-yellow-500 rounded-xl shadow-2xl p-3 max-w-xs">
              <div className="absolute -left-2 top-6 w-4 h-4 bg-burnt-orange-600 rotate-45 transform origin-center"></div>
              
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-xs mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Complete Your Profile
                  </h3>
                  <p className="text-white/90 text-[10px] mb-2">
                    Add a profile photo to help others recognize you!
                  </p>
                  <div className="flex gap-2">
                    <label className="px-2 py-1 bg-white text-burnt-orange-600 rounded-lg text-[10px] font-semibold hover:bg-white/90 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onPhotoUpload}
                        className="hidden"
                      />
                      Upload
                    </label>
                    <button
                      onClick={onClosePopup}
                      className="px-2 py-1 bg-white/20 text-white rounded-lg text-[10px] font-semibold hover:bg-white/30 transition-colors"
                    >
                      Later
                    </button>
                  </div>
                </div>
                <button
                  onClick={onClosePopup}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
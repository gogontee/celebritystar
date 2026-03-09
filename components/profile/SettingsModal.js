// /components/profile/SettingsModal.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  User, 
  Globe, 
  Camera, 
  Save, 
  Loader,
  Check
} from 'lucide-react';

export default function SettingsModal({ profile, isOpen, onClose, onUpdate, supabase }) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    bio: profile.bio || '',
    location: profile.location || '',
    website: profile.website || '',
    birth_date: profile.birth_date || '',
    phone: profile.phone || '',
    instagram: profile.instagram || '',
    tiktok: profile.tiktok || '',
    twitter: profile.twitter || '',
    facebook: profile.facebook || '',
    youtube: profile.youtube || '',
    email_notifications: profile.email_notifications !== false,
    push_notifications: profile.push_notifications !== false,
    content_visibility: profile.content_visibility || 'public'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(profile.avatar_url || null);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
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
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onUpdate();
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          birth_date: formData.birth_date,
          phone: formData.phone,
          instagram: formData.instagram,
          tiktok: formData.tiktok,
          twitter: formData.twitter,
          facebook: formData.facebook,
          youtube: formData.youtube,
          email_notifications: formData.email_notifications,
          push_notifications: formData.push_notifications,
          content_visibility: formData.content_visibility,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-white/10 shadow-2xl relative z-[1001]"
          >
            <div className="sticky top-0 bg-black/50 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-burnt-orange-500" />
                Edit Profile
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {success && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-green-400 text-sm">
                  Profile updated successfully!
                </div>
              )}

              {/* Profile Photo Upload Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-burnt-orange-500" />
                  Profile Photo
                </h3>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-burnt-orange-500 to-yellow-500 border-2 border-white/20">
                      {photoPreview ? (
                        <Image
                          src={photoPreview}
                          alt="Profile preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <Loader className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      Upload New Photo
                    </label>
                    <p className="text-xs text-white/40 mt-1">
                      Recommended: Square image, at least 400x400px
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <User className="w-4 h-4 text-burnt-orange-500" />
                  Basic Information
                </h3>
                
                <div>
                  <label className="block text-xs text-white/40 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1">Birth Date</label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-burnt-orange-500" />
                  Social Links
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1">Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">TikTok</label>
                    <input
                      type="text"
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">Facebook</label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">YouTube</label>
                    <input
                      type="text"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                      placeholder="channel"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">Twitter/X</label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-burnt-orange-500" />
                  Preferences
                </h3>

                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="email_notifications"
                      checked={formData.email_notifications}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-burnt-orange-500 focus:ring-burnt-orange-500"
                    />
                    <span className="text-sm text-white/80">Email Notifications</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="push_notifications"
                      checked={formData.push_notifications}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-burnt-orange-500 focus:ring-burnt-orange-500"
                    />
                    <span className="text-sm text-white/80">Push Notifications</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-2">Content Visibility</label>
                  <select
                    name="content_visibility"
                    value={formData.content_visibility}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
                  >
                    <option value="public">Public</option>
                    <option value="followers_only">Followers Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
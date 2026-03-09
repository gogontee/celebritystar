// /components/profile/VideoModal.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Video } from 'lucide-react';

export default function VideoModal({ onClose, onAdd }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) return;
    setAdding(true);
    await onAdd(videoUrl, caption);
    setAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-white/10"
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-burnt-orange-500" />
            Add Video
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-2">YouTube URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtu.be/..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
              required
            />
            <p className="text-[10px] text-white/30 mt-1">
              Supported: YouTube links (youtu.be or youtube.com)
            </p>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-2">Caption (Optional)</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows="3"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={adding || !videoUrl}
            className="w-full py-3 bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Add Video'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
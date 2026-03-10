// app/about/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, Twitter, Facebook, Youtube, 
  Send, Mail, Phone, MapPin, Globe, 
  Heart, Star, Trophy, Users, Camera, Mic,
  ChevronRight, ChevronLeft, X, Check,
  Award, Sparkles, Clock, Calendar, Shield,
  MessageCircle, Download, Share2, Tv,
  UserPlus, Settings, AlertCircle, PartyPopper,
  Crown, DollarSign, Loader
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AboutPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [formError, setFormError] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Updated tabs - removed judges and sponsors
  const tabs = [
    { id: 'about', label: 'About', icon: Star },
    { id: 'how-it-works', label: 'How It Works', icon: Trophy },
    { id: 'prizes', label: 'Prizes', icon: Award },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.3 }
    }
  };

  const floatingTabVariants = {
    initial: { y: 0 },
    hover: { 
      y: -5,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formError) setFormError('');
  };

  // Validate form
  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setFormError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setFormError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    if (!formData.message.trim()) {
      setFormError('Message is required');
      return false;
    }
    return true;
  };

  // Handle form submission to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormStatus('sending');
    setFormError('');

    try {
      const { error } = await supabase
        .from('get_in_touch')
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone || null,
            message: formData.message,
            status: 'unread',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setFormStatus('success');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setFormStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormStatus('error');
      setFormError('Failed to send message. Please try again.');
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setFormStatus(null);
        setFormError('');
      }, 5000);
    }
  };

  // Social media links
  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/celebritystarafrica', label: 'Instagram', color: 'from-purple-500 to-pink-500' },
    { icon: Twitter, href: 'https://twitter.com/celebritystarafrica', label: 'Twitter', color: 'from-blue-400 to-blue-600' },
    { icon: Facebook, href: 'https://facebook.com/celebritystarafrica', label: 'Facebook', color: 'from-blue-600 to-blue-800' },
    { icon: Youtube, href: 'https://youtube.com/celebritystarafrica', label: 'YouTube', color: 'from-red-500 to-red-700' },
    { icon: Send, href: 'https://t.me/celebritystarafrica', label: 'Telegram', color: 'from-blue-500 to-cyan-500' },
    { icon: MessageCircle, href: 'https://wa.me/2348000000000', label: 'WhatsApp', color: 'from-green-500 to-green-600' },
  ];

  // Updated How It Works steps
  const howItWorksSteps = [
    {
      step: 1,
      title: 'Create Account',
      desc: 'Create your account on Celebrity Star Portal, add your photos, and complete your profile using the settings button on your page',
      icon: UserPlus,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: 2,
      title: 'Priority Challenge',
      desc: 'Get active in the Priority Challenge. This challenge determines who will make up the 30 housemates in Celebrity Star Mansion',
      icon: AlertCircle,
      color: 'from-orange-500 to-yellow-500'
    },
    {
      step: 3,
      title: 'Top Candidates',
      desc: 'Top candidates shall be announced on all Celebrity Star platforms. If you make it to the house, congratulations in advance!',
      icon: PartyPopper,
      color: 'from-green-500 to-emerald-500'
    },
    {
      step: 4,
      title: 'Live Show',
      desc: 'The show shall be full of life! The public shall determine who gets evicted and who stays through votes. Get ready for the battle of stars',
      icon: Tv,
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: 5,
      title: 'Grand Final',
      desc: 'One winner shall emerge as the STAR OF AFRICA. You have what it takes, so don\'t dull!',
      icon: Crown,
      color: 'from-yellow-500 to-amber-500'
    },
    {
      step: 6,
      title: 'Star Prize',
      desc: 'A whopping $30,000 USD for the winner and lots of consolation prizes!',
      icon: DollarSign,
      color: 'from-red-500 to-rose-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-16 sm:pt-20 pb-16 sm:pb-24">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-48 sm:w-72 h-48 sm:h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-4 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section - Reduced title size on desktop */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Celebrity Star
            </span>
            <br className="sm:hidden" />
            <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Reality Show Africa</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Africa's biggest talent showcase. Where stars are born and dreams come true.
          </p>
        </motion.div>

        {/* Action Buttons - Smaller on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-8 sm:mb-12"
        >
          {/* Updated Terms Button - Now links to terms page */}
          <Link
            href="/terms"
            className="px-3 sm:px-6 py-1.5 sm:py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold shadow-lg shadow-orange-500/30 flex items-center gap-1 sm:gap-2 hover:scale-105 transition-transform"
          >
            <Shield className="w-3 h-3 sm:w-5 sm:h-5" />
            <span>Terms</span>
          </Link>

          <motion.a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 sm:px-6 py-1.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold shadow-lg shadow-green-500/30 flex items-center gap-1 sm:gap-2"
          >
            <MessageCircle className="w-3 h-3 sm:w-5 sm:h-5" />
            <span>WhatsApp</span>
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 sm:px-6 py-1.5 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold flex items-center gap-1 sm:gap-2 hover:bg-white/20 transition-all"
          >
            <Download className="w-3 h-3 sm:w-5 sm:h-5" />
            <span>Brochure</span>
          </motion.button>
        </motion.div>

        {/* Floating Tabs Navigation - Smaller buttons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-4 mb-6 sm:mb-8"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              variants={floatingTabVariants}
              initial="initial"
              whileHover="hover"
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-2 sm:px-4 py-1.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-xs sm:text-base ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8"
          >
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">About Celebrity Star Africa</h2>
                <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                      Celebrity Star Africa is the continent's premier reality showcase, a competitive lifestyle event, 
                      bringing together exceptional young people from across Africa into one house life in spotlight. 
                      Now in its 1st season, the show shall become a global phenomenon, discovering and launching the 
                      careers of Africa's young people aiming at becoming stars.
                    </p>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                      From singers and dancers to comedians and performers, we provide a platform for 
                      raw talent to shine on the biggest stage. With millions of viewers across the 
                      continent and worldwide, winners emerge as true celebrities.
                    </p>
                  </div>
                  <div className="relative h-48 sm:h-64 md:h-auto rounded-lg sm:rounded-xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"
                      alt="Celebrity Star Show"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                </div>
              </div>
            )}

            {/* How It Works Tab - Updated with new content and mobile grid of 2 columns */}
            {activeTab === 'how-it-works' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">How It Works</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                  {howItWorksSteps.map((item) => (
                    <motion.div
                      key={item.step}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-5 md:p-6 border border-white/10 relative group hover:bg-white/10 transition-all"
                    >
                      <div className={`absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm`}>
                        {item.step}
                      </div>
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20 flex items-center justify-center mb-2 sm:mb-3 md:mb-4`}>
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-white mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-[10px] sm:text-xs md:text-sm text-white/60 line-clamp-3 sm:line-clamp-4">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Prizes Tab */}
            {activeTab === 'prizes' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">Prizes & Rewards</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {/* Grand Prize */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-b from-yellow-500/20 to-orange-500/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-yellow-500/30 text-center"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                      <Trophy className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1">1st Prize</h3>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-1">$30,000</div>
                    <p className="text-[10px] sm:text-xs text-white/60">+ Consolation Prizes</p>
                  </motion.div>

                  {/* Consolation Prizes */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-white/10 text-center"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                      <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1">Consolation</h3>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-1">Multiple</div>
                    <p className="text-[10px] sm:text-xs text-white/60">Prizes for top finalists</p>
                  </motion.div>

                  {/* Special Awards */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-white/10 text-center sm:col-span-2 md:col-span-1"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                      <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1">Special Awards</h3>
                    <div className="text-sm sm:text-base text-blue-400 mb-1">Weekly Prizes</div>
                    <p className="text-[10px] sm:text-xs text-white/60">Fan Favorite, Best Performance</p>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">Get in Touch</h2>
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  {/* Contact Form */}
                  <div className="space-y-3 sm:space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-white/80 text-xs sm:text-sm mb-1">
                          Full Name <span className="text-orange-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                          className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm sm:text-base text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition"
                          disabled={formStatus === 'sending'}
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-xs sm:text-sm mb-1">
                          Email <span className="text-orange-400">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email address"
                          className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm sm:text-base text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition"
                          disabled={formStatus === 'sending'}
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-xs sm:text-sm mb-1">
                          Phone <span className="text-white/40 text-xs">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm sm:text-base text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition"
                          disabled={formStatus === 'sending'}
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-xs sm:text-sm mb-1">
                          Message <span className="text-orange-400">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          placeholder="Write your message here..."
                          rows="4"
                          className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-sm sm:text-base text-white placeholder-white/40 focus:border-orange-500 focus:outline-none transition resize-none"
                          disabled={formStatus === 'sending'}
                        ></textarea>
                      </div>

                      {/* Error Message */}
                      <AnimatePresence>
                        {formError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{formError}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={formStatus === 'sending'}
                        className="w-full py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg text-sm sm:text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formStatus === 'sending' ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : formStatus === 'success' ? (
                          <>
                            <Check className="w-4 h-4" />
                            Message Sent!
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </motion.button>

                      <p className="text-xs text-white/40 text-center">
                        <span className="text-orange-400">*</span> Required fields
                      </p>
                    </form>
                  </div>

                  {/* Contact Info & Social Media */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-white/10">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-3 sm:mb-4">Contact Information</h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-xs sm:text-sm">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                          <span className="truncate">info@celebritystarafrica.com</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-xs sm:text-sm">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                          <span>+234 800 000 0000</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-xs sm:text-sm">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                          <span>Lagos, Nigeria</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-white/80 text-xs sm:text-sm">
                          <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                          <span className="truncate">www.celebritystarafrica.com</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-white/10">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-3 sm:mb-4">Follow Us</h3>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {socialLinks.map((social) => (
                          <motion.a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -2 }}
                            className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${social.color} flex items-center justify-center`}
                          >
                            <social.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </motion.a>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-white/10">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-3 sm:mb-4">Office Hours</h3>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between text-white/80 text-xs sm:text-sm">
                          <span>Mon - Fri</span>
                          <span>9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between text-white/80 text-xs sm:text-sm">
                          <span>Saturday</span>
                          <span>10:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between text-white/80 text-xs sm:text-sm">
                          <span>Sunday</span>
                          <span>Closed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Social Media Bar - Smaller icons on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-1.5 sm:gap-2"
        >
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${social.color} shadow-lg`}
              title={social.label}
            >
              <social.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
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
  MessageCircle, Download, Share2, Tv
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Terms from '../../components/Terms'; // Import the Terms component

export default function AboutPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Floating tabs configuration - removed judges and sponsors
  const tabs = [
    { id: 'about', label: 'About Show', icon: Star },
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
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setFormStatus(null), 5000);
    }, 1500);
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

  // Terms of participation - kept for modal checkbox but will use Terms component
  const termsOfParticipation = [
    "Contestants must be between 18 and 35 years old",
    "Must be a citizen of an African country",
    "Valid passport and international travel documents required",
    "No professional entertainment contracts in the last 2 years",
    "Must be available for the entire 90-day filming period",
    "Pass medical and psychological evaluation",
    "Agree to background check",
    "Submit non-refundable application fee of ₦15,000",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-20 pb-24">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Celebrity Star
            </span>
            <br />
            <span className="text-white">Reality Show Africa</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Africa's biggest talent showcase. Where stars are born and dreams come true.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTerms(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30 flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Terms of Participation
          </motion.button>

          <motion.a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-500/30 flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-white/20 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Brochure
          </motion.button>
        </motion.div>

        {/* Floating Tabs Navigation - updated with only 4 tabs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              variants={floatingTabVariants}
              initial="initial"
              whileHover="hover"
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                <span className="text-sm md:text-base whitespace-nowrap">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
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
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8"
          >
            {/* About Tab - updated with new text and removed stats */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">About Celebrity Star Africa</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-white/80 leading-relaxed">
                      Celebrity Star Africa is the continent's premier reality showcase, a competitive lifestyle event, 
                      bringing together exceptional young people from across Africa into one house life in spotlight. 
                      Now in its 1st season, the show shall become a global phenomenon, discovering and launching the 
                      careers of Africa's young people aiming at becoming stars.
                    </p>
                    <p className="text-white/80 leading-relaxed">
                      From singers and dancers to comedians and performers, we provide a platform for 
                      raw talent to shine on the biggest stage. With millions of viewers across the 
                      continent and worldwide, winners emerge as true celebrities.
                    </p>
                  </div>
                  <div className="relative h-64 md:h-auto rounded-xl overflow-hidden">
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

            {/* How It Works Tab */}
            {activeTab === 'how-it-works' && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { step: 1, title: 'Apply Online', desc: 'Fill out the application form and submit your audition video', icon: Send },
                    { step: 2, title: 'Auditions', desc: 'Selected contestants perform at regional auditions', icon: Mic },
                    { step: 3, title: 'The House', desc: 'Top contestants move into the Celebrity Star house', icon: Users },
                    { step: 4, title: 'Live Shows', desc: 'Public votes determine who makes it to live shows', icon: Tv },
                    { step: 5, title: 'Semi-Finals', desc: 'The best compete for a spot in the grand finale', icon: Trophy },
                    { step: 6, title: 'Grand Finale', desc: 'One winner takes it all and becomes a star', icon: Star },
                  ].map((item) => (
                    <motion.div
                      key={item.step}
                      whileHover={{ y: -5 }}
                      className="bg-white/5 rounded-xl p-6 border border-white/10 relative"
                    >
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                        {item.step}
                      </div>
                      <item.icon className="w-8 h-8 text-orange-400 mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Prizes Tab */}
            {activeTab === 'prizes' && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Prizes & Rewards</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-b from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30 text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">1st Prize</h3>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">₦50,000,000</div>
                    <p className="text-white/60 text-sm">+ Recording Contract + Car</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">2nd Prize</h3>
                    <div className="text-3xl font-bold text-gray-400 mb-2">₦20,000,000</div>
                    <p className="text-white/60 text-sm">+ Recording Contract</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-700 to-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">3rd Prize</h3>
                    <div className="text-3xl font-bold text-amber-600 mb-2">₦10,000,000</div>
                    <p className="text-white/60 text-sm">+ Recording Contract</p>
                  </motion.div>
                </div>

                <div className="mt-8 p-6 bg-white/5 rounded-xl">
                  <h3 className="text-lg font-bold text-white mb-4">Other Prizes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Weekly Star Prize', 'Fan Favorite', 'Best Performance', 'Social Media Star'].map((prize) => (
                      <div key={prize} className="text-center">
                        <div className="text-sm font-medium text-white">{prize}</div>
                        <div className="text-orange-400 font-bold">₦1,000,000</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Get in Touch</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Contact Form */}
                  <div className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-white/80 text-sm mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500 focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500 focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-1">Phone (Optional)</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500 focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-1">Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows="4"
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-orange-500 focus:outline-none transition resize-none"
                        ></textarea>
                      </div>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={formStatus === 'sending'}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {formStatus === 'sending' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                    </form>
                  </div>

                  {/* Contact Info & Social Media */}
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-white/80">
                          <Mail className="w-5 h-5 text-orange-400" />
                          <span>info@celebritystarafrica.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                          <Phone className="w-5 h-5 text-orange-400" />
                          <span>+234 800 000 0000</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                          <MapPin className="w-5 h-5 text-orange-400" />
                          <span>Lagos, Nigeria</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                          <Globe className="w-5 h-5 text-orange-400" />
                          <span>www.celebritystarafrica.com</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {socialLinks.map((social) => (
                          <motion.a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3 }}
                            className={`p-3 rounded-lg bg-gradient-to-r ${social.color} flex items-center justify-center`}
                          >
                            <social.icon className="w-5 h-5 text-white" />
                          </motion.a>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4">Office Hours</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-white/80">
                          <span>Monday - Friday</span>
                          <span>9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between text-white/80">
                          <span>Saturday</span>
                          <span>10:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between text-white/80">
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

        {/* Social Media Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className={`p-3 rounded-full bg-gradient-to-r ${social.color} shadow-lg`}
              title={social.label}
            >
              <social.icon className="w-5 h-5 text-white" />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Terms Modal - Using imported Terms component */}
      <AnimatePresence>
        {showTerms && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowTerms(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-gradient-to-b from-gray-900 to-black rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-orange-600 to-yellow-500">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Official Terms & Conditions
                </h2>
                <button
                  onClick={() => setShowTerms(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Imported Terms component */}
                <Terms />
                
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-white/80 text-sm">
                      I have read and agree to the terms of participation
                    </span>
                  </label>
                </div>
              </div>

              <div className="p-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={() => setShowTerms(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (acceptedTerms) {
                      router.push('/apply');
                    }
                  }}
                  disabled={!acceptedTerms}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
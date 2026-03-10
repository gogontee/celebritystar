// app/adminpannel/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { 
  ChevronLeft,
  Shield,
  Users,
  UserCog,
  Loader,
  AlertCircle,
  Image as ImageIcon,
  Mail // Added Mail icon for messages
} from 'lucide-react';

// Import components
import AccessModal from '../../components/admin/AccessModal';
import ProfileManagement from '../../components/admin/ProfileManagement';
import VotersView from '../../components/admin/VotersView';
import CelebMedia from '../../components/admin/CelebMedia';
import MessagePortal from '../../components/MessagePortal'; // Import MessagePortal

export default function AdminPanelPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profiles'); // 'profiles', 'voters', 'media', or 'messages'
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAccessModal, setShowAccessModal] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); // For badge on messages tab

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    if (accessGranted) {
      checkAdminStatus();
      fetchUnreadMessagesCount(); // Fetch unread messages count
    }
  }, [accessGranted]);

  // Set up real-time subscription for messages
  useEffect(() => {
    if (accessGranted && isAdmin) {
      const subscription = supabase
        .channel('get_in_touch_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'get_in_touch' 
          }, 
          () => {
            // Refresh unread count when messages change
            fetchUnreadMessagesCount();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [accessGranted, isAdmin]);

  const checkAdminStatus = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile?.role !== 'admin') {
        router.push('/');
        return;
      }

      setIsAdmin(true);
      
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error checking admin status:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadMessagesCount = async () => {
    try {
      const { count, error } = await supabase
        .from('get_in_touch')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      if (error) throw error;
      setUnreadMessagesCount(count || 0);
    } catch (error) {
      console.error('Error fetching unread messages count:', error);
    }
  };

  const handleAccessGranted = () => {
    setAccessGranted(true);
    setShowAccessModal(false);
  };

  if (showAccessModal) {
    return <AccessModal onAccessGranted={handleAccessGranted} />;
  }

  if (!isAdmin || !accessGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-burnt-orange-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/60">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-burnt-orange-950 to-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-burnt-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-burnt-orange-950 to-black">
      {/* Simple Header - No complex positioning */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-burnt-orange-400" />
                  Admin Panel
                </h1>
                <p className="text-xs text-white/40">
                  {activeTab === 'profiles' ? `${totalCount} total users` : 
                   activeTab === 'voters' ? 'View all transactions' : 
                   activeTab === 'media' ? 'Manage celebrity media content' :
                   `${unreadMessagesCount} unread messages`}
                </p>
              </div>
            </div>

            {/* Toggle buttons - Profiles, Voters, Media, Messages */}
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => {
                  console.log('Profiles clicked');
                  setActiveTab('profiles');
                }}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'profiles'
                    ? 'bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
                style={{ minHeight: '48px' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <UserCog className="w-4 h-4" />
                  Profiles
                </span>
              </button>
              <button
                onClick={() => {
                  console.log('Voters clicked');
                  setActiveTab('voters');
                }}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'voters'
                    ? 'bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
                style={{ minHeight: '48px' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Voters
                </span>
              </button>
              <button
                onClick={() => {
                  console.log('Media clicked');
                  setActiveTab('media');
                }}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'media'
                    ? 'bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
                style={{ minHeight: '48px' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Media
                </span>
              </button>
              <button
                onClick={() => {
                  console.log('Messages clicked');
                  setActiveTab('messages');
                }}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap relative ${
                  activeTab === 'messages'
                    ? 'bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
                style={{ minHeight: '48px' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Messages
                  {unreadMessagesCount > 0 && activeTab !== 'messages' && (
                    <span className="absolute -top-1 -right-1 sm:relative sm:top-0 sm:right-0 sm:ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                    </span>
                  )}
                  {unreadMessagesCount > 0 && activeTab === 'messages' && (
                    <span className="ml-1 bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadMessagesCount}
                    </span>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'profiles' ? (
          <ProfileManagement />
        ) : activeTab === 'voters' ? (
          <VotersView />
        ) : activeTab === 'media' ? (
          <CelebMedia />
        ) : (
          <MessagePortal />
        )}
      </div>
    </div>
  );
}
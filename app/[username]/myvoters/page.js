// app/[username]/myvoters/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { 
  ChevronLeft, 
  Users, 
  Mail, 
  User, 
  Hash, 
  Calendar,
  Copy,
  Check,
  Search,
  Download,
  Filter,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function MyVotersPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username;
  
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [copiedRef, setCopiedRef] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    totalVotes: 0,
    totalAmount: 0,
    uniqueVoters: 0
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    checkUserAndFetchData();
  }, [username]);

  const checkUserAndFetchData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get profile by username
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (!profileData) {
        router.push('/404');
        return;
      }

      setProfile(profileData);
      
      // Check if current user is the owner
      setIsOwner(user?.id === profileData.id);

      // If not owner, redirect to profile page
      if (user?.id !== profileData.id) {
        router.push(`/${username}`);
        return;
      }

      // Fetch vote transactions for this candidate
      await fetchVoters(profileData.id);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoters = async (candidateId) => {
    try {
      // First fetch all vote transactions
      const { data: transactions, error } = await supabase
        .from('vote_transactions')
        .select('*')
        .eq('candidate_id', candidateId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!transactions || transactions.length === 0) {
        setVoters([]);
        setStats({
          totalVotes: 0,
          totalAmount: 0,
          uniqueVoters: 0
        });
        return;
      }

      // Get all user_ids that are not null
      const userIds = transactions
        .filter(tx => tx.user_id)
        .map(tx => tx.user_id);

      // Fetch profiles for registered users
      let profilesMap = {};
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', userIds);

        if (!profilesError && profiles) {
          profilesMap = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {});
        }
      }

      // Enrich transactions with profile data
      const enrichedVoters = transactions.map(tx => ({
        ...tx,
        profile_data: tx.user_id ? profilesMap[tx.user_id] : null
      }));

      setVoters(enrichedVoters);

      // Calculate stats
      const totalVotes = transactions?.reduce((sum, tx) => sum + (tx.votes || 0), 0) || 0;
      const totalAmount = transactions?.reduce((sum, tx) => sum + (tx.total_amount || 0), 0) || 0;
      const uniqueVoters = new Set(
        transactions?.map(tx => tx.user_id || tx.guest_email).filter(Boolean)
      ).size;

      setStats({
        totalVotes,
        totalAmount,
        uniqueVoters
      });

    } catch (error) {
      console.error('Error fetching voters:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVoterDisplay = (transaction) => {
    // If it's a registered user with profile data, show their full name
    if (transaction.user_id && transaction.profile_data) {
      return transaction.profile_data.full_name || `@${transaction.profile_data.username}`;
    } else if (transaction.guest_name) {
      return transaction.guest_name;
    } else if (transaction.guest_email) {
      return transaction.guest_email.split('@')[0];
    } else if (transaction.user_id) {
      // Fallback if profile data wasn't found
      return `User ${transaction.user_id.substring(0, 1)}...`;
    }
    return 'Anonymous Voter';
  };

  const getVoterEmail = (transaction) => {
    if (transaction.guest_email) {
      return transaction.guest_email;
    } else if (transaction.user_id && transaction.profile_data) {
      // For registered users, we might not have email in profiles table
      // You could fetch email from auth.users if needed, but that requires admin access
      return 'Registered User';
    }
    return null;
  };

  const getInitials = (transaction) => {
    const display = getVoterDisplay(transaction);
    return display.charAt(0).toUpperCase();
  };

  const getVoterColor = (transaction) => {
    if (transaction.user_id && transaction.profile_data) return 'from-burnt-orange-500 to-yellow-500';
    if (transaction.guest_name) return 'from-green-500 to-emerald-500';
    if (transaction.guest_email) return 'from-blue-500 to-cyan-500';
    return 'from-gray-500 to-gray-600';
  };

  const filteredVoters = voters.filter(voter => {
    const searchLower = searchTerm.toLowerCase();
    const display = getVoterDisplay(voter).toLowerCase();
    const email = getVoterEmail(voter)?.toLowerCase() || '';
    const ref = voter.reference?.toLowerCase() || '';
    
    return display.includes(searchLower) || 
           email.includes(searchLower) || 
           ref.includes(searchLower);
  });

  const sortedVoters = [...filteredVoters].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === 'mostVotes') {
      return (b.votes || 0) - (a.votes || 0);
    } else if (sortBy === 'leastVotes') {
      return (a.votes || 0) - (b.votes || 0);
    } else if (sortBy === 'highestAmount') {
      return (b.total_amount || 0) - (a.total_amount || 0);
    }
    return 0;
  });

  const exportToCSV = () => {
    const headers = ['Voter', 'Email', 'Votes', 'Amount (NGN)', 'Reference', 'Date'];
    const csvData = voters.map(v => [
      getVoterDisplay(v),
      getVoterEmail(v) || 'N/A',
      v.votes || 0,
      v.total_amount || 0,
      v.reference || 'N/A',
      formatDate(v.created_at)
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}_voters_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-burnt-orange-950 to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-burnt-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white/70 text-sm">Loading your voters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-burnt-orange-950 to-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/${username}`}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </Link>
              <div>
                {/* Title - Reduced font size on mobile with !important */}
<h1 className="text-[14px] !text-base sm:!text-xl font-bold text-white flex items-center gap-2">
  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-burnt-orange-400" />
  My Voters
</h1>
                {/* Stats text - Adjusted for mobile */}
                <p className="text-[10px] sm:text-xs text-white/40">
                  {stats.uniqueVoters} unique voters • {stats.totalVotes} total votes • ₦{stats.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Export Button - Adjusted for mobile */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white rounded-xl text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>

          {/* Search and Filter - Adjusted for mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search voters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-white/40 focus:border-burnt-orange-500 focus:outline-none transition-colors"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:border-burnt-orange-500 focus:outline-none transition-colors"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="mostVotes">Most Votes</option>
              <option value="leastVotes">Least Votes</option>
              <option value="highestAmount">Highest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voters List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {sortedVoters.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-burnt-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-burnt-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No voters yet</h3>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              When people vote for you, they'll appear here. Share your profile to get more votes!
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {sortedVoters.map((voter) => (
              <motion.div
                key={voter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 p-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Voter Avatar */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getVoterColor(voter)} flex items-center justify-center flex-shrink-0`}>
                      {voter.profile_data?.avatar_url ? (
                        <Image
                          src={voter.profile_data.avatar_url}
                          alt={getVoterDisplay(voter)}
                          width={40}
                          height={40}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-lg">
                          {getInitials(voter)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white text-sm sm:text-base">
                          {getVoterDisplay(voter)}
                        </span>
                        {voter.profile_data?.username && (
                          <span className="text-[10px] sm:text-xs text-white/40">
                            @{voter.profile_data.username}
                          </span>
                        )}
                        {voter.guest_email && (
                          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-white/40">
                            <Mail className="w-3 h-3" />
                            {voter.guest_email}
                          </span>
                        )}
                      </div>
                      
                      {/* Reference */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] sm:text-xs text-white/40 font-mono flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Ref: {voter.reference?.substring(0, 12)}...
                        </span>
                        <button
                          onClick={() => copyToClipboard(voter.reference)}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy reference"
                        >
                          {copiedRef === voter.reference ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/40 hover:text-white/60" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Vote Stats */}
                  <div className="flex items-center gap-4 sm:gap-6 ml-13 sm:ml-0">
                    <div className="text-center min-w-[50px] sm:min-w-[60px]">
                      <div className="text-base sm:text-lg font-bold text-burnt-orange-400">
                        {voter.votes}
                      </div>
                      <div className="text-[8px] sm:text-[10px] text-white/40">votes</div>
                    </div>
                    
                    <div className="text-center min-w-[70px] sm:min-w-[80px]">
                      <div className="text-xs sm:text-sm font-semibold text-yellow-400">
                        ₦{voter.total_amount?.toLocaleString() || 0}
                      </div>
                      <div className="text-[8px] sm:text-[10px] text-white/40">amount</div>
                    </div>
                    
                    <div className="text-center min-w-[70px] sm:min-w-[80px] hidden sm:block">
                      <div className="text-xs text-white/60 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(voter.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-white/40">date</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Date */}
                <div className="sm:hidden mt-3 pt-3 border-t border-white/10 text-[10px] text-white/40 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(voter.created_at)}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {voters.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-burnt-orange-500/10 to-yellow-500/10 rounded-xl border border-burnt-orange-500/20">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-[10px] sm:text-xs text-white/40">Total Transactions</div>
                <div className="text-base sm:text-lg font-bold text-white">{voters.length}</div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-white/40">Total Votes</div>
                <div className="text-base sm:text-lg font-bold text-burnt-orange-400">{stats.totalVotes}</div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-white/40">Total Amount</div>
                <div className="text-base sm:text-lg font-bold text-yellow-400">₦{stats.totalAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-white/40">Unique Voters</div>
                <div className="text-base sm:text-lg font-bold text-white">{stats.uniqueVoters}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
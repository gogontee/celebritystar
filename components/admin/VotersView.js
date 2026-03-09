// components/admin/VotersView.js
'use client';

import { useState, useEffect } from 'react';
import { 
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Calendar,
  Download,
  Loader,
  Award,
  CreditCard,
  Hash
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

export default function VotersView() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [votersMap, setVotersMap] = useState({}); // For voter profiles
  const [candidatesMap, setCandidatesMap] = useState({}); // For candidate profiles

  const ITEMS_PER_PAGE = 10;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchTerm]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('vote_transactions')
        .select('*', { count: 'exact' })
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`
          guest_name.ilike.%${searchTerm}%,
          guest_email.ilike.%${searchTerm}%,
          reference.ilike.%${searchTerm}%
        `);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await query
        .range(from, to);

      if (error) throw error;

      setTransactions(data || []);
      setTotalCount(count || 0);

      // Fetch profile names for both voters and candidates
      if (data && data.length > 0) {
        // Get all voter user_ids
        const voterIds = data
          .filter(tx => tx.user_id)
          .map(tx => tx.user_id);

        // Get all candidate_ids
        const candidateIds = data
          .filter(tx => tx.candidate_id)
          .map(tx => tx.candidate_id);

        const allProfileIds = [...new Set([...voterIds, ...candidateIds])];

        if (allProfileIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, username')
            .in('id', allProfileIds);

          if (profiles) {
            const map = profiles.reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {});
            
            // Split into voters and candidates maps (they share the same data)
            setVotersMap(map);
            setCandidatesMap(map);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVoterName = (transaction) => {
    if (transaction.guest_name) {
      return transaction.guest_name;
    } else if (transaction.user_id && votersMap[transaction.user_id]) {
      return votersMap[transaction.user_id].full_name || votersMap[transaction.user_id].username;
    } else if (transaction.guest_email) {
      return transaction.guest_email.split('@')[0];
    }
    return 'Anonymous Voter';
  };

  const getVoterEmail = (transaction) => {
    if (transaction.guest_email) {
      return transaction.guest_email;
    } else if (transaction.user_id && votersMap[transaction.user_id]) {
      return 'Registered User';
    }
    return null;
  };

  const getCandidateName = (transaction) => {
    if (transaction.candidate_id && candidatesMap[transaction.candidate_id]) {
      return candidatesMap[transaction.candidate_id].full_name || candidatesMap[transaction.candidate_id].username;
    }
    return 'Unknown Candidate';
  };

  const getCandidateUsername = (transaction) => {
    if (transaction.candidate_id && candidatesMap[transaction.candidate_id]) {
      return candidatesMap[transaction.candidate_id].username;
    }
    return null;
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

  const exportToCSV = () => {
    const headers = ['Voter Name', 'Email', 'Candidate', 'Username', 'Votes', 'Amount (NGN)', 'Reference', 'Date'];
    
    const csvData = transactions.map(t => [
      getVoterName(t),
      getVoterEmail(t) || 'N/A',
      getCandidateName(t),
      getCandidateUsername(t) || 'N/A',
      t.votes || 0,
      t.total_amount || 0,
      t.reference || 'N/A',
      formatDate(t.created_at)
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voters_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      {/* Search and Export - Mobile & Desktop Optimized */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4 mb-4 sm:mb-6">
        {/* Mobile Layout - Search and Export on same row */}
        <div className="flex sm:hidden items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search voters..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-2 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/40 focus:border-burnt-orange-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>

        {/* Desktop Layout - Full width search and export */}
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by voter name, email, or reference..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:border-burnt-orange-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-burnt-orange-500 to-yellow-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-burnt-orange-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                No transactions found
              </div>
            ) : (
              transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-xl border border-white/10 p-3"
                >
                  {/* Voter Info */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burnt-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-base">
                        {getVoterName(transaction).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm truncate">
                        {getVoterName(transaction)}
                      </div>
                      {getVoterEmail(transaction) && (
                        <div className="flex items-center gap-1 text-xs text-white/40 truncate">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{getVoterEmail(transaction)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-burnt-orange-400" />
                      <span className="text-white/80">Candidate:</span>
                    </div>
                    <div className="text-white/80 truncate font-medium">
                      {getCandidateName(transaction)}
                    </div>

                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-white/40" />
                      <span className="text-white/80">Username:</span>
                    </div>
                    <div className="text-white/60 truncate">
                      @{getCandidateUsername(transaction) || 'unknown'}
                    </div>

                    <div className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-yellow-400" />
                      <span className="text-white/80">Votes:</span>
                    </div>
                    <div className="text-white font-semibold">{transaction.votes}</div>

                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">₦</span>
                      <span className="text-white/80">Amount:</span>
                    </div>
                    <div className="text-yellow-400 font-semibold">
                      ₦{transaction.total_amount?.toLocaleString() || 0}
                    </div>

                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-white/40" />
                      <span className="text-white/80">Ref:</span>
                    </div>
                    <div className="text-white/40 font-mono text-[10px] truncate">
                      {transaction.reference?.substring(0, 10)}...
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1 text-[10px] text-white/40">
                    <Calendar className="w-3 h-3" />
                    {formatDate(transaction.created_at)}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-3 text-left text-xs font-medium text-white/40">Voter</th>
                    <th className="p-3 text-left text-xs font-medium text-white/40">Contact</th>
                    <th className="p-3 text-left text-xs font-medium text-white/40">Candidate</th>
                    <th className="p-3 text-left text-xs font-medium text-white/40">Username</th>
                    <th className="p-3 text-left text-xs font-medium text-white/40">Votes</th>
                    <th className="p-3 text-left text-xs font-medium text-white/40">Amount</th>
                    <th className="p-3 text-left text-xs font-medium text-white/40">Reference</th>
                    <th className="p-3 text-left text-xs font-medium text-white/40">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-white/40">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-burnt-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-sm">
                                {getVoterName(transaction).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-white">
                              {getVoterName(transaction)}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          {getVoterEmail(transaction) ? (
                            <div className="flex items-center gap-1 text-xs">
                              <Mail className="w-3 h-3 text-white/40" />
                              <span className="text-white/80">{getVoterEmail(transaction)}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-white/40">No email</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Award className="w-3 h-3 text-burnt-orange-400" />
                            <span className="text-sm text-white/80 font-medium">
                              {getCandidateName(transaction)}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-xs text-white/60">
                            @{getCandidateUsername(transaction) || 'unknown'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-semibold text-burnt-orange-400">
                            {transaction.votes}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-400">
                              ₦{transaction.total_amount?.toLocaleString() || 0}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3 text-white/40" />
                            <span className="text-xs font-mono text-white/60">
                              {transaction.reference?.substring(0, 12)}...
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-white/40" />
                            <span className="text-xs text-white/60">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination - Mobile Optimized */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-white/40 order-2 sm:order-1">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <span className="text-sm text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Summary Stats */}
          {transactions.length > 0 && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-burnt-orange-500/10 to-yellow-500/10 rounded-xl border border-burnt-orange-500/20">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <div className="text-[10px] sm:text-xs text-white/40">Transactions</div>
                  <div className="text-base sm:text-lg font-bold text-white">{totalCount}</div>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-white/40">Total Votes</div>
                  <div className="text-base sm:text-lg font-bold text-burnt-orange-400">
                    {transactions.reduce((sum, t) => sum + (t.votes || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-white/40">Total Amount</div>
                  <div className="text-base sm:text-lg font-bold text-yellow-400">
                    ₦{transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-white/40">Unique Voters</div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {new Set(transactions.map(t => t.user_id || t.guest_email).filter(Boolean)).size}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
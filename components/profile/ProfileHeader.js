// components/profile/ProfileHeader.jsx
import { ChevronLeft, Settings, LogOut, Vote, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProfileHeader({ stats, isOwner, onSettingsClick, onSignOut, onBack }) {
  const params = useParams();
  const username = params.username;

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onBack}
        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      
      <div className="flex items-center gap-4">
        {/* See Who's Voting Button - Only for owner */}
        {isOwner && (
          <Link
            href={`/${username}/myvoters`}
            className="flex items-center gap-2 bg-gradient-to-r from-burnt-orange-500/20 to-yellow-500/20 hover:from-burnt-orange-500/30 hover:to-yellow-500/30 px-3 py-2 rounded-xl border border-burnt-orange-500/30 transition-all group"
          >
            <Users className="w-4 h-4 text-burnt-orange-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-white hidden sm:inline">Who's voting for you</span>
            <span className="text-xs text-white/60 hidden sm:inline">({stats.totalVotes?.toLocaleString() || 0} votes)</span>
          </Link>
        )}

        {/* Stats Display */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
          {/* Total Votes */}
          <div className="flex items-center gap-1.5">
            <Vote className="w-4 h-4 text-burnt-orange-400" />
            <span className="text-white font-medium">
              {stats.totalVotes?.toLocaleString() || 0}
            </span>
            <span className="text-white/40 text-xs hidden sm:inline">votes</span>
          </div>
          
          {/* Divider */}
          <div className="w-px h-4 bg-white/20" />
          
          {/* Rank */}
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-medium">#{stats.rank}</span>
            <span className="text-white/40 text-xs hidden sm:inline">rank</span>
          </div>
        </div>

        {/* Settings and Logout (only for owner) */}
        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onSignOut}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
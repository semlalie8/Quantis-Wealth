import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, Mail, Star, Send, Paperclip, MoreVertical, Archive, Trash2 } from 'lucide-react';

const messages = [
  { 
    id: 1, 
    sender: 'Quantis Research', 
    subject: 'Quarterly Market Outlook Q3 2026', 
    excerpt: 'Our latest analysis on emerging markets and interest rate pivots...', 
    time: '09:42 AM', 
    read: false, 
    starred: true,
    avatar: 'QR'
  },
  { 
    id: 2, 
    sender: 'Sarah Williams (Advisor)', 
    subject: 'Portfolio Rebalancing Discussion', 
    excerpt: 'Hi Sam, I reviewed your latest RL-optimized plan and have some...', 
    time: 'Yesterday', 
    read: true, 
    starred: false,
    avatar: 'SW'
  },
  { 
    id: 3, 
    sender: 'System Alert', 
    subject: 'Security Audit Complete', 
    excerpt: 'Your institutional account passed the bi-weekly security protocol...', 
    time: '2 days ago', 
    read: true, 
    starred: false,
    avatar: 'SY'
  }
];

export function Inbox() {
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Message List */}
      <div className="w-96 border-r border-white/5 flex flex-col bg-background/50">
        <div className="p-6 border-b border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Inbox</h1>
            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <Mail size={20} className="text-primary" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground/60" size={16} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`p-6 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.02] relative ${
                selectedMessage.id === msg.id ? 'bg-white/[0.03]' : ''
              }`}
            >
              {!msg.read && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
              )}
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    {msg.avatar}
                  </div>
                  <span className={`text-sm ${!msg.read ? 'font-bold' : 'text-secondary-foreground'}`}>{msg.sender}</span>
                </div>
                <span className="text-[10px] text-secondary-foreground/50">{msg.time}</span>
              </div>
              <p className={`text-xs mb-1 truncate ${!msg.read ? 'font-bold text-foreground' : 'text-secondary-foreground'}`}>
                {msg.subject}
              </p>
              <p className="text-[11px] text-secondary-foreground/60 line-clamp-1">
                {msg.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 flex flex-col bg-background/20 backdrop-blur-sm">
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-background/40">
          <div className="flex items-center gap-4">
            <button className="text-secondary-foreground hover:text-foreground transition-colors">
              <Archive size={18} />
            </button>
            <button className="text-secondary-foreground hover:text-foreground transition-colors">
              <Trash2 size={18} />
            </button>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <button className={`transition-colors ${selectedMessage.starred ? 'text-accent' : 'text-secondary-foreground hover:text-accent'}`}>
              <Star size={18} fill={selectedMessage.starred ? 'currentColor' : 'none'} />
            </button>
          </div>
          <button className="text-secondary-foreground hover:text-foreground transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <motion.div 
            key={selectedMessage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {selectedMessage.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{selectedMessage.sender}</p>
                    <p className="text-xs text-secondary-foreground">to sam.semlali@quantis.capital</p>
                  </div>
                </div>
              </div>
              <span className="text-xs text-secondary-foreground/50">{selectedMessage.time}</span>
            </div>

            <GlassCard className="p-8 mb-8">
              <div className="prose prose-invert max-w-none text-sm text-secondary-foreground leading-relaxed space-y-4">
                <p>Dear Sam,</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>Best regards,<br/>{selectedMessage.sender}</p>
              </div>
            </GlassCard>

            <div className="flex items-center gap-4">
              <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
                Reply <Send size={16} />
              </button>
              <button className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-secondary-foreground">
                <Paperclip size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

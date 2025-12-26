import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Users, ShieldCheck, Search, UserCog, 
  X, Check, Crown, UtensilsCrossed, Building2, GraduationCap,
  MoreVertical, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserRole } from '@/contexts/AuthContext';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  joinedAt: string;
}

const initialUsers: UserAccount[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@campus.edu', role: 'student', status: 'active', joinedAt: '2024-01-15' },
  { id: '2', name: 'Priya Patel', email: 'priya@campus.edu', role: 'food_admin', status: 'active', joinedAt: '2024-02-10' },
  { id: '3', name: 'Amit Kumar', email: 'amit@campus.edu', role: 'resource_admin', status: 'active', joinedAt: '2024-01-20' },
  { id: '4', name: 'Sneha Reddy', email: 'sneha@campus.edu', role: 'student', status: 'active', joinedAt: '2024-03-05' },
  { id: '5', name: 'Vikram Singh', email: 'vikram@campus.edu', role: 'super_admin', status: 'active', joinedAt: '2023-12-01' },
  { id: '6', name: 'Ananya Gupta', email: 'ananya@campus.edu', role: 'student', status: 'inactive', joinedAt: '2024-02-28' },
  { id: '7', name: 'Karthik Nair', email: 'karthik@campus.edu', role: 'student', status: 'active', joinedAt: '2024-03-10' },
  { id: '8', name: 'Meera Joshi', email: 'meera@campus.edu', role: 'food_admin', status: 'active', joinedAt: '2024-01-25' },
];

const roleConfig: Record<UserRole, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  student: { label: 'Student', icon: GraduationCap, color: 'text-blue-400', bgColor: 'bg-blue-400/20' },
  food_admin: { label: 'Food Admin', icon: UtensilsCrossed, color: 'text-success', bgColor: 'bg-success/20' },
  resource_admin: { label: 'Resource Admin', icon: Building2, color: 'text-purple-400', bgColor: 'bg-purple-400/20' },
  super_admin: { label: 'Super Admin', icon: Crown, color: 'text-warning', bgColor: 'bg-warning/20' },
};

const SuperAdminPage: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    foodAdmins: users.filter(u => u.role === 'food_admin').length,
    resourceAdmins: users.filter(u => u.role === 'resource_admin').length,
    superAdmins: users.filter(u => u.role === 'super_admin').length,
  };

  const handleOpenRoleModal = (user: UserAccount) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleAssignRole = (newRole: UserRole) => {
    if (!selectedUser) return;
    
    setUsers(prev =>
      prev.map(user =>
        user.id === selectedUser.id ? { ...user, role: newRole } : user
      )
    );
    toast.success(`${selectedUser.name} is now a ${roleConfig[newRole].label}`);
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
          : user
      )
    );
    const user = users.find(u => u.id === userId);
    if (user) {
      toast.success(`${user.name} is now ${user.status === 'active' ? 'inactive' : 'active'}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Super Admin</h1>
              <p className="text-sm text-muted-foreground">User & Role Management</p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-warning/20">
            <Crown className="w-5 h-5 text-warning" />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-400/20">
                <GraduationCap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.students}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-success/20">
                <UtensilsCrossed className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.foodAdmins}</p>
                <p className="text-xs text-muted-foreground">Food Admins</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-400/20">
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.resourceAdmins}</p>
                <p className="text-xs text-muted-foreground">Resource Admins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 pb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-card rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(['all', 'student', 'food_admin', 'resource_admin', 'super_admin'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterRole === role
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {role === 'all' ? 'All Users' : roleConfig[role].label}
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="px-4 space-y-3">
        {filteredUsers.map((user, index) => {
          const config = roleConfig[user.role];
          const RoleIcon = config.icon;
          
          return (
            <motion.div
              key={user.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className={`module-card ${user.status === 'inactive' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-lg font-bold text-foreground">
                    {user.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${config.bgColor}`}>
                    <RoleIcon className={`w-3 h-3 ${config.color}`} />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
                    {user.status === 'inactive' && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-destructive/20 text-destructive">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${config.bgColor} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenRoleModal(user)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Change role"
                  >
                    <UserCog className="w-4 h-4 text-secondary" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <ShieldCheck className={`w-4 h-4 ${user.status === 'active' ? 'text-success' : 'text-muted-foreground'}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>

      {/* Role Assignment Modal */}
      <AnimatePresence>
        {showRoleModal && selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setShowRoleModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[70vh] overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Assign Role</h2>
                    <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
                  </div>
                  <button onClick={() => setShowRoleModal(false)} className="p-2 rounded-lg hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {(Object.entries(roleConfig) as [UserRole, typeof roleConfig[UserRole]][]).map(([role, config]) => {
                  const RoleIcon = config.icon;
                  const isSelected = selectedUser.role === role;
                  
                  return (
                    <button
                      key={role}
                      onClick={() => handleAssignRole(role)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-secondary/20 ring-2 ring-secondary' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${config.bgColor}`}>
                        <RoleIcon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-foreground">{config.label}</h3>
                        <p className="text-xs text-muted-foreground">
                          {role === 'student' && 'Access to student features only'}
                          {role === 'food_admin' && 'Manage canteen menu & orders'}
                          {role === 'resource_admin' && 'Manage rooms & equipment'}
                          {role === 'super_admin' && 'Full control over all modules'}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="p-1.5 rounded-full bg-secondary">
                          <Check className="w-4 h-4 text-secondary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border safe-area-bottom">
                <p className="text-xs text-muted-foreground text-center">
                  Role changes take effect immediately
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminPage;

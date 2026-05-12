import { useState, useEffect } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import {
    Users,
    Calendar,
    ShieldCheck,
    Search,
    UserX,
    BarChart3,
    Clock,
    ExternalLink,
    Filter,
    LogOut,
    User as UserIcon,
    Mail,
    Phone,
    Camera,
    Save,
    Trash2,
    Star,
    DollarSign
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface Stats {
    totalUsers: number;
    totalProviders: number;
    totalBookings: number;
    pendingVerifications: number;
    totalRevenue?: number;
    activeBookings?: number;
}

interface Review {
    _id: string;
    customerId: { firstName: string; lastName: string };
    serviceProviderId: { userId: { firstName: string; lastName: string } };
    rating: number;
    comment: string;
    createdAt: string;
}


interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
}

interface Provider {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        isVerified: boolean;
    };
    profession: string;
    experience: number;
    isVerified: boolean;
    hourlyRate: number;
}

interface Booking {
    _id: string;
    customerId: {
        firstName: string;
        lastName: string;
        email: string;
    };
    serviceProviderId: {
        userId: {
            firstName: string;
            lastName: string;
            email: string;
        };
    };
    serviceType: string;
    status: string;
    totalAmount: number;
    scheduledDate: string;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'providers' | 'bookings' | 'profile' | 'reviews'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Profile Logic
    const { user: authUser, updateUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: authUser?.firstName || '',
        lastName: authUser?.lastName || '',
        email: authUser?.email || '',
        phone: authUser?.phone || '',
        profilePhoto: authUser?.profilePhoto || '',
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            const response = await api.put('/auth/profile', profileData);
            updateUser(response.data.user);
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setProfileLoading(false);
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'overview') {
                const statsRes = await api.get('/admin/stats');
                setStats(statsRes.data.stats);
            } else if (activeTab === 'users') {
                const usersRes = await api.get('/admin/users');
                setUsers(usersRes.data);
            } else if (activeTab === 'providers') {
                const providersRes = await api.get('/admin/providers');
                setProviders(providersRes.data);
            } else if (activeTab === 'bookings') {
                const bookingsRes = await api.get('/admin/bookings');
                setBookings(bookingsRes.data);
            } else if (activeTab === 'reviews') {
                const reviewsRes = await api.get('/admin/reviews');
                setReviews(reviewsRes.data);
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId: string) => {
        try {
            await api.post(`/admin/users/${userId}/toggle-active`);
            toast.success('User status updated');
            fetchData();
        } catch (error) { }
    };

    const verifyProvider = async (providerId: string) => {
        try {
            await api.post(`/admin/providers/${providerId}/verify`);
            toast.success('Provider verified');
            fetchData();
        } catch (error) { }
    };

    const deleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success('User deleted permanently');
            fetchData();
        } catch (error) { toast.error('Failed to delete user'); }
    };

    const removeProvider = async (providerId: string) => {
        if (!window.confirm('Are you sure you want to remove this provider? They will be downgraded to a customer.')) return;
        try {
            await api.delete(`/admin/providers/${providerId}`);
            toast.success('Provider removed');
            fetchData();
        } catch (error) { toast.error('Failed to remove provider'); }
    };

    const updateBookingStatus = async (bookingId: string, status: string) => {
        try {
            await api.put(`/admin/bookings/${bookingId}/status`, { status });
            toast.success(`Booking marked as ${status}`);
            fetchData();
        } catch (error) { toast.error('Failed to update booking'); }
    };

    const deleteReview = async (reviewId: string) => {
        if (!window.confirm('Are you sure you want to remove this review?')) return;
        try {
            await api.delete(`/admin/reviews/${reviewId}`);
            toast.success('Review removed');
            fetchData();
        } catch (error) { toast.error('Failed to remove review'); }
    };

    const filteredData = () => {
        const term = searchTerm.toLowerCase();
        if (activeTab === 'users') {
            return users.filter(u => u.firstName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
        }
        if (activeTab === 'providers') {
            return providers.filter(p => p.userId.firstName.toLowerCase().includes(term) || p.profession.toLowerCase().includes(term));
        }
        if (activeTab === 'bookings') {
            return bookings.filter(b => b.serviceType.toLowerCase().includes(term) || b.customerId.firstName.toLowerCase().includes(term));
        }
        return [];
    };

    if (loading && !stats && activeTab === 'overview') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">System Control</h1>
                        <p className="text-neutral-500 font-medium">Platform Management & Analytics Overview</p>
                    </div>

                    <nav className="inline-flex bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-neutral-200/60 sticky top-4 z-10 transition-all hover:shadow-md flex-wrap">
                        {(['overview', 'users', 'providers', 'bookings', 'reviews', 'profile'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setLoading(true); }}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab
                                    ? 'bg-neutral-900 text-white shadow-lg scale-105'
                                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </header>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Revenue', value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-100/50' },
                                { label: 'Total Base', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100/50' },
                                { label: 'Total Ops', value: stats?.totalBookings || 0, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-100/50' },
                                { label: 'Verification Queue', value: stats?.pendingVerifications || 0, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100/50' },
                            ].map((stat, i) => (
                                <div key={i} className="group bg-white p-7 rounded-3xl border border-neutral-200/60 hover:border-neutral-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl transition-transform group-hover:rotate-6`}>
                                            <stat.icon size={26} />
                                        </div>
                                        <span className="text-neutral-400 font-bold group-hover:text-neutral-900 transition-colors">+{Math.floor(Math.random() * 20)}%</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-1">{stat.label}</h3>
                                    <p className="text-4xl font-black text-neutral-900">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-neutral-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-10">
                                        <h2 className="text-2xl font-black flex items-center gap-3">
                                            <BarChart3 className="text-indigo-400" size={28} />
                                            Platform Momentum
                                        </h2>
                                        <select className="bg-white/10 border-none rounded-xl text-sm px-4 py-2 focus:ring-0">
                                            <option>Last 30 Days</option>
                                        </select>
                                    </div>
                                    <div className="flex-1 flex items-end gap-3 min-h-[250px]">
                                        {[45, 78, 56, 92, 64, 85, 72, 59, 95, 81, 68, 88].map((h, i) => (
                                            <div key={i} className="flex-1 group/bar relative">
                                                <div
                                                    className="w-full bg-white/20 rounded-xl transition-all duration-500 group-hover/bar:bg-indigo-400 group-hover/bar:scale-105"
                                                    style={{ height: `${h}%` }}
                                                ></div>
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-neutral-900 px-2 py-1 rounded-lg text-[10px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                                    {h}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-200/60 shadow-lg">
                                    <h3 className="text-xl font-black text-neutral-900 mb-6 tracking-tight">System Integrity</h3>
                                    <div className="space-y-5">
                                        {[
                                            { l: 'Server Latency', v: '24ms', c: 'text-emerald-500' },
                                            { l: 'Auth Uptime', v: '99.9%', c: 'text-blue-500' },
                                            { l: 'Payment Gate', v: 'Active', c: 'text-indigo-500' },
                                            { l: 'Db Health', v: 'Optimal', c: 'text-emerald-500' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors">
                                                <span className="text-neutral-500 font-bold">{item.l}</span>
                                                <span className={`font-black ${item.c}`}>{item.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                                    <ShieldCheck className="absolute bottom-[-20px] right-[-20px] text-white/10 w-40 h-40 group-hover:scale-110 transition-transform duration-700" />
                                    <h3 className="text-xl font-black mb-2">Security Hub</h3>
                                    <p className="text-white/70 text-sm mb-6 leading-relaxed">System-wide security protocol and access log monitoring.</p>
                                    <button className="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black text-sm hover:shadow-lg transition-all active:scale-95">
                                        Enter Secure Mode
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200/60 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="p-10 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-50/50">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-neutral-900 tracking-tight capitalize">Admin Profile</h2>
                                <p className="text-neutral-500 font-medium">Manage your personal information and credentials</p>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors">
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </div>
                        <div className="p-10">
                            <form onSubmit={handleProfileUpdate} className="space-y-8 max-w-3xl">
                                {/* Profile Photo Section */}
                                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-neutral-100">
                                    <div className="relative group cursor-pointer">
                                        {profileData.profilePhoto ? (
                                            <img
                                                src={profileData.profilePhoto}
                                                alt="Profile"
                                                className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-xl"
                                            />
                                        ) : (
                                            <div className="h-28 w-28 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-xl">
                                                <UserIcon className="h-12 w-12 text-indigo-600" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full text-center sm:text-left space-y-2">
                                        <h3 className="font-bold text-neutral-900">Avatar URL</h3>
                                        <input
                                            type="text"
                                            placeholder="Paste image URL here..."
                                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                            value={profileData.profilePhoto}
                                            onChange={(e) => setProfileData({ ...profileData, profilePhoto: e.target.value })}
                                        />
                                        <p className="text-xs font-medium text-neutral-400">Provide a direct link to an image to use as your avatar</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700">First Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                            <input
                                                type="text"
                                                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
                                                value={profileData.firstName}
                                                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700">Last Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                            <input
                                                type="text"
                                                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
                                                value={profileData.lastName}
                                                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700">Contact Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                            <input
                                                type="email"
                                                className="w-full pl-12 pr-4 py-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 font-medium cursor-not-allowed"
                                                value={profileData.email}
                                                disabled
                                                title="Email cannot be changed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-neutral-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                            <input
                                                type="text"
                                                className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={profileLoading}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        <Save size={20} />
                                        {profileLoading ? 'Synchronizing...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Data Tabs */}
                {activeTab !== 'overview' && activeTab !== 'profile' && (
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200/60 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="p-10 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-50/50">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-neutral-900 tracking-tight capitalize">{activeTab} Database</h2>
                                <p className="text-neutral-500 font-medium">Manage and monitor live {activeTab} information</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-neutral-900 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder={`Filter by name, email or type...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12 pr-6 py-4 bg-white border border-neutral-200/80 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-900 w-full md:w-80 font-medium transition-all"
                                    />
                                </div>
                                <button className="p-4 bg-white border border-neutral-200/80 rounded-[1.5rem] hover:bg-neutral-100 transition-colors shadow-sm">
                                    <Filter size={20} className="text-neutral-600" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                {activeTab === 'users' && (
                                    <>
                                        <thead className="bg-neutral-50">
                                            <tr>
                                                <th className="px-10 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Principal</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Identity</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Lifecycle</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Timeline</th>
                                                <th className="px-10 py-6 text-right text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Ops</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {filteredData().map((u: any) => (
                                                <tr key={u._id} className="group hover:bg-neutral-50/80 transition-all duration-300">
                                                    <td className="px-10 py-7">
                                                        <div className="flex items-center gap-5">
                                                            <div className="h-14 w-14 rounded-[1.2rem] bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                                                                {u.firstName[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-neutral-900 text-lg uppercase tracking-tight">{u.firstName} {u.lastName}</p>
                                                                <p className="text-neutral-400 font-bold">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-900 text-white' :
                                                            u.role === 'service_provider' ? 'bg-neutral-900 text-white' :
                                                                'bg-neutral-100 text-neutral-600'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-3 w-3 rounded-full ${u.isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500'}`}></div>
                                                            <span className={`text-sm font-black uppercase tracking-tighter ${u.isActive ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                                {u.isActive ? 'Active Mode' : 'Suspended'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-7 text-neutral-400 font-bold text-sm">
                                                        {new Date(u.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-10 py-7 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => toggleUserStatus(u._id)} className={`p-4 rounded-2xl transition-all ${u.isActive ? 'text-rose-600 hover:bg-rose-100 hover:scale-110' : 'text-emerald-600 hover:bg-emerald-100 hover:scale-110'}`} title={u.isActive ? 'Suspend User' : 'Activate User'}>
                                                                <UserX size={22} className={u.isActive ? 'rotate-0' : 'rotate-180 transition-transform duration-500'} />
                                                            </button>
                                                            <button onClick={() => deleteUser(u._id)} className="p-4 rounded-2xl text-red-600 hover:bg-red-100 hover:scale-110 transition-all" title="Delete Permanently">
                                                                <Trash2 size={22} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </>
                                )}

                                {activeTab === 'providers' && (
                                    <>
                                        <thead className="bg-neutral-50">
                                            <tr>
                                                <th className="px-10 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Specialist</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Profession</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Experience</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Certificate</th>
                                                <th className="px-10 py-6 text-right text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Ops</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {filteredData().map((p: any) => (
                                                <tr key={p._id} className="group hover:bg-neutral-50/80 transition-colors">
                                                    <td className="px-10 py-7">
                                                        <div className="flex items-center gap-5">
                                                            <div className="h-14 w-14 rounded-[1.2rem] bg-emerald-100 text-emerald-700 flex items-center justify-center font-black group-hover:bg-emerald-200 transition-colors">
                                                                {p.userId.firstName[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-neutral-900 uppercase tracking-tight">{p.userId.firstName} {p.userId.lastName}</p>
                                                                <p className="text-neutral-400 font-bold text-sm">{p.userId.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-7 font-black text-neutral-700 uppercase italic tracking-tighter">{p.profession}</td>
                                                    <td className="px-6 py-7 text-neutral-900 font-black">{p.experience} Years</td>
                                                    <td className="px-6 py-7">
                                                        {p.isVerified ? (
                                                            <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl w-fit">
                                                                <ShieldCheck size={14} /> Official
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl w-fit">
                                                                <Clock size={14} /> Pending
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-10 py-7 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            {!p.isVerified && (
                                                                <button onClick={() => verifyProvider(p._id)} className="bg-neutral-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all hover:shadow-lg active:scale-95" title="Verify Provider">
                                                                    Authorize
                                                                </button>
                                                            )}
                                                            <button onClick={() => removeProvider(p._id)} className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm" title="Remove Provider Listing">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </>
                                )}

                                {activeTab === 'bookings' && (
                                    <>
                                        <thead className="bg-neutral-50">
                                            <tr>
                                                <th className="px-10 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Trans ID</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Stakeholders</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Volume</th>
                                                <th className="px-10 py-6 text-right text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Link</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {filteredData().map((b: any) => (
                                                <tr key={b._id} className="group hover:bg-neutral-50/80 transition-colors">
                                                    <td className="px-10 py-7">
                                                        <p className="font-mono text-xs font-black text-neutral-400">#SC-{b._id.slice(-6).toUpperCase()}</p>
                                                        <p className="font-black text-neutral-900 mt-1 uppercase text-sm tracking-tight">{b.serviceType}</p>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex -space-x-3">
                                                                <div className="h-10 w-10 rounded-full border-2 border-white bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black uppercase ring-2 ring-neutral-50">{b.customerId?.firstName?.[0]}</div>
                                                                <div className="h-10 w-10 rounded-full border-2 border-white bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black uppercase ring-2 ring-neutral-50">{b.serviceProviderId?.userId?.firstName?.[0]}</div>
                                                            </div>
                                                            <span className="text-neutral-500 font-bold text-sm tracking-tighter">Client x Specialist</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <select
                                                            value={b.status}
                                                            onChange={(e) => updateBookingStatus(b._id, e.target.value)}
                                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none border border-transparent hover:border-neutral-200 transition-all ${
                                                                b.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                                                b.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                                                b.status === 'cancelled' ? 'bg-rose-50 text-rose-700' :
                                                                'bg-indigo-50 text-indigo-700'
                                                            }`}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="in_progress">In Progress</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <p className="text-xl font-black text-neutral-900">₹{b.totalAmount}</p>
                                                        <p className="text-[10px] text-neutral-400 font-black uppercase tracking-tight">{new Date(b.scheduledDate).toLocaleDateString()}</p>
                                                    </td>
                                                    <td className="px-10 py-7 text-right">
                                                        <button className="p-4 rounded-2xl bg-neutral-100 text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all shadow-sm">
                                                            <ExternalLink size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </>
                                )}

                                {activeTab === 'reviews' && (
                                    <>
                                        <thead className="bg-neutral-50">
                                            <tr>
                                                <th className="px-10 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Context</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Rating</th>
                                                <th className="px-6 py-6 text-left text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Content</th>
                                                <th className="px-10 py-6 text-right text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Ops</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {reviews.map((r: any) => (
                                                <tr key={r._id} className="group hover:bg-neutral-50/80 transition-colors">
                                                    <td className="px-10 py-7">
                                                        <p className="font-black text-neutral-900 uppercase text-sm tracking-tight">{r.customerId?.firstName} → {r.serviceProviderId?.userId?.firstName}</p>
                                                        <p className="text-[10px] text-neutral-400 font-black uppercase tracking-tight mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={16} className={i < r.rating ? "text-amber-500 fill-amber-500" : "text-neutral-200"} />
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <p className="text-sm font-medium text-neutral-600 line-clamp-2 max-w-md">{r.comment}</p>
                                                    </td>
                                                    <td className="px-10 py-7 text-right">
                                                        <button onClick={() => deleteReview(r._id)} className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Delete Review">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </>
                                )}
                            </table>
                        </div>
                        {filteredData().length === 0 && (
                            <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="h-24 w-24 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300">
                                    <Search size={40} />
                                </div>
                                <h4 className="text-2xl font-black text-neutral-900 uppercase">No Data Records Found</h4>
                                <p className="text-neutral-500 max-w-xs font-medium">We couldn't find any results matching your current filters or search parameters.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

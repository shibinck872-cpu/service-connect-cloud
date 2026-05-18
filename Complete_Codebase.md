# Complete Codebase for Service Connect App

## File: `frontend\src\admin\AdminDashboard.tsx`

```typescript
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
    Filter
} from 'lucide-react';

interface Stats {
    totalUsers: number;
    totalProviders: number;
    totalBookings: number;
    pendingVerifications: number;
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
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'providers' | 'bookings'>('overview');
    const [searchTerm, setSearchTerm] = useState('');

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

                    <nav className="inline-flex bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-neutral-200/60 sticky top-4 z-10 transition-all hover:shadow-md">
                        {(['overview', 'users', 'providers', 'bookings'] as const).map((tab) => (
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
                                { label: 'Total Base', value: stats?.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100/50' },
                                { label: 'Experts', value: stats?.totalProviders, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
                                { label: 'Total Ops', value: stats?.totalBookings, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-100/50' },
                                { label: 'Verification Queue', value: stats?.pendingVerifications, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100/50' },
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

                {/* Data Tabs */}
                {activeTab !== 'overview' && (
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
                                                        <button onClick={() => toggleUserStatus(u._id)} className={`p-4 rounded-2xl transition-all ${u.isActive ? 'text-rose-600 hover:bg-rose-100 hover:scale-110' : 'text-emerald-600 hover:bg-emerald-100 hover:scale-110'}`}>
                                                            <UserX size={22} className={u.isActive ? 'rotate-0' : 'rotate-180 transition-transform duration-500'} />
                                                        </button>
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
                                                        {!p.isVerified && (
                                                            <button onClick={() => verifyProvider(p._id)} className="bg-neutral-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all hover:shadow-lg active:scale-95">
                                                                Authorize Access
                                                            </button>
                                                        )}
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
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${b.status === 'completed' ? 'bg-emerald-500 text-white' :
                                                            b.status === 'pending' ? 'bg-amber-500 text-white' :
                                                                'bg-indigo-500 text-white'
                                                            }`}>
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-7">
                                                        <p className="text-xl font-black text-neutral-900">${b.totalAmount}</p>
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

```

## File: `frontend\src\admin\BookingDetailsPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import ChatWindow from '../components/ChatWindow';
import PaymentButton from '../components/PaymentButton';
import { Calendar, Clock, MapPin, XCircle, Mail, Phone } from 'lucide-react';

interface Booking {
  _id: string;
  serviceType: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  isEmergency: boolean;
  estimatedHours: number;
  totalAmount: number;
  paymentStatus: string;
  customerId: {
    firstName: string;
    lastName: string;
  };
  serviceProviderId: {
    businessName?: string;
    userId: {
      firstName: string;
      lastName: string;
    };
  };
}

const BookingDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      setBooking(response.data);
    } catch (error) {
      toast.error('Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success('Status updated');
      fetchBooking();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Booking not found</p>
        </div>
      </div>
    );
  }

  const isCustomer = user?.role === 'customer';
  const isProvider = user?.role === 'service_provider';
  const providerName = booking.serviceProviderId?.businessName ||
    `${booking.serviceProviderId?.userId?.firstName} ${booking.serviceProviderId?.userId?.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Header & Progress Tracker */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Booking Reference</p>
              <h1 className="text-xl font-mono font-bold text-gray-900">#{booking._id.slice(-8).toUpperCase()}</h1>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${booking.status === 'completed' ? 'bg-green-500 text-white' :
                booking.status === 'confirmed' ? 'bg-blue-500 text-white' :
                  booking.status === 'in_progress' ? 'bg-amber-500 text-white' :
                    booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                      'bg-gray-400 text-white'
                }`}>
                {booking.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
              <div
                style={{
                  width:
                    booking.status === 'pending' ? '25%' :
                      booking.status === 'confirmed' ? '50%' :
                        booking.status === 'in_progress' ? '75%' :
                          booking.status === 'completed' ? '100%' : '0%'
                }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${booking.status === 'cancelled' ? 'bg-red-500 w-full' : 'bg-primary-600'
                  }`}
              ></div>
            </div>
            <div className="flex text-xs text-gray-500 justify-between font-medium">
              <span className={booking.status === 'pending' ? 'text-primary-600 font-bold' : ''}>Requested</span>
              <span className={booking.status === 'confirmed' ? 'text-primary-600 font-bold' : ''}>Confirmed</span>
              <span className={booking.status === 'in_progress' ? 'text-primary-600 font-bold' : ''}>In Progress</span>
              <span className={booking.status === 'completed' ? 'text-primary-600 font-bold' : ''}>Completed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Service Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Service Requested</h3>
                  <p className="text-xl font-bold text-gray-900 capitalize">{booking.serviceType}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Task Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                    "{booking.description}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Calendar className="h-6 w-6 text-primary-600 mr-4" />
                    <div>
                      <p className="text-xs text-gray-500">Scheduled Date</p>
                      <p className="font-bold text-gray-900">{new Date(booking.scheduledDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Clock className="h-6 w-6 text-primary-600 mr-4" />
                    <div>
                      <p className="text-xs text-gray-500">Preferred Time</p>
                      <p className="font-bold text-gray-900">{booking.scheduledTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                  <MapPin className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Service Location</p>
                    <p className="font-bold text-gray-900 leading-snug">
                      {booking.location.address}<br />
                      {booking.location.city}, {booking.location.state} {booking.location.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Communication Center</h2>
                <span className="text-xs text-green-500 font-bold flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  Live Chat
                </span>
              </div>
              <ChatWindow bookingId={id!} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Payment & Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-primary-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Price Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Base Rate</span>
                  <span className="font-medium">${(booking.totalAmount / (booking.isEmergency ? 1.5 : 1)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Time</span>
                  <span className="font-medium">{booking.estimatedHours} hrs</span>
                </div>
                {booking.isEmergency && (
                  <div className="flex justify-between text-red-500 font-bold text-sm">
                    <span>Emergency Surcharge (50%)</span>
                    <span>Included</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-900 font-bold">Grand Total</span>
                    <span className="text-3xl font-black text-primary-600">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className={`w-full py-2 rounded-lg text-center font-bold text-xs uppercase tracking-widest ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {booking.paymentStatus === 'paid' ? 'Invoice Paid' : 'Payment Required'}
                  </div>
                </div>

                {isCustomer && booking.paymentStatus === 'pending' && booking.status === 'completed' && (
                  <div className="pt-4">
                    <PaymentButton bookingId={booking._id} amount={booking.totalAmount} onSuccess={fetchBooking} />
                  </div>
                )}
              </div>
            </div>

            {/* Provider Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {isCustomer ? 'Your Service Expert' : 'Client Profile'}
              </h3>
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-black text-xl mr-4 shadow-inner">
                  {(isCustomer ? providerName : booking.customerId.firstName).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">
                    {isCustomer ? providerName : `${booking.customerId.firstName} ${booking.customerId.lastName}`}
                  </h4>
                  <p className="text-sm text-gray-500">Service Professional</p>
                </div>
              </div>

              <div className="space-y-3">
                {isProvider && (
                  <>
                    <div className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors cursor-pointer">
                      <Mail className="h-4 w-4 mr-3" />
                      {(booking.customerId as any).email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors cursor-pointer">
                      <Phone className="h-4 w-4 mr-3" />
                      {(booking.customerId as any).phone}
                    </div>
                  </>
                )}
                <button className="w-full mt-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                  View Full Profile
                </button>
              </div>
            </div>

            {/* Cancellation Action */}
            {isCustomer && booking.status === 'pending' && (
              <button
                onClick={() => updateStatus('cancelled')}
                className="w-full flex items-center justify-center py-4 px-4 rounded-2xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all group"
              >
                <XCircle className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                Cancel Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;


```

## File: `frontend\src\admin\BrowseProvidersPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search, Star, MapPin, Shield, Filter, ArrowRight } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

interface ServiceProvider {
  _id: string;
  businessName?: string;
  serviceTypes: string[];
  hourlyRate: number;
  location: {
    city: string;
    state: string;
  };
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  userId: {
    firstName: string;
    lastName: string;
  };
}

const BrowseProvidersPage = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    fetchProviders();
  }, [serviceType, minRating]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (serviceType) params.serviceType = serviceType;
      if (minRating) params.minRating = minRating;

      const response = await api.get('/service-providers', { params });
      setProviders(response.data);
    } catch (error) {
      toast.error('Failed to load service providers');
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const name = provider.businessName || `${provider.userId.firstName} ${provider.userId.lastName}`;
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.serviceTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      provider.location.city.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-dark-900 text-white relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-heading mb-4">
            Find <span className="text-gradient">Elite Professionals</span>
          </h1>
          <p className="text-dark-300 max-w-2xl mx-auto">
            Connect with verified experts for your next project.
            Quality assured, satisfaction guaranteed.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl border-white/5 p-6 mb-12 shadow-xl shadow-black/20">
          <div className="flex items-center space-x-2 mb-6 text-primary-400">
            <Filter className="h-5 w-5" />
            <h2 className="font-semibold text-lg">Refine Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, service, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>

            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer hover:bg-dark-700"
            >
              <option value="">All Services</option>
              <option value="plumber">Plumber</option>
              <option value="electrician">Electrician</option>
              <option value="mechanic">Mechanic</option>
              <option value="carpenter">Carpenter</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer hover:bg-dark-700"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>

            <button
              onClick={() => {
                setServiceType('');
                setMinRating('');
                setSearchTerm('');
              }}
              className="px-4 py-3 text-dark-300 border border-dark-600 rounded-xl hover:bg-dark-700 hover:text-white transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Providers List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-dark-800 rounded-2xl"></div>
            ))}
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-20 bg-dark-800/30 rounded-3xl border border-white/5">
            <Search className="h-16 w-16 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-300 text-lg">No providers found matching your criteria.</p>
            <button
              onClick={() => {
                setServiceType('');
                setMinRating('');
                setSearchTerm('');
              }}
              className="mt-4 text-primary-400 hover:text-primary-300 font-medium"
            >
              Clear filters and try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {filteredProviders.map((provider) => {
              const name = provider.businessName || `${provider.userId.firstName} ${provider.userId.lastName}`;
              return (
                <Link
                  key={provider._id}
                  to={`/providers/${provider._id}`}
                  className="group bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-dark-800 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors mb-1">{name}</h3>
                      <div className="flex items-center space-x-2 text-dark-400">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">
                          {provider.location.city}, {provider.location.state}
                        </span>
                      </div>
                    </div>
                    {provider.isVerified && (
                      <div className="bg-primary-500/10 p-2 rounded-lg" title="Verified Professional">
                        <Shield className="h-5 w-5 text-primary-400" />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {provider.serviceTypes.slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-dark-700/50 border border-white/5 text-dark-300 text-xs font-medium rounded-lg capitalize group-hover:border-primary-500/30 transition-colors"
                        >
                          {type}
                        </span>
                      ))}
                      {provider.serviceTypes.length > 3 && (
                        <span className="px-3 py-1 bg-dark-700/50 border border-white/5 text-dark-400 text-xs font-medium rounded-lg">
                          +{provider.serviceTypes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center space-x-1.5">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-white">
                        {provider.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-dark-400">
                        ({provider.totalReviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-white">
                        ${provider.hourlyRate}<span className="text-xs text-dark-400 font-normal">/hr</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    View Profile <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseProvidersPage;


```

## File: `frontend\src\admin\ChangePasswordPage.tsx`

```typescript
import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Navigate } from 'react-router-dom';
import { Key, Save, ArrowLeft, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const ChangePasswordPage = () => {
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);

        try {
            const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    }),
  }
);

            const data = await response.json();

            if (response.ok) {
                toast.success('Password changed successfully');
                navigate('/profile');
            } else {
                toast.error(data.message || 'Change password failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={formData.currentPassword}
                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-gray-50">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition-all disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {loading ? 'Changing...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;

```

## File: `frontend\src\admin\CreateBookingPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

interface ServiceProvider {
  _id: string;
  businessName?: string;
  hourlyRate: number;
  serviceTypes: string[];
  userId: {
    firstName: string;
    lastName: string;
  };
}

const CreateBookingPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    scheduledDate: '',
    scheduledTime: '',
    estimatedHours: 2,
    isEmergency: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (providerId) {
      fetchProvider();
    }
  }, [providerId]);

  const fetchProvider = async () => {
    try {
      const response = await api.get(`/service-providers/${providerId}`);
      setProvider(response.data);
      if (response.data.serviceTypes.length > 0) {
        setFormData(prev => ({
          ...prev,
          serviceType: response.data.serviceTypes[0]
        }));
      }
    } catch (error) {
      toast.error('Failed to load provider');
      navigate('/providers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get user's location if available
      let coordinates = { lat: 0, lng: 0 };
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      }

      const bookingData = {
        serviceProviderId: providerId,
        ...formData,
        location: {
          ...formData,
          coordinates,
        },
        scheduledDate: new Date(formData.scheduledDate),
      };

      const response = await api.post('/bookings', bookingData);
      toast.success('Booking created successfully!');
      navigate(`/bookings/${response.data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return null;
  }

  const name = provider.businessName || `${provider.userId.firstName} ${provider.userId.lastName}`;
  const totalAmount = provider.hourlyRate * formData.estimatedHours * (formData.isEmergency ? 1.5 : 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Book Service</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{name}</h2>
          <p className="text-gray-600 mb-4">Rate: ${provider.hourlyRate}/hour</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                required
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select service type</option>
                {provider.serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the service you need..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date
                </label>
                <input
                  required
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Time
                </label>
                <input
                  required
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Service Address
              </label>
              <div className="grid grid-cols-1 gap-4">
                <input
                  required
                  type="text"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    required
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    required
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    required
                    type="text"
                    placeholder="ZIP"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Hours
              </label>
              <input
                required
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="emergency"
                checked={formData.isEmergency}
                onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="emergency" className="ml-2 flex items-center text-sm text-gray-700">
                <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                Emergency service (50% surcharge)
              </label>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-primary-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              {formData.isEmergency && (
                <p className="text-sm text-gray-600 mt-2">
                  *Emergency service includes 50% surcharge
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating Booking...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingPage;


```

## File: `frontend\src\admin\CustomerDashboardPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/authStore';
import { Wrench, Plus, Clock, Star, Calendar, ChevronRight, Zap, Droplet, Truck, Paintbrush, Hammer, Search } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

interface Booking {
  _id: string;
  serviceType: string;
  status: string;
  scheduledDate: string;
  totalAmount: number;
  serviceProviderId: {
    businessName?: string;
    userId: {
      firstName: string;
      lastName: string;
    };
  };
}

const CustomerDashboardPage = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load bookings', error);
      // toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Plumber', icon: Droplet, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { name: 'Electrician', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { name: 'Mechanic', icon: Wrench, color: 'text-red-400', bg: 'bg-red-500/20' },
    { name: 'Carpenter', icon: Hammer, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { name: 'Painter', icon: Paintbrush, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { name: 'Movers', icon: Truck, color: 'text-green-400', bg: 'bg-green-500/20' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold font-heading mb-2">
              Hello, <span className="text-gradient">{user?.firstName}</span>
            </h1>
            <p className="text-dark-300">Ready to find the perfect professional?</p>
          </div>
          <Link
            to="/providers"
            className="mt-4 md:mt-0 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Browse All Providers
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="mb-12 animate-slide-up">
          <h2 className="text-xl font-bold font-heading mb-6 flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-primary-400" />
            Quick Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/providers?category=${cat.name.toLowerCase()}`}
                className="glass-card p-6 rounded-2xl border-white/5 hover:border-primary-500/30 hover:bg-dark-800 transition-all duration-300 group text-center flex flex-col items-center"
              >
                <div className={`p-4 rounded-full mb-3 ${cat.bg} group-hover:scale-110 transition-transform`}>
                  <cat.icon className={`h-6 w-6 ${cat.color}`} />
                </div>
                <span className="font-semibold text-dark-200 group-hover:text-white transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Active Bookings Section */}
          <div className="lg:col-span-2 glass-card rounded-2xl border-white/5 p-8 animate-fade-in delay-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-heading flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-primary-400" />
                Active Bookings
              </h2>
              <Link to="/my-bookings" className="text-sm text-primary-400 hover:text-primary-300 font-medium hover:underline">
                View History
              </Link>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 bg-dark-800 rounded-xl"></div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-dark-800/50 rounded-xl border border-white/5 border-dashed">
                <Calendar className="h-12 w-12 text-dark-500 mx-auto mb-4" />
                <p className="text-dark-300 mb-6">No active bookings</p>
                <Link
                  to="/providers"
                  className="inline-flex items-center text-primary-400 hover:text-primary-300 font-bold"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Book a Service
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Link
                    key={booking._id}
                    to={`/bookings/${booking._id}`}
                    className="flex justify-between items-center p-5 bg-dark-800/50 border border-white/5 rounded-xl hover:border-primary-500/30 hover:bg-dark-800 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-dark-700 flex items-center justify-center text-dark-300 font-bold border border-white/5">
                        {booking.serviceType.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white capitalize group-hover:text-primary-400 transition-colors">
                          {booking.serviceType}
                        </h3>
                        <p className="text-sm text-dark-400">
                          with {booking.serviceProviderId?.businessName ||
                            `${booking.serviceProviderId?.userId?.firstName} ${booking.serviceProviderId?.userId?.lastName}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-1 ${booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                          booking.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-dark-700 text-dark-300'
                        }`}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-sm text-dark-400 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Side Panel */}
          <div className="glass-card rounded-2xl border-white/5 p-8 h-fit animate-fade-in delay-200">
            <h2 className="text-xl font-bold font-heading mb-6 text-white">Need Help?</h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <h3 className="font-bold text-yellow-100">Priority Support</h3>
                </div>
                <p className="text-sm text-yellow-200/70 mb-3">Get faster responses for urgent issues.</p>
                <button className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-sm font-bold rounded-lg transition-colors border border-yellow-500/30">
                  Contact Support
                </button>
              </div>

              <Link to="/my-bookings" className="flex items-center justify-between p-4 bg-dark-800/50 hover:bg-dark-800 rounded-xl transition-colors group">
                <span className="text-dark-200 group-hover:text-white font-medium">Past Bookings</span>
                <ChevronRight className="h-4 w-4 text-dark-400 group-hover:text-white" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboardPage;


```

## File: `frontend\src\admin\HomePage.tsx`

```typescript
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Wrench, Zap, Car, Hammer, Shield, Clock, Star, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';
import Chatbot from '../components/Chatbot';

const HomePage = () => {
  const services = [
    { icon: Wrench, name: 'Plumbing', desc: 'Expert pipe repairs & installation', color: 'from-blue-500 to-cyan-400' },
    { icon: Zap, name: 'Electrical', desc: 'Certified electricians', color: 'from-yellow-500 to-amber-400' },
    { icon: Car, name: 'Mechanic', desc: 'Auto maintenance & diagnostics', color: 'from-green-500 to-emerald-400' },
    { icon: Hammer, name: 'Carpentry', desc: 'Custom woodwork & repairs', color: 'from-orange-500 to-red-400' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'Strict background checks ensure your safety and peace of mind.'
    },
    {
      icon: Clock,
      title: 'Instant Booking',
      description: 'Book services in as little as 60 seconds with our optimized flow.'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Top-rated providers delivering excellence in every job.'
    },
    {
      icon: MessageCircle,
      title: '24/7 Support',
      description: 'Our dedicated team is always here to help you anytime.'
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary-500/20 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border-primary-500/30 mb-8 animate-slide-up">
            <span className="flex h-2 w-2 rounded-full bg-primary-400 mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-primary-300">#1 Trusted Service Marketplace</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 font-heading">
            Mastery at Your <br />
            <span className="text-gradient">Fingertips</span>
          </h1>

          <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the new standard in home services. From quick fixes to major renovations, connect with elite professionals instantly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="group bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300 flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/providers"
              className="px-8 py-4 rounded-xl font-bold text-white glass-card hover:bg-white/10 transition-all duration-300"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Elite Services</h2>
            <p className="text-dark-400">Curated for excellence, delivered with precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.name}
                  to="/providers"
                  className="group glass-card p-8 rounded-2xl hover:border-primary-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-6 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all`}>
                    <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">{service.name}</h3>
                  <p className="text-sm text-dark-400">{service.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold font-heading mb-6">
                Why Top Tier Clients <br />
                <span className="text-gradient">Choose Us</span>
              </h2>
              <p className="text-dark-300 mb-8 text-lg">
                We don't just connect you; we ensure a seamless, premium experience from start to finish.
              </p>

              <div className="space-y-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                      <p className="text-dark-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl blur-2xl opacity-20 transform rotate-3"></div>
              <div className="glass-card p-8 rounded-3xl relative border-none bg-dark-800">
                <div className="grid gap-6">
                  {/* Mock UI Elements for Visual Interest */}
                  <div className="flex items-center gap-4 p-4 bg-dark-900/50 rounded-xl">
                    <div className="h-10 w-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <div className="h-2 w-24 bg-dark-700 rounded mb-2"></div>
                      <div className="h-2 w-16 bg-dark-700 rounded"></div>
                    </div>
                    <div className="ml-auto text-primary-400 font-bold">5.0</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-dark-900/50 rounded-xl opacity-75">
                    <div className="h-10 w-10 rounded-full bg-secondary-500/20 flex items-center justify-center text-secondary-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="h-2 w-32 bg-dark-700 rounded mb-2"></div>
                      <div className="h-2 w-20 bg-dark-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative glass-card rounded-3xl p-12 text-center border-primary-500/20 overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
              <Zap className="h-64 w-64 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">Ready to Upgrade?</h2>
            <p className="text-xl text-dark-200 mb-10 max-w-2xl mx-auto">
              Join the exclusive network of top-rated professionals and discerning clients.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-dark-900 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default HomePage;


```

## File: `frontend\src\admin\LoginPage.tsx`

```typescript
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { Logo } from '../components/Logo';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for identifier (Email or 10-digit phone)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(formData.identifier) && !phoneRegex.test(formData.identifier)) {
      toast.error('Please enter a valid email or 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      setAuth(response.data.user, response.data.token);
      const roleName = response.data.user.role === 'service_provider' ? 'Service Provider' : 'Customer';
      toast.success(`Login successful! Signed in as ${roleName}`);
      navigate(response.data.user.role === 'service_provider' ? '/provider/dashboard' : '/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 pointer-events-none" />
      <Navbar />

      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl animate-fade-in">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex justify-center mb-4">
              <div className="bg-primary-500/20 p-4 rounded-full">
                <Logo className="h-10 w-10 text-primary-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold font-heading">
              Welcome Back
            </h2>
            <p className="mt-2 text-dark-300">
              Sign in to manage your services
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-dark-200 mb-1">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-dark-400" />
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-dark-600 rounded-xl leading-5 bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
                    placeholder="Enter email or 10-digit phone"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-dark-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-10 pr-10 py-3 border border-dark-600 rounded-xl leading-5 bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-dark-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-400 hover:text-primary-300">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all transform active:scale-95"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-dark-300">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300">
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


```

## File: `frontend\src\admin\MyBookingsPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface Booking {
  _id: string;
  serviceType: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  totalAmount: number;
  location: {
    city: string;
    state: string;
  };
  customerId?: {
    firstName: string;
    lastName: string;
  };
  serviceProviderId: {
    businessName?: string;
    userId: {
      firstName: string;
      lastName: string;
    };
  };
}

const MyBookingsPage = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          {user?.role === 'customer' && (
            <Link
              to="/providers"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Find Providers
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-2">
            {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">No bookings found</p>
            {user?.role === 'customer' && (
              <Link
                to="/providers"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Browse Service Providers
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const providerName = booking.serviceProviderId?.businessName || 
                `${booking.serviceProviderId?.userId?.firstName} ${booking.serviceProviderId?.userId?.lastName}`;
              const customerName = booking.customerId 
                ? `${booking.customerId.firstName} ${booking.customerId.lastName}`
                : '';

              return (
                <Link
                  key={booking._id}
                  to={`/bookings/${booking._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 capitalize">
                          {booking.serviceType}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{booking.scheduledTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.location.city}, {booking.location.state}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-3">
                        {user?.role === 'customer' 
                          ? `Provider: ${providerName}`
                          : `Customer: ${customerName}`}
                      </p>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-primary-600">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                      <ArrowRight className="h-5 w-5 text-gray-400 mt-2 ml-auto" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;


```

## File: `frontend\src\admin\ProfilePage.tsx`

```typescript
import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Navigate } from 'react-router-dom';
import { User, Phone, Mail, Camera, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
    const { user, updateUser, token } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profilePhoto: user?.profilePhoto || '',
    });

    if (!user) {
        return <Navigate to="/login" />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                updateUser(data.user);
                toast.success('Profile updated successfully');
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Photo Section */}
                            <div className="flex flex-col items-center sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-50">
                                <div className="relative group">
                                    {formData.profilePhoto ? (
                                        <img
                                            src={formData.profilePhoto}
                                            alt="Profile"
                                            className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                                        />
                                    ) : (
                                        <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-md">
                                            <User className="h-10 w-10 text-primary-600" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-sm font-medium text-gray-900">Profile Photo</h3>
                                    <p className="text-xs text-gray-500 mt-1 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                                    <input
                                        type="text"
                                        placeholder="Paste image URL here"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                        value={formData.profilePhoto}
                                        onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="email"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-gray-50"
                                            value={formData.email}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-gray-50">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition-all disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

```

## File: `frontend\src\admin\ProviderProfilePage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Star, MapPin, Shield, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

interface ServiceProvider {
  _id: string;
  businessName?: string;
  serviceTypes: string[];
  hourlyRate: number;
  experience: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  description: string;
  userId: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  customerId: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

const ProviderProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProvider();
      fetchReviews();
    }
  }, [id]);

  const fetchProvider = async () => {
    try {
      const response = await api.get(`/service-providers/${id}`);
      setProvider(response.data);
    } catch (error) {
      toast.error('Failed to load provider');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/provider/${id}`);
      setReviews(response.data);
    } catch (error) {
      // Reviews might not exist yet
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Provider not found</h2>
          <Link to="/providers" className="text-primary-400 hover:text-primary-300">
            Return to Browse
          </Link>
        </div>
      </div>
    );
  }

  const name = provider.businessName || `${provider.userId.firstName} ${provider.userId.lastName}`;

  return (
    <div className="min-h-screen bg-dark-900 text-white relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative min-h-screen">
        <Link to="/providers" className="inline-flex items-center text-dark-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Providers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-2xl border-white/5 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Shield className="h-32 w-32" />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-4xl font-bold font-heading">{name}</h1>
                      {provider.isVerified && (
                        <div title="Verified Professional">
                          <Shield className="h-6 w-6 text-primary-400 fill-primary-400/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-dark-300">
                      <MapPin className="h-5 w-5 text-primary-500" />
                      <span>
                        {provider.location.city}, {provider.location.state}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {provider.serviceTypes.map((type) => (
                    <span
                      key={type}
                      className="px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-300 rounded-lg capitalize font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-bold text-white mb-2">About</h3>
                  <p className="text-dark-300 leading-relaxed">{provider.description}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-6 rounded-2xl border-white/5 text-center">
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{provider.rating.toFixed(1)}</p>
                <p className="text-sm text-dark-400">{provider.totalReviews} reviews</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border-white/5 text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="h-8 w-8 text-primary-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{provider.experience}+</p>
                <p className="text-sm text-dark-400">Years Experience</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border-white/5 text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">100%</p>
                <p className="text-sm text-dark-400">Job Success</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="glass-card rounded-2xl border-white/5 p-8">
              <h2 className="text-2xl font-bold font-heading mb-6">Client Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-bold text-white">
                            {review.customerId.firstName} {review.customerId.lastName}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-dark-600'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-dark-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-dark-300 italic">"{review.comment}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-400 text-center py-8">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl border-white/5 p-6 sticky top-24 border-primary-500/20 shadow-2xl shadow-primary-900/20">
              <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>

              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                <span className="text-dark-300">Hourly Rate</span>
                <span className="text-2xl font-bold text-white">${provider.hourlyRate}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-dark-300 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Verified License
                </div>
                <div className="flex items-center text-dark-300 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Background Checked
                </div>
                <div className="flex items-center text-dark-300 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Satisfaction Guarantee
                </div>
              </div>

              {user && user.role === 'customer' ? (
                <Link
                  to={`/book/${provider._id}`}
                  className="block w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white text-center py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-95"
                >
                  Book Appointment
                </Link>
              ) : !user ? (
                <Link
                  to="/login"
                  className="block w-full bg-dark-700 text-white text-center py-4 rounded-xl font-bold hover:bg-dark-600 transition-all"
                >
                  Login to Book
                </Link>
              ) : (
                <div className="text-center p-4 bg-dark-800 rounded-xl text-dark-300 text-sm">
                  Providers cannot book other providers.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfilePage;


```

## File: `frontend\src\admin\RegisterPage.tsx`

```typescript
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { Logo } from '../components/Logo';
import { ArrowLeft, User, Mail, Phone, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'customer' as 'customer' | 'service_provider',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Phone number validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      setAuth(response.data.user, response.data.token);
      const roleName = response.data.user.role === 'service_provider' ? 'Service Provider' : 'Customer';
      toast.success(`Registration successful! Welcome, ${roleName}`);

      if (response.data.user.role === 'service_provider') {
        navigate('/provider/setup');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 pointer-events-none" />
      <Navbar />

      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl animate-fade-in">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex justify-center mb-4">
              <div className="bg-primary-500/20 p-4 rounded-full">
                <Logo className="h-10 w-10 text-primary-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold font-heading">
              Create Account
            </h2>
            <p className="mt-2 text-dark-300">
              Join our community today
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-dark-200 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-dark-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-dark-600 rounded-xl leading-5 bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-dark-200 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="block w-full px-3 py-3 border border-dark-600 rounded-xl leading-5 bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-200 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-dark-600 rounded-xl leading-5 bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-dark-200 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className="block w-full pl-10 pr-3 py-3 border border-dark-600 rounded-xl leading-5 bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
                  placeholder="Enter 10-digit phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-200 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-10 py-3 border border-dark-600 rounded-xl leading-5 bg-dark-800 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-dark-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`
                  relative flex flex-col items-center p-4 cursor-pointer rounded-xl border-2 transition-all
                  ${formData.role === 'customer'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-600 bg-dark-800 hover:border-dark-500'}
                `}>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={formData.role === 'customer'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'customer' | 'service_provider' })}
                    className="sr-only"
                  />
                  <span className="font-semibold">Customer</span>
                  {formData.role === 'customer' && (
                    <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary-500" />
                  )}
                </label>

                <label className={`
                  relative flex flex-col items-center p-4 cursor-pointer rounded-xl border-2 transition-all
                  ${formData.role === 'service_provider'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-600 bg-dark-800 hover:border-dark-500'}
                `}>
                  <input
                    type="radio"
                    name="role"
                    value="service_provider"
                    checked={formData.role === 'service_provider'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'customer' | 'service_provider' })}
                    className="sr-only"
                  />
                  <span className="font-semibold text-center">Provider</span>
                  {formData.role === 'service_provider' && (
                    <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary-500" />
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all transform active:scale-95"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-dark-300">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;


```

## File: `frontend\src\admin\ServiceProviderDashboard.tsx`

```typescript
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Clock, DollarSign, Calendar, AlertCircle, TrendingUp, Power, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
  _id: string;
  serviceType: string;
  status: string;
  scheduledDate: string;
  totalAmount: number;
  customerId: {
    firstName: string;
    lastName: string;
  };
}

interface ProviderStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalEarnings: number;
}

const ServiceProviderDashboard = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<ProviderStats>({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true); // Mock availability state

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      const bookingsData = response.data;
      setBookings(bookingsData.slice(0, 5));

      // Calculate stats
      const completed = bookingsData.filter((b: Booking) => b.status === 'completed');
      const pending = bookingsData.filter((b: Booking) =>
        ['pending', 'confirmed', 'in_progress'].includes(b.status)
      );
      const earnings = completed.reduce((sum: number, b: Booking) => sum + b.totalAmount, 0);

      setStats({
        totalBookings: bookingsData.length,
        completedBookings: completed.length,
        pendingBookings: pending.length,
        totalEarnings: earnings,
      });
    } catch (error) {
      //   toast.error('Failed to load dashboard data'); 
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = () => {
    // In a real app, this would make an API call
    setIsAvailable(!isAvailable);
    toast.success(isAvailable ? 'You are now offline' : 'You are now online');
  };

  const StatCard = ({ title, value, icon: Icon, color, prefix = '' }: any) => (
    <div className="glass-card p-6 rounded-2xl border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
        <Icon className={`h-20 w-20 ${color}`} />
      </div>
      <div className="relative z-10">
        <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <p className="text-dark-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{prefix}{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary-600/10 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 animate-fade-in gap-6">
          <div>
            <h1 className="text-4xl font-bold font-heading mb-2">
              Provider Dashboard
            </h1>
            <p className="text-dark-300">Manage your business and track performance.</p>
          </div>

          <div className="flex items-center gap-4 bg-dark-800/50 p-2 rounded-xl border border-white/5">
            <div className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isAvailable ? 'bg-green-500/20 text-green-400' : 'text-dark-400'}`}>
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="font-bold text-sm">Online</span>
            </div>
            <button
              onClick={toggleAvailability}
              className={`p-2 rounded-lg transition-all ${isAvailable ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'}`}
              title={isAvailable ? "Go Offline" : "Go Online"}
            >
              <Power className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
          <StatCard
            title="Total Earnings"
            value={stats.totalEarnings.toFixed(2)}
            icon={DollarSign}
            color="text-green-400"
            prefix="$"
          />
          <StatCard
            title="Active Jobs"
            value={stats.pendingBookings}
            icon={Clock}
            color="text-yellow-400"
          />
          <StatCard
            title="Completed"
            value={stats.completedBookings}
            icon={TrendingUp}
            color="text-primary-400"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Calendar}
            color="text-secondary-400"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            to="/provider/setup"
            className="group glass-card p-8 rounded-2xl border-white/5 hover:border-primary-500/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">Edit Profile</h3>
              <p className="text-dark-400">Update services, pricing, and business details</p>
            </div>
          </Link>

          <Link
            to="/my-bookings"
            className="group glass-card p-8 rounded-2xl border-white/5 hover:border-secondary-500/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">Manage Bookings</h3>
              <p className="text-dark-400">View upcoming jobs and booking requests</p>
            </div>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="glass-card rounded-2xl border-white/5 p-8 animate-fade-in delay-100">
          <h2 className="text-2xl font-bold font-heading mb-8">Recent Requests</h2>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-dark-800 rounded-xl"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-dark-800/50 rounded-xl border border-white/5">
              <AlertCircle className="h-12 w-12 text-dark-500 mx-auto mb-4" />
              <p className="text-dark-300 mb-2">No active bookings yet</p>
              <p className="text-sm text-dark-500">
                Optimize your profile to attract more customers
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Link
                  key={booking._id}
                  to={`/bookings/${booking._id}`}
                  className="block p-5 bg-dark-800/50 border border-white/5 rounded-xl hover:border-primary-500/30 hover:bg-dark-800 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-dark-700 flex items-center justify-center text-dark-300 font-bold border border-white/5">
                        {booking.serviceType.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white capitalize group-hover:text-primary-400 transition-colors">
                          {booking.serviceType}
                        </h3>
                        <p className="text-sm text-dark-300">
                          Client: {booking.customerId.firstName} {booking.customerId.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-2 ${booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                          booking.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-dark-700 text-dark-300'
                        }`}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-lg font-bold text-white">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;

```

## File: `frontend\src\admin\ServiceProviderProfileSetup.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import toast from 'react-hot-toast';
import { MapPin, DollarSign, Clock, FileText } from 'lucide-react';

interface ProfileData {
  businessName: string;
  serviceTypes: string[];
  experience: number;
  hourlyRate: number;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
}

const ServiceProviderProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    businessName: '',
    serviceTypes: [],
    experience: 0,
    hourlyRate: 0,
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: { lat: 0, lng: 0 },
    },
    availability: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '17:00', available: true },
      sunday: { start: '09:00', end: '17:00', available: false },
    },
  });

  const serviceTypeOptions = ['plumber', 'electrician', 'mechanic', 'carpenter', 'painter', 'handyman', 'other'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/service-providers/profile/me');
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      // Profile doesn't exist yet, that's ok
    } finally {
      setLoading(false);
    }
  };

  const handleServiceTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter(t => t !== type)
        : [...prev.serviceTypes, type]
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
          }
        }));
        toast.success('Location updated');
      }, () => {
        toast.error('Failed to get location');
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const existing = await api.get('/service-providers/profile/me').catch(() => null);
      
      if (existing?.data) {
        await api.put(`/service-providers/${existing.data._id}`, formData);
        toast.success('Profile updated successfully!');
      } else {
        await api.post('/service-providers', formData);
        toast.success('Profile created successfully!');
      }
      
      navigate('/provider/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Service Provider Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {serviceTypeOptions.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.serviceTypes.includes(type)}
                        onChange={() => handleServiceTypeToggle(type)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell customers about your services and expertise..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <MapPin className="h-5 w-5 inline mr-1" />
              Location
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                required
                placeholder="Street Address"
                value={formData.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={formData.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={formData.location.state}
                  onChange={(e) => handleLocationChange('state', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  required
                  placeholder="ZIP Code"
                  value={formData.location.zipCode}
                  onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Use Current Location
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || formData.serviceTypes.length === 0}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderProfileSetup;


```

## File: `frontend\src\api\api.ts`

```typescript
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';

      // Don't show toast for 401 errors (handled by auth redirect)
      if (error.response.status === 401) {
        const { logout } = useAuthStore.getState();
        logout();
        // Redirect handled by ProtectedRoute
      } else if (error.response.status >= 500) {
        toast.error('Server error. Please try again later.');
      }
      // Other errors will be handled by individual components
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default api;


```

## File: `frontend\src\App.tsx`

```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import HomePage from './admin/HomePage';
import LoginPage from './admin/LoginPage';
import RegisterPage from './admin/RegisterPage';
import CustomerDashboardPage from './admin/CustomerDashboardPage';
import BrowseProvidersPage from './admin/BrowseProvidersPage';
import ProviderProfilePage from './admin/ProviderProfilePage';
import CreateBookingPage from './admin/CreateBookingPage';
import BookingDetailsPage from './admin/BookingDetailsPage';
import MyBookingsPage from './admin/MyBookingsPage';
import ServiceProviderDashboard from './admin/ServiceProviderDashboard';
import ServiceProviderProfileSetup from './admin/ServiceProviderProfileSetup';
import ProfilePage from './admin/ProfilePage';
import ChangePasswordPage from './admin/ChangePasswordPage';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/providers" element={<BrowseProvidersPage />} />
        <Route path="/providers/:id" element={<ProviderProfilePage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:providerId"
          element={
            <ProtectedRoute>
              <CreateBookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute requiredRole="service_provider">
              <ServiceProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/setup"
          element={
            <ProtectedRoute requiredRole="service_provider">
              <ServiceProviderProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;


```

## File: `frontend\src\components\Chatbot.tsx`

```typescript
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import api from '../api/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: "Hello! I'm here to help you find skilled service providers. How can I assist you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/chatbot/chat', { message: input });
      const botMessage = { text: response.data.response, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const botMessage = { text: 'Sorry, I encountered an error. Please try again.', isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white p-4 rounded-full shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 hover:scale-105 transition-all z-50 animate-bounce-slow group"
        >
          <MessageCircle className="h-6 w-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] glass-card rounded-2xl shadow-2xl flex flex-col z-50 border border-white/10 animate-slide-up overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-white">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-bold">Service Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/95 scrollbar-thin scrollbar-thumb-dark-700">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.isBot
                      ? 'bg-dark-800 text-white border border-white/5 rounded-tl-sm'
                      : 'bg-primary-600 text-white rounded-br-sm shadow-md shadow-primary-900/20'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-dark-800 rounded-2xl p-3 border border-white/5 rounded-tl-sm flex space-x-1">
                  <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-dark-900 border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for plumbing, wiring..."
                className="w-full bg-dark-800 border border-dark-600 rounded-xl pl-4 pr-12 py-3 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;


```

## File: `frontend\src\components\ChatWindow.tsx`

```typescript
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, MessageCircle } from 'lucide-react';
import api from '../api/api';
import { useAuthStore } from '../store/authStore';

interface Message {
  bookingId: string;
  senderId: string;
  message: string;
  timestamp: Date;
}

interface ChatWindowProps {
  bookingId: string;
}

const ChatWindow = ({ bookingId }: ChatWindowProps) => {
  const { token, user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || !user) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}/messages`);
        const formattedMessages = response.data.map((msg: any) => ({
          bookingId: msg.bookingId,
          senderId: msg.senderId,
          message: msg.content,
          timestamp: new Date(msg.createdAt),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_booking', bookingId);
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [bookingId, token, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;

    socket.emit('send_message', {
      bookingId,
      message: input,
    });

    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <MessageCircle className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Conversation</h2>
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-12">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <MessageCircle className="h-12 w-12 text-gray-200" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">Secure Channel Established</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Start your conversation with the service professional here. All messages are encrypted and logged for your safety.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.senderId === user?.id || String(msg.senderId) === String(user?.id);
            return (
              <div
                key={idx}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isOwn
                      ? 'bg-primary-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                      }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 mt-1.5 px-1 uppercase tracking-tighter">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center bg-gray-50 rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all border border-transparent focus-within:border-primary-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message here..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 py-2 text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-primary-600 text-white p-2.5 rounded-lg hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-40 disabled:grayscale"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[9px] text-center text-gray-400 mt-2 font-medium uppercase tracking-widest">
          Press enter to transmit message
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;



```

## File: `frontend\src\components\Logo.tsx`

```typescript
import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8" }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" className="text-primary-600" fill="white" />
            <path
                d="M35 35 L65 35 L65 45 L45 45 L45 55 L65 55 L65 65 L35 65 L35 55 L55 55 L55 45 L35 45 Z"
                fill="currentColor"
                className="text-primary-600"
            />
            <circle cx="70" cy="30" r="10" fill="currentColor" className="text-primary-500" />
        </svg>
    );
};

export const LogoText: React.FC = () => (
    <div className="flex items-center gap-2">
        <Logo className="h-10 w-10 text-primary-600" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            Service Connect
        </span>
    </div>
);

```

## File: `frontend\src\components\Navbar.tsx`

```typescript
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { LogoText } from './Logo';
import {
  LogOut,
  User as UserIcon,
  Home,
  Settings,
  ShieldCheck,
  ShieldAlert,
  UserX,
  Trash2,
  Key
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <LogoText />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/providers"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Find Providers
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'service_provider' ? '/provider/dashboard' : '/dashboard'}
                  className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none group p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border-2 border-primary-500"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-500">
                        <UserIcon className="h-5 w-5 text-primary-600" />
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                      {user.firstName}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl py-2 border border-gray-100 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-200 origin-top-right">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-50">
                        <div className="flex items-center space-x-3">
                          {user.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt="Profile"
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-primary-600" />
                            </div>
                          )}
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-gray-900 truncate">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="text-xs text-gray-500 truncate">{user.email}</span>
                            <span className="text-xs text-gray-500 truncate">{user.phone}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-1">
                          {user.isVerified ? (
                            <div className="flex items-center text-green-600 text-[10px] font-bold uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600 text-[10px] font-bold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full">
                              <ShieldAlert className="h-3 w-3 mr-1" />
                              Pending Verification
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-bold transition-colors"
                          >
                            <ShieldCheck className="h-4 w-4 mr-3 text-indigo-500" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary-500" />
                          Update Profile
                        </Link>
                        <Link
                          to="/change-password"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        >
                          <Key className="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary-500" />
                          Change Password
                        </Link>
                      </div>

                      <div className="border-t border-gray-50 py-1">
                        <button
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to deactivate your account?')) {
                              try {
                                const response = await fetch('http://localhost:5000/api/auth/deactivate', {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${useAuthStore.getState().token}`,
                                  }
                                });
                                if (response.ok) {
                                  toast.success('Account deactivated');
                                  handleLogout();
                                } else {
                                  const errorData = await response.json();
                                  toast.error(errorData.message || 'Failed to deactivate account');
                                }
                              } catch (error) {
                                toast.error('Failed to deactivate');
                              }
                            }
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <UserX className="h-4 w-4 mr-3" />
                          Deactivate Account
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('CRITICAL: This will permanently delete your account details. Proceed?')) {
                              try {
                                const response = await fetch('http://localhost:5000/api/auth/account', {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${useAuthStore.getState().token}`,
                                  }
                                });
                                if (response.ok) {
                                  toast.success('Account deleted');
                                  handleLogout();
                                } else {
                                  const errorData = await response.json();
                                  toast.error(errorData.message || 'Failed to delete account');
                                }
                              } catch (error) {
                                toast.error('Failed to delete');
                              }
                            }
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          Delete Account
                        </button>
                      </div>

                      <div className="border-t border-gray-50 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors font-medium"
                        >
                          <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


```

## File: `frontend\src\components\PaymentButton.tsx`

```typescript
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/api';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface PaymentButtonProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}

const PaymentForm = ({ bookingId, amount, onSuccess }: PaymentButtonProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Payment system not ready. Please try again.');
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const { data } = await api.post('/payments/create-intent', { bookingId });
      
      if (!data.clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = data;

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        await api.post('/payments/confirm', { bookingId, paymentIntentId: paymentIntent.id });
        toast.success('Payment successful!');
        onSuccess();
      } else {
        toast.error('Payment was not successful. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed';
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

const PaymentButton = (props: PaymentButtonProps) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default PaymentButton;


```

## File: `frontend\src\components\ProtectedRoute.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'customer' | 'service_provider' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


```

## File: `frontend\src\index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: dark;
  color: rgba(255, 255, 255, 0.9);
  background-color: #0f172a; /* dark-900 */

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: #0f172a;
  background-image: 
    radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(245, 158, 11, 0.15) 0px, transparent 50%);
  color: #f8fafc;
}

.glass-card {
  @apply bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl;
}

.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600;
}

.text-gradient-secondary {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-600;
}

#root {
  width: 100%;
  min-height: 100vh;
}


```

## File: `frontend\src\main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


```

## File: `frontend\src\store\authStore.ts`

```typescript
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'service_provider' | 'admin';
  isVerified: boolean;
  profilePhoto?: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

const loadAuthFromStorage = () => {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { user: parsed.user, token: parsed.token };
    }
  } catch (error) {
    // Ignore errors
  }
  return { user: null, token: null };
};

const saveAuthToStorage = (user: User | null, token: string | null) => {
  try {
    if (user && token) {
      localStorage.setItem('auth-storage', JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem('auth-storage');
    }
  } catch (error) {
    // Ignore errors
  }
};

const initialState = loadAuthFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  token: initialState.token,
  setAuth: (user, token) => {
    saveAuthToStorage(user, token);
    set({ user, token });
  },
  updateUser: (updatedFields) => {
    set((state) => {
      const newUser = state.user ? { ...state.user, ...updatedFields } : null;
      if (newUser && state.token) {
        saveAuthToStorage(newUser, state.token);
      }
      return { user: newUser };
    });
  },
  logout: () => {
    saveAuthToStorage(null, null);
    set({ user: null, token: null });
  },
}));


```

## File: `frontend\src\vite-env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


```

## File: `backend\src\index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import serviceProviderRoutes from './routes/serviceProvider.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { initializeSocket } from './socket/socket.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/service-providers', serviceProviderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Service Connect API is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler as express.ErrorRequestHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize Socket.io
initializeSocket(io);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/service-connect')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;


```

## File: `backend\src\middleware\auth.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  body: any; // Ensure body property exists
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string; role: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};


```

## File: `backend\src\middleware\errorHandler.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appError = error as AppError;
  const statusCode = appError.statusCode || 500;
  const message = appError.message || error.message || 'Internal Server Error';

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
    method: req.method
  });

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


```

## File: `backend\src\models\Booking.model.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  customerId: mongoose.Types.ObjectId;
  serviceProviderId: mongoose.Types.ObjectId;
  serviceType: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  scheduledDate: Date;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  isEmergency: boolean;
  estimatedHours: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceProviderId: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  estimatedHours: {
    type: Number,
    required: true,
    min: 0.5
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);


```

## File: `backend\src\models\Message.model.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    bookingId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        index: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

```

## File: `backend\src\models\Review.model.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  _id: string;
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  serviceProviderId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceProviderId: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const Review = mongoose.model<IReview>('Review', ReviewSchema);


```

## File: `backend\src\models\ServiceProvider.model.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceProvider extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  businessName?: string;
  serviceTypes: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    documentUrl?: string;
  }>;
  experience: number;
  hourlyRate: number;
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  profileImage?: string;
  description: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceProviderSchema = new Schema<IServiceProvider>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    trim: true
  },
  serviceTypes: [{
    type: String,
    enum: ['plumber', 'electrician', 'mechanic', 'carpenter', 'painter', 'handyman', 'other']
  }],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    documentUrl: String
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    monday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    tuesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    wednesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    thursday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    friday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    saturday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: true }
    },
    sunday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      available: { type: Boolean, default: false }
    }
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  profileImage: String,
  description: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const ServiceProvider = mongoose.model<IServiceProvider>('ServiceProvider', ServiceProviderSchema);


```

## File: `backend\src\models\Subscription.model.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  _id: string;
  customerId: mongoose.Types.ObjectId;
  planType: 'basic' | 'premium' | 'enterprise';
  serviceTypes: string[];
  monthlyPrice: number;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planType: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    required: true
  },
  serviceTypes: [{
    type: String
  }],
  monthlyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);


```

## File: `backend\src\models\User.model.ts`

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'service_provider' | 'admin';
  isVerified: boolean;
  profilePhoto?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'service_provider', 'admin'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);


```

## File: `backend\src\routes\admin.routes.ts`

```typescript
import express from 'express';
import { User } from '../models/User.model.js';
import { Booking } from '../models/Booking.model.js';
import { ServiceProvider } from '../models/ServiceProvider.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(authenticate, authorize('admin'));

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isDeleted: false });
        const totalProviders = await ServiceProvider.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const pendingVerifications = await ServiceProvider.countDocuments({ isVerified: false });

        // Get recent bookings
        const recentBookings = await Booking.find()
            .populate('customerId', 'firstName lastName')
            .populate({
                path: 'serviceProviderId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalUsers,
                totalProviders,
                totalBookings,
                pendingVerifications
            },
            recentBookings
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get all service providers
router.get('/providers', async (req, res) => {
    try {
        const providers = await ServiceProvider.find()
            .populate('userId', 'firstName lastName email phone profilePhoto isVerified')
            .sort({ createdAt: -1 });
        res.json(providers);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('customerId', 'firstName lastName email')
            .populate({
                path: 'serviceProviderId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName email'
                }
            })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Verify a service provider
router.post('/providers/:id/verify', async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        provider.isVerified = true;
        await provider.save();

        // Also update the associated User model verification status
        await User.findByIdAndUpdate(provider.userId, { isVerified: true });

        res.json({ message: 'Provider verified successfully', provider });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle user active status
router.post('/users/:id/toggle-active', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

```

## File: `backend\src\routes\auth.routes.ts`

```typescript
import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { Request, Response } from 'express';

const router = express.Router();

// Register
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('phone').trim().isMobilePhone('any').withMessage('Please enter a valid phone number'),
    body('role').isIn(['customer', 'service_provider'])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, firstName, lastName, phone, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role,
        isVerified: role === 'customer' // Customers auto-verified, providers need manual verification
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          profilePhoto: user.profilePhoto,
          isActive: user.isActive
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Login
router.post('/login',
  [
    body('identifier').notEmpty().withMessage('Email or phone number is required'),
    body('password').notEmpty()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { identifier, password } = req.body;

      // Find user by email OR phone
      const user = await User.findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { phone: identifier }
        ]
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          profilePhoto: user.profilePhoto,
          isActive: user.isActive
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile
router.put('/profile', authenticate,
  [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('phone').optional().trim().isMobilePhone('any').withMessage('Please enter a valid phone number'),
    body('email').optional().isEmail().normalizeEmail(),
    body('profilePhoto').optional().isString()
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, phone, email, profilePhoto } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;
      if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: req.userId } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = email;
      }
      if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          profilePhoto: user.profilePhoto,
          isActive: user.isActive
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Change password
router.put('/change-password', authenticate,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid current password' });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Deactivate account
router.post('/deactivate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'Account deactivated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Delete account (soft delete)
router.delete('/account', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    user.isDeleted = true;
    await user.save();

    res.json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


```

## File: `backend\src\routes\booking.routes.ts`

```typescript
import express from 'express';
import { body, validationResult } from 'express-validator';
import { Booking } from '../models/Booking.model.js';
import { ServiceProvider } from '../models/ServiceProvider.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { compareObjectIds } from '../utils/objectId.js';
import { Message } from '../models/Message.model.js';

const router = express.Router();

// Create a booking
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create bookings' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      serviceProviderId,
      serviceType,
      description,
      location,
      scheduledDate,
      scheduledTime,
      isEmergency,
      estimatedHours
    } = req.body;

    // Validation
    if (!serviceProviderId || !serviceType || !description || !location || !scheduledDate || !scheduledTime || !estimatedHours) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (estimatedHours <= 0) {
      return res.status(400).json({ message: 'Estimated hours must be greater than 0' });
    }

    const provider = await ServiceProvider.findById(serviceProviderId);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    if (!provider.isVerified) {
      return res.status(400).json({ message: 'Service provider is not verified' });
    }

    const totalAmount = provider.hourlyRate * estimatedHours * (isEmergency ? 1.5 : 1);

    const booking = new Booking({
      customerId: req.userId,
      serviceProviderId,
      serviceType,
      description,
      location,
      scheduledDate,
      scheduledTime,
      isEmergency,
      estimatedHours,
      totalAmount,
      status: 'pending'
    });

    await booking.save();
    const populated = await booking.populate([
      { path: 'serviceProviderId', select: 'businessName hourlyRate' },
      { path: 'customerId', select: 'firstName lastName' }
    ]);

    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings for current user
router.get('/my-bookings', authenticate, async (req: AuthRequest, res) => {
  try {
    let query: any = {};

    if (req.userRole === 'customer') {
      query.customerId = req.userId;
    } else {
      // Find the ServiceProvider profile for this user
      const provider = await ServiceProvider.findOne({ userId: req.userId });
      if (!provider) {
        return res.json([]); // No profile = no bookings
      }
      query.serviceProviderId = provider._id;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'firstName lastName email phone')
      .populate('serviceProviderId', 'businessName hourlyRate')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single booking
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'firstName lastName email phone')
      .populate('serviceProviderId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization: Must be the customer OR the provider
    // Safely extract IDs whether they are strings, ObjectIds, or populated objects
    const bookingCustomerId = (booking.customerId as any)?._id?.toString() || booking.customerId?.toString();
    const isCustomer = bookingCustomerId === req.userId;

    const providerProfile = booking.serviceProviderId as any;
    const providerUserId = providerProfile?.userId?._id?.toString() || providerProfile?.userId?.toString();
    const isProvider = providerUserId === req.userId;

    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch('/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Service providers can update to confirmed, in_progress, or completed
    if (req.userRole === 'service_provider') {
      const provider = await ServiceProvider.findOne({ userId: req.userId });
      if (provider && compareObjectIds(booking.serviceProviderId, provider._id)) {
        if (['confirmed', 'in_progress', 'completed'].includes(status)) {
          booking.status = status as any;
          await booking.save();
          return res.json(booking);
        }
      }
    }

    // Customers can cancel
    if (req.userRole === 'customer' &&
      compareObjectIds(booking.customerId, req.userId)) {
      if (status === 'cancelled') {
        booking.status = status;
        await booking.save();
        return res.json(booking);
      }
    }

    res.status(403).json({ message: 'Unauthorized or invalid status update' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get chat messages for a booking
router.get('/:id/messages', authenticate, async (req: AuthRequest, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization: Must be customer or provider
    const isCustomer = compareObjectIds(booking.customerId, req.userId);
    const providerProfile = await ServiceProvider.findById(booking.serviceProviderId);
    const isProvider = providerProfile && compareObjectIds(providerProfile.userId, req.userId);

    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const messages = await Message.find({ bookingId: req.params.id })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


```

## File: `backend\src\routes\chatbot.routes.ts`

```typescript
import express from 'express';
import { body } from 'express-validator';

const router = express.Router();

// Simple chatbot endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase();

    // Simple keyword-based responses
    let response = '';

    if (lowerMessage.includes('plumber') || lowerMessage.includes('plumbing')) {
      response = 'I can help you find a plumber! Common services include leak repairs, pipe installation, drain cleaning, and fixture installation. Would you like to browse available plumbers?';
    } else if (lowerMessage.includes('electrician') || lowerMessage.includes('electrical')) {
      response = 'I can help you find an electrician! Services include wiring, panel upgrades, outlet installation, and electrical repairs. Would you like to see available electricians?';
    } else if (lowerMessage.includes('mechanic') || lowerMessage.includes('car') || lowerMessage.includes('vehicle')) {
      response = 'I can help you find a mechanic! Services include oil changes, brake repairs, engine diagnostics, and general maintenance. Would you like to find a mechanic near you?';
    } else if (lowerMessage.includes('carpenter') || lowerMessage.includes('carpentry')) {
      response = 'I can help you find a carpenter! Services include furniture building, repairs, installations, and custom woodwork. Would you like to browse carpenters?';
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      response = 'For emergencies, we have an emergency repair option that prioritizes urgent requests. Would you like to create an emergency service request?';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      response = 'Pricing varies by service provider and is based on hourly rates. Rates typically range from $30-$100 per hour depending on the service type and experience level. You can see exact rates when viewing provider profiles.';
    } else if (lowerMessage.includes('verified') || lowerMessage.includes('trust') || lowerMessage.includes('safe')) {
      response = 'All service providers go through a verification process including background checks and certification validation. You can also read reviews from previous customers to make an informed decision.';
    } else {
      response = 'I\'m here to help you find skilled service providers! I can assist with finding plumbers, electricians, mechanics, carpenters, and more. What service do you need today?';
    }

    res.json({ response });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


```

## File: `backend\src\routes\payment.routes.ts`

```typescript
import express, { Request, Response } from 'express';
import { Booking } from '../models/Booking.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { compareObjectIds } from '../utils/objectId.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback', {
  apiVersion: '2023-10-16'
});

const router = express.Router();

// Create payment intent
router.post('/create-intent', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookingId = (req as Request).body?.bookingId;

    const booking = await Booking.findById(bookingId)
      .populate('customerId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!compareObjectIds(booking.customerId, req.userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        customerId: req.userId!
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: booking.totalAmount
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.post('/confirm', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, paymentIntentId } = (req as Request).body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'paid';
    await booking.save();

    res.json({ message: 'Payment confirmed', booking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


```

## File: `backend\src\routes\review.routes.ts`

```typescript
import express from 'express';
import { body, validationResult } from 'express-validator';
import { Review } from '../models/Review.model.js';
import { Booking } from '../models/Booking.model.js';
import { ServiceProvider } from '../models/ServiceProvider.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { compareObjectIds } from '../utils/objectId.js';

const router = express.Router();

// Create review
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create reviews' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!compareObjectIds(booking.customerId, req.userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = new Review({
      bookingId,
      customerId: req.userId,
      serviceProviderId: booking.serviceProviderId,
      rating,
      comment
    });

    await review.save();

    // Update service provider rating
    const provider = await ServiceProvider.findById(booking.serviceProviderId);
    if (provider) {
      const reviews = await Review.find({ serviceProviderId: provider._id });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      provider.rating = totalRating / reviews.length;
      provider.totalReviews = reviews.length;
      await provider.save();
    }

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a service provider
router.get('/provider/:providerId', async (req, res) => {
  try {
    const reviews = await Review.find({ serviceProviderId: req.params.providerId })
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


```

## File: `backend\src\routes\serviceProvider.routes.ts`

```typescript
import express from 'express';
import { body, validationResult } from 'express-validator';
import { ServiceProvider } from '../models/ServiceProvider.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all service providers (for customers to browse)
router.get('/', async (req, res) => {
  try {
    const { serviceType, city, minRating, verified } = req.query;
    let query: any = {};

    if (serviceType) {
      query.serviceTypes = serviceType;
    }
    if (city) {
      query['location.city'] = new RegExp(city as string, 'i');
    }
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }
    if (verified === 'true') {
      query.isVerified = true;
    }

    const providers = await ServiceProvider.find(query)
      .populate('userId', 'firstName lastName email phone')
      .select('-availability')
      .sort({ rating: -1 });

    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get nearby service providers
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, serviceType, maxDistance = 50 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const providers = await ServiceProvider.find({
      serviceTypes: serviceType || { $exists: true },
      isVerified: true,
      'location.coordinates.lat': {
        $gte: Number(lat) - 0.5,
        $lte: Number(lat) + 0.5
      },
      'location.coordinates.lng': {
        $gte: Number(lng) - 0.5,
        $lte: Number(lng) + 0.5
      }
    })
      .populate('userId', 'firstName lastName email phone')
      .sort({ rating: -1 })
      .limit(20);

    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single service provider
router.get('/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone');
    
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    res.json(provider);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Update service provider profile
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== 'service_provider') {
      return res.status(403).json({ message: 'Only service providers can create profiles' });
    }

    const existingProfile = await ServiceProvider.findOne({ userId: req.userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists. Use PUT to update.' });
    }

    const provider = new ServiceProvider({
      ...req.body,
      userId: req.userId
    });

    await provider.save();
    const populated = await provider.populate('userId', 'firstName lastName email phone');
    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update service provider profile
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    
    if (provider.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(provider, req.body);
    await provider.save();
    const populated = await provider.populate('userId', 'firstName lastName email phone');
    res.json(populated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get my profile (for service provider)
router.get('/profile/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.userId })
      .populate('userId', 'firstName lastName email phone');
    
    if (!provider) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(provider);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


```

## File: `backend\src\socket\socket.ts`

```typescript
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Booking } from '../models/Booking.model.js';
import { compareObjectIds } from '../utils/objectId.js';

interface UserSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (io: Server) => {
  io.use((socket: UserSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string; role: string };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: UserSocket) => {
    console.log('User connected:', socket.userId);

    // Join user's personal room
    if (socket.userId) {
      socket.join(`user_${socket.userId}`);
    }

    // Join booking room when user opens a booking
    socket.on('join_booking', async (bookingId: string) => {
      try {
        const booking = await Booking.findById(bookingId);

        if (booking &&
          (compareObjectIds(booking.customerId, socket.userId) ||
            compareObjectIds(booking.serviceProviderId, socket.userId))) {
          socket.join(`booking_${bookingId}`);
        }
      } catch (error) {
        console.error('Error joining booking room:', error);
      }
    });

    // Handle chat messages
    socket.on('send_message', async (data: { bookingId: string; message: string }) => {
      try {
        const { Message } = await import('../models/Message.model.js');
        const booking = await Booking.findById(data.bookingId);

        if (booking &&
          (compareObjectIds(booking.customerId, socket.userId) ||
            compareObjectIds(booking.serviceProviderId, socket.userId))) {

          // Save to database
          const newMessage = new Message({
            bookingId: data.bookingId,
            senderId: socket.userId,
            content: data.message
          });

          await newMessage.save();

          const messageData = {
            bookingId: data.bookingId,
            senderId: socket.userId,
            message: data.message,
            timestamp: newMessage.createdAt
          };

          // Broadcast to booking room
          io.to(`booking_${data.bookingId}`).emit('new_message', messageData);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle location updates
    socket.on('update_location', async (data: { bookingId: string; location: { lat: number; lng: number } }) => {
      try {
        const booking = await Booking.findById(data.bookingId);

        if (booking && compareObjectIds(booking.serviceProviderId, socket.userId)) {
          // Notify customer of service provider location
          io.to(`user_${booking.customerId}`).emit('location_update', {
            bookingId: data.bookingId,
            location: data.location
          });
        }
      } catch (error) {
        console.error('Error updating location:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });
};


```

## File: `backend\src\utils\objectId.ts`

```typescript
import mongoose from 'mongoose';

/**
 * Safely compare two ObjectIds or strings
 * Handles both ObjectId instances and string representations
 */
export const compareObjectIds = (id1: mongoose.Types.ObjectId | string | undefined, id2: string | undefined): boolean => {
  if (!id1 || !id2) return false;
  
  const str1 = typeof id1 === 'string' ? id1 : id1.toString();
  const str2 = typeof id2 === 'string' ? id2 : id2.toString();
  
  return str1 === str2;
};

/**
 * Convert ObjectId or string to string safely
 */
export const toObjectIdString = (id: mongoose.Types.ObjectId | string | undefined): string | null => {
  if (!id) return null;
  return typeof id === 'string' ? id : id.toString();
};


```


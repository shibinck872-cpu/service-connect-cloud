import express from 'express';
import { User } from '../models/User.model.js';
import { Booking } from '../models/Booking.model.js';
import { ServiceProvider } from '../models/ServiceProvider.model.js';
import { Review } from '../models/Review.model.js';
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
        const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'confirmed', 'in_progress'] } });
        
        // Calculate total revenue
        const completedBookings = await Booking.find({ status: 'completed' });
        const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

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
                pendingVerifications,
                totalRevenue,
                activeBookings
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

// Update user details
router.put('/users/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { firstName, lastName, email, role },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully', user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user permanently
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Also remove provider profile if exists
        if (user.role === 'service_provider') {
            await ServiceProvider.findOneAndDelete({ userId: user._id });
        }
        
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Reject/Remove service provider
router.delete('/providers/:id', async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.params.id);
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        
        // Change user role back to customer if they are removed as provider
        await User.findByIdAndUpdate(provider.userId, { role: 'customer', isVerified: false });
        await ServiceProvider.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Provider removed and role reset to customer' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Update booking status
router.put('/bookings/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('customerId', 'firstName lastName email')
         .populate({
             path: 'serviceProviderId',
             populate: { path: 'userId', select: 'firstName lastName email' }
         });

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json({ message: 'Booking status updated', booking });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get all reviews
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('customerId', 'firstName lastName')
            .populate({
                path: 'serviceProviderId',
                populate: { path: 'userId', select: 'firstName lastName' }
            })
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a review
router.delete('/reviews/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        
        // Update provider rating
        const provider = await ServiceProvider.findById(review.serviceProviderId);
        if (provider) {
            const remainingReviews = await Review.find({ serviceProviderId: provider._id });
            if (remainingReviews.length > 0) {
                const totalRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
                provider.rating = Number((totalRating / remainingReviews.length).toFixed(1));
                provider.totalReviews = remainingReviews.length;
            } else {
                provider.rating = 0;
                provider.totalReviews = 0;
            }
            await provider.save();
        }

        res.json({ message: 'Review deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

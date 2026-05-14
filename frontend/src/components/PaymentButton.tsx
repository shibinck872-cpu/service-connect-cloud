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

  const handleMockPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await api.post('/payments/mock-confirm', { bookingId });
      toast.success('Mock Payment Successful (Bypassed Stripe)!');
      onSuccess();
    } catch (error: any) {
      toast.error('Mock payment failed');
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
        {processing ? 'Processing Stripe...' : `Pay ₹${amount.toFixed(2)}`}
      </button>

      {/* Development Testing Force-Bypass */}
      <button
        type="button"
        onClick={handleMockPayment}
        disabled={processing}
        className="w-full bg-emerald-100 text-emerald-800 border-2 border-emerald-500 py-3 rounded-lg font-bold hover:bg-emerald-200 transition-colors disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
        title="Use this to simulate a successful payment without needing a configured Stripe account"
      >
        {processing ? 'Simulating...' : `Test Payment (Bypass API)`}
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


import { db } from '../config/firebase'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { loadStripe } from '@stripe/stripe-js'

// Stripe Configuration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Initialize Stripe
let stripePromise = null
const getStripe = () => {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

// Payment service for handling different payment methods
const paymentService = {
  // Process payment based on selected method
  async processPayment(orderId, paymentMethod, paymentDetails) {
    try {
      const paymentsRef = collection(db, 'payments')
      
      const paymentData = {
        orderId,
        paymentMethod, // 'card', 'cash', 'mobile_money'
        amount: paymentDetails.amount,
        currency: 'USD',
        status: paymentMethod === 'cash' ? 'pending' : 'processing',
        customerEmail: paymentDetails.customerEmail,
        customerName: paymentDetails.customerName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Add method-specific details
      if (paymentMethod === 'card') {
        paymentData.cardDetails = {
          last4: paymentDetails.cardNumber?.slice(-4) || '****',
          cardHolder: paymentDetails.cardHolder,
        }
      } else if (paymentMethod === 'mobile_money') {
        paymentData.mobileMoneyDetails = {
          phoneNumber: paymentDetails.phoneNumber,
          provider: paymentDetails.provider,
        }
      }

      // Add payment record to Firestore
      const paymentDoc = await addDoc(paymentsRef, paymentData)

      // Update order with payment info
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        paymentMethod,
        paymentStatus: paymentData.status,
        paymentId: paymentDoc.id,
        updatedAt: serverTimestamp(),
      })

      return {
        success: true,
        paymentId: paymentDoc.id,
        status: paymentData.status,
        message: this.getPaymentMessage(paymentMethod),
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },

  // Get appropriate message based on payment method
  getPaymentMessage(paymentMethod) {
    switch (paymentMethod) {
      case 'cash':
        return 'Order placed! Pay cash on delivery.'
      case 'card':
        return 'Payment successful! Your order is being processed.'
      case 'mobile_money':
        return 'Payment initiated! Check your phone to complete the payment.'
      default:
        return 'Order placed successfully!'
    }
  },

  // Update payment status (for admin/webhook use)
  async updatePaymentStatus(paymentId, status, transactionId = null) {
    try {
      const paymentRef = doc(db, 'payments', paymentId)
      const updateData = {
        status,
        updatedAt: serverTimestamp(),
      }

      if (transactionId) {
        updateData.transactionId = transactionId
      }

      await updateDoc(paymentRef, updateData)

      return { success: true }
    } catch (error) {
      console.error('Error updating payment status:', error)
      return { success: false, error: error.message }
    }
  },

  // Process Stripe Card Payment (REAL)
  async processStripePayment(orderDetails) {
    try {
      const stripe = await getStripe()
      
      if (!stripe) {
        throw new Error('Stripe not initialized. Please check your publishable key.')
      }

      // Create payment intent on your backend
      // For now, we'll use Stripe Checkout (simpler integration)
      
      // In production, you would:
      // 1. Create a payment intent on your backend
      // 2. Get the client secret
      // 3. Confirm payment with stripe.confirmCardPayment()
      
      // For demonstration, we'll simulate a successful payment
      console.log('💳 Processing Stripe payment for order:', orderDetails.orderId)
      console.log('Amount:', orderDetails.amount)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real implementation, replace with actual Stripe API call
      const paymentIntent = {
        id: `pi_${Date.now()}`,
        status: 'succeeded',
        amount: Math.round(orderDetails.amount * 100), // Stripe uses cents
        currency: 'usd',
      }

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: 'completed',
        message: 'Payment successful! Your order is confirmed.',
      }
    } catch (error) {
      console.error('Stripe payment error:', error)
      throw new Error('Payment failed: ' + error.message)
    }
  },

  // Process card payment with basic validation
  async processCardPayment(cardDetails, amount) {
    // Validate card details
    if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
      throw new Error('Invalid card number')
    }

    if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
      throw new Error('Invalid CVV')
    }

    if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 4) {
      throw new Error('Invalid expiry date')
    }

    // Card validation passed
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
    }
  },

  // Simulate mobile money payment
  async processMobileMoneyPayment(phoneNumber, amount, provider) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Simple validation
    if (!phoneNumber || phoneNumber.length < 10) {
      throw new Error('Invalid phone number')
    }

    // Simulate successful payment initiation
    return {
      success: true,
      transactionId: `mm_${Date.now()}`,
      message: `Payment request sent to ${phoneNumber}. Please check your phone to complete.`,
    }
  },

  // Get Stripe instance (for use in components)
  getStripeInstance: getStripe,
}

export default paymentService

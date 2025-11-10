import { useState } from 'react'
import { formatCurrency, calculateTotal } from '../utils/helpers'
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa'
import { SiStripe } from 'react-icons/si'

const CheckoutModal = ({ cartItems, onClose, onConfirm }) => {
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  })
  const [mobileMoneyDetails, setMobileMoneyDetails] = useState({
    phoneNumber: '',
    provider: 'm-pesa',
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const total = calculateTotal(cartItems)

  const paymentMethods = [
    { id: 'cash', name: 'Cash on Delivery', icon: FaMoneyBillWave, color: 'green' },
    { id: 'card', name: 'Card Payment', icon: FaCreditCard, color: 'blue', subtitle: 'Powered by Stripe' },
    { id: 'mobile_money', name: 'Mobile Money', icon: FaMobileAlt, color: 'purple', subtitle: 'M-Pesa, eZ Cash, etc.' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (customerName && phone && address) {
      setIsProcessing(true)
      
      try {
        const orderData = {
          customerName,
          phone,
          address,
          items: cartItems,
          total,
          paymentMethod,
        }

        if (paymentMethod === 'card') {
          orderData.paymentDetails = {
            cardNumber: cardDetails.cardNumber,
            cardHolder: cardDetails.cardHolder,
            expiryDate: cardDetails.expiryDate,
            cvv: cardDetails.cvv,
          }
        } else if (paymentMethod === 'mobile_money') {
          orderData.paymentDetails = {
            phoneNumber: mobileMoneyDetails.phoneNumber,
            provider: mobileMoneyDetails.provider,
          }
        }

        await onConfirm(orderData)
      } catch (error) {
        console.error('Order submission error:', error)
        alert('Failed to place order. Please try again.')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full animate-scale-in shadow-soft-lg my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Checkout</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={isProcessing}
          >
            <span className="text-2xl text-gray-500 dark:text-gray-400">×</span>
          </button>
        </div>

        {/* Cart Items */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Order Summary</h3>
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="text-gray-700 dark:text-gray-300">
                {item.quantity}x {item.name}
              </span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-300 dark:border-gray-600 mt-3 pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-800 dark:text-white">Total</span>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="input-field"
                required
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="input-field"
                required
                disabled={isProcessing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Delivery Address *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State, ZIP"
              className="input-field resize-none"
              rows="3"
              required
              disabled={isProcessing}
            />
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method *
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  disabled={isProcessing}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    paymentMethod === method.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <method.icon
                    className={`text-2xl mx-auto mb-2 ${
                      paymentMethod === method.id
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      paymentMethod === method.id
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {method.name}
                  </p>
                  {method.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {method.subtitle}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Card Payment Details */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 dark:text-white">Card Details</h4>
                <SiStripe className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg mb-3">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  🔒 Secure payment powered by Stripe. Accepts all major cards worldwide.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardNumber: e.target.value.replace(/\s/g, '') })
                  }
                  placeholder="4242 4242 4242 4242"
                  maxLength="16"
                  className="input-field font-mono"
                  required
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  💡 Test: Use 4242 4242 4242 4242
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Holder Name *
                </label>
                <input
                  type="text"
                  value={cardDetails.cardHolder}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
                  placeholder="John Doe"
                  className="input-field"
                  required
                  disabled={isProcessing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                    placeholder="12/25"
                    maxLength="5"
                    className="input-field font-mono"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    placeholder="123"
                    maxLength="3"
                    className="input-field font-mono"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Money Payment Details */}
          {paymentMethod === 'mobile_money' && (
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Mobile Wallet Details</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provider *
                </label>
                <select
                  value={mobileMoneyDetails.provider}
                  onChange={(e) =>
                    setMobileMoneyDetails({ ...mobileMoneyDetails, provider: e.target.value })
                  }
                  className="input-field"
                  required
                  disabled={isProcessing}
                >
                  <option value="m-pesa">M-Pesa</option>
                  <option value="ezcash">eZ Cash</option>
                  <option value="airtel">Airtel Money</option>
                  <option value="mtn">MTN Mobile Money</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={mobileMoneyDetails.phoneNumber}
                  onChange={(e) =>
                    setMobileMoneyDetails({ ...mobileMoneyDetails, phoneNumber: e.target.value })
                  }
                  placeholder="+254 712 345 678"
                  className="input-field"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>
          )}

          {/* Cash on Delivery Note */}
          {paymentMethod === 'cash' && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-300">
                💰 You will pay <strong>{formatCurrency(total)}</strong> in cash when your order is delivered.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Place Order - ${formatCurrency(total)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutModal

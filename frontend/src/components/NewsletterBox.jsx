import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, XCircle, Sparkles, Gift, Bell, TrendingUp } from 'lucide-react';
import api from '../lib/api';

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  // Real-time email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value.length > 0) {
      setIsValidEmail(validateEmail(value));
    } else {
      setIsValidEmail(true);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!validateEmail(email)) {
      setIsValidEmail(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/api/newsletter/subscribe', { email });
      if (data.success) {
        setMessage('Thank you for subscribing! Check your inbox for exclusive offers.');
        setIsSuccess(true);
        setEmail('');
        setTimeout(() => {
          setMessage('');
          setIsSuccess(false);
        }, 5000);
      } else {
        setMessage(data.message || 'Subscription failed. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      const msg = error?.response?.data?.message || error.message;
      setMessage(msg || 'Something went wrong. Please try again later.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: <Gift className="w-5 h-5" />, text: "20% OFF First Order" },
    { icon: <Bell className="w-5 h-5" />, text: "Early Access to Sales" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Exclusive Style Tips" },
    { icon: <Sparkles className="w-5 h-5" />, text: "New Arrivals First" }
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-orange-300/30 to-red-300/30 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-20 w-40 h-40 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-br from-blue-300/30 to-teal-300/30 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 25, 0],
            x: [0, -20, 0],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-10 right-1/4 w-28 h-28 bg-gradient-to-br from-yellow-300/30 to-orange-300/30 rounded-full blur-2xl"
        />

        {/* Floating Sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
            className="absolute"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`
            }}
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6 shadow-xl"
            >
              <Mail className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              Subscribe & Get{' '}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                20% OFF
              </span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              Join the TinyMillion family and stay updated with exclusive offers, new arrivals, and style inspiration — straight to your inbox.
            </p>
          </motion.div>

          {/* Newsletter Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <form onSubmit={onSubmitHandler} className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Input Container */}
                <div className={`relative flex items-center gap-2 bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 ${
                  !isValidEmail && email.length > 0
                    ? 'border-red-500'
                    : 'border-transparent focus-within:border-orange-500'
                }`}>
                  {/* Email Icon */}
                  <div className="absolute left-5 pointer-events-none">
                    <Mail className={`w-5 h-5 transition-colors duration-300 ${
                      email.length > 0 && isValidEmail
                        ? 'text-green-500'
                        : email.length > 0
                        ? 'text-red-500'
                        : 'text-gray-400'
                    }`} />
                  </div>

                  {/* Input Field */}
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    placeholder="Enter your email address"
                    className="flex-1 pl-14 pr-4 py-5 text-gray-900 placeholder-gray-400 bg-transparent outline-none text-base md:text-lg"
                  />

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || (!isValidEmail && email.length > 0)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`m-2 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center gap-2 ${
                      isLoading || (!isValidEmail && email.length > 0)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <span className="hidden sm:inline">Subscribe</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Validation Message */}
                <AnimatePresence>
                  {!isValidEmail && email.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-5 -bottom-6 text-sm text-red-500 flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Please enter a valid email address
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Success/Error Message */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${
                      isSuccess
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-red-50 border-2 border-red-200'
                    }`}
                  >
                    {isSuccess ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm md:text-base font-medium ${
                      isSuccess ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {message}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/50"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl mb-3 text-orange-600">
                  {benefit.icon}
                </div>
                <p className="text-sm font-semibold text-gray-900">{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500">
              🔒 We respect your privacy. Unsubscribe anytime. Join{' '}
              <span className="font-bold text-gray-900">50,000+</span> subscribers
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      </div>
    </section>
  );
};

export default NewsletterBox;
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    text: "Amazing WooCommerce theme and truly amazing support!!! Just review the demo and you can experience all the great features this theme comes with, but more than that the support is incredible. My questions were replied to immediately and my issues were resolved within the hour!!! Truly above and beyond!!! Its no wonder at all there are 15K sales!!! I truly appreciate your responsive and immediate assistance!!!",
    customerName: "John Florance",
    country: "Afghanistan",
  },
  {
    id: 2,
    text: "Amazing WooCommerce theme and truly amazing support!!! Just review the demo and you can experience all the great features this theme comes with, but more than that the support is incredible. My questions were replied to immediately and my issues were resolved within the hour!!! Truly above and beyond!!! Its no wonder at all there are 15K sales!!! I truly appreciate your responsive and immediate assistance!!!",
    customerName: "John Florance",
    country: "Afghanistan",
  },
  {
    id: 3,
    text: "Amazing WooCommerce theme and truly amazing support!!! Just review the demo and you can experience all the great features this theme comes with, but more than that the support is incredible. My questions were replied to immediately and my issues were resolved within the hour!!! Truly above and beyond!!! Its no wonder at all there are 15K sales!!! I truly appreciate your responsive and immediate assistance!!!",
    customerName: "John Florance",
    country: "Afghanistan",
  },
];

const WhatOurCustomersSay = () => {
  return (
    <section
      className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden py-20 md:py-24"
      aria-label="Customer Testimonials"
    >
      {/* Fixed Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&q=80)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg text-gray-200 font-light max-w-3xl mx-auto leading-relaxed">
            Amazing WooCommerce theme and truly amazing support!!! Just review the demo and you can experience all the great features this theme comes with, but more than that the support is incredible.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="mt-12 md:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6 font-light">
                  {testimonial.text}
                </p>

                {/* Customer Info */}
                <div className="border-t border-white/20 pt-4">
                  <p className="text-white font-semibold text-base mb-1">
                    {testimonial.customerName}
                  </p>
                  <p className="text-white/60 text-sm">
                    {testimonial.country}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatOurCustomersSay;


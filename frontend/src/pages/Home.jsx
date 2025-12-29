import LatestCollection from '../components/LatestCollection'
import MostPurchase from '../components/MostPurchase'
import BestSeller from '../components/BestSeller'
import NewsletterBox from '../components/NewsletterBox'
import HeroSlider from '../components/HeroSlider'
import CategoryGrid from '../components/CategoryGrid'
import FeaturedMiniStores from '../components/FeaturedMiniStores'
import usePageMetadata from '../hooks/usePageMetadata'
import FlashSale from '../components/FlashSale'
import BrandAndArrivalsSection from '../components/BrandAndArrivalsSection'
import WhatOurCustomersSay from '../components/WhatOurCustomersSay'
import { motion } from 'framer-motion'
import { TrendingUp, Shield, Truck, RotateCcw, Headphones, Award } from 'lucide-react'

const Home = () => {
  usePageMetadata({
    title: 'Discover New Fashion Drops',
    description:
      'Explore TinyMillion for creator-led fashion drops, jewellery, and lifestyle essentials curated for everyday confidence.',
    keywords:
      'TinyMillion collections, new arrivals, creator fashion, trending outfits, lifestyle store',
    canonical: '/',
    structuredData: ({ absoluteCanonical, pageDescription, absoluteImage, baseTitle }) => [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${absoluteCanonical}#home-collections`,
        url: absoluteCanonical,
        name: baseTitle,
        description: pageDescription,
        image: absoluteImage,
      },
    ],
  })


  // Why Choose Us
  const whyChooseUs = [
    {
      id: 1,
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping",
      description: "On orders above ₹999"
    },
    {
      id: 2,
      icon: <RotateCcw className="w-6 h-6" />,
      title: "Easy Returns",
      description: "15 days return policy"
    },
    {
      id: 3,
      icon: <Shield className="w-6 h-6" />,
      title: "100% Secure",
      description: "Safe payment methods"
    },
    {
      id: 4,
      icon: <Headphones className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Always here to help"
    }
  ]

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Most Purchased Products */}
      <MostPurchase />

      {/* Latest Collection */}
      <section className="container mx-auto px-4 py-16">
        <LatestCollection />
      </section>

      {/* Brand Logo Slider & New Arrivals Banner */}
      <BrandAndArrivalsSection />

      {/* Flash Sale */}
      <FlashSale />

      {/* Best Seller */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <BestSeller />
        </div>
      </section>

      {/* What Our Customers Say */}
      <WhatOurCustomersSay />

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Why Choose TinyMillion?
          </h2>
          <p className="text-gray-600 text-lg">
            We're committed to providing the best shopping experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 py-16">
        <NewsletterBox />
      </section>
    </div>
  )
}

export default Home
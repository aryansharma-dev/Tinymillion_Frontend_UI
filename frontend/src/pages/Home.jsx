import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import HeroSlider from '../components/HeroSlider'
import FeaturedMiniStores from '../components/FeaturedMiniStores'
import usePageMetadata from '../hooks/usePageMetadata'
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

  // Categories Data
  const categories = [
    {
      id: 1,
      name: "T-Shirts",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      link: "/collection?category=tshirts",
      count: "200+ Styles"
    },
    {
      id: 2,
      name: "Hoodies",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
      link: "/collection?category=hoodies",
      count: "150+ Styles"
    },
    {
      id: 3,
      name: "Oversized",
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop",
      link: "/collection?category=oversized",
      count: "180+ Styles"
    },
    {
      id: 4,
      name: "Joggers",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=500&fit=crop",
      link: "/collection?category=joggers",
      count: "120+ Styles"
    },
    {
      id: 5,
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&fit=crop",
      link: "/collection?category=accessories",
      count: "90+ Items"
    },
    {
      id: 6,
      name: "Sneakers",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      link: "/collection?category=sneakers",
      count: "100+ Styles"
    }
  ]

  // Trust Stats
  const trustStats = [
    {
      id: 1,
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      value: "10 Crore+",
      label: "Products Sold",
      color: "bg-yellow-50"
    },
    {
      id: 2,
      icon: <Award className="w-8 h-8 text-blue-500" />,
      value: "2 Crore+",
      label: "Happy Customers",
      color: "bg-blue-50"
    },
    {
      id: 3,
      icon: <Shield className="w-8 h-8 text-green-500" />,
      value: "100%",
      label: "Secure Payments",
      color: "bg-green-50"
    },
    {
      id: 4,
      icon: <Truck className="w-8 h-8 text-purple-500" />,
      value: "24-48 Hrs",
      label: "Fast Delivery",
      color: "bg-purple-50"
    }
  ]

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

      {/* Shop by Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg">
            Explore our curated collections for every style
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.a
              key={category.id}
              href={category.link}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                
                {/* Category Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                  <p className="text-xs text-white/80">{category.count}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Trust Stats Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustStats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                  {stat.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Collection */}
      <section className="container mx-auto px-4 py-16">
        <LatestCollection />
      </section>

      {/* Best Seller */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <BestSeller />
        </div>
      </section>

      {/* Featured Mini Stores */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Featured Mini Stores
          </h2>
          <p className="text-gray-600 text-lg">
            Discover curated collections from our creators
          </p>
        </motion.div>
        <FeaturedMiniStores />
      </section>

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

      {/* Our Policy */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <OurPolicy />
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
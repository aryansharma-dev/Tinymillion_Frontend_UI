import { useState } from 'react'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import usePageMetadata from '../hooks/usePageMetadata'
import { MapPin, Mail, Phone, Send } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  usePageMetadata({
    title: 'Contact TinyMillion',
    description:
      'Reach the TinyMillion team for customer support, partnership enquiries, or creator collaborations in Noida and Saharanpur.',
    keywords: 'TinyMillion contact, customer support, TinyMillion address, TinyMillion phone',
    canonical: '/contact',
    structuredData: ({ absoluteCanonical, baseTitle, pageDescription }) => [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        '@id': `${absoluteCanonical}#contact`,
        url: absoluteCanonical,
        name: baseTitle,
        description: pageDescription,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            telephone: '+91-9258808835',
            email: 'hello.tinymillion@gmail.com',
            areaServed: 'IN',
            availableLanguage: ['English'],
          },
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'House No 119, Patthar Ka Kuan Duddha, Deoband',
          addressLocality: 'Saharanpur',
          addressRegion: 'Uttar Pradesh',
          postalCode: '247554',
          addressCountry: 'IN',
        },
      },
    ],
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Add your form submission logic here
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop"
              alt="Contact us"
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>

          {/* Right: Content */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Established In 1998
            </h1>
            <p className="text-gray-600 leading-relaxed mb-8">
              Suspendisse eget mi aget felis egestas tristique ut sit amet libero. Donec lacinia dapibus ante sed feugiat. Sed sit mauris, maximus eu varius id, tincidunt vitae mauris.
            </p>
            
            {/* Trusted By Brands */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide">Trusted By</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="text-lg font-bold text-gray-400">BEAN SHOP</div>
                <div className="text-lg font-bold text-gray-400">JUST DAILY</div>
                <div className="text-lg font-bold text-gray-400">ROYAL STORE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Contact Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Australia */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">AUSTRALIA</h3>
              <div className="space-y-3 text-gray-600">
                <p>Elizabeth Street 123</p>
                <p>50050 Sydney</p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Tel: +44 (0)20 7435 7686
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-Mail: services@8theme.com
                </p>
              </div>
            </div>

            {/* New Jersey */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">NEW JERSEY</h3>
              <div className="space-y-3 text-gray-600">
                <p>5th Avenue 678 Top Street</p>
                <p>7689 New York</p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Tel: +49 (0)30 68605 2986
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-Mail: contact@8theme.com
                </p>
              </div>
            </div>

            {/* Abu Dhabi */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">ABU DAHBI</h3>
              <div className="space-y-3 text-gray-600">
                <p>5th Avenue 678 Top Street</p>
                <p>7689 New York</p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Tel: +49 (0)30 68605 2986
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-Mail: contact@8theme.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative h-96 bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345096513!2d144.96305761531677!3d-37.81627997975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sau!4v1621408672305!5m2!1sen!2sau"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Location Map"
        />
      </div>

      {/* Contact Form */}
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Fill Our Contact Form
          </h2>
          
          <div className="bg-white rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Your email"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Subject"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                placeholder="Your message"
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
              >
                <Send className="w-4 h-4" />
                SEND MESSAGE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterBox/>
    </div>
  )
}

export default Contact
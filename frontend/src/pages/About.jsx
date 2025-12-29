import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import usePageMetadata from '../hooks/usePageMetadata'
import { Play, Package, Truck, ShieldCheck, Award } from 'lucide-react'

const About = () => {
  usePageMetadata({
    title: 'About TinyMillion',
    description:
      'Learn how TinyMillion blends timeless silhouettes with modern culture to craft creator-inspired apparel and accessories.',
    keywords: 'TinyMillion story, about TinyMillion, brand mission, creator fashion label',
    canonical: '/about',
    structuredData: ({ absoluteCanonical, pageDescription, baseTitle, absoluteImage }) => [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${absoluteCanonical}#about`,
        url: absoluteCanonical,
        name: baseTitle,
        description: pageDescription,
        primaryImageOfPage: absoluteImage,
      },
    ],
  })

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Small Image - Top Left */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop"
                  alt="Fashion model"
                  className="w-full h-64 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
              {/* Large Image - Center */}
              <div className="row-span-2">
                <img
                  src="https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=600&fit=crop"
                  alt="Fashion design"
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
              {/* Empty space for layout balance */}
              <div></div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Quality, Consciousness and<br />Versatile Design.
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              Over 25 years of experience, we have crafted thousands of strategic discovery process that enables us to peel back the layers which enable us to understand, connect, represent and dominate your market.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition">
              <Play className="w-4 h-4" />
              Play video
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            TinyMillion Big Moments - 1975
          </h2>
          
          <div className="space-y-16">
            {/* Timeline Item 1 */}
            <div className="relative">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-32 text-right">
                  <span className="text-sm text-gray-500">12 July, 1975</span>
                </div>
                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gray-900 mt-2 relative">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-32 bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">1975</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica craft beer labore wes anderson cred.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-32"></div>
                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gray-900 mt-2 relative">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-32 bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">1999</h3>
                    <span className="text-sm text-gray-500">25 July, 2022</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-32 text-right">
                  <span className="text-sm text-gray-500">18 Jun, 2023</span>
                </div>
                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gray-900 mt-2 relative">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-32 bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">2010</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-32"></div>
                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gray-900 mt-2"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">2021</h3>
                    <span className="text-sm text-gray-500">25 July, 2022</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Nullam id dolor id nibh ultricies vehicula ut id elit. Donec sed odio dui. Integer posuere erat a ante venenatis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <Package className="w-10 h-10 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Biodegradable Packaging</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                It is a long established fact that reader will be distract the readable content looking at its layout.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <Award className="w-10 h-10 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% Fair Trade</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                These many variations of passages lorem Ipsum available but the majority have suffered alteration in some form.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <ShieldCheck className="w-10 h-10 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Biodegradable Packaging</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                It is a long established fact that reader will be distract the readable content looking at its layout.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <Package className="w-10 h-10 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Biodegradable Packaging</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                It is a long established fact that reader will be distract the readable content looking at its layout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600&h=900&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">What Our Customer Say</h2>
          
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          
          <p className="text-white text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
            Amazing theme and really amazing support! Just review the demo and understand all our great features that theme comes with. But more than that the support is incredible. My questions were replied to immediately and my issues were resolved within the hour! Truly although happened me no wonderful as there are gift sheet! I truly thought I am definitely won't completely enjoy what an experience with friends and wouldn't certainly be recommend!
          </p>
          
          <div>
            <p className="text-white font-bold text-lg mb-1">JOHN FLORENCE</p>
            <p className="text-gray-300 text-sm">CEO - Xstore</p>
          </div>
        </div>
      </div>

      {/* Brand Logos */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-12">
            <div className="text-2xl font-bold text-gray-400">BEAN SHOP</div>
            <div className="text-2xl font-bold text-gray-400">SCANDINAVIA</div>
            <div className="text-2xl font-bold text-gray-400">APPGAMES</div>
            <div className="text-2xl font-bold text-gray-400">BIG DADDY</div>
            <div className="text-2xl font-bold text-gray-400">BY FETA</div>
            <div className="text-2xl font-bold text-gray-400">OAK BARK</div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterBox/>
    </div>
  )
}

export default About;
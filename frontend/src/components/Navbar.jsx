import { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import ShopContext from '../context/ShopContextInstance';
import { Search, Heart, ShoppingCart, User, Menu, X, MapPin, ChevronDown, Globe } from 'lucide-react';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [storeLocatorOpen, setStoreLocatorOpen] = useState(false);
    const [activeNav, setActiveNav] = useState('');
    const [weather, setWeather] = useState({ temp: '28°C', condition: 'Sunny' });

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    const handleSearchDesktop = () => {
        if (!searchExpanded) {
            setSearchExpanded(true);
        } else {
            setShowSearch(true);
            navigate('/collection');
        }
    }

    const handleSearchMobile = () => {
        setShowSearch(true);
        navigate('/collection');
    }

    const cartCount = getCartCount();

    return (
        <>
            {/* TOP BAR */}
            <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-10 text-xs'>
                        {/* Announcement Marquee */}
                        <div className='flex-1 overflow-hidden relative'>
                            <div className='animate-marquee whitespace-nowrap inline-block'>
                                <span className='mx-8'>🎉 Free shipping on orders above ₹999</span>
                                <span className='mx-8'>✨ New arrivals just dropped!</span>
                                <span className='mx-8'>🔥 Limited time offer - 50% OFF</span>
                                <span className='mx-8'>🎉 Free shipping on orders above ₹999</span>
                            </div>
                        </div>

                        {/* Right Side Utils */}
                        <div className='hidden md:flex items-center gap-4 ml-4'>
                            {/* Weather Widget */}
                            <div className='flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all'>
                                <span className='text-yellow-300'>☀️</span>
                                <span className='font-medium'>{weather.temp}</span>
                            </div>

                            {/* Store Locator */}
                            <div className='relative'>
                                <button
                                    onClick={() => setStoreLocatorOpen(!storeLocatorOpen)}
                                    className='flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all'
                                >
                                    <MapPin className='w-3.5 h-3.5' />
                                    <span>Stores</span>
                                </button>
                                {storeLocatorOpen && (
                                    <div className='absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl p-4 text-gray-800 z-50'>
                                        <h4 className='font-bold mb-2'>Find a Store Near You</h4>
                                        <input
                                            type='text'
                                            placeholder='Enter your location...'
                                            className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400'
                                        />
                                        <button className='w-full mt-3 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all'>
                                            Search Stores
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Currency Selector */}
                            <div className='relative'>
                                <button
                                    onClick={() => setCurrencyOpen(!currencyOpen)}
                                    className='flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all'
                                >
                                    <Globe className='w-3.5 h-3.5' />
                                    <span>INR</span>
                                    <ChevronDown className='w-3 h-3' />
                                </button>
                                {currencyOpen && (
                                    <div className='absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 text-gray-800 z-50'>
                                        <button className='w-full text-left px-4 py-2 hover:bg-gray-100 transition-all'>
                                            🇮🇳 INR - Indian Rupee
                                        </button>
                                        <button className='w-full text-left px-4 py-2 hover:bg-gray-100 transition-all'>
                                            🇺🇸 USD - US Dollar
                                        </button>
                                        <button className='w-full text-left px-4 py-2 hover:bg-gray-100 transition-all'>
                                            🇪🇺 EUR - Euro
                                        </button>
                                        <button className='w-full text-left px-4 py-2 hover:bg-gray-100 transition-all'>
                                            🇬🇧 GBP - British Pound
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN NAVBAR */}
            <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
                : 'bg-white/50 backdrop-blur-md shadow-sm'
                }`}>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-20'>
                    
                    {/* Logo - Animated */}
                    <Link to='/' className='flex-shrink-0 group relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500' />
                        <img 
                            src={assets.logo} 
                            className='relative h-9 w-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-2' 
                            alt="TinyMillion logo" 
                        />
                    </Link>

                    {/* Center Navigation - Desktop */}
                    <div className='hidden lg:flex items-center gap-8'>
                        <NavLink
                            to='/'
                            onMouseEnter={() => setActiveNav('home')}
                            className={({ isActive }) =>
                                `relative text-sm font-bold tracking-wider transition-all duration-300 py-2 group ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    HOME
                                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 rounded-full transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}></span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/collection'
                            onMouseEnter={() => setActiveNav('collection')}
                            className={({ isActive }) =>
                                `relative text-sm font-bold tracking-wider transition-all duration-300 py-2 group ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    COLLECTION
                                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 rounded-full transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}></span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/store'
                            onMouseEnter={() => setActiveNav('mini')}
                            className={({ isActive }) =>
                                `relative text-sm font-bold tracking-wider transition-all duration-300 py-2 group ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    MINI STORES
                                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 via-green-400 to-green-600 rounded-full transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}></span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/about'
                            onMouseEnter={() => setActiveNav('about')}
                            className={({ isActive }) =>
                                `relative text-sm font-bold tracking-wider transition-all duration-300 py-2 group ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    ABOUT US 
                                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-orange-400 to-red-600 rounded-full transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}></span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to='/contact'
                            onMouseEnter={() => setActiveNav('contact')}
                            className={({ isActive }) =>
                                `relative text-sm font-bold tracking-wider transition-all duration-300 py-2 group ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    CONTACT US 
                                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-orange-400 to-red-600 rounded-full transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                        }`}></span>
                                </>
                            )}
                        </NavLink>

                    </div>

                    {/* Right Icons - Desktop */}
                    <div className='hidden lg:flex items-center gap-2'>
                        {/* Search Icon - Expandable */}
                        <div className={`relative transition-all duration-500 ${searchExpanded ? 'w-80' : 'w-auto'}`}>
                            {searchExpanded ? (
                                <div className='relative'>
                                    <input
                                        type='text'
                                        placeholder='Search products...'
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearchDesktop();
                                            }
                                        }}
                                        onBlur={() => !searchInput && setSearchExpanded(false)}
                                        autoFocus
                                        className='w-full pl-10 pr-10 py-2.5 border-2 border-gray-900 rounded-full bg-white focus:outline-none text-gray-700 placeholder-gray-400'
                                    />
                                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                                    <button
                                        onClick={() => { setSearchExpanded(false); setSearchInput(''); }}
                                        className='absolute right-3 top-1/2 -translate-y-1/2'
                                    >
                                        <X className='w-4 h-4 text-gray-400 hover:text-gray-700' />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setSearchExpanded(true)}
                                    className='relative p-3 rounded-full hover:bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-110 hover:text-gray-900 group'
                                >
                                    <Search className='w-5 h-5' />
                                    <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                                        Search
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Wishlist */}
                        <button className='relative p-3 rounded-full hover:bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-110 hover:text-red-500 group'>
                            <Heart className='w-5 h-5' />
                            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                                3
                            </span>
                            <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                                Wishlist
                            </span>
                        </button>

                        {/* Cart */}
                        <Link to='/cart' className='relative group'>
                            <div className='p-3 rounded-full hover:bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-110 hover:text-gray-900'>
                                <ShoppingCart className='w-5 h-5' />
                            </div>
                            {cartCount > 0 && (
                                <span key={cartCount} className='absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg ring-2 ring-white animate-scale'>
                                    {cartCount}
                                </span>
                            )}
                            <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                                Cart
                            </span>
                        </Link>

                        {/* User Dropdown */}
                        <div className='relative'>
                            <button
                                onClick={() => token ? setUserDropdownOpen(!userDropdownOpen) : navigate('/login')}
                                className='relative p-3 rounded-full hover:bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-110 hover:text-gray-900 group'
                            >
                                <User className='w-5 h-5' />
                                <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                                    Account
                                </span>
                            </button>
                            {token && userDropdownOpen && (
                                <div className='absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-dropdown'>
                                    <div className='bg-gradient-to-r from-gray-900 to-gray-700 p-4 text-white'>
                                        <p className='font-bold text-sm'>Welcome Back!</p>
                                        <p className='text-xs opacity-75 mt-1'>Manage your account</p>
                                    </div>
                                    <div className='py-2'>
                                        <button className='w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-3 group'>
                                            <User className='w-4 h-4 text-gray-400 group-hover:text-gray-700' />
                                            <span>My Profile</span>
                                        </button>
                                        <button
                                            onClick={() => { navigate('/orders'); setUserDropdownOpen(false); }}
                                            className='w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-3 group'
                                        >
                                            <ShoppingCart className='w-4 h-4 text-gray-400 group-hover:text-gray-700' />
                                            <span>Orders</span>
                                        </button>
                                        <button
                                            onClick={() => { logout(); setUserDropdownOpen(false); }}
                                            className='w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all flex items-center gap-3 group border-t border-gray-100 mt-2'
                                        >
                                            <X className='w-4 h-4' />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Icons */}
                    <div className='flex lg:hidden items-center gap-3'>
                        <button
                            onClick={handleSearchMobile}
                            className='p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110'
                        >
                            <Search className='w-5 h-5' />
                        </button>

                        <Link to='/cart' className='relative'>
                            <div className='p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110'>
                                <ShoppingCart className='w-5 h-5' />
                            </div>
                            {cartCount > 0 && (
                                <span key={cartCount} className='absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale ring-2 ring-white'>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setVisible(true)}
                            className='p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110'
                        >
                            <Menu className='w-6 h-6' />
                        </button>
                    </div>
                </div>
            </div>
        </nav>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setVisible(false)}
            />

            <div
                className={`fixed top-0 left-0 bottom-0 w-full max-w-sm bg-gradient-to-br from-white via-gray-50 to-white z-50 lg:hidden transform transition-all duration-500 ease-out shadow-2xl ${visible ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className='flex flex-col h-full'>
                    {/* Header */}
                    <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-700'>
                        <img src={assets.logo} className='h-8 w-auto brightness-0 invert' alt="TinyMillion logo" />
                        <button
                            onClick={() => setVisible(false)}
                            className='p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 text-white'
                        >
                            <X className='w-6 h-6' />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className='flex-1 overflow-y-auto py-4'>
                        <NavLink
                            to='/'
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide transition-all duration-300 ${isActive 
                                    ? 'text-gray-900 bg-gradient-to-r from-gray-100 to-transparent border-l-4 border-gray-900' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <span className='text-2xl'>🏠</span>
                            <span>HOME</span>
                        </NavLink>

                        <NavLink
                            to='/collection'
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide transition-all duration-300 ${isActive 
                                    ? 'text-gray-900 bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-600' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <span className='text-2xl'>👔</span>
                            <span>COLLECTION</span>
                        </NavLink>


                        <NavLink
                            to='/store'
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide transition-all duration-300 ${isActive 
                                    ? 'text-gray-900 bg-gradient-to-r from-green-50 to-transparent border-l-4 border-green-600' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <span className='text-2xl'>🏪</span>
                            <span>MINI STORES</span>
                        </NavLink>

                        <NavLink
                            to='/about'
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide transition-all duration-300 ${isActive 
                                    ? 'text-gray-900 bg-gradient-to-r from-orange-50 to-transparent border-l-4 border-orange-600' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <span className='text-2xl'>🔥</span>
                            <span>ABOUT US</span>
                        </NavLink>

                        <NavLink
                            to='/contact'
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-6 py-4 text-sm font-bold tracking-wide transition-all duration-300 ${isActive 
                                    ? 'text-gray-900 bg-gradient-to-r from-orange-50 to-transparent border-l-4 border-orange-600' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <span className='text-2xl'>🔥</span>
                            <span>CONTACT US</span>
                        </NavLink>

                        <div className='my-4 px-6'>
                            <div className='h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
                        </div>

                        <button className='flex items-center gap-4 w-full px-6 py-4 text-sm font-bold tracking-wide text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-300'>
                            <Heart className='w-5 h-5' />
                            <span>WISHLIST</span>
                            <span className='ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>3</span>
                        </button>
                    </div>

                   {/* Bottom User Actions */}
                    {token ? (
                        <div className='border-t border-gray-200 p-4 space-y-2 bg-gradient-to-t from-gray-100 to-transparent'>
                            <div className='px-4 py-3 bg-white rounded-xl shadow-sm'>
                                <p className='text-sm font-bold text-gray-900'>Hey, User! 👋</p>
                                <p className='text-xs text-gray-500 mt-1'>Welcome back</p>
                            </div>
                            <button className='flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-white rounded-xl transition-all duration-200'>
                                <User className='w-5 h-5' />
                                <span>My Profile</span>
                            </button>
                            <button
                                onClick={() => { navigate('/orders'); setVisible(false); }}
                                className='flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-white rounded-xl transition-all duration-200'
                            >
                                <ShoppingCart className='w-5 h-5' />
                                <span>Orders</span>
                            </button>
                            <button
                                onClick={() => { logout(); setVisible(false); }}
                                className='flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200'
                            >
                                <X className='w-5 h-5' />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className='border-t border-gray-200 p-4 bg-gradient-to-t from-gray-100 to-transparent'>
                            <button
                                onClick={() => { navigate('/login'); setVisible(false); }}
                                className='w-full px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-bold hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl'
                            >
                                Sign In / Register
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Mobile Nav Bar */}
            <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]'>
                <div className='flex items-center justify-around py-3 px-2'>
                    <NavLink
                        to='/'
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500'
                            }`
                        }
                    >
                        <span className='text-xl'>🏠</span>
                        <span className='text-xs font-semibold'>Home</span>
                    </NavLink>

                    <NavLink
                        to='/collection'
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500'
                            }`
                        }
                    >
                        <span className='text-xl'>🛍️</span>
                        <span className='text-xs font-semibold'>Shop</span>
                    </NavLink>

                    <Link
                        to='/cart'
                        className='flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 text-gray-500 relative'
                    >
                        <span className='text-xl'>🛒</span>
                        {cartCount > 0 && (
                            <span className='absolute -top-1 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                                {cartCount}
                            </span>
                        )}
                        <span className='text-xs font-semibold'>Cart</span>
                    </Link>

                    <NavLink
                        to='/store'
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${isActive ? 'text-gray-900 bg-gray-100' : 'text-gray-500'
                            }`
                        }
                    >
                        <span className='text-xl'>🏪</span>
                        <span className='text-xs font-semibold'>Stores</span>
                    </NavLink>

                    <button
                        onClick={() => token ? navigate('/orders') : navigate('/login')}
                        className='flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 text-gray-500'
                    >
                        <User className='w-5 h-5' />
                        <span className='text-xs font-semibold'>Account</span>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                
                @keyframes scale {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
                .animate-scale {
                    animation: scale 0.3s ease-in-out;
                }

                @keyframes dropdown {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-dropdown {
                    animation: dropdown 0.3s ease-out;
                }
            `}</style>
        </>
    )
}

export default Navbar;
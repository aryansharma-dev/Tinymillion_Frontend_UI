import { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import ShopContext from '../context/ShopContextInstance';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');

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
        setShowSearch(true);
        navigate('/collection');
    }

    const handleSearchMobile = () => {
        setShowSearch(true);
        navigate('/collection');
    }

    const cartCount = getCartCount();

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
            : 'bg-white/50 backdrop-blur-md shadow-sm'
            }`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-20'>
                    
                    <Link to='/' className='flex-shrink-0 group'>
                        <img src={assets.logo} className='h-8 lg:h-8 md:h-8 sm:h-8 lg:w-auto w-36 sm:w-32 transition-transform duration-300 group-hover:scale-105' alt="TinyMillion logo" />
                    </Link>

                    <div className='hidden lg:flex items-center flex-1 max-w-2xl mx-12'>
                        <div className='relative w-full group'>
                            <div className='absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-lg group-hover:from-white/50 group-focus-within:from-white/60 transition-all duration-300' />
                            <input
                                type='text'
                                placeholder='Search products...'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onFocus={handleSearchDesktop}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearchDesktop();
                                    }
                                }}
                                className='relative w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-0 focus:border-transparent cursor-text transition-all hover:border-gray-300 hover:bg-white/90 text-gray-700 placeholder-gray-400'
                            />
                            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
                        </div>
                    </div>

                    <div className='hidden lg:flex items-center gap-2'>
                        <button className='p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-110 hover:text-gray-900'>
                            <Heart className='w-5 h-5' />
                        </button>

                        <Link to='/cart' className='relative group'>
                            <div className='p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-110 hover:text-gray-900'>
                                <ShoppingCart className='w-5 h-5' />
                            </div>
                            {cartCount > 0 && (
                                <span key={cartCount} className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg ring-2 ring-white animate-scale'>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className='relative group'>
                            <button
                                onClick={() => token ? null : navigate('/login')}
                                className='p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition-all duration-300 hover:scale-110 hover:text-gray-900'
                            >
                                <User className='w-5 h-5' />
                            </button>
                            {token && (
                                <div className='absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-50'>
                                    <div className='bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] py-2 w-40 border border-gray-100 overflow-hidden'>
                                        <button className='w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:translate-x-0.5'>
                                            My Profile
                                        </button>
                                        <button
                                            onClick={() => navigate('/orders')}
                                            className='w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:translate-x-0.5'
                                        >
                                            Orders
                                        </button>
                                        <button
                                            onClick={logout}
                                            className='w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 hover:translate-x-0.5'
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex lg:hidden items-center gap-3'>
                        <button
                            onClick={handleSearchMobile}
                            className='p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300'
                        >
                            <Search className='w-5 h-5' />
                        </button>

                        <Link to='/cart' className='relative'>
                            <div className='p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300'>
                                <ShoppingCart className='w-5 h-5' />
                            </div>
                            {cartCount > 0 && (
                                <span key={cartCount} className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale'>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setVisible(true)}
                            className='p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300'
                        >
                            <Menu className='w-6 h-6' />
                        </button>
                    </div>
                </div>

                <div className='hidden lg:flex items-center justify-center space-x-8 pb-4 border-b border-gray-100/50'>
                    <NavLink
                        to='/'
                        className={({ isActive }) =>
                            `text-xs font-semibold tracking-wider transition-all duration-300 hover:text-gray-900 relative py-2 ${isActive ? 'text-gray-900' : 'text-gray-600'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                HOME
                                {isActive && (
                                    <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full scale-x-100 origin-left transition-transform duration-300'></span>
                                )}
                            </>
                        )}
                    </NavLink>

                    <div
                        className='relative'
                        onMouseEnter={() => setCategoriesOpen(true)}
                        onMouseLeave={() => setCategoriesOpen(false)}
                    >
                        <NavLink
                            to='/collection'
                            className={({ isActive }) =>
                                `text-xs font-semibold tracking-wider transition-all duration-300 hover:text-gray-900 relative py-2 ${isActive ? 'text-gray-900' : 'text-gray-600'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    COLLECTION
                                    {isActive && (
                                        <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full scale-x-100 origin-left transition-transform duration-300'></span>
                                    )}
                                </>
                            )}
                        </NavLink>

                        <div
                            className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 w-screen max-w-4xl transition-all duration-300 z-50 ${categoriesOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-3 invisible'
                                }`}
                        >
                            <div className='bg-white rounded-xl shadow-[0_12px_50px_rgba(0,0,0,0.12)] border border-gray-100 p-10'>
                                <div className='grid grid-cols-4 gap-10'>
                                    <div>
                                        <h3 className='font-bold text-gray-900 mb-4 text-xs tracking-widest uppercase'>Men</h3>
                                        <ul className='space-y-3 border-l-2 border-gray-200 pl-4'>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Topwear</a></li>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Bottomwear</a></li>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Winterwear</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-gray-900 mb-4 text-xs tracking-widest uppercase'>Women</h3>
                                        <ul className='space-y-3 border-l-2 border-gray-200 pl-4'>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Topwear</a></li>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Bottomwear</a></li>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Winterwear</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-gray-900 mb-4 text-xs tracking-widest uppercase'>Kids</h3>
                                        <ul className='space-y-3 border-l-2 border-gray-200 pl-4'>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Topwear</a></li>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Bottomwear</a></li>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Winterwear</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-gray-900 mb-4 text-xs tracking-widest uppercase'>Accessories</h3>
                                        <ul className='space-y-3 border-l-2 border-gray-200 pl-4'>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Bags</a></li>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Jewelry</a></li>
                                            <li><a href='#' className='text-sm text-gray-600 hover:text-gray-900 hover:underline decoration-2 underline-offset-2 transition-all duration-200'>Watches</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <NavLink
                        to='/store'
                        className={({ isActive }) =>
                            `text-xs font-semibold tracking-wider transition-all duration-300 hover:text-gray-900 relative py-2 ${isActive ? 'text-gray-900' : 'text-gray-600'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                MINI STORE
                                {isActive && (
                                    <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full scale-x-100 origin-left transition-transform duration-300'></span>
                                )}
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to='/about'
                        className={({ isActive }) =>
                            `text-xs font-semibold tracking-wider transition-all duration-300 hover:text-gray-900 relative py-2 ${isActive ? 'text-gray-900' : 'text-gray-600'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                ABOUT
                                {isActive && (
                                    <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full scale-x-100 origin-left transition-transform duration-300'></span>
                                )}
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to='/contact'
                        className={({ isActive }) =>
                            `text-xs font-semibold tracking-wider transition-all duration-300 hover:text-gray-900 relative py-2 ${isActive ? 'text-gray-900' : 'text-gray-600'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                CONTACT
                                {isActive && (
                                    <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full scale-x-100 origin-left transition-transform duration-300'></span>
                                )}
                            </>
                        )}
                    </NavLink>
                </div>
            </div>

            <div
                className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setVisible(false)}
            />

            <div
                className={`fixed top-0 left-0 bottom-0 w-80 bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${visible ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className='flex flex-col h-full'>
                    <div className='flex items-center justify-between p-5 border-b border-gray-100'>
                        <img src={assets.logo} className='h-7 w-auto' alt="TinyMillion logo" />
                        <button
                            onClick={() => setVisible(false)}
                            className='p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110'
                        >
                            <X className='w-5 h-5 text-gray-600' />
                        </button>
                    </div>

                    <div className='flex-1 overflow-y-auto py-3'>
                        <NavLink
                            to='/'
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                                `block px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${isActive ? 'text-gray-900 bg-gray-100 border-l-3 border-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            HOME
                        </NavLink>
                        <NavLink
                            to='/collection'
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                                `block px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${isActive ? 'text-gray-900 bg-gray-100 border-l-3 border-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            COLLECTION
                        </NavLink>
                        <NavLink
                            to='/store'
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                                `block px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${isActive ? 'text-gray-900 bg-gray-100 border-l-3 border-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            MINI STORE
                        </NavLink>
                        <NavLink
                            to='/about'
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                                `block px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${isActive ? 'text-gray-900 bg-gray-100 border-l-3 border-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            ABOUT
                        </NavLink>
                        <NavLink
                            to='/contact'
                            onClick={() => setVisible(false)}
                            className={({ isActive }) =>
                                `block px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${isActive ? 'text-gray-900 bg-gray-100 border-l-3 border-gray-900' : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            CONTACT
                        </NavLink>
                    </div>

                    {token && (
                        <div className='border-t border-gray-100 p-3 space-y-2 bg-gray-50'>
                            <button className='w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-all duration-200'>
                                My Profile
                            </button>
                            <button
                                onClick={() => { navigate('/orders'); setVisible(false); }}
                                className='w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-all duration-200'
                            >
                                Orders
                            </button>
                            <button
                                onClick={() => { logout(); setVisible(false); }}
                                className='w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-white rounded-lg transition-all duration-200'
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes scale {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
                .animate-scale {
                    animation: scale 0.3s ease-in-out;
                }
            `}</style>
        </nav>
    )
}

export default Navbar;

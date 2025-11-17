import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useCoins } from '../context/CoinContext'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { freeVisitsRemaining } = useCoins()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 px-2 sm:px-4">
      <div className="navbar-start flex-1">
        {/* Mobile Menu Button */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLineCap="round"
                strokeLineJoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {mobileMenuOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <li>
                <Link to="/" className="text-base">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-base">About</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-base">Gallery</Link>
              </li>
              <li>
                <Link to="/articles" className="text-base">Articles</Link>
              </li>
            </ul>
          )}
        </div>

        {/* Logo and Brand Name */}
        <Link
          to="/"
          className="btn btn-ghost px-1 sm:px-2 md:px-4 normal-case text-sm sm:text-base md:text-xl"
          aria-label="Art Gallery Home"
        >
          <img
            src="/images/logo.png"
            alt="Art Gallery Logo"
            className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 object-contain mr-1 sm:mr-2"
          />
          <span className="hidden xs:inline sm:inline">Art Gallery</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link to="/" className="text-base hover:bg-primary hover:text-primary-content rounded-lg">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-base hover:bg-primary hover:text-primary-content rounded-lg">
              About
            </Link>
          </li>
          <li>
            <Link to="/gallery" className="text-base hover:bg-primary hover:text-primary-content rounded-lg">
              Gallery
            </Link>
          </li>
          <li>
            <Link to="/articles" className="text-base hover:bg-primary hover:text-primary-content rounded-lg">
              Articles
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Side Actions */}
      <div className="navbar-end gap-1 sm:gap-2 flex-nowrap">
        {/* Search - Hidden on small mobile, shown on larger screens */}
        <div className="form-control hidden sm:flex">
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered w-24 md:w-auto text-sm"
            aria-label="Search artists and artworks"
          />
        </div>

        {/* Coin Display - Responsive */}
        {user ? (
          <div className="badge badge-primary gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLineCap="round"
                strokeLineJoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="hidden xs:inline">{user.coins || 0}</span>
            <span className="xs:hidden">{user.coins || 0}</span>
          </div>
        ) : (
          <div className="badge badge-secondary gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3">
            <span className="hidden xs:inline">{freeVisitsRemaining} free</span>
            <span className="xs:hidden">{freeVisitsRemaining}</span>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          className="btn btn-ghost btn-circle btn-sm sm:btn-md focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLineCap="round"
                strokeLineJoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLineCap="round"
                strokeLineJoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* User Menu */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar btn-sm sm:btn-md focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User menu"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                <img
                  alt="User avatar"
                  src={user.photoURL || '/default-avatar.png'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {dropdownOpen && (
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300"
                onClick={() => setDropdownOpen(false)}
              >
                <li>
                  <Link to="/profile" className="text-base">Profile</Link>
                </li>
                <li>
                  <button onClick={() => navigate('/profile?tab=coins')} className="text-base">
                    My Coins
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/profile?tab=visits')} className="text-base">
                    Visit History
                  </button>
                </li>
                <li>
                  <button onClick={handleSignOut} className="text-base text-error">
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-primary btn-sm sm:btn-md text-xs sm:text-sm px-3 sm:px-4"
            aria-label="Login"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar

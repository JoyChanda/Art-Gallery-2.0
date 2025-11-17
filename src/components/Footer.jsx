import { Link } from 'react-router-dom'
import { FaTwitter, FaInstagram, FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="footer bg-base-200 text-base-content border-t border-base-300">
      <div className="container mx-auto px-4 py-10 md:py-12">
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column - Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <Link
              to="/"
              className="mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
              aria-label="Art Gallery Home"
            >
              <img
                src="/images/logo.png"
                alt="Art Gallery Logo"
                className="h-16 w-16 md:h-20 md:w-20 object-contain"
              />
            </Link>
            <p className="text-sm md:text-base text-base-content/80 text-center md:text-left max-w-sm">
              Art galleries need to have enough space to hold several collections of art for show as
              well as in storage if possible. Don't forget you need to be able to host receptions.
              That means a space large enough that allows people to socialize and move around.
            </p>
          </div>

          {/* Center Column - Page Links */}
          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">Navigation</h3>
            <nav className="flex flex-col gap-3" aria-label="Footer Navigation">
              <Link
                to="/"
                className="link link-hover text-base-content/80 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 transition-colors"
                aria-label="Navigate to Home page"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="link link-hover text-base-content/80 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 transition-colors"
                aria-label="Navigate to About page"
              >
                About
              </Link>
              <Link
                to="/gallery"
                className="link link-hover text-base-content/80 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 transition-colors"
                aria-label="Navigate to Gallery page"
              >
                Gallery
              </Link>
              <Link
                to="/articles"
                className="link link-hover text-base-content/80 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 transition-colors"
                aria-label="Navigate to Articles page"
              >
                Article
              </Link>
            </nav>
          </div>

          {/* Right Column - Social Media */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide">Follow Us</h3>
            <div className="flex gap-4" role="list" aria-label="Social Media Links">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle hover:bg-primary hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                aria-label="Follow us on Twitter"
                role="listitem"
              >
                <FaTwitter className="text-xl md:text-2xl" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle hover:bg-primary hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                aria-label="Follow us on Instagram"
                role="listitem"
              >
                <FaInstagram className="text-xl md:text-2xl" aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle hover:bg-primary hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                aria-label="Follow us on Facebook"
                role="listitem"
              >
                <FaFacebook className="text-xl md:text-2xl" aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle hover:bg-primary hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                aria-label="Follow us on YouTube"
                role="listitem"
              >
                <FaYoutube className="text-xl md:text-2xl" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle hover:bg-primary hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                aria-label="Follow us on LinkedIn"
                role="listitem"
              >
                <FaLinkedin className="text-xl md:text-2xl" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-base-300 mt-8 pt-6 text-center">
          <p className="text-sm text-base-content/70">
            Copyright © {new Date().getFullYear()} - All rights reserved by Art Gallery
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Leaf
} from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-brand rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-accent">
                  Hey Harvest
                </h3>
                <p className="text-sm text-gray-400">Premium Makhana</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium makhana from the pristine ponds of Mithilanchal, Bihar. 
              Bringing you the finest quality lotus seeds with natural goodness.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Our Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/health-benefits" className="text-gray-400 hover:text-white transition-colors">
                  Health Benefits
                </Link>
              </li>
              <li>
                <Link to="/process" className="text-gray-400 hover:text-white transition-colors">
                  Our Process
                </Link>
              </li>
              <li>
                <Link to="/certifications" className="text-gray-400 hover:text-white transition-colors">
                  Certifications
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-gray-400 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-gray-400 text-sm">hello@heyharvest.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-accent mt-1" />
                <span className="text-gray-400 text-sm">
                  Patna, Bihar, India<br />
                  Pin: 800001
                </span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2">Stay Updated</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-r-md text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Hey Harvest Foods Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Made with ❤️ in Bihar</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs">Powered by</span>
              <span className="text-accent text-xs font-semibold">MERN Stack</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

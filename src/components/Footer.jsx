import { motion } from 'framer-motion'
import { Github, Linkedin, Instagram, Youtube, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socials = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/joel-castro-/',
      icon: Linkedin,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Joel-CA',
      icon: Github,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/joel.castro__/',
      icon: Instagram,
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/channel/UCdyH58i2nqY-lhJjnWhvcNA',
      icon: Youtube,
    },
  ]

  return (
    <motion.footer
      id="contact"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl font-bold mb-2">
              <span className="gradient-text">Joel</span>'s Portfolio
            </h3>
            <p className="text-slate-400">
              Computer Science @ USC
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <p>
                <a href="#about" className="text-slate-400 hover:text-primary-400 transition">
                  About
                </a>
              </p>
              <p>
                <a href="#projects" className="text-slate-400 hover:text-primary-400 transition">
                  Projects
                </a>
              </p>
              <p>
                <a href="#publications" className="text-slate-400 hover:text-primary-400 transition">
                  Publications
                </a>
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-right"
          >
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <a
              href="mailto:joelcast@usc.edu"
              className="text-slate-400 hover:text-primary-400 transition flex items-center justify-center md:justify-end gap-2"
            >
              <Mail size={18} />
              joelcast [at] usc [dot] edu
            </a>
          </motion.div>
        </div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center gap-6 mb-8 pb-8 border-b border-slate-800"
        >
          {socials.map((social) => {
            const Icon = social.icon
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: '#a06fe2' }}
                className="text-slate-400 transition"
              >
                <Icon size={24} />
              </motion.a>
            )
          })}
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-slate-500 text-sm"
        >
          <p>
            Copyright &copy; {currentYear}. All rights reserved by Joel Castro.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer

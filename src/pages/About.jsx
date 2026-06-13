import { motion } from 'framer-motion'
import { Download, ExternalLink } from 'lucide-react'
import { getLatestResumePath } from '../utils/resumeHelper'

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.section
      id="about"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/50 to-slate-950"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image with hover effect */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.div
              className="relative w-full max-w-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-2xl blur-2xl" />
              <img
                src="/assets/img/SURF Portrait Square (softbox lighting).png"
                alt="Joel Castro Portrait"
                className="relative rounded-2xl shadow-2xl border border-primary-500/20 w-full h-auto"
              />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants}>
            <h2 className="section-title text-left text-4xl md:text-5xl mb-6">
              Joel E. Castro Hernandez
            </h2>

            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              I'm a masters student at the University of Southern California (USC) majoring in computer science. My passions and
              interests lie in the realm of computer graphics, robotics, computer vision, simulations, and in particular,
              the overlap these arenas have with animation, film, video games, and AR/VR.
            </p>

            {/* Facts */}
            <motion.div
              variants={containerVariants}
              className="space-y-3 mb-8"
            >
              {[
                { label: 'From:', value: 'San Diego, CA' },
                { label: 'Age:', value: '22' },
                { label: 'Pronouns:', value: 'He/Him/His' },
                { label: 'Cat dad of:', value: 'Milo, Mitchu, Sol, Rumi, and Cowboy' },
              ].map((fact, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex gap-2"
                >
                  <span className="font-semibold text-slate-400">{fact.label}</span>
                  <span className="text-slate-300">{fact.value}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <a
                href={getLatestResumePath()}
                download="Joel_Castro_Resume.pdf"
                className="btn-primary flex items-center gap-2"
              >
                <Download size={18} />
                Download Resume
              </a>
              <a
                href="https://joel-ca.github.io/JoelsCatShowcaser/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2"
              >
                <ExternalLink size={18} />
                Cat Showcaser
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default About

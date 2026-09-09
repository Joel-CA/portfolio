import { motion } from 'framer-motion'
import { Download, ExternalLink } from 'lucide-react'
import { getLatestResumePath } from '../utils/resumeHelper'
import ThreeDViewer from '../components/ThreeDViewer'

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
        <div className="flex flex-col gap-16">
          {/* Top Row: Image & Content */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image with hover effect */}
            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <motion.div
                className="relative w-full max-w-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-2xl blur-2xl" />
                <img
                  src="./assets/img/SURF Portrait Square (softbox lighting).png"
                  alt="Joel Castro Portrait"
                  className="relative rounded-2xl shadow-2xl border border-primary-500/20 w-full h-auto"
                />
              </motion.div>

              {/* University Affiliations */}
              <motion.div
                variants={itemVariants}
                className="mt-5 w-full max-w-sm"
              >
                <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-3 font-medium">Studied & Worked At</p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {[
                    { file: 'usc.png',      label: 'University of Southern California', whiteBg: true  },
                    { file: 'ucb.png',      label: 'UC Berkeley',                       whiteBg: false },
                    { file: 'stanford.png', label: 'Stanford University',               whiteBg: true  },
                    { file: 'ucsf.png',     label: 'UC San Francisco',                  whiteBg: true  },
                    { file: 'cmu.png',      label: 'Carnegie Mellon University',         whiteBg: true  },
                  ].map((school) => (
                    <motion.div
                      key={school.file}
                      whileHover={{ scale: 1.18, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className={`group relative flex items-center justify-center w-12 h-12 rounded-full border border-slate-600 hover:border-slate-400 cursor-default shadow-md hover:shadow-lg transition-shadow duration-300 ${school.whiteBg ? 'bg-white' : 'bg-slate-800/80'}`}
                      title={school.label}
                    >
                      <img
                        src={`./assets/img/logos/${school.file}`}
                        alt={school.label}
                        className="w-10 h-10 object-contain transition-transform duration-300 drop-shadow-sm"
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 z-10">
                        {school.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div variants={itemVariants}>
              <h2 className="section-title text-left text-4xl md:text-5xl mb-6">
                Joel E. Castro Hernandez
              </h2>

              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                I'm a masters student at the University of Southern California (USC) majoring in computer science. I did my undergraduate studies at UC Berkeley where I also held research positions at Stanford, UCSF, and CMU. My passions and
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

          {/* Bottom Row: 3D Viewer */}
          <motion.div variants={itemVariants} className="w-full sm:w-4/5 mx-auto">
            <ThreeDViewer />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default About

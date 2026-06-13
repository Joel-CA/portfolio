import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const ProjectModal = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 pointer-events-auto">
              {/* Header with close button */}
              <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-primary-400">
                  {project.title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Main image */}
                {project.image && (
                  <div className="w-full rounded-lg overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}

                {/* Tech and category */}
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-primary-700/20 text-primary-400 rounded-full text-sm">
                    {project.tech}
                  </span>
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm capitalize">
                    {project.category}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Extended content if available */}
                {project.extended && (
                  <>
                    {project.extended.features && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Features</h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                          {project.extended.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.extended.details && (
                      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {project.extended.details}
                      </div>
                    )}

                    {project.extended.images && project.extended.images.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Gallery</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.extended.images.map((img, idx) => (
                            <div key={idx} className="rounded-lg overflow-hidden">
                              <img
                                src={img.src}
                                alt={img.caption}
                                className="w-full h-auto"
                              />
                              {img.caption && (
                                <p className="text-sm text-slate-400 mt-2 text-center">
                                  {img.caption}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Links */}
                {project.links && project.links.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Links</h3>
                    <div className="flex flex-wrap gap-3">
                      {project.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline text-sm py-1 px-3"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProjectModal

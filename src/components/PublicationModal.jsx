import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Award } from 'lucide-react'

const PublicationModal = ({ publication, isOpen, onClose }) => {
  if (!isOpen || !publication) return null

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
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 pointer-events-auto">
              {/* Header with close button */}
              <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-primary-400">
                  {publication.title}
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
                {/* Publication Info */}
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-slate-400">Authors:</span>
                    <p className="text-slate-300 italic mt-1">{publication.authors}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Venue:</span>
                    <p className="text-slate-300">{publication.venue}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">Status:</span>
                    <p className="text-slate-300">{publication.status}</p>
                  </div>
                </div>

                {/* Poster Image */}
                {publication.posterImage && (
                  <div className="w-full rounded-lg overflow-hidden">
                    <img
                      src={publication.posterImage}
                      alt="Publication Poster"
                      className="w-full h-auto max-h-64 object-cover"
                    />
                  </div>
                )}

                {/* Abstract */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Abstract</h3>
                  <p className="text-slate-300 leading-relaxed">
                    {publication.abstract}
                  </p>
                </div>

                {/* Awards */}
                {publication.awards && publication.awards.length > 0 && (
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-primary-500/20">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Award size={20} className="text-primary-400" />
                      Awards & Recognition
                    </h3>
                    <div className="space-y-2">
                      {publication.awards.map((award, idx) => (
                        <div key={idx} className="text-primary-300">
                          • {award}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Paper Links */}
                {publication.links && publication.links.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {publication.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs py-1 px-3 rounded transition ${
                            link.disabled
                              ? 'bg-slate-700/30 text-slate-600 cursor-not-allowed'
                              : 'btn-outline'
                          }`}
                          disabled={link.disabled}
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Poster and Video Links */}
                {(publication.posterLink || publication.videoLink) && (
                  <div className="flex gap-2 flex-wrap pt-4 border-t border-slate-800">
                    {publication.posterLink && (
                      <a
                        href={publication.posterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-outline text-sm py-2 px-4 flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        View Poster
                      </a>
                    )}
                    {publication.videoLink && (
                      <a
                        href={publication.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-outline text-sm py-2 px-4 flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        {publication.videoLinkText || 'Watch Video'}
                      </a>
                    )}
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

export default PublicationModal

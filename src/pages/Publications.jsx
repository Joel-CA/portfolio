import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Award } from 'lucide-react'
import PublicationModal from '../components/PublicationModal'

const Publications = () => {
  const [selectedPublication, setSelectedPublication] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openPublication = (pub) => {
    setSelectedPublication(pub)
    setIsModalOpen(true)
  }
  const publications = [
    {
      title: '[Title TBD]',
      authors: 'Austin Patel, Joel E. Castro Hernandez, Shuran Song',
      venue: 'TBD',
      status: 'Draft',
      abstract: '[Abstract TBD].',
      posterImage: './assets/Posters/Teaching Robots to Write Preview.png',
      links: [
        { text: 'Paper Coming Soon', url: '#', disabled: true },
        { text: 'Conference Page Coming Soon', url: '#', disabled: true },
      ],
      posterLink: './assets/Posters/REAL Labs - Teaching Robots to Write (SURF & SEED versions).pdf',
      videoLink: 'https://youtu.be/6p_m_byNkXs?si=cVlmHBuHn--0y3HV',
      videoLinkText: 'Lightning Talk Video',
    },
    {
      title: 'Understanding Program Visualizations in the Wild',
      authors: 'Joel E. Castro Hernandez, Olohi Goodness John',
      venue: 'SPLASH, 2024',
      status: 'Published',
      abstract:
        'Visualizations play a significant role in writing, debugging, profiling, and generally understanding programs. However, little work has been done to understand the structure of program visualizations at a fundamental level— namely, why and how they scale. In this paper we present a theory of the interpretability of program visualizations focused on their abstraction and composition properties.',
      posterImage: './assets/Posters/Understanding Program Visualizations In The Wild Preview.png',
      links: [
        {
          text: 'View Paper',
          url: 'https://dl.acm.org/doi/pdf/10.1145/3689491.3689975',
        },
        {
          text: 'SPLASH Page',
          url: 'https://2024.splashcon.org/details/splash-2024-SRC/10/Understanding-Program-Visualizations-in-the-Wild',
        },
        {
          text: 'ACM Digital Library',
          url: 'https://dl.acm.org/doi/abs/10.1145/3689491.3689975',
        },
      ],
      posterLink: './assets/Posters/Understanding Program Visualizations in the Wild Poster (REUSE & SPLASH Versions).pdf',
      awards: [
        'Selected for Poster & Oral Presentations at SPLASH',
        'Selected for Poster Presentation at SACNAS',
      ],
    },
    {
      title: 'Interpretable biophysical neural networks of transcriptional activation domains separate roles of protein abundance and coactivator binding',
      authors:
        'Claire LeBlanc, Pooja Agarwal, Jack Demaray, Gean Hu, Marissa Zintel, Angelica Lam, Joel E. Castro Hernandez, Max Staller',
      venue: 'Cell Press',
      status: 'Under Review (Preprint)',
      abstract:
        'Deep neural networks have improved biological prediction accuracy, but interpretation remains challenging. We designed simple neural networks incorporating biophysical models of transcriptional activation domains. These networks revealed how hydrophobic residues increase activation strength while decreasing protein abundance, and how acidic residues control both parameters. Combining biophysical and deep neural networks maximizes prediction accuracy and interpretability to yield insights into biological mechanisms.',
      links: [
        {
          text: 'View Paper',
          url: 'https://www.biorxiv.org/content/10.1101/2025.09.19.677413v1.full.pdf',
        },
        {
          text: 'bioRxiv',
          url: 'https://www.biorxiv.org/content/10.1101/2025.09.19.677413v1',
        },
        {
          text: 'NIH PubMed',
          url: 'https://pubmed.ncbi.nlm.nih.gov/41000786/',
        },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.section
      id="publications"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={cardVariants} className="text-center mb-16">
          <p className="section-subtitle">Publications</p>
          <h2 className="section-title">Research & Publications</h2>

          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
            <a
              href="https://scholar.google.com/citations?user=6vb9oD4AAAAJ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition flex items-center gap-1"
            >
              Google Scholar
              <ExternalLink size={16} />
            </a>
            <span className="text-slate-500">|</span>
            <a
              href="https://dl.acm.org/profile/99661387609"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition flex items-center gap-1"
            >
              ACM Profile
              <ExternalLink size={16} />
            </a>
            <span className="text-slate-500">|</span>
            <a
              href="https://orcid.org/0000-0002-8759-4678"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition flex items-center gap-1"
            >
              ORCID
              <ExternalLink size={16} />
            </a>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{
            scrollBehavior: 'smooth',
            scrollPaddingLeft: 'auto',
          }}
        >
          {publications.map((pub, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => openPublication(pub)}
              className="card-base overflow-hidden flex-shrink-0 w-full md:w-96 snap-start cursor-pointer"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary-400 mb-3">
                  {pub.title}
                </h3>

                <div className="space-y-2 mb-4 text-sm">
                  <p>
                    <span className="font-medium">Authors:</span>{' '}
                    <em>{pub.authors}</em>
                  </p>
                  <p>
                    <span className="font-medium">Venue:</span> {pub.venue}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {pub.status}
                  </p>
                </div>

                <p className="text-slate-400 text-sm mb-4">
                  {pub.abstract}
                </p>

                {pub.awards && pub.awards.length > 0 && (
                  <div className="mb-4 p-3 bg-slate-800/50 rounded border border-primary-500/20">
                    {pub.awards.map((award, idx) => (
                      <div key={idx} className="flex gap-2 text-xs text-primary-300 mb-1 last:mb-0">
                        <Award size={14} className="flex-shrink-0 mt-0.5" />
                        <span>{award}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {pub.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`px-3 py-1 text-xs rounded transition ${
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

                {pub.posterImage && (
                  <div className="mb-4">
                    <img
                      src={pub.posterImage}
                      alt="Publication Poster"
                      className="rounded w-full h-32 object-cover"
                    />
                  </div>
                )}

                {(pub.posterLink || pub.videoLink) && (
                  <div className="flex gap-2 flex-wrap">
                    {pub.posterLink && (
                      <a
                        href={pub.posterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-outline text-xs py-1 px-3"
                      >
                        View Poster
                      </a>
                    )}
                    {pub.videoLink && (
                      <a
                        href={pub.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-outline text-xs py-1 px-3"
                      >
                        {pub.videoLinkText || 'Watch Video'}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <PublicationModal
        publication={selectedPublication}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.section>
  )
}

export default Publications

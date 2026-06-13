import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Play } from 'lucide-react'
import ProjectModal from '../components/ProjectModal'

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

  const projects = [
    {
      id: 1,
      title: 'Diffusion/FM (from scratch)',
      image: '/assets/img/work/cs180_proj5_imgs/pic_w_kanazawa_transition_to_infill.gif',
      description: 'Explorations in diffusion and flow-matching generative models, image infill and class-conditioned sampling.',
      tech: 'Python, PyTorch',
      category: 'tools',
      links: [
        { text: 'Project Page', url: 'https://joel-ca.github.io/CS180/project5/' },
        { text: "Joel's CS180 Projects", url: 'https://joel-ca.github.io/CS180/' },
      ],
      extended: {
        features: [
          'Image infill and conditional sampling experiments.',
          'Label + time conditioned Flow matching models trained from scratch.',
          'Class-conditioned generation and interpolations.',
        ]
      }
    },
    {
      id: 2,
      title: 'NeRF (from scratch)',
      image: '/assets/img/work/cs180_proj4_imgs/lafufu_nerf_thumnail.gif',
      description: 'Implementation of Neural Radiance Fields for 3D scene reconstruction from multi-view images.',
      tech: 'Python, PyTorch',
      category: 'tools',
      links: [
        { text: 'Project Writeup', url: 'https://joel-ca.github.io/CS180/project4/' },
        { text: "Joel's CS180 Projects", url: 'https://joel-ca.github.io/CS180/' },
      ],
      extended: {
        features: [
          'Camera calibration using ArUco markers with intrinsics and distortion coefficient estimation.',
          '2D neural field fitting with sinusoidal positional encoding.',
          'Ray generation and stratified sampling with perturbation.',
          'Volume rendering equation implementation.',
          'Novel view synthesis with 20+ dB validation PSNR.',
        ]
      }
    },
    {
      id: 3,
      title: 'ANova Space Adventure',
      image: '/assets/img/work/arduino_picture.jpg',
      description: 'An endless space flyer for the Arduino joystick! Navigate your jet through an asteroid field.',
      tech: 'Processing, Java, Arduino',
      category: 'games',
      links: [
        { text: 'Github', url: 'https://github.com/Joel-CA/AnovaSpaceAdventure' },
        { text: 'Play on itch.io', url: 'https://joel-ca.itch.io/anova-space-adventure' },
      ],
      extended: {
        details: 'Navigate your jet through an asteroid field. Destroy asteroids and survive! How far can you get?'
      }
    },
    {
      id: 4,
      title: 'Spheres & Physics',
      image: '/assets/img/work/spheres_physics_thumbnnail.jpg',
      description: 'Minecraft Fabric Mod with spheres that interact with physics and custom shaders.',
      tech: 'Minecraft Fabric Mod, Java',
      category: 'games',
      links: [
        { text: 'Github', url: 'https://github.com/jordan-duan/184-final' },
        { text: 'CurseForge Mod', url: 'https://www.curseforge.com/minecraft/mc-mods/spheres-physics' },
        { text: 'CurseForge Shaders', url: 'https://www.curseforge.com/minecraft/shaders/spheres-physics-shaders' },
      ],
      extended: {
        features: [
          'Procedural sphere model generation',
          'Sphere texture mapping',
          'Quaternion-based, physically accurate rotation mechanics',
          'Final video editing',
          'Project deliverable writing',
        ],
        details: 'CS184 Spring 2025 - Final Project Honorable Mention\n\nSpheres & Physics, but in Minecraft! We modded Minecraft to introduce two major enhancements: spheres that interacted with physics and custom shaders.',
      }
    },
    {
      id: 5,
      title: 'Cloth Simulator',
      image: '/assets/img/work/mirror_shader_clothOnSphere.jpg',
      description: 'C++ cloth simulation with physics, collision detection, and advanced shading.',
      tech: 'C++',
      category: 'graphics',
      links: [
        { text: 'Webpage Writeup', url: 'https://cal-cs184-student.github.io/joel-castro/hw4/index.html' },
      ],
      extended: {
        features: [
          'Masses and springs with structural, shearing, and bending constraints',
          'Simulation via Verlet integration for improved stability',
          'Collision handling with ray-sphere and ray-plane intersection testing',
          'Self-collision detection with spatial hash mapping',
          'Blinn-Phong shading, bump mapping, displacement mapping, and mirror shaders',
        ]
      }
    },
    {
      id: 6,
      title: 'Path Tracer',
      image: '/assets/img/work/RR_m5_bunny.png',
      description: 'C++ path tracer with BVH acceleration, direct/global illumination, and adaptive sampling.',
      tech: 'C++',
      category: 'graphics',
      links: [
        { text: 'Webpage Writeup', url: 'https://cal-cs184-student.github.io/joel-castro/hw3/index.html' },
      ],
      extended: {
        features: [
          'Ray generation and scene intersection with Möller-Trumbore algorithm',
          'Bounding Volume Hierarchy (BVH) with median primitive position splits',
          'Direct illumination with hemisphere and importance sampling',
          'Global illumination using Monte-Carlo integration',
          'Russian Roulette ray termination',
          'Adaptive sampling for optimized rendering',
        ]
      }
    },
    {
      id: 7,
      title: 'Mesh Editor',
      image: '/assets/img/work/king_clawthorn.png',
      description: 'C++ mesh editor with Bezier curves, half-edge data structure, and loop subdivision.',
      tech: 'C++',
      category: 'graphics',
      links: [
        { text: 'Webpage Writeup', url: 'https://cal-cs184-student.github.io/joel-castro/hw2/index.html' },
      ],
      extended: {
        features: [
          'Bezier curves with 1D de Casteljau subdivision',
          'Bezier surfaces with separable 1D de Casteljau subdivision',
          'Triangle meshes with half-edge data structure',
          'Area-weighted vertex normals',
          'Edge flip and edge split operations',
          'Loop subdivision for mesh upsampling',
        ],
        details: 'Art: 3D models of King Clawthorn from The Owl House modeled in AutoDesk Maya and rendered in Mesh Editor.'
      }
    },
    {
      id: 8,
      title: 'Rasterizer',
      image: '/assets/img/work/joel_cat_art_184.png',
      description: 'C++ rasterizer with antialiasing, texture mapping, and level sampling.',
      tech: 'C++',
      category: 'graphics',
      links: [
        { text: 'Webpage Writeup', url: 'https://cal-cs184-student.github.io/joel-castro/hw1/index.html' },
      ],
      extended: {
        features: [
          'Triangle rasterization and optimizations',
          'Antialiasing by supersampling',
          'Configurable sampling rate',
          'Transformation functions',
          'Barycentric coordinates interpolation',
          'Texture mapping with nearest, bilinear, and level sampling',
        ]
      }
    },
    {
      id: 9,
      title: 'Sockrates: Color Sorting/Folding',
      image: '/assets/img/work/sockrates_thumbnail.png',
      description: 'Programmed Sawyer robot arm to fold socks and sort by color using OpenCV and ROS.',
      tech: 'ROS, Python (OpenCV), Sawyer Robot',
      category: 'tools',
      links: [
        { text: 'Project Website', url: 'https://106a-project-site.vercel.app/' },
      ],
      extended: {
        features: [
          'Implemented Python, OpenCV HSV-mask color sorting script with 100% correct classification',
          'Worked on Inverse-Kinematics-based (IK) path planning for delivering folded socks to correct bin',
          'Worked on Forward Kinematic (FK) sock folding actuation',
          'Built ROS Publisher/Subscriber system to integrate computer vision, FK, and IK scripts',
        ],
        details: 'Programmed Sawyer industrial robot arm to fold socks and sort them based on color. Worked in group of 4 for a semester and presented results at UC Berkeley\'s EECS 106A showcase.'
      }
    },
    {
      id: 10,
      title: 'Four Birds',
      image: '/assets/img/work/four_birds_thumbnail.png',
      description: 'Animated short produced in a team for UC Berkeley\'s UCBUGG community showcase.',
      tech: 'Maya, After Effects, Animated Short',
      category: 'animation',
      links: [
        { text: 'Watch on YouTube', url: 'https://www.youtube.com/embed/mOlBL_qqE-Q' },
      ],
      extended: {
        features: [
          'Wrote custom expressions for camera and baby-bird movements',
          'Animated timestamps: 0:00-0:07, 0:50-1:25',
          'Performed all compositing, sound-design, and editing',
          'Modeled, rigged, and skinned Mama Bird',
          'Designed Mama Bird and 4 baby birds',
          'Rendered with Pixar Renderman',
          'Co-storyboarded the short',
          'Textured baby birds',
        ]
      }
    },
    {
      id: 11,
      title: 'Projection-Based Rendering',
      image: '/assets/img/work/JoelProjection-BasedRenderingInProcessingThumbnail.png',
      description: 'Projection-based rendering in Processing with 3D model importing and performance optimizations.',
      tech: 'Processing, Java',
      category: 'graphics',
      links: [
        { text: 'Github', url: 'https://github.com/Joel-CA/projectionBasedRenderingInProcessing' },
        { text: 'Play on itch.io', url: 'https://joel-ca.itch.io/projection-based-rendering' },
      ],
      extended: {
        details: 'Rederiving and implementing projection-based rendering in Processing (Java kernel). Built with nothing more than the Processing\'s 2D line drawing function. Implemented 3D model (STL, OBJ) importing, player scene traversal, and performance optimizations such as frustum and backface culling.'
      }
    },
    {
      id: 12,
      title: 'Portal Spoof',
      image: '/assets/img/work/portal_spoof_image.JPG',
      description: 'UE5 portal gun inspired by Valve\'s Portal game with momentum conservation and item teleportation.',
      tech: 'Unreal Engine 5',
      category: 'games',
      links: [
        { text: 'Demo Video', url: 'https://www.youtube.com/embed/0RrBIWU3Qg4' },
      ],
      extended: {
        details: 'UE5 camera component-based portal gun inspired by the Valve game series! Supports momentum conservation, item/player teleportation, and a dynamic view out through the other portal just like in the real game.\n\nBlueprint implementation averages around 30 FPS. Currently being re-implemented in C++ to optimize memory and thread usage.'
      }
    },
    {
      id: 13,
      title: 'Spotify to MP3',
      image: '/assets/img/work/spotify_to_mp3_readme_image.JPG',
      description: 'Tool to legally download Spotify playlists as MP3 files via YouTube.',
      tech: 'YouTube API, Spotify API, Python',
      category: 'tools',
      links: [
        { text: 'Github', url: 'https://github.com/Joel-CA/spotify_to_mp3' },
      ],
      extended: {
        details: 'Legally download your favorite Spotify playlists in mp3 format (via YouTube) for free!\n\nBuilt for Vivo Music 3 Garmin watch compatibility. Allows uploading playlists to watch at no cost.'
      }
    },
    {
      id: 14,
      title: 'Reefer',
      image: '/assets/img/work/refer_image.JPG',
      description: 'LA Hacks coral health ML classifier with interpretability using Gemini.',
      tech: 'Gemini API, Python (Reflex), Bash',
      category: 'tools',
      links: [
        { text: 'DEVPOST', url: 'https://devpost.com/software/reefer' },
      ],
      extended: {
        features: [
          'Takes a single image of coral and outputs health status (bleached or not)',
          'Provides interpretable analysis of model evaluation',
          'Gemini API for interpretability interface',
          'Integration with front-end and back-end via Python-Bash scripting',
        ],
        details: 'Reefer is a web app that analyzes coral health using ML. Primarily responsible for Reefer\'s Gemini Interpretability Interface and its subsequent integration.'
      }
    },
    {
      id: 15,
      title: "Rototo's Escape",
      image: '/assets/img/work/rototos_escape_image.JPG',
      description: '2D platformer game with recoil-based physics puzzle mechanics.',
      tech: 'Unity, JavaScript',
      category: 'games',
      links: [
        { text: 'Play on itch.io', url: 'https://guardhei.itch.io/rototos-escape' },
      ],
      extended: {
        details: 'Use the recoil of the pulse gun to solve different platforming puzzles and help Rototo escape from the lab!\n\nCo-developed a working 2D platformer video game prototype within a semester for a community showcase. Implemented GUI logic and game sound mechanics logic.'
      }
    },
    {
      id: 16,
      title: 'Picture Pathway',
      image: '/assets/img/work/picture_pathway_image.JPG',
      description: 'TreeHacks winner - student-teacher platform with generative AI visualizations.',
      tech: 'Dall-E API, JavaScript, Python (Django), SQL',
      category: 'tools',
      links: [
        { text: 'DEVPOST', url: 'https://devpost.com/software/picture-pathway' },
      ],
      extended: {
        details: 'Picture Pathway is a student-teacher platform that aims to emulate effective studying methodology through generative AI visualization assignments!\n\nTreeHacks Winner. Responsible for front-end development and supported teammates through integration and debugging of the back-end.'
      }
    },
    {
      id: 17,
      title: 'Saucy Car',
      image: '/assets/img/work/saucy_car_image.JPG',
      description: 'First 3D animated short with modeling, rigging, animation, and rendering.',
      tech: 'Maya, After Effects, Animated Short',
      category: 'animation',
      links: [
        { text: 'Watch on YouTube', url: 'https://www.youtube.com/embed/a063XUSM7wo' },
      ],
      extended: {
        features: [
          'Performed smokecloud FX animation/compositing and all sound-design/editing',
          'Modeled and textured pick-up truck, monster truck, and fridge',
          'Animated timestamps: 0:32-0:42',
          'Textured and lit environment',
          'Rendered with Arnold',
          'Skinned "Biker Dude"',
        ],
        details: 'Storyboarded, modeled, textured, rigged, skinned, animated, rendered, composited and sound-designed my first ever 3D animated short from scratch in a team of four within a semester.'
      }
    },
    {
      id: 18,
      title: "'Essay': An Atom Egoyan 'Calendar' Spoof",
      image: '/assets/img/work/essay_image.jpg',
      description: "Inspired by Atom Egoyan's techniques, exploring the interconnectedness of language and culture.",
      tech: 'Premiere Pro, Narrative Short Film',
      category: 'film',
      links: [
        { text: 'View on FilmFreeway', url: 'https://filmfreeway.com/Essay437' },
        { text: 'Watch on YouTube', url: 'https://www.youtube.com/embed/eP231yEMXqw' },
      ],
      extended: {
        details: "Inspired by the cinematic techniques employed in Atom Egoyan's 1993 film, Calendar, 'Essay' by Joel Castro attempts to capture the interconnectedness of language and culture, demonstrating how they contribute to our identities."
      }
    },
    {
      id: 19,
      title: 'Fulfilling Measure B',
      image: '/assets/img/work/fulfilling_measure_B_image.JPG',
      description: 'Documentary exploring decades-long battle for police reform in San Diego.',
      tech: 'Premiere Pro, Documentary Short Film',
      category: 'film',
      links: [
        { text: 'View on FilmFreeway', url: 'https://filmfreeway.com/FulfillingMeasureB' },
        { text: 'UCSD Breathable Streets', url: 'https://breathablestreets.ucsd.edu/youth-ambassador-scholars' },
      ],
      extended: {
        details: 'Fulfilling Measure B is a telling of a decades-long battle toward police reform in the city of San Diego. The film intends to recognize the monumental efforts of community members and organizations, and to shine a light on the need for reform.'
      }
    },
    {
      id: 20,
      title: 'Cave Explorer',
      image: '/assets/img/work/cave-explorer-screenshot02.png',
      description: 'Visually aesthetic cave-themed platformer. Collect gems, don\'t fall, get rich!',
      tech: 'Processing, Java',
      category: 'games',
      links: [
        { text: 'Play on itch.io', url: 'https://joel-ca.itch.io/cave-explorer' },
        { text: 'Github', url: 'https://github.com/Joel-CA/cave-explorer/tree/main' },
      ],
      extended: {
        details: 'Cave-themed, visually aesthetic platformer. Collect gems, don\'t fall, get rich. How much can you gather?'
      }
    },
  ]

  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Games', value: 'games' },
    { label: 'Graphics', value: 'graphics' },
    { label: 'Tools', value: 'tools' },
    { label: 'Animation', value: 'animation' },
    { label: 'Film', value: 'film' },
  ]

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  const openProject = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(6)
  }, [activeFilter])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const projectVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.section
      id="projects"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="section-subtitle">Projects</p>
          <h2 className="section-title">See my work!</h2>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeFilter === cat.value
                  ? 'bg-primary-700 text-white'
                  : 'btn-outline'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="wait">
            {filteredProjects.slice(0, visibleCount).map((project) => (
              <motion.div
                key={project.id}
                variants={projectVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover={{ y: -8 }}
                className="card-base overflow-hidden group cursor-pointer"
                onClick={() => openProject(project)}
              >
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-primary-400 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">
                    {project.description}
                  </p>
                  <p className="text-xs text-slate-500 mb-4">{project.tech}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.links.slice(0, 2).map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn-outline text-xs py-1 px-2 flex items-center gap-1"
                      >
                        {link.text.includes('Github') && <Github size={14} />}
                        {link.text.includes('itch.io') && <Play size={14} />}
                        {!link.text.includes('Github') && !link.text.includes('itch.io') && <ExternalLink size={14} />}
                        <span className="hidden sm:inline">{link.text}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Show More Button */}
        {visibleCount < filteredProjects.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="btn-primary px-8 py-3 text-lg"
            >
              Show More
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </motion.section>
  )
}

export default Projects
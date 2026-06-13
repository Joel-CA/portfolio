import { motion } from 'framer-motion'

const Skills = () => {
  const skillsData = [
    {
      category: 'Coding Languages',
      skills: [
        {
          name: 'Java',
          frameworks: ['Processing']
        },
        {
          name: 'C++',
          frameworks: ['OpenGL', 'DirectX']
        },
        {
          name: 'Python',
         frameworks: ['PyTorch', 'TensorFlow', 'OpenCV', 'ROS']
        },
        {
          name: 'C',
         frameworks: ['CUDA']
        },
        {
          name: 'JavaScript',
         frameworks: []
        },
      ]
    },
    {
      category: 'Software & Tools',
      skills: [
        { name: 'AutoDesk Maya', frameworks: [ 'Bifrost' ] },
        { name: 'Unreal Engine', frameworks: [] },
        { name: 'Unity', frameworks: [] },
        { name: 'Adobe', frameworks: ['Premiere Pro', 'After Effects', 'Photoshop'] },
        { name: 'Blender', frameworks: [] },
        { name: 'Git/GitHub', frameworks: [] },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const skillGroupVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const skillVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.section
      id="skills"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          variants={skillGroupVariants}
          className="section-title mb-16"
        >
          My Skills
        </motion.h2>

        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-12"
        >
          {skillsData.map((group, idx) => (
            <motion.div key={idx} variants={skillGroupVariants}>
              <h3 className="text-2xl font-semibold text-slate-100 mb-8">
                {group.category}
              </h3>

              <motion.div
                variants={containerVariants}
                className="space-y-6"
              >
                {group.skills.map((skill, skillIdx) => (
                  <motion.div
                    key={skillIdx}
                    variants={skillVariants}
                    className="p-4 rounded-lg border border-slate-800 hover:border-primary-500 transition-all duration-300 bg-slate-900/50"
                  >
                    <div className="mb-3">
                      <h4 className="text-lg font-semibold text-slate-100">
                        {skill.name}
                      </h4>
                    </div>

                    {/* Frameworks/Packages */}
                    {skill.frameworks && skill.frameworks.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skill.frameworks.map((framework, fIdx) => (
                          <span
                            key={fIdx}
                            className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700 hover:border-primary-400 transition"
                          >
                            {framework}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Skills

import { motion } from 'motion/react';
import { Code2, Palette, Database, Smartphone, Globe, Zap } from 'lucide-react';

export function Skills() {
  const skillsData = [
    {
      category: 'Frontend Development',
      icon: Palette,
      color: 'from-cyan-400 to-blue-600',
      skills: [
        { name: 'Vue.js', level: 98 },
        { name: 'ReactJS', level: 95 },
        { name: 'Next.js', level: 88 },
        { name: 'TailwindCSS', level: 92 },
        { name: 'HTML5 & CSS3', level: 95 },
      ]
    },
    {
      category: 'Backend Development',
      icon: Database,
      color: 'from-purple-400 to-pink-600',
      skills: [
        { name: 'Python (Flask)', level: 85 },
        { name: 'PHP (Laravel)', level: 90 },
        { name: 'NestJS', level: 89 },
      ]
    },
    {
      category: 'Mobile Development',
      icon: Smartphone,
      color: 'from-green-400 to-emerald-600',
      skills: [
        { name: 'React Native', level: 93 },
      ]
    },
    {
      category: 'System Programming',
      icon: Zap,
      color: 'from-orange-400 to-red-600',
      skills: [
        { name: 'Rust', level: 60 },
      ]
    },
  ];

  return (
    <section id="skills" className="min-h-screen py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl neon-blue mb-4">Compétences</h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Une maîtrise complète des technologies modernes pour créer des solutions innovantes et performantes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {skillsData.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="glass rounded-2xl p-8 holographic hover:scale-105 transition-transform duration-500"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${category.color} glow-blue`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl text-cyan-400">{category.category}</h3>
              </div>

              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-purple-400">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: categoryIndex * 0.1 + skillIndex * 0.1,
                          ease: 'easeOut',
                        }}
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full relative`}
                      >
                        <motion.div
                          animate={{
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute inset-0 bg-white/20"
                        />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 holographic"
        >
          <h3 className="text-3xl text-center mb-12 text-purple-400">Expertise Globale</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { name: 'Frontend', value: 92, color: 'cyan' },
              { name: 'Backend', value: 85, color: 'purple' },
              { name: 'Mobile', value: 87, color: 'green' },
              { name: 'Design', value: 80, color: 'pink' },
              { name: 'DevOps', value: 75, color: 'orange' },
              { name: 'Architecture', value: 83, color: 'blue' },
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-28 h-28 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke={`var(--neon-${item.color === 'cyan' ? 'blue' : item.color === 'purple' ? 'purple' : 'blue'})`}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 301.593' }}
                      whileInView={{
                        strokeDasharray: `${(item.value / 100) * 301.593} 301.593`,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.5,
                        delay: index * 0.1,
                        ease: 'easeOut',
                      }}
                      className="drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl text-white">{item.value}%</span>
                  </div>
                </div>
                <span className="text-gray-400 text-center">{item.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

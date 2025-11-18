import { motion } from 'motion/react';
import { Code2, Database, Layout, Smartphone, Server, Cpu } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  const techStack = [
    { name: 'Python (Flask)', icon: '🐍', color: 'from-yellow-500 to-blue-500' },
    { name: 'PHP (Laravel)', icon: '🐘', color: 'from-red-500 to-orange-500' },
    { name: 'Vue.js', icon: '💚', color: 'from-green-400 to-emerald-600' },
    { name: 'NestJS', icon: '🔺', color: 'from-red-600 to-pink-500' },
    { name: 'ReactJS', icon: '⚛️', color: 'from-cyan-400 to-blue-500' },
    { name: 'React Native', icon: '📱', color: 'from-blue-400 to-purple-500' },
    { name: 'Next.js', icon: '▲', color: 'from-gray-800 to-gray-600' },
    { name: 'TailwindCSS', icon: '💨', color: 'from-cyan-300 to-blue-400' },
    { name: 'HTML5 & CSS3', icon: '🎨', color: 'from-orange-500 to-red-500' },
    { name: 'Rust', icon: '🦀', color: 'from-orange-600 to-red-700' },
  ];

  const categories = [
    { 
      title: 'Frontend', 
      icon: Layout, 
      skills: ['Vue.js', 'ReactJS', 'Next.js', 'TailwindCSS', 'HTML5 & CSS3']
    },
    { 
      title: 'Backend', 
      icon: Server, 
      skills: ['Python (Flask)', 'PHP (Laravel)', 'NestJS']
    },
    { 
      title: 'Mobile', 
      icon: Smartphone, 
      skills: ['React Native']
    },
    { 
      title: 'Systèmes', 
      icon: Cpu, 
      skills: ['Rust']
    },
  ];

  return (
    <section id="about" className="min-h-screen py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl neon-purple mb-4">À Propos de Moi</h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-3xl blur-2xl"></div> */}
            <div className="relative glass rounded-3xl p-4 glow-purple">
              <div className="aspect-square rounded-2xl overflow-hidden holographic">
                <ImageWithFallback
                  src="/src/assets/1763398165966.png"
                  alt="ADINGRA Koffi"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Biography */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-8 holographic">
              <h3 className="text-2xl md:text-3xl text-cyan-400 mb-4">
                ADINGRA Koffi Jean Emmanuel Martial
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Je suis un développeur full-stack passionné, spécialisé dans la création d'applications modernes, performantes et scalables. Mon expertise couvre l'ensemble de la stack technologique, du frontend au backend, en passant par le développement mobile et les systèmes bas niveau.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="glass px-4 py-2 rounded-full text-sm text-cyan-400 border border-cyan-500/30">
                  Innovation
                </span>
                <span className="glass px-4 py-2 rounded-full text-sm text-purple-400 border border-purple-500/30">
                  Créativité
                </span>
                <span className="glass px-4 py-2 rounded-full text-sm text-pink-400 border border-pink-500/30">
                  Excellence Technique
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Grid with 3D Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl text-center mb-12 text-cyan-400">Stack Technologique</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, rotateY: 10 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-6 text-center holographic group cursor-pointer"
              >
                <div className={`text-4xl md:text-5xl mb-3 group-hover:scale-125 transition-transform`}>
                  {tech.icon}
                </div>
                <div className={`text-sm bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                  {tech.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills by Category */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 holographic glow-blue hover:glow-purple transition-all duration-500"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl text-cyan-400">{category.title}</h4>
              </div>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="text-gray-300 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

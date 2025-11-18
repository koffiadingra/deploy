import { motion } from "motion/react";
import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-20"></div>

      {/* Floating Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Profile Image with 3D Effect */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="relative"
          >
            {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div> */}
            <div className="relative glass rounded-full p-2 glow-blue">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-cyan-400/30 holographic">
                <ImageWithFallback
                  src="/src/assets/1763398165966.png"
                  alt="ADINGRA Koffi Jean Emmanuel Martial"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Orbiting Icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 text-cyan-400" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl neon-blue">
              Bienvenue sur mon Portfolio
            </h1>
            <div className="text-2xl md:text-4xl text-purple-400 neon-purple">
              Développeur Full-Stack
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-cyan-300 max-w-2xl"
          >
            Innovation technologique et créativité digitale
          </motion.p>

          {/* Introduction Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-2xl p-6 md:p-8 max-w-4xl holographic"
          >
            <p className="text-gray-300 leading-relaxed">
              Dans le domaine de l'innovation technologique et de la créativité,
              un portfolio est le reflet digital de mes compétences, expériences
              et visions. Cette interface met en avant mon évolution en tant que
              développeur, où code, design et individualité se rencontrent.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-blue"
            >
              <a href="#about">À propos de moi</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-purple-500/50 hover:bg-purple-500/10 glow-purple"
            >
              <a href="#projects">Mes projets</a>
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-cyan-400" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

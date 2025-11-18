import { motion } from 'motion/react';
import { Heart, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 border-t border-white/10">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <span className="text-white">AK</span>
              </div>
              <span className="neon-blue">ADINGRA Koffi</span>
            </div>
            <p className="text-gray-400 text-sm">
              Développeur Full-Stack passionné par l'innovation et la création d'expériences digitales exceptionnelles.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-cyan-400 mb-4">Navigation Rapide</h3>
            <ul className="space-y-2">
              {['Home', 'À propos', 'Compétences', 'Projets', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(' ', '')}`}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-purple-400 mb-4">Informations Légales</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Mentions Légales
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Politique de Confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Conditions d'Utilisation
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 text-sm flex items-center"
          >
            © {new Date().getFullYear()} ADINGRA Koffi Jean Emmanuel Martial. 
            Créé avec <Heart className="w-4 h-4 mx-1 text-red-500 fill-red-500" /> et React
          </motion.p>

          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="glass rounded-full p-3 hover:bg-cyan-500/10 transition-colors glow-blue"
          >
            <ArrowUp className="w-5 h-5 text-cyan-400" />
          </motion.button>
        </div>

        {/* Accessibility Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-gray-500 mt-4"
        >
          Site optimisé pour l'accessibilité • ARIA compliant • Responsive Design
        </motion.p>
      </div>
    </footer>
  );
}

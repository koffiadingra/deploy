import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Projects() {
  const [currentPage, setCurrentPage] = useState(0);
  const projectsPerPage = 3;

  const projects = [
    {
      title: "Plateforme de Notation Films & Séries",
      description:
        "Application complète de critique et notation de films/séries, avec fiches détaillées, système de votes et interactions utilisateur.",
      image:
        "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      technologies: [
        "Next.js",
        "TailwindCSS",
        "Node.js",
        "API REST",
        "mongoDB",
      ],
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Plateforme d'Achat & Réservation de Tickets",
      description:
        "Backend complet pour une plateforme de concerts et événements : gestion des modules, endpoints, logique métier et APIs connectées au frontend Vue.js.",
      image:
        "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      technologies: ["NestJS", "TailwindCSS", "Vue.js", "mongoDB"],
      color: "from-yellow-500 to-amber-600",
    },
    {
      title: "Application de Gestion des Tâches (Type Trello)",
      description:
        "Développement backend dédié au système de commentaires, intégration avec WordPress et mise en place des interactions frontend en Vue.js.",
      image:
        "https://images.unsplash.com/photo-1587614382346-4ec70d6ab5b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      technologies: ["WordPress", "Vue.js", "TailwindCSS"],
      color: "from-blue-500 to-sky-600",
    },

    {
      title: "Plateforme de Centralisation de Commentaires",
      description:
        "Développement backend complet pour la gestion des utilisateurs, centralisation multi-plateforme des commentaires et création du frontend en Vue.js avec intégration Laravel.",
      image:
        "https://images.unsplash.com/photo-1581092334564-1e7d1f5f7f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      technologies: ["Laravel", "TailwindCSS", "Vue.js", "MySQL"],
      color: "from-red-500 to-rose-600",
    },

    {
      title: "FREEADS — Plateforme de Petites Annonces",
      description:
        "Site de publication d'annonces gratuites (Laravel) : inscription/validation par e-mail, CRUD annonces (photo, prix, localisation), recherche et filtres (catégorie, lieu, fourchette de prix), pages annonces et tableau de bord utilisateur.",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      technologies: ["Laravel", "Vue.js", "MySQL", "TailwindCSS"],
      color: "from-emerald-500 to-green-600",
    },
    {
      title: "Integration — Template HTML/CSS",
      description:
        "Intégration complète d'un template Desktop puis Mobile en HTML5/CSS3 conforme W3C, optimisation SEO (Lighthouse), importation des polices Avenir & Roboto, interface construite avec Grid Layout et visuels temporaires.",
      image:
        "https://images.unsplash.com/photo-1559027615-ce3d9af3e6ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      technologies: ["HTML5", "CSS3", "Responsive Design", "SEO"],
      color: "from-gray-600 to-slate-700",
    },
    {
      title: "Redditech — Mobile Browsing App for Reddit",
      description:
        "Application mobile de navigation Reddit (role : Software Architect / Mobile Developer). Intégration OAuth2 (Authorization Code), affichage du profil utilisateur, navigation des subreddits abonnés, recherche et affichage des subreddits, filtres de posts, gestion des listings/pagination et UI/UX polie selon les bonnes pratiques du framework choisi.",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      technologies: ["React Native ", "OAuth2", "Vuex"],
      color: "from-red-500 to-rose-600",
    },
    {
      title: "My Show Time — Booking Platform (NestJS & MongoDB)",
      description:
        "Développement backend complet d'une plateforme de réservation de concerts/festivals en NestJS et MongoDB : gestion utilisateurs, système de réservation avec QR code, favoris, filtres avancés et panneau d’administration pour gérer concerts, comptes et statistiques.",
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      technologies: [
        "NestJS",
        "Node.js",
        "MongoDB",
        "Mongoose",
        "JWT",
        "WebSockets",
      ],
      color: "from-purple-600 to-indigo-700",
    },
  ];

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = currentPage * projectsPerPage;
  const currentProjects = projects.slice(
    startIndex,
    startIndex + projectsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section
      id="projects"
      className="min-h-screen py-20 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl neon-purple mb-4">Mes Projets</h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Une sélection de projets démontrant mon expertise technique et ma
            créativité
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentProjects.map((project, index) => (
                <motion.div
                  key={`${currentPage}-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, rotateY: 5 }}
                  className="glass rounded-2xl overflow-hidden holographic group cursor-pointer"
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${project.color} rounded-xl opacity-80 blur-xl`}
                    ></div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl mb-3 text-cyan-400 group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        className={`flex-1 bg-gradient-to-r ${project.color} hover:opacity-80`}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-500/50 hover:bg-purple-500/10"
                      >
                        <Github className="w-4 h-4" />
                        <a href="https://github.com/EpitechCodingAcademyPromo2025"></a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-6">
          <Button
            onClick={prevPage}
            variant="outline"
            size="icon"
            className="glass border-cyan-500/50 hover:bg-cyan-500/10 glow-blue"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPage
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 w-8"
                    : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextPage}
            variant="outline"
            size="icon"
            className="glass border-purple-500/50 hover:bg-purple-500/10 glow-purple"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Project Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-gray-400"
        >
          Page {currentPage + 1} sur {totalPages} • {projects.length} projets au
          total
        </motion.div>
      </div>
    </section>
  );
}

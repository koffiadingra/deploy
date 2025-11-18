import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Github,
  Linkedin,
  Send,
  MapPin,
  Phone,
  Download,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "https://cvdesignr.com/p/691b374deade2";
    link.download = "cv adingra koffi jean emmanuel martial";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message envoyé avec succès! Je vous répondrai bientôt.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/koffiadingra/wecode",
      color: "from-gray-600 to-gray-800",
      hoverColor: "hover:text-gray-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/koffi-jean-emmanuel-martial-adingra-3b7622361/",
      color: "from-blue-600 to-blue-800",
      hoverColor: "hover:text-blue-400",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:koffi.adingra@epitech.eu",
      color: "from-cyan-600 to-cyan-800",
      hoverColor: "hover:text-cyan-400",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "koffi.adingra@epitech.eu",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+225 0778909537",
    },
    {
      icon: MapPin,
      label: "Localisation",
      value: "côte d'ivoire",
    },
  ];

  return (
    <section
      id="contact"
      className="min-h-screen py-20 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl neon-blue mb-4">Contactez-moi</h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Vous avez un projet en tête ? N'hésitez pas à me contacter pour en
            discuter
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 holographic"
          >
            <h3 className="text-2xl mb-6 text-cyan-400">
              Envoyez-moi un message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Nom complet
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="glass border-cyan-500/30 focus:border-cyan-500 bg-white/5"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="glass border-cyan-500/30 focus:border-cyan-500 bg-white/5"
                  placeholder="votre.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Sujet
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="glass border-cyan-500/30 focus:border-cyan-500 bg-white/5"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm mb-2 text-gray-300"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="glass border-cyan-500/30 focus:border-cyan-500 bg-white/5 resize-none"
                  placeholder="Décrivez votre projet ou votre demande..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 glow-blue"
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer le message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info & Social Links */}
          <div className="space-y-8">
            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 holographic flex items-center space-x-4 hover:scale-105 transition-transform"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 glow-blue">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">{info.label}</div>
                    <div className="text-cyan-400">{info.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 holographic"
            >
              <h3 className="text-xl mb-6 text-purple-400">Réseaux Sociaux</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, rotateZ: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 glass rounded-xl p-6 flex flex-col items-center justify-center space-y-3 ${social.hoverColor} transition-colors group`}
                  >
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-br ${social.color} group-hover:scale-110 transition-transform`}
                    >
                      <social.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-sm text-gray-400">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Download CV */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 glow-purple h-14"
                onClick={() => toast.info('Le téléchargement du CV commencera bientôt')}
              >
                <Download className="w-5 h-5 mr-2" />
                Télécharger mon CV
                <a href="https://cvdesignr.com/p/691b374deade2"></a>
              </Button> */}
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 glow-purple h-14"
                onClick={() => {
                  handleDownload();
                  toast.info("Le téléchargement du CV commencera bientôt");
                }}
              >
                <Download className="w-5 h-5 mr-2" />
                Télécharger mon CV
              </Button>
            </motion.div>

            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 text-center holographic"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">
                  Disponible pour de nouveaux projets
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Temps de réponse moyen : 24-48h
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

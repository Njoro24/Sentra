import React from "react"
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
} from "lucide-react"
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer"

export default function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Pricing", href: "#pricing" },
        { label: "Security", href: "#" },
        { label: "API Docs", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Support", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Status", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Compliance", href: "#" },
      ],
    },
  ]

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-blue-400" />,
      text: "support@sentra.io",
      href: "mailto:support@sentra.io",
    },
    {
      icon: <Phone size={18} className="text-blue-400" />,
      text: "+254 798 779 172",
      href: "tel:+254798779172",
    },
    {
      icon: <MapPin size={18} className="text-blue-400" />,
      text: "Nairobi, Kenya",
    },
  ]

  const socialLinks = [
    { icon: <Facebook size={20} />, label: "Facebook", href: "#" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
    { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "#" },
    { icon: <Globe size={20} />, label: "Website", href: "#" },
  ]

  return (
    <footer className="bg-[#0F0F11]/10 relative h-fit overflow-hidden w-full">
      <div className="max-w-full mx-auto p-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-12 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Sentra" className="w-10 h-10" />
              <span className="text-white text-3xl font-bold" style={{ fontFamily: 'Syne' }}>Sentra</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Intelligent fraud detection platform protecting financial institutions in real-time.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-lg font-semibold mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-white/70 hover:text-blue-400 transition-colors text-sm"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-white/70 text-sm">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-white/10 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          {/* Social icons */}
          <div className="flex space-x-6 text-white/60">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-blue-400 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left text-white/60">
            &copy; {new Date().getFullYear()} Sentra. All rights reserved.
          </p>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="lg:flex hidden h-[20rem] -mt-40 -mb-20 justify-center items-center">
        <TextHoverEffect text="Sentra" className="z-50 scale-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  )
}

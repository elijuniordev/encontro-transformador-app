// src/components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    // O footer agora usará o gradiente definido no tema
    <footer className="w-full bg-gradient-divine text-primary-foreground py-8 px-4 border-t border-border shadow-peaceful">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm">
          Direitos reservados a Igreja Videira Osasco. Desenvolvido por{" "}
          <a
            href="https://digitaldominus.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            // O link usará uma cor secundária clara e brilhará ao passar o mouse
            className="underline text-secondary hover:text-primary-glow transition-colors"
          >
            Dominus Digital
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
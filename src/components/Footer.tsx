// src/components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    // 'w-full' garante largura total, 'px-4' para padding interno
    <footer className="w-full bg-primary text-primary-foreground py-4 px-4">
      {/* 'max-w-6xl mx-auto text-center' centraliza o conteúdo dentro do footer de largura total */}
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm">
          Direitos reservados a Igreja Videira Osasco. Desenvolvido por{" "}
          <a
            href="https://digitaldominus.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Dominus Digital
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
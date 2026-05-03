import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, EyeOff, Lock, ChevronDown, ChevronLeft, ChevronRight, X, Edit2, Trash2 } from 'lucide-react';

// ============================================
// CSS GLOBAL
// ============================================
const GLOBAL_CSS = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes modalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .sa-page * { box-sizing: border-box; }

  /* DETALHES - Layout responsivo */
  .sa-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    padding: 2rem;
    align-items: start;
  }
  @media (max-width: 900px) {
    .sa-detail-grid {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
      padding: 1.5rem !important;
    }
  }

  .sa-detail-title {
    font-size: 30px;
    font-weight: 700;
    margin: 0 0 1.5rem;
    color: #000;
    line-height: 1.25;
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    text-align: left;
  }
  @media (max-width: 768px) {
    .sa-detail-title { font-size: 22px !important; }
  }

  /* GALERIA - Foto principal (CONTAIN para não cortar) */
  .sa-gallery-main {
    position: relative;
    width: 100%;
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 12px;
    background: #1a1a1a;
  }
  @media (max-width: 768px) {
    .sa-gallery-main { height: 360px !important; }
  }

  .sa-gallery-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    cursor: pointer;
    display: block;
  }

  /* THUMBNAILS */
  .sa-thumb {
    width: 100%;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    background: #f5f5f5;
    transition: all 0.2s;
  }
  @media (max-width: 768px) {
    .sa-thumb { height: 60px !important; }
  }

  .sa-text-left { text-align: left !important; }

  /* CARDS GRID */
  .sa-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }
  @media (max-width: 480px) {
    .sa-cards-grid { grid-template-columns: 1fr !important; }
  }

  /* CARD INFO TAGS - Centralizadas */
  .sa-card-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 0.75rem;
  }
  .sa-card-tag {
    font-size: 11px;
    background: #f5f5f5;
    color: #333;
    padding: 5px 12px;
    border-radius: 4px;
    font-weight: 500;
    white-space: nowrap;
  }

  /* MODAL */
  .sa-modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: modalFadeIn 0.2s ease-out;
  }
  .sa-modal {
    background: white;
    border-radius: 16px;
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalSlideUp 0.3s ease-out;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
`;

// ============================================
// HELPERS DE TEXTO
// ============================================
function generoTexto(genero) {
  if (genero === 'menina') return 'Menina';
  if (genero === 'menino') return 'Menino';
  return 'Menina - Menino';
}

function categoriaTexto(categoria) {
  const traducao = {
    newborn: 'Newborn',
    acompanhamento: 'Acompanhamento',
    temático: 'Temático',
    clean: 'Clean',
    gemeos: 'Gêmeos',
    smash: 'Smash The Cake',
    gestante: 'Gestante'
  };
  return traducao[categoria] || (categoria ? categoria.charAt(0).toUpperCase() + categoria.slice(1) : 'Sem categoria');
}

// ============================================
// ÍCONES SVG
// ============================================

const LogoIcon = ({ src }) => {
  if (src) {
    return <img src={src} alt="Samara Assi" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />;
  }
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M8 24c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );
};

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="18" cy="8" r="1.5" fill="currentColor"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="2"/>
    <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// ============================================
// DADOS INICIAIS (SIMPLIFICADOS - sem temas e tipo)
// ============================================

const DADOS_CENARIOS_INICIAIS = [
  {
    id: 1,
    titulo: "Newborn - Primeiras Semanas",
    categoria: "newborn",
    ageMonthMin: 0,
    ageMonthMax: 1,
    genero: "all",
    descricaoBreve: "Cenário minimalista especial para recém-nascidos com foco em conforto",
    descricaoDetalhada: "Ambiente controlado e aconchegante para os primeiros momentos do bebê. Com iluminação natural suave, tons neutros (brancos, bege, cinza) e texturas macias como cobertores e almofadinhas.",
    imagemUrl: "https://images.unsplash.com/photo-1555069519-27cea69b0b78?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1555069519-27cea69b0b78?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591147834402-1b6dcce6f1f5?w=800&h=600&fit=crop"
    ],
    destaques: true
  },
  {
    id: 2,
    titulo: "Newborn - 7 Dias",
    categoria: "newborn",
    ageMonthMin: 0,
    ageMonthMax: 1,
    genero: "menina",
    descricaoBreve: "Ensaio especial para bebê recém-nascido com flores e elementos delicados",
    descricaoDetalhada: "Sessão fotográfica com bebê com até 7 dias de nascimento. Inclui poses em cocoon, poses em adornos florais e com acessórios delicados.",
    imagemUrl: "https://images.unsplash.com/photo-1523438097911-512bf86e4908?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1523438097911-512bf86e4908?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop"
    ],
    destaques: true
  },
  {
    id: 3,
    titulo: "Newborn Masculino - Estúdio",
    categoria: "newborn",
    ageMonthMin: 0,
    ageMonthMax: 1,
    genero: "menino",
    descricaoBreve: "Cenário limpo e minimalista para newborn meninos",
    descricaoDetalhada: "Espaço com elementos mais neutros e estruturados. Tons de cinza, branco e marrom. Segurança e conforto em primeiro lugar.",
    imagemUrl: "https://images.unsplash.com/photo-1516627145497-ae6ab60908c9?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1516627145497-ae6ab60908c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&h=600&fit=crop"
    ],
    destaques: false
  },
  {
    id: 4,
    titulo: "Acompanhamento - 1 Mês",
    categoria: "acompanhamento",
    ageMonthMin: 0,
    ageMonthMax: 2,
    genero: "all",
    descricaoBreve: "Primeiro mês: capturando o desenvolvimento inicial do bebê",
    descricaoDetalhada: "Primeira sessão do acompanhamento mensal. Bebê com aproximadamente 30 dias.",
    imagemUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&h=600&fit=crop"
    ],
    destaques: false
  },
  {
    id: 5,
    titulo: "Acompanhamento - 3 Meses",
    categoria: "acompanhamento",
    ageMonthMin: 2,
    ageMonthMax: 4,
    genero: "all",
    descricaoBreve: "Aos 3 meses: primeiros sorrisos genuínos e maior interação",
    descricaoDetalhada: "Nesta idade, o bebê já consegue seguir rostos com o olhar e começa a sorrir genuinamente.",
    imagemUrl: "https://images.unsplash.com/photo-1503454537688-e9c6afada334?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1503454537688-e9c6afada334?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&h=600&fit=crop"
    ],
    destaques: false
  },
  {
    id: 6,
    titulo: "Acompanhamento - 6 Meses",
    categoria: "acompanhamento",
    ageMonthMin: 5,
    ageMonthMax: 7,
    genero: "all",
    descricaoBreve: "Meio do ano: bebê sentando com suporte, mais expressivo",
    descricaoDetalhada: "Aos 6 meses o bebê consegue ficar sentado com suporte e mostra muito mais personalidade.",
    imagemUrl: "https://images.unsplash.com/photo-1503235930437-8c6cea9583a0?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1503235930437-8c6cea9583a0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530268729831-4be0452b33ee?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1525458379671-3d4a6260eaa3?w=800&h=600&fit=crop"
    ],
    destaques: true
  },
  {
    id: 7,
    titulo: "Acompanhamento - 9 Meses",
    categoria: "acompanhamento",
    ageMonthMin: 8,
    ageMonthMax: 10,
    genero: "all",
    descricaoBreve: "Aos 9 meses: engatinhando e explorando o mundo",
    descricaoDetalhada: "Bebê muito mais ativo, começando a engatinhar e explorar.",
    imagemUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503235930437-8c6cea9583a0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1525458379671-3d4a6260eaa3?w=800&h=600&fit=crop"
    ],
    destaques: false
  },
  {
    id: 8,
    titulo: "Acompanhamento - 12 Meses (1 Ano)",
    categoria: "acompanhamento",
    ageMonthMin: 10,
    ageMonthMax: 14,
    genero: "all",
    descricaoBreve: "Aniversário de 1 ano: grande transformação do bebê",
    descricaoDetalhada: "Marca o final do primeiro ano de vida. Bebê muito mais independente, talvez já caminhando ou prestes a caminhar.",
    imagemUrl: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558363198-88a8e106c3ed?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1525458379671-3d4a6260eaa3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503235930437-8c6cea9583a0?w=800&h=600&fit=crop"
    ],
    destaques: true
  },
  {
    id: 9,
    titulo: "Tema Floresta Mágica",
    categoria: "temático",
    ageMonthMin: 6,
    ageMonthMax: 36,
    genero: "menina",
    descricaoBreve: "Natureza encantada com flores, plantas e elementos florais",
    descricaoDetalhada: "Cenário que remete a uma floresta mágica com plantas verdes, flores naturais e tecidos fluidos.",
    imagemUrl: "https://images.unsplash.com/photo-1530268729831-4be0452b33ee?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1530268729831-4be0452b33ee?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503235930437-8c6cea9583a0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1499209974431-9a029af47614?w=800&h=600&fit=crop"
    ],
    destaques: true
  },
  {
    id: 10,
    titulo: "Tema Astronauta - Espaço",
    categoria: "temático",
    ageMonthMin: 6,
    ageMonthMax: 48,
    genero: "menino",
    descricaoBreve: "Exploração espacial com naves, planetas e elementos futuristas",
    descricaoDetalhada: "Ambiente temático com elementos de ficção científica. Cores: azul marinho, prata, dourado.",
    imagemUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop"
    ],
    destaques: true
  },
  {
    id: 11,
    titulo: "Tema Piquenique Campestre",
    categoria: "temático",
    ageMonthMin: 4,
    ageMonthMax: 36,
    genero: "all",
    descricaoBreve: "Cenário rural com toalha de piquenique, frutas e elementos de picnic",
    descricaoDetalhada: "Ambiente ao ar livre ou estúdio com tema de piquenique. Inclui toalha quadriculada, frutas frescas, cesta de vime.",
    imagemUrl: "https://images.unsplash.com/photo-1499209974431-9a029af47614?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1499209974431-9a029af47614?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530268729831-4be0452b33ee?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503235930437-8c6cea9583a0?w=800&h=600&fit=crop"
    ],
    destaques: false
  },
  {
    id: 12,
    titulo: "Tema Festa Tropical",
    categoria: "temático",
    ageMonthMin: 6,
    ageMonthMax: 36,
    genero: "all",
    descricaoBreve: "Cores vibrantes, flores tropicais, banana leaves e elementos alegres",
    descricaoDetalhada: "Cenário colorido e alegre com folhas de bananeira e flores tropicais em cores vibrantes.",
    imagemUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530268729831-4be0452b33ee?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1499209974431-9a029af47614?w=800&h=600&fit=crop"
    ],
    destaques: true
  },
  {
    id: 13,
    titulo: "Tema Mundo Ártico",
    categoria: "temático",
    ageMonthMin: 6,
    ageMonthMax: 48,
    genero: "menina",
    descricaoBreve: "Inverno congelado com nevinha artificial, tons azuis e prateados",
    descricaoDetalhada: "Cenário invernal elegante com tons azuis, brancos e prateados.",
    imagemUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1483794344563-d27a8d18014e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop"
    ],
    destaques: false
  },
  {
    id: 14,
    titulo: "Tema Circo",
    categoria: "temático",
    ageMonthMin: 12,
    ageMonthMax: 48,
    genero: "all",
    descricaoBreve: "Alegria e diversão com cores primárias, balões e elementos circenses",
    descricaoDetalhada: "Ambiente festivo com listras, balões coloridos, banners.",
    imagemUrl: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558363198-88a8e106c3ed?w=800&h=600&fit=crop"
    ],
    destaques: false
  },
  {
    id: 15,
    titulo: "Clean Minimalista Branco",
    categoria: "clean",
    ageMonthMin: 0,
    ageMonthMax: 60,
    genero: "all",
    descricaoBreve: "Fundo branco puro para fotos neutras e elegantes",
    descricaoDetalhada: "Cenário totalmente minimalista com fundo branco, sem distrações.",
    imagemUrl: "https://images.unsplash.com/photo-1513154754953-1bb8f8ceef08?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1513154754953-1bb8f8ceef08?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555069519-27cea69b0b78?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522529163902-abf92ad63995?w=800&h=600&fit=crop"
    ],
    destaques: true
  },
  {
    id: 16,
    titulo: "Clean Cinza Claro",
    categoria: "clean",
    ageMonthMin: 0,
    ageMonthMax: 60,
    genero: "all",
    descricaoBreve: "Fundo cinza suave para contraste delicado",
    descricaoDetalhada: "Ambiente minimalista com fundo em tom cinza claro.",
    imagemUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513154754953-1bb8f8ceef08?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522529163902-abf92ad63995?w=800&h=600&fit=crop"
    ],
    destaques: false
  },
  {
    id: 17,
    titulo: "Clean com Textura",
    categoria: "clean",
    ageMonthMin: 0,
    ageMonthMax: 60,
    genero: "all",
    descricaoBreve: "Fundo neutro com pequena textura sutil",
    descricaoDetalhada: "Cenário clean com leve textura.",
    imagemUrl: "https://images.unsplash.com/photo-1522529163902-abf92ad63995?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1522529163902-abf92ad63995?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513154754953-1bb8f8ceef08?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"
    ],
    destaques: false
  },
  {
    id: 18,
    titulo: "Gêmeos Especial",
    categoria: "gemeos",
    ageMonthMin: 0,
    ageMonthMax: 36,
    genero: "all",
    descricaoBreve: "Cenário pensado especialmente para capturar a conexão entre gêmeos",
    descricaoDetalhada: "Ambiente minimalista com focos para acentuar a interação entre os gêmeos.",
    imagemUrl: "https://images.unsplash.com/photo-1503252947848-6b6bbadb78df?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1503252947848-6b6bbadb78df?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591147834402-1b6dcce6f1f5?w=800&h=600&fit=crop"
    ],
    destaques: false
  },
  {
    id: 19,
    titulo: "Smash The Cake - 1 Aninho",
    categoria: "smash",
    ageMonthMin: 10,
    ageMonthMax: 14,
    genero: "all",
    descricaoBreve: "Celebração do primeiro aniversário com bolo para o bebê explorar",
    descricaoDetalhada: "Sessão especial para marcar 1 ano de vida.",
    imagemUrl: "https://images.unsplash.com/photo-1558363198-88a8e106c3ed?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1558363198-88a8e106c3ed?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop"
    ],
    destaques: true
  },
  {
    id: 20,
    titulo: "Gestante - Barriguinha",
    categoria: "gestante",
    ageMonthMin: -9,
    ageMonthMax: -1,
    genero: "all",
    descricaoBreve: "Celebração da gravidez, focando a beleza da gestante",
    descricaoDetalhada: "Ensaio sensível e elegante durante a gestação.",
    imagemUrl: "https://images.unsplash.com/photo-1594008166651-ba5db8917f1d?w=800&h=600&fit=crop",
    imagens: [
      "https://images.unsplash.com/photo-1594008166651-ba5db8917f1d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&h=600&fit=crop"
    ],
    destaques: false
  }
];

// ============================================
// COMPONENTE: GALERIA DE FOTOS (object-fit: contain)
// ============================================

function GaleriaFotos({ imagens, titulo }) {
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fotos = imagens && imagens.length > 0 ? imagens : ['https://via.placeholder.com/800x600/f0f0f0/666?text=Sem+Imagem'];

  const proximaImagem = () => setImagemAtiva((prev) => (prev + 1) % fotos.length);
  const imagemAnterior = () => setImagemAtiva((prev) => (prev - 1 + fotos.length) % fotos.length);

  // Reset imagem ativa quando muda o cenário
  useEffect(() => {
    setImagemAtiva(0);
  }, [imagens]);

  return (
    <>
      <div style={{ width: '100%' }}>
        <div className="sa-gallery-main">
          <img
            src={fotos[imagemAtiva]}
            alt={`${titulo} - foto ${imagemAtiva + 1}`}
            onClick={() => setLightboxOpen(true)}
            className="sa-gallery-img"
          />

          {fotos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); imagemAnterior(); }}
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)', border: 'none', width: '36px', height: '36px',
                  borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); proximaImagem(); }}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)', border: 'none', width: '36px', height: '36px',
                  borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <div style={{
            position: 'absolute', bottom: '12px', right: '12px',
            background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px',
            borderRadius: '12px', fontSize: '12px', fontWeight: '600'
          }}>
            {imagemAtiva + 1} / {fotos.length}
          </div>
        </div>

        {fotos.length > 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(fotos.length, 5)}, 1fr)`,
            gap: '8px'
          }}>
            {fotos.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setImagemAtiva(idx)}
                className="sa-thumb"
                style={{
                  border: imagemAtiva === idx ? '3px solid #000' : '2px solid transparent',
                  opacity: imagemAtiva === idx ? 1 : 0.7
                }}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
              width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>

          <img
            src={fotos[imagemAtiva]}
            alt={titulo}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', cursor: 'default' }}
          />

          {fotos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); imagemAnterior(); }}
                style={{
                  position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                  width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); proximaImagem(); }}
                style={{
                  position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                  width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

// ============================================
// COMPONENTE: MODAL DE EDIÇÃO (sem temas e tipo)
// ============================================

function ModalEdicao({ scenario, onSave, onClose }) {
  const [editData, setEditData] = useState({
    titulo: scenario.titulo || '',
    categoria: scenario.categoria || 'temático',
    ageMonthMin: scenario.ageMonthMin ?? 0,
    ageMonthMax: scenario.ageMonthMax ?? 12,
    genero: scenario.genero || 'all',
    descricaoBreve: scenario.descricaoBreve || '',
    descricaoDetalhada: scenario.descricaoDetalhada || '',
    imagens: scenario.imagens || [scenario.imagemUrl],
    destaques: scenario.destaques || false
  });

  const handleSave = () => {
    if (!editData.titulo.trim()) {
      alert('O título é obrigatório!');
      return;
    }
    if (editData.imagens.length === 0 || !editData.imagens[0]) {
      alert('Adicione pelo menos uma imagem!');
      return;
    }

    const updated = {
      ...scenario,
      ...editData,
      imagemUrl: editData.imagens[0],
      imagens: editData.imagens
    };
    onSave(updated);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d5d5d5',
    borderRadius: '8px',
    fontSize: '14px',
    background: '#f5f5f5',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    marginBottom: '6px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div className="sa-modal-overlay" onClick={onClose}>
      <div className="sa-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 1,
          borderRadius: '16px 16px 0 0'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#000' }}>
            ✏️ Editar Cenário
          </h2>
          <button
            onClick={onClose}
            style={{
              background: '#f5f5f5',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <img
              src={editData.imagens[0] || 'https://via.placeholder.com/200x150/f0f0f0/666?text=Sem+Imagem'}
              alt="Preview"
              style={{
                width: '100%',
                maxWidth: '300px',
                height: '180px',
                objectFit: 'contain',
                background: '#1a1a1a',
                borderRadius: '12px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Título *</label>
            <input
              type="text"
              value={editData.titulo}
              onChange={e => setEditData({ ...editData, titulo: e.target.value })}
              placeholder="Ex: Newborn - 7 Dias"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>URLs das Imagens (uma por linha)</label>
            <textarea
              value={editData.imagens.join('\n')}
              onChange={e => {
                const urls = e.target.value.split('\n').filter(url => url.trim());
                setEditData({ ...editData, imagens: urls });
              }}
              rows="4"
              placeholder="https://...foto1.jpg&#10;https://...foto2.jpg"
              style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px', resize: 'vertical' }}
            />
            <p style={{ fontSize: '11px', color: '#666', margin: '6px 0 0' }}>
              📷 {editData.imagens.length} foto(s) | A primeira é a capa
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Categoria</label>
              <select
                value={editData.categoria}
                onChange={e => setEditData({ ...editData, categoria: e.target.value })}
                style={inputStyle}
              >
                <option value="newborn">Newborn</option>
                <option value="acompanhamento">Acompanhamento</option>
                <option value="temático">Temático</option>
                <option value="clean">Clean</option>
                <option value="gemeos">Gêmeos</option>
                <option value="smash">Smash The Cake</option>
                <option value="gestante">Gestante</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sexo</label>
              <select
                value={editData.genero}
                onChange={e => setEditData({ ...editData, genero: e.target.value })}
                style={inputStyle}
              >
                <option value="all">Menina - Menino</option>
                <option value="menina">Menina</option>
                <option value="menino">Menino</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Idade Mín (meses)</label>
              <input
                type="number"
                value={editData.ageMonthMin}
                onChange={e => setEditData({ ...editData, ageMonthMin: parseInt(e.target.value) || 0 })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Idade Máx (meses)</label>
              <input
                type="number"
                value={editData.ageMonthMax}
                onChange={e => setEditData({ ...editData, ageMonthMax: parseInt(e.target.value) || 0 })}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
              <input
                type="checkbox"
                checked={editData.destaques}
                onChange={e => setEditData({ ...editData, destaques: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                ⭐ Marcar como destaque
              </span>
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Descrição Curta</label>
            <textarea
              value={editData.descricaoBreve}
              onChange={e => setEditData({ ...editData, descricaoBreve: e.target.value })}
              rows="2"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Descrição Detalhada</label>
            <textarea
              value={editData.descricaoDetalhada}
              onChange={e => setEditData({ ...editData, descricaoDetalhada: e.target.value })}
              rows="4"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          borderTop: '1px solid #f0f0f0',
          position: 'sticky',
          bottom: 0,
          background: 'white',
          borderRadius: '0 0 16px 16px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '12px',
              background: 'white',
              color: '#000',
              border: '1px solid #d5d5d5',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 2,
              minWidth: '160px',
              padding: '12px',
              background: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            💾 Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function CenariosPlatform() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [savedNotification, setSavedNotification] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [editingScenario, setEditingScenario] = useState(null);

  const [filters, setFilters] = useState({
    ageMin: 0,
    ageMax: 60,
    categoria: 'all',
    gender: 'all',
    search: ''
  });

  const [newScenario, setNewScenario] = useState({
    titulo: '',
    categoria: 'temático',
    ageMonthMin: 0,
    ageMonthMax: 12,
    genero: 'all',
    descricaoBreve: '',
    descricaoDetalhada: '',
    imagemUrl: '',
    imagens: []
  });

  // Carregar Logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/logo_samarafotografia.jpg');
        if (response.ok) {
          setLogoUrl('/logo_samarafotografia.jpg');
        }
      } catch (e) {
        console.log('Logo não encontrado');
      }
    };
    loadLogo();
  }, []);

  // LocalStorage v4 (modelo simplificado)
  useEffect(() => {
    const dados = localStorage.getItem('cenarios_samara_assi_v4');
    
    if (dados) {
      try {
        const parsed = JSON.parse(dados);
        const normalized = parsed.map(s => ({
          ...s,
          imagens: s.imagens && s.imagens.length > 0 ? s.imagens : [s.imagemUrl]
        }));
        setScenarios(normalized);
      } catch (error) {
        setScenarios(DADOS_CENARIOS_INICIAIS);
      }
    } else {
      setScenarios(DADOS_CENARIOS_INICIAIS);
      localStorage.setItem('cenarios_samara_assi_v4', JSON.stringify(DADOS_CENARIOS_INICIAIS));
    }
  }, []);

  useEffect(() => {
    if (scenarios.length > 0) {
      localStorage.setItem('cenarios_samara_assi_v4', JSON.stringify(scenarios));
      setSavedNotification('💾 Salvo');
      setTimeout(() => setSavedNotification(''), 2000);
    }
  }, [scenarios]);

  const handleAdminLogin = () => {
    if (passwordInput === 'samara123') {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      alert('Senha incorreta');
    }
  };

  const handleAddScenario = () => {
    if (newScenario.titulo.trim()) {
      const imagensArray = newScenario.imagens.length > 0 
        ? newScenario.imagens 
        : [newScenario.imagemUrl];

      const scenario = {
        ...newScenario,
        id: Math.max(...scenarios.map(s => s.id), 0) + 1,
        imagemUrl: imagensArray[0],
        imagens: imagensArray,
        destaques: false
      };
      setScenarios([...scenarios, scenario]);
      setNewScenario({
        titulo: '',
        categoria: 'temático',
        ageMonthMin: 0,
        ageMonthMax: 12,
        genero: 'all',
        descricaoBreve: '',
        descricaoDetalhada: '',
        imagemUrl: '',
        imagens: []
      });
      alert('✅ Cenário adicionado!');
    }
  };

  const handleDeleteScenario = (id) => {
    if (window.confirm('Deletar este cenário?')) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  const handleEditScenario = (scenario) => {
    setEditingScenario(scenario);
  };

  const handleSaveEdit = (updatedScenario) => {
    setScenarios(scenarios.map(s => 
      s.id === updatedScenario.id ? updatedScenario : s
    ));
    setEditingScenario(null);
    alert('✅ Cenário atualizado!');
  };

  const handleCancelEdit = () => {
    setEditingScenario(null);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Resetar para os dados originais?')) {
      setScenarios(DADOS_CENARIOS_INICIAIS);
      localStorage.setItem('cenarios_samara_assi_v4', JSON.stringify(DADOS_CENARIOS_INICIAIS));
      alert('✅ Dados resetados!');
    }
  };

  const handleAgeChange = (type, value) => {
    const numValue = Math.max(0, Math.min(60, parseInt(value) || 0));
    if (type === 'min') {
      setFilters({ ...filters, ageMin: Math.min(numValue, filters.ageMax) });
    } else {
      setFilters({ ...filters, ageMax: Math.max(numValue, filters.ageMin) });
    }
  };

  const filteredScenarios = useMemo(() => {
    return scenarios
      .filter(s => {
        const ageMatch = s.ageMonthMin >= filters.ageMin && s.ageMonthMax <= filters.ageMax;
        const categoriaMatch = filters.categoria === 'all' || s.categoria === filters.categoria;
        const genderMatch = filters.gender === 'all' || s.genero === 'all' || s.genero === filters.gender;
        const searchMatch = s.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
                           (s.descricaoBreve || '').toLowerCase().includes(filters.search.toLowerCase());
        return ageMatch && categoriaMatch && genderMatch && searchMatch;
      })
      .sort((a, b) => a.titulo.localeCompare(b.titulo));
  }, [scenarios, filters]);

  // ============================================
  // TELA: LOGIN ADMIN
  // ============================================
  if (!isAuthenticated && window.location.hash === '#admin') {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className="sa-page" style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Lock size={48} style={{ color: '#000', marginBottom: '1rem' }} />
              <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 0.5rem', color: '#000' }}>Área Restrita</h1>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Apenas administradores</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '0.75rem', color: '#000', textTransform: 'uppercase' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAdminLogin()}
                  placeholder="Digite a senha"
                  style={{
                    width: '100%',
                    padding: '12px 50px 12px 14px',
                    border: '1px solid #d5d5d5',
                    borderRadius: '10px',
                    fontSize: '15px',
                    background: '#f5f5f5',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleAdminLogin}
              style={{
                width: '100%',
                padding: '12px',
                background: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              Entrar
            </button>

            <button
              onClick={() => window.location.hash = ''}
              style={{
                width: '100%',
                padding: '12px',
                background: 'white',
                color: '#000',
                border: '1px solid #d5d5d5',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // TELA: DETALHES (Faixa Etária | Categoria | Sexo)
  // ============================================
  if (selectedScenario) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className="sa-page" style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          <header style={{
            background: 'white',
            borderBottom: '1px solid #f0f0f0',
            padding: '1rem',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                <LogoIcon src={logoUrl} />
                <h1 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  margin: 0, 
                  color: '#000',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Samara Assi
                </h1>
              </div>
              <button
                onClick={() => setSelectedScenario(null)}
                style={{
                  padding: '8px 16px',
                  background: 'white',
                  border: '1px solid #d5d5d5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#000',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                ← Voltar
              </button>
            </div>
          </header>

          <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)' 
            }}>
              <div className="sa-detail-grid">
                <div>
                  <GaleriaFotos 
                    imagens={selectedScenario.imagens || [selectedScenario.imagemUrl]} 
                    titulo={selectedScenario.titulo} 
                  />
                </div>

                <div className="sa-text-left">
                  <h1 className="sa-detail-title">
                    {selectedScenario.titulo}
                  </h1>

                  <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div className="sa-text-left" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '1.25rem' }}>
                      <p className="sa-text-left" style={{ fontSize: '11px', fontWeight: '700', color: '#666', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Faixa Etária
                      </p>
                      <p className="sa-text-left" style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#000' }}>
                        {selectedScenario.ageMonthMin}-{selectedScenario.ageMonthMax} meses
                      </p>
                    </div>

                    <div className="sa-text-left" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '1.25rem' }}>
                      <p className="sa-text-left" style={{ fontSize: '11px', fontWeight: '700', color: '#666', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Categoria
                      </p>
                      <p className="sa-text-left" style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#000' }}>
                        {categoriaTexto(selectedScenario.categoria)}
                      </p>
                    </div>

                    <div className="sa-text-left">
                      <p className="sa-text-left" style={{ fontSize: '11px', fontWeight: '700', color: '#666', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Sexo
                      </p>
                      <p className="sa-text-left" style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#000' }}>
                        {generoTexto(selectedScenario.genero)}
                      </p>
                    </div>
                  </div>

                  <h2 className="sa-text-left" style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 0.75rem', color: '#000' }}>
                    Descrição
                  </h2>
                  <p className="sa-text-left" style={{ fontSize: '14px', lineHeight: '1.7', color: '#555', margin: '0 0 2rem' }}>
                    {selectedScenario.descricaoDetalhada}
                  </p>

                  <button
                    onClick={() => setSelectedScenario(null)}
                    style={{
                      padding: '12px 24px',
                      background: '#000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%',
                      maxWidth: '280px'
                    }}
                  >
                    ← Voltar ao Catálogo
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  // ============================================
  // TELA: ADMIN PANEL
  // ============================================
  if (isAuthenticated) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className="sa-page" style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
          padding: '1rem',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color: '#000' }}>Admin</h1>
                <p style={{ fontSize: '12px', color: '#666', margin: '0.5rem 0 0' }}>💾 Os dados são salvos automaticamente</p>
              </div>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  window.location.hash = '';
                }}
                style={{
                  padding: '10px 20px',
                  background: '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Sair
              </button>
            </div>

            {savedNotification && (
              <div style={{
                background: '#e8f5e9',
                border: '1px solid #4caf50',
                color: '#2e7d32',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                {savedNotification}
              </div>
            )}

            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 1.5rem', color: '#000' }}>➕ Novo Cenário</h2>

              <input
                type="text"
                value={newScenario.titulo}
                onChange={e => setNewScenario({ ...newScenario, titulo: e.target.value })}
                placeholder="Título"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d5d5d5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#f5f5f5',
                  boxSizing: 'border-box',
                  marginBottom: '1rem'
                }}
              />

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#000', textTransform: 'uppercase' }}>
                  URLs das Imagens (uma por linha) - 3 a 5 fotos recomendadas
                </label>
                <textarea
                  value={newScenario.imagens.join('\n')}
                  onChange={e => {
                    const urls = e.target.value.split('\n').filter(url => url.trim());
                    setNewScenario({ ...newScenario, imagens: urls, imagemUrl: urls[0] || '' });
                  }}
                  placeholder="https://...foto1.jpg&#10;https://...foto2.jpg&#10;https://...foto3.jpg"
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d5d5d5',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    background: '#f5f5f5',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
                <p style={{ fontSize: '11px', color: '#666', margin: '6px 0 0' }}>
                  ✨ A primeira imagem será usada como capa
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px', color: '#666' }}>Categoria</label>
                  <select value={newScenario.categoria} onChange={e => setNewScenario({ ...newScenario, categoria: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #d5d5d5', borderRadius: '8px', fontSize: '14px', background: '#f5f5f5', boxSizing: 'border-box' }}>
                    <option value="newborn">Newborn</option>
                    <option value="acompanhamento">Acompanhamento</option>
                    <option value="temático">Temático</option>
                    <option value="clean">Clean</option>
                    <option value="gemeos">Gêmeos</option>
                    <option value="smash">Smash The Cake</option>
                    <option value="gestante">Gestante</option>
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px', color: '#666' }}>Sexo</label>
                  <select value={newScenario.genero} onChange={e => setNewScenario({ ...newScenario, genero: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #d5d5d5', borderRadius: '8px', fontSize: '14px', background: '#f5f5f5', boxSizing: 'border-box' }}>
                    <option value="all">Menina - Menino</option>
                    <option value="menina">Menina</option>
                    <option value="menino">Menino</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px', color: '#666' }}>Idade Mín</label>
                  <input type="number" min="0" value={newScenario.ageMonthMin} onChange={e => setNewScenario({ ...newScenario, ageMonthMin: parseInt(e.target.value) || 0 })} style={{ width: '100%', padding: '10px', border: '1px solid #d5d5d5', borderRadius: '8px', fontSize: '14px', background: '#f5f5f5', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px', color: '#666' }}>Idade Máx</label>
                  <input type="number" min="0" value={newScenario.ageMonthMax} onChange={e => setNewScenario({ ...newScenario, ageMonthMax: parseInt(e.target.value) || 12 })} style={{ width: '100%', padding: '10px', border: '1px solid #d5d5d5', borderRadius: '8px', fontSize: '14px', background: '#f5f5f5', boxSizing: 'border-box' }} />
                </div>
              </div>

              <textarea
                value={newScenario.descricaoBreve}
                onChange={e => setNewScenario({ ...newScenario, descricaoBreve: e.target.value })}
                placeholder="Descrição curta"
                rows="2"
                style={{ width: '100%', padding: '12px', border: '1px solid #d5d5d5', borderRadius: '8px', fontSize: '14px', background: '#f5f5f5', boxSizing: 'border-box', marginBottom: '1rem', resize: 'vertical' }}
              />

              <textarea
                value={newScenario.descricaoDetalhada}
                onChange={e => setNewScenario({ ...newScenario, descricaoDetalhada: e.target.value })}
                placeholder="Descrição detalhada"
                rows="3"
                style={{ width: '100%', padding: '12px', border: '1px solid #d5d5d5', borderRadius: '8px', fontSize: '14px', background: '#f5f5f5', boxSizing: 'border-box', marginBottom: '1rem', resize: 'vertical' }}
              />

              <button
                onClick={handleAddScenario}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <PlusIcon /> Adicionar Cenário
              </button>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 1rem', color: '#000' }}>
              Cenários ({scenarios.length})
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
              gap: '1rem', 
              marginBottom: '2rem' 
            }}>
              {scenarios.sort((a, b) => a.titulo.localeCompare(b.titulo)).map(s => (
                <div key={s.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                  <img src={s.imagemUrl} alt={s.titulo} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '0.75rem' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 0.4rem', color: '#000', lineHeight: '1.3' }}>{s.titulo}</h3>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', color: '#999' }}>📷 {s.imagens?.length || 1}</span>
                      {s.destaques && <span style={{ fontSize: '10px', color: '#ff9800' }}>⭐ Destaque</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleEditScenario(s)}
                        style={{
                          flex: 1,
                          padding: '8px 6px',
                          background: '#000',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit2 size={12} /> Editar
                      </button>
                      <button
                        onClick={() => handleDeleteScenario(s.id)}
                        style={{
                          padding: '8px 10px',
                          background: '#fff',
                          color: '#d32f2f',
                          border: '1px solid #f0d0d0',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid #f0f0f0' }}>
              <button
                onClick={handleResetToDefault}
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  border: '1px solid #d32f2f',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#d32f2f',
                  cursor: 'pointer'
                }}
              >
                🔄 Resetar para dados originais
              </button>
            </div>
          </div>

          {editingScenario && (
            <ModalEdicao
              scenario={editingScenario}
              onSave={handleSaveEdit}
              onClose={handleCancelEdit}
            />
          )}
        </div>
      </>
    );
  }

  // ============================================
  // TELA: CATÁLOGO PRINCIPAL
  // ============================================
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="sa-page" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)' }}>
        <header style={{
          background: 'white',
          borderBottom: '1px solid #f0f0f0',
          padding: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '1rem',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
              <LogoIcon src={logoUrl} />
              <div style={{ minWidth: 0 }}>
                <h1 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  margin: 0, 
                  color: '#000',
                  whiteSpace: 'nowrap'
                }}>
                  Samara Assi
                </h1>
                <p style={{ fontSize: '11px', color: '#666', margin: '0.25rem 0 0' }}>Cenários de Fotografia</p>
              </div>
            </div>
            <button
              onClick={() => window.location.hash = '#admin'}
              style={{
                padding: '8px 16px',
                background: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                flexShrink: 0
              }}
            >
              Admin
            </button>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              placeholder="Buscar cenários..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                border: '1px solid #d5d5d5',
                borderRadius: '8px',
                fontSize: '14px',
                background: '#f5f5f5',
                color: '#000',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </header>

        {/* FILTROS: Idade | Categoria | Sexo | Limpar */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #f0f0f0',
          padding: '0.75rem 1rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.5rem'
            }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setExpandedFilter(expandedFilter === 'age' ? null : 'age')}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#f9f9f9',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#000',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{filters.ageMin}-{filters.ageMax}m</span>
                  <ChevronDown size={14} style={{ transform: expandedFilter === 'age' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>

                {expandedFilter === 'age' && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '12px',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="number" min="0" max="60" value={filters.ageMin} onChange={e => handleAgeChange('min', e.target.value)} style={{ width: '50%', padding: '6px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '12px' }} />
                      <input type="number" min="0" max="60" value={filters.ageMax} onChange={e => handleAgeChange('max', e.target.value)} style={{ width: '50%', padding: '6px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '12px' }} />
                    </div>
                  </div>
                )}
              </div>

              <select value={filters.categoria} onChange={e => setFilters({ ...filters, categoria: e.target.value })} style={{ padding: '10px 12px', background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#000', cursor: 'pointer' }}>
                <option value="all">Categoria</option>
                <option value="newborn">Newborn</option>
                <option value="acompanhamento">Acompanhamento</option>
                <option value="temático">Temático</option>
                <option value="clean">Clean</option>
                <option value="gemeos">Gêmeos</option>
                <option value="smash">Smash The Cake</option>
                <option value="gestante">Gestante</option>
              </select>

              <select value={filters.gender} onChange={e => setFilters({ ...filters, gender: e.target.value })} style={{ padding: '10px 12px', background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#000', cursor: 'pointer' }}>
                <option value="all">Sexo</option>
                <option value="menina">Menina</option>
                <option value="menino">Menino</option>
              </select>

              <button onClick={() => setFilters({ ageMin: 0, ageMax: 60, categoria: 'all', gender: 'all', search: '' })} style={{ padding: '10px 12px', background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#666', cursor: 'pointer' }}>
                ✕ Limpar
              </button>
            </div>
          </div>
        </div>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          {filteredScenarios.filter(s => s.destaques).length > 0 && (
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 1.5rem', color: '#000' }}>Destaques</h2>
              <div className="sa-cards-grid">
                {filteredScenarios.filter(s => s.destaques).map((scenario, idx) => (
                  <ScenarioCard key={scenario.id} scenario={scenario} onSelect={setSelectedScenario} index={idx} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 1.5rem', color: '#000' }}>Todos os Cenários</h2>
            {filteredScenarios.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <CameraIcon />
                <p style={{ fontSize: '16px', color: '#999', margin: '1rem 0 0' }}>Nenhum cenário encontrado.</p>
              </div>
            ) : (
              <div className="sa-cards-grid">
                {filteredScenarios.map((scenario, idx) => (
                  <ScenarioCard key={scenario.id} scenario={scenario} onSelect={setSelectedScenario} index={idx} />
                ))}
              </div>
            )}
          </section>
        </main>

        <footer style={{ background: '#f5f5f5', borderTop: '1px solid #f0f0f0', padding: '2rem', marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>© 2024 Samara Assi Fotografia</p>
        </footer>
      </div>
    </>
  );
}

// ============================================
// COMPONENTE: SCENARIO CARD
// Tags centralizadas: Idade | Sexo | Categoria
// ============================================

function ScenarioCard({ scenario, onSelect, index }) {
  const [hovering, setHovering] = useState(false);
  const numFotos = scenario.imagens?.length || 1;

  return (
    <div
      onClick={() => onSelect(scenario)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: hovering ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovering ? '0 12px 28px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.06)',
        animation: `fadeInUp 0.5s ease-out ${index * 0.06}s both`,
        cursor: 'pointer'
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={scenario.imagemUrl}
          alt={scenario.titulo}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            transition: 'all 0.4s',
            transform: hovering ? 'scale(1.05)' : 'scale(1)',
            display: 'block'
          }}
        />
        {numFotos > 1 && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            📷 {numFotos}
          </div>
        )}
      </div>
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 0.5rem', color: '#000', lineHeight: '1.3', wordBreak: 'break-word' }}>
          {scenario.titulo}
        </h3>
        <p style={{ fontSize: '12px', color: '#666', margin: '0 0 0.75rem', lineHeight: '1.4' }}>
          {scenario.descricaoBreve}
        </p>

        {/* TAGS: Idade | Sexo | Categoria */}
        <div className="sa-card-tags">
          <span className="sa-card-tag">
            {scenario.ageMonthMin}-{scenario.ageMonthMax}m
          </span>
          <span className="sa-card-tag">
            {generoTexto(scenario.genero)}
          </span>
          <span className="sa-card-tag">
            {categoriaTexto(scenario.categoria)}
          </span>
        </div>

        <button
          style={{
            width: '100%',
            padding: '9px',
            background: hovering ? '#000' : '#f5f5f5',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            color: hovering ? 'white' : '#000',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
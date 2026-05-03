import React, { useState } from 'react';
import { Camera, MessageCircle, Phone, Mail, ArrowRight, ChevronDown, Lock } from 'lucide-react';

// ============================================
// LANDING PAGE — Single-page com âncoras
// Seções: abertura, informacoes, orientacoes,
// bebe-mes-a-mes, gemeos, contato
// ============================================

const BEBE_MESES = [
  { mes: 1, titulo: '1º mês', imagem: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&q=80', texto: 'Uma das marcas do primeiro mês de idade é o "sorriso social". O bebê reconhece os mais próximos e reage às gracinhas. Isso também indica que o lado psíquico está se desenvolvendo no ritmo certo. A visão é cada vez mais nítida, pois ele passa a distinguir o mundo em 3D. O pescoço vai ficando mais durinho — o bebê consegue virar a cabeça quando ouve uma voz conhecida. Também é a fase das cólicas: alguns hormônios responsáveis pela maturidade do aparelho digestivo ainda não foram liberados, causando o desconforto. A alimentação da mãe que está amamentando afeta a saúde do bebê. Se for saudável, pode combater as cólicas.' },
  { mes: 2, titulo: '2º mês', imagem: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80', texto: 'Um dos grandes marcos desse período é o sorriso social — fenômeno curioso, porque independe do olhar e da receptividade dos pais. Além do sorriso, o bebê de 2 meses já consegue levantar o queixo, sinalizando que o controle da musculatura do pescoço está avançando. Tem também o reflexo de virar o rosto de lado se colocado de bruços quando acordado. A visão (as duas retinas se fundem) permite ao bebê fixar e acompanhar objetos e pessoas. Ele enxerga a mãe de outro modo, vendo detalhes do nariz, da boca, dos lábios, e é capaz de reconhecer o pai e os avós.' },
  { mes: 3, titulo: '3º mês', imagem: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&q=80', texto: 'Os 3 meses trazem várias novidades: o bebê gosta de brincar de esconde-esconde com a mãe e responde à brincadeira. Pode tocar os calcanhares e começar a descobrir os pezinhos. Durante o dia fica mais ativo e pode dormir a noite inteira. Uma característica marcante dessa fase é que ele não gosta de ficar sozinho — reclama e chora quando isso acontece. Continua colocando tudo na boca, segue os objetos visualmente e tenta alcançar o que lhe interessa, erguendo o corpinho. A linguagem se desenvolve com rapidez: ele presta atenção e fixa o olhar nos movimentos da boca de quem fala.' },
  { mes: 4, titulo: '4º mês', imagem: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80', texto: 'O bebê começa a fazer imitações, principalmente dos movimentos relacionados à boca. É bem provável que ele se torne um grande "conversador", bastante sociável e atento a tudo o que diz respeito aos pais e outras pessoas próximas. Neste período, sua musculatura já está mais desenvolvida e ele consegue inclusive levar os pés à boca. Rolar para os lados e sentar com ajuda de algum apoio também são características típicas do mês.' },
  { mes: 5, titulo: '5º mês', imagem: 'https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=800&q=80', texto: 'Não estranhe se a criança começar a morder objetos — o comportamento é uma forma de comunicação que o bebê encontra por ainda não dominar a linguagem: é a expressão da insatisfação, da brincadeira ou da alegria. Isso não necessariamente tem a ver com o surgimento dos primeiros dentinhos, que podem começar a aparecer tanto no terceiro quanto no décimo segundo mês. A audição está mais acurada e ele tem capacidade de reconhecer o próprio nome. Para distraí-lo, balançar um molho de chaves, cantar uma cantiga ou bater palmas são ótimas opções.' },
  { mes: 6, titulo: '6º mês', imagem: 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=800&q=80', texto: 'Segundo a Organização Mundial da Saúde (OMS) e o Ministério da Saúde, no sexto mês o bebê já pode começar gradativamente a ingerir outros alimentos — frutas, legumes, verduras e cereais — além do leite materno. Para descobrir se está pronta, observe se a criança já consegue ficar sentada sem apoio (sinal de que a musculatura do abdômen está mais definida). Os alimentos devem ter uma consistência bem pastosa, pois ainda não há mastigação. Vale lembrar que a OMS recomenda que o aleitamento materno seja mantido até o bebê completar dois anos. Para mais informações consulte sempre o Pediatra.' },
  { mes: 7, titulo: '7º mês', imagem: 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800&q=80', texto: 'Como já consegue ficar sentado sozinho, por volta desta fase o bebê deve começar a apoiar as mãos no chão para se sustentar melhor. Seus ossos e musculatura estão mais rígidos. Geralmente a criança também começa a utilizar o polegar e o dedo indicador para pegar objetos menores, bem como ensaiar "palminhas".' },
  { mes: 8, titulo: '8º mês', imagem: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80', texto: 'As brincadeiras de esconder, nessa fase, são as preferidas. O bebê se diverte muito — e os pais também, com as frequentes gargalhadas. O "não" entra em cena, e ele entende. É comum o bebê parar com uma atividade quando a mãe o repreende. Ele começa a perceber que é um ser separado da mãe, e passa a fazer manhas e protestos, como jogar as coisas no chão. Já é capaz de se sentar sozinho, sem apoio. Deixá-lo sentadinho, rodeado de brinquedos, é um belo estímulo nessa fase. Logo ele vai tentar sair em busca do que interessa engatinhando.' },
  { mes: 9, titulo: '9º mês', imagem: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=800&q=80', texto: 'Época de um quadro muito comum e esperado na pediatria: a angústia da separação. É neste período que o bebê compreende que é um ser separado da mãe. Não estranhe se ele ficar mais choroso, sobretudo durante a madrugada — não se trata de dor física. Os choros noturnos estão relacionados ao medo que a criança sente ao acordar e pensar que a mãe pode não voltar mais. Por conta dessa angústia, o bebê pode ficar mais amedrontado diante de estranhos e se alimentar menos. Engatinhar é outra grande novidade. A partir de agora ele domina a "pinça radial" e consegue pegar objetos bem menores com o polegar e o indicador.' },
  { mes: 10, titulo: '10º mês', imagem: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80', texto: 'Depois que passa a entender que é um ser separado da mãe, o bebê geralmente elege alguns "objetos de estimação", que em geral associa à figura materna. Essa pode ser uma das características principais da fase: um apego repentino a um bichinho de pelúcia, a um determinado pano ou a um brinquedo. Simbolicamente, a criança passa a carregar o objeto consigo, "mantendo a mãe sempre pertinho" quando ele está mais ansioso.' },
  { mes: 11, titulo: '11º mês', imagem: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80', texto: 'Tudo o que o bebê mais quer nessa fase é ficar em pé. Então, ele se apoia em todos os lugares possíveis: na poltrona, na mesinha, na cadeira. É comum a cena em que ele consegue se erguer, mas como ainda não desenvolveu o equilíbrio, cai de bumbum no chão. Esses pequenos tombos dificilmente apresentam riscos de lesões graves, uma vez que sua estrutura óssea ainda é pouco rígida. Outra mudança significativa é a percepção visual: se antes ele enxergava tudo do ponto de vista de quem engatinha, em pé seu horizonte se amplia no mínimo 50 centímetros.' },
  { mes: 12, titulo: '12º mês', imagem: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80', texto: 'Se ainda não aconteceu nos meses anteriores, certamente o bebê vai dar os primeiros passinhos agora, ainda que com algum tipo de apoio. Paralelamente surge a crise da ambivalência, que consiste no desejo de ser independente e na necessidade de ser dependente. A linguagem continua a se desenvolver. Palavras como "mamãe" e "água" podem ser as primeiras na fase. Há bebês que começam a caminhar e a falar quase ao mesmo tempo, mas é mais comum que uma função seja dissociada da outra. Agora começa uma nova etapa de desenvolvimento, com mais autonomia e capacidade de comunicação.' }
];

const TEMAS_GEMEOS = [
  'A Bela e a Fera', 'Alice no País das Maravilhas', 'Alladin e Jasmine', 'Anjo', 'Anos 60',
  'Aviador', 'Banda Kiss', 'Banheira Rústica', 'Banheira Vintage', 'Beijos', 'Bexigas',
  'Branca de Neve', 'Carnaval', 'Cavalo Carrossel', 'Chaves e Chiquinha', 'Chef',
  'Chupando Limão', 'Circo', 'Copa do Mundo', 'DJ', 'Doces', 'Festa Junina', 'Fotógrafo(a)',
  'Galinha Pintadinha', 'Game of Thrones', 'Greys Anatomy', 'Halloween', 'Harley Davidson',
  'Inverno', 'Jornalista', 'Kombi na Praia', 'Mário Kart', 'Masha e o Urso', 'Médico(a)',
  'Meu Malvado Favorito', 'Mickey e Minnie', 'Monstros S/A', 'Moto Chopper', 'Moto R1',
  'Mundo Bita', 'O Mágico de OZ', 'Oriental', 'Os 3 Porquinhos', 'Os Incríveis', 'Outono',
  'Patrulha Canina', 'Pequeno Príncipe', 'Peter Pan / Tinkerbell', 'Pirata', 'Primavera',
  'Rock', 'Rolls Royce', 'Safari', 'Show da Luna', 'Simpsons', 'Skatista', 'Star Wars',
  'Stranger Things', 'Super Mário Bros', 'Surfista', 'Toy Story', 'Trolls', 'Turma da Mônica',
  'Vingadores', 'Vintage Urso Gigante'
];

const LANDING_CSS = `
  /* Inter direto via @import (funciona mesmo se index.html não tiver o link) */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .lp-page * { box-sizing: border-box; }
  .lp-page { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; min-height: 100vh; background: #fff; color: #000; }

  /* ============================================
     HEADER (compartilhado entre Landing e Catálogo)
     ============================================ */
  .lp-header { background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.06); position: sticky; top: 0; z-index: 100; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  .lp-header-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.875rem 1.25rem; min-height: 64px; }

  /* Brand (logo + nome) */
  .lp-header-brand { display: flex; align-items: center; gap: 0.75rem; min-width: 0; cursor: pointer; transition: opacity 0.2s; flex-shrink: 1; }
  .lp-header-brand:hover { opacity: 0.7; }
  .lp-header-brand-img { width: 38px; height: 38px; object-fit: contain; flex-shrink: 0; }
  .lp-header-brand-text { display: flex; flex-direction: column; min-width: 0; }
  .lp-header-brand h1 { font-size: 15px; font-weight: 700; margin: 0; color: #000; white-space: nowrap; letter-spacing: -0.2px; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; }
  .lp-header-brand p { font-size: 10px; color: #999; margin: 2px 0 0; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; }

  /* Nav */
  .lp-header-nav { display: flex; gap: 0.25rem; align-items: center; flex-wrap: nowrap; flex-shrink: 0; }
  .lp-header-nav button { padding: 8px 14px; font-size: 13px; font-weight: 500; color: #555; text-decoration: none; border-radius: 8px; transition: all 0.15s ease; white-space: nowrap; cursor: pointer; background: none; border: none; font-family: inherit; line-height: 1; }
  .lp-header-nav button:hover { background: #f5f5f5; color: #000; }
  .lp-header-nav .lp-cta { background: #000; color: white; padding: 9px 18px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
  .lp-header-nav .lp-cta:hover { background: #1a1a1a; color: white; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.18); }
  .lp-header-nav .lp-admin { background: transparent; color: #888; border: 1px solid #e8e8e8; padding: 8px 12px; }
  .lp-header-nav .lp-admin:hover { background: #f5f5f5; color: #000; border-color: #d5d5d5; }

  /* Mobile */
  @media (max-width: 900px) {
    .lp-header-inner { padding: 0.75rem 1rem; min-height: 60px; }
    .lp-header-brand-img { width: 34px; height: 34px; }
    .lp-header-brand h1 { font-size: 14px; }
    .lp-header-brand p { display: none; }
    .lp-header-nav button.lp-nav-mob-hide { display: none; }
    .lp-header-nav button { padding: 7px 12px; font-size: 12px; }
    .lp-header-nav .lp-cta { padding: 8px 14px; }
    .lp-header-nav .lp-admin { padding: 7px 10px; }
    .lp-header-nav .lp-admin span { display: none; }
  }
  @media (max-width: 380px) {
    .lp-header-brand h1 { font-size: 13px; }
    .lp-header-nav { gap: 4px; }
    .lp-header-nav button { padding: 6px 10px; font-size: 11px; }
  }

  /* HERO */
  .lp-hero { padding: 5rem 1.5rem 4rem; text-align: center; background: linear-gradient(180deg, #fafafa 0%, #fff 100%); border-bottom: 1px solid #f0f0f0; }
  .lp-hero-logo { width: 100px; height: 100px; margin: 0 auto 1.5rem; object-fit: contain; }
  .lp-hero h1 { font-size: 48px; font-weight: 800; margin: 0 0 0.75rem; color: #000; letter-spacing: -1.5px; line-height: 1.1; }
  .lp-hero-sub { font-size: 18px; color: #666; margin: 0 0 0.5rem; font-weight: 500; }
  .lp-hero-since { font-size: 12px; color: #999; margin: 0 0 2.5rem; letter-spacing: 1px; text-transform: uppercase; }
  .lp-hero-cta { display: inline-flex; align-items: center; gap: 10px; padding: 16px 32px; background: #000; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; font-family: inherit; }
  .lp-hero-cta:hover { background: #222; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
  .lp-hero-scroll { margin-top: 3rem; color: #999; font-size: 12px; display: flex; flex-direction: column; align-items: center; gap: 6px; animation: bounce 2s ease-in-out infinite; }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
  @media (max-width: 600px) {
    .lp-hero { padding: 3rem 1rem; }
    .lp-hero h1 { font-size: 32px; }
    .lp-hero-sub { font-size: 15px; }
    .lp-hero-cta { padding: 14px 24px; font-size: 14px; }
  }

  /* SEÇÕES (todos os textos alinhados à esquerda por padrão) */
  .lp-section { padding: 4rem 1.5rem; max-width: 900px; margin: 0 auto; scroll-margin-top: 80px; }
  .lp-section-wide { padding: 4rem 0; max-width: none; scroll-margin-top: 80px; }
  .lp-section-wide-inner { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }
  .lp-section-divider { background: #fafafa; }
  .lp-section-title { font-size: 32px; font-weight: 800; margin: 0 0 0.5rem; color: #000; letter-spacing: -0.5px; text-align: left; }
  .lp-section-subtitle { font-size: 13px; color: #999; margin: 0 0 2.5rem; text-align: left; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
  @media (max-width: 600px) {
    .lp-section, .lp-section-wide-inner { padding-left: 1rem; padding-right: 1rem; }
    .lp-section, .lp-section-wide { padding-top: 3rem; padding-bottom: 3rem; }
    .lp-section-title { font-size: 26px; }
  }

  /* BLOCO DE TEXTO (sempre alinhado à esquerda) */
  .lp-text-block { background: white; border: 1px solid #f0f0f0; border-radius: 16px; padding: 2rem; box-shadow: 0 2px 12px rgba(0,0,0,0.04); text-align: left; }
  .lp-text-block p { font-size: 15px; line-height: 1.8; color: #444; margin: 0 0 1rem; text-align: left; }
  .lp-text-block p:last-child { margin-bottom: 0; }
  .lp-text-block strong { color: #000; font-weight: 700; }
  .lp-text-block ul { padding-left: 0; list-style: none; margin: 0; }
  .lp-text-block li { font-size: 15px; line-height: 1.7; color: #444; padding: 0.6rem 0 0.6rem 1.75rem; position: relative; border-bottom: 1px solid #f5f5f5; text-align: left; }
  .lp-text-block li:last-child { border-bottom: none; }
  .lp-text-block li::before { content: '✓'; position: absolute; left: 0; top: 0.7rem; color: #000; font-weight: 700; }
  .lp-text-block .lp-warning { background: #fff8e1; border-left: 4px solid #ffc107; padding: 1rem 1.25rem; border-radius: 8px; margin: 1.25rem 0; font-size: 14px; color: #5d4d00; line-height: 1.7; text-align: left; }
  .lp-text-block .lp-warning strong { color: #5d4d00; }
  @media (max-width: 600px) {
    .lp-text-block { padding: 1.5rem 1.25rem; }
    .lp-text-block p, .lp-text-block li { font-size: 14px; }
  }

  /* ACCORDION (BEBÊ MÊS A MÊS) */
  .lp-accordion { display: grid; gap: 0.75rem; }
  .lp-accordion-item { background: white; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; transition: all 0.2s; }
  .lp-accordion-item:hover { border-color: #d5d5d5; }
  .lp-accordion-header { width: 100%; padding: 1rem 1.25rem; background: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-size: 16px; font-weight: 700; color: #000; text-align: left; transition: background 0.15s; font-family: inherit; }
  .lp-accordion-header:hover { background: #fafafa; }
  .lp-accordion-header.is-open { background: #000; color: white; }
  .lp-accordion-content { padding: 0; border-top: 1px solid #f0f0f0; background: #fafafa; }
  .lp-accordion-content-inner { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; padding: 1.25rem; align-items: start; }
  .lp-accordion-img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; background: #f0f0f0; display: block; }
  .lp-accordion-text { font-size: 14px; line-height: 1.7; color: #555; text-align: left; }
  .lp-accordion-arrow { transition: transform 0.2s; flex-shrink: 0; }
  .lp-accordion-arrow.is-open { transform: rotate(180deg); }
  @media (max-width: 700px) {
    .lp-accordion-content-inner { grid-template-columns: 1fr; gap: 1rem; }
  }

  /* TEMAS GÊMEOS - GRID DE TAGS */
  .lp-temas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.5rem; margin-top: 1.5rem; }
  .lp-tema-tag { background: white; border: 1px solid #e8e8e8; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #333; text-align: center; transition: all 0.15s; }
  .lp-tema-tag:hover { background: #000; color: white; border-color: #000; }

  /* CONTATO */
  .lp-contato-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 2rem; }
  .lp-contato-card { background: white; border: 1px solid #f0f0f0; border-radius: 16px; padding: 1.5rem; text-align: center; text-decoration: none; color: inherit; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .lp-contato-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.08); border-color: #000; }
  .lp-contato-card-icon { width: 48px; height: 48px; background: #f5f5f5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; }
  .lp-contato-card-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
  .lp-contato-card-value { font-size: 14px; font-weight: 600; color: #000; word-break: break-word; }
  .lp-contato-info { text-align: left; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #f0f0f0; font-size: 13px; color: #888; line-height: 1.7; }
  .lp-contato-info strong { color: #000; font-weight: 700; }

  /* FOOTER */
  .lp-footer { background: #f5f5f5; border-top: 1px solid #f0f0f0; padding: 2rem 1rem; text-align: center; }
  .lp-footer p { margin: 0 0 0.75rem; font-size: 12px; color: #999; }
  .lp-footer-sep-desktop { display: inline; }
  .lp-footer-sep-mobile { display: none; }
  @media (max-width: 600px) {
    .lp-footer-sep-desktop { display: none; }
    .lp-footer-sep-mobile { display: inline; }
  }
`;

// Header reutilizável (usado pela Landing E pelo Catálogo)
export function LandingHeader({ logoUrl, onIrParaCatalogo, onIrParaInicio, onIrParaAdmin, currentPage = 'landing' }) {
  // Scroll suave manual: resolve o problema do scroll-margin-top + hash não atualizar a tela
  const goSection = (id) => {
    if (currentPage === 'catalogo') {
      // Vai pra landing primeiro, depois rola até a seção
      onIrParaInicio();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <style>{LANDING_CSS}</style>
      <header className="lp-header">
        <div className="lp-header-inner">
          <div className="lp-header-brand" onClick={onIrParaInicio}>
            {logoUrl ? <img src={logoUrl} alt="Samara Assis Fotografia" className="lp-header-brand-img" /> : null}
            <div className="lp-header-brand-text">
              <h1>Samara Assis Fotografia</h1>
              <p>Desde 2003</p>
            </div>
          </div>
          <nav className="lp-header-nav">
            <button onClick={() => goSection('informacoes')} className="lp-nav-mob-hide">Informações</button>
            <button onClick={() => goSection('orientacoes')} className="lp-nav-mob-hide">Orientações</button>
            <button onClick={() => goSection('contato')} className="lp-nav-mob-hide">Contato</button>
            {currentPage !== 'catalogo' && <button onClick={onIrParaCatalogo} className="lp-cta">Catálogo</button>}
            {currentPage === 'catalogo' && <button onClick={onIrParaInicio} className="lp-cta">Início</button>}
            <button onClick={onIrParaAdmin} className="lp-admin" title="Área administrativa" aria-label="Admin">
              <Lock size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 5 }} />
              <span>Admin</span>
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}

// Acordeão controlado pelo pai — apenas 1 aberto por vez
function AccordionItem({ titulo, texto, imagem, isOpen, onToggle }) {
  return (
    <div className="lp-accordion-item">
      <button onClick={onToggle} className={`lp-accordion-header ${isOpen ? 'is-open' : ''}`}>
        <span>{titulo}</span>
        <ChevronDown size={18} className={`lp-accordion-arrow ${isOpen ? 'is-open' : ''}`} />
      </button>
      {isOpen && (
        <div className="lp-accordion-content">
          <div className="lp-accordion-content-inner">
            {imagem && <img src={imagem} alt={titulo} className="lp-accordion-img" loading="lazy" />}
            <div className="lp-accordion-text">{texto}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ícone Instagram inline (lucide-react não exporta esse ícone)
function IconInstagram({ size = 24 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function LandingPage({ logoUrl, onIrParaCatalogo, onIrParaAdmin }) {
  // Accordion único: só 1 mês aberto por vez. Abrir outro fecha o anterior.
  const [openMes, setOpenMes] = useState(null);

  const irParaTopo = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <div className="lp-page">

        <LandingHeader
          logoUrl={logoUrl}
          onIrParaCatalogo={onIrParaCatalogo}
          onIrParaInicio={irParaTopo}
          onIrParaAdmin={onIrParaAdmin}
          currentPage="landing"
        />

        {/* HERO / ABERTURA */}
        <section id="abertura" className="lp-hero">
          {logoUrl && <img src={logoUrl} alt="Samara Assis Fotografia" className="lp-hero-logo" />}
          <h1>Samara Assis Fotografia</h1>
          <p className="lp-hero-sub">Cenários únicos para eternizar cada fase do seu bebê</p>
          <p className="lp-hero-since">Há mais de 20 anos criando memórias</p>
          <button onClick={onIrParaCatalogo} className="lp-hero-cta">
            <Camera size={20} />
            Ver Catálogo de Cenários
            <ArrowRight size={20} />
          </button>
          <div className="lp-hero-scroll">
            <span>Conheça mais</span>
            <ChevronDown size={16} />
          </div>
        </section>

        {/* INFORMAÇÕES */}
        <section id="informacoes" className="lp-section-wide lp-section-divider">
          <div className="lp-section-wide-inner">
            <h2 className="lp-section-title">Informações</h2>
            <p className="lp-section-subtitle">O que você precisa saber</p>
            <div className="lp-text-block">
              <p>O uso de algumas <strong>fantasias depende do tamanho e peso da criança</strong>, mesmo indicando a idade da vestimenta. Os cenários são disponíveis para todas as idades (crianças de 1 mês a 10 anos), mas algumas fantasias não estão disponíveis para alguns tamanhos.</p>
              <p>Informamos que <strong>Sessões "Especiais"</strong> como Newborn, Dia dos Pais, Dia das Mães, Bosque Encantado, Carruagem Externa e Natal — havendo interesse, deverão ser pagas à parte.</p>
              <p>Em caso de dúvida, favor entrar em contato para saber se há necessidade de trazer algum traje adicional (camiseta branca, calça jeans, etc).</p>
              <p>Sempre que possível trazer sapato — a cor será informada pelos fotógrafos.</p>
              <p>Nas opções <strong>Clean</strong> e <strong>Cenários Temáticos</strong>, os fotógrafos geralmente criam algo novo nas cores desejadas pelo cliente, mas temos várias opções prontas na galeria.</p>
              <p>Veja diversas fotos no nosso Instagram: <a href="https://www.instagram.com/samaraassifotografia/" target="_blank" rel="noopener noreferrer" style={{ color: '#000', fontWeight: 600 }}>@samaraassifotografia</a></p>
              <div className="lp-warning">
                <strong>🍰 Sobre bolos e doces nas sessões:</strong><br />
                Durante o acompanhamento fotográfico, solicitamos que <strong>não tragam bolo</strong>. Devido aos corantes, fantasias e elementos do cenário podem ser manchados. Se desejarem incluir um bolo, recomendamos a sessão <strong>Smash The Cake</strong> (próximo ao 12º mês) — feita à parte, onde o bebê pode se lambuzar à vontade. ❤️
              </div>
            </div>
          </div>
        </section>

        {/* ORIENTAÇÕES */}
        <section id="orientacoes" className="lp-section">
          <h2 className="lp-section-title">Orientações</h2>
          <p className="lp-section-subtitle">Para uma sessão tranquila</p>
          <div className="lp-text-block">
            <ul>
              <li>Procure deixar a criança dormir em horários de costume para não estressá-la.</li>
              <li>É recomendável <strong>não dar vacinas no dia da sessão</strong>.</li>
              <li>O ambiente é climatizado (25 a 28°C, umidade 60% mín), seguindo recomendações de pediatras.</li>
              <li>A sessão dura em média de 20 a 40 minutos, considerando paradas para amamentar, troca de fraldas e lanche.</li>
              <li>Temos sala de espera com TV, Netflix, Chromecast e Wi-Fi.</li>
              <li>Favor trazer <strong>brinquedos ou algo para distrair a criança</strong>. Temos músicas e vídeos infantis para ajudar.</li>
              <li>A escolha das produções deve ser feita <strong>5 dias antes</strong> da sessão.</li>
              <li>Se pais quiserem participar, vir de <strong>camiseta branca e calça jeans</strong>. (Maquiagem e cabelo não inclusos)</li>
              <li>Adultos adicionais (amigos/parentes): R$ 50,00 cada (taxa única no pacote anual).</li>
              <li>Irmãos usando fantasia do estúdio: R$ 50,00 de taxa.</li>
              <li>Mais de uma fantasia no mesmo cenário: R$ 150,00.</li>
              <li>Para acompanhamento mensal/bimestral/trimestral: 1 cenário e 1 fantasia (trocas só com cenário adicional).</li>
            </ul>
            <div className="lp-warning" style={{ marginTop: '1.5rem' }}>
              <strong>⚠️ Atenção:</strong><br />
              • Aos <strong>Domingos</strong> haverá acréscimo de 100% no valor de cada sessão.<br />
              • Atrasos de 15 minutos sem aviso = sessão remarcada com multa de <strong>R$ 100,00</strong>.<br />
              • Caso haja imprevisto, avisar antecipadamente!
            </div>
            <p style={{ marginTop: '1.5rem', fontStyle: 'italic' }}>Com certeza vocês irão se divertir e tudo vai acontecer naturalmente! ✨</p>
          </div>
        </section>

        {/* BEBÊ MÊS A MÊS */}
        <section id="bebe-mes-a-mes" className="lp-section-wide lp-section-divider">
          <div className="lp-section-wide-inner">
            <h2 className="lp-section-title">Bebê Mês a Mês</h2>
            <p className="lp-section-subtitle">Acompanhe o desenvolvimento de 1 a 12 meses</p>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, margin: '0 0 2rem', textAlign: 'left' }}>
              Cada bebê é único. Alguns demoram mais para fazer algumas coisas, mas também podem iniciar outras mais cedo. Tudo depende deles e cada um tem o seu tempo. Clique em cada mês para conhecer o desenvolvimento esperado:
            </p>
            <div className="lp-accordion">
              {BEBE_MESES.map((b, idx) => (
                <AccordionItem
                  key={b.mes}
                  titulo={b.titulo}
                  texto={b.texto}
                  imagem={b.imagem}
                  isOpen={openMes === idx}
                  onToggle={() => setOpenMes(openMes === idx ? null : idx)}
                />
              ))}
            </div>
            <p style={{ color: '#999', fontSize: 11, marginTop: '2rem', fontStyle: 'italic', lineHeight: 1.6 }}>
              Fontes: Dra. Ana Escobar (Hospital das Clínicas SP), Dr. Carlos Corrêa (Ministério da Saúde), Dra. Cylmara Gargalak Aziz (Hospital São Luiz), Dr. Leonardo Posternak (Albert Einstein).
            </p>
          </div>
        </section>

        {/* GÊMEOS */}
        <section id="gemeos" className="lp-section">
          <h2 className="lp-section-title">Dicas para Gêmeos</h2>
          <p className="lp-section-subtitle">Temas especiais para gemelares</p>
          <div className="lp-text-block">
            <p style={{ fontWeight: 600 }}>No momento atendemos ensaios de gêmeos para <strong>Menino e Menina</strong>:</p>
            <div className="lp-temas-grid">
              {TEMAS_GEMEOS.map(t => <div key={t} className="lp-tema-tag">{t}</div>)}
            </div>
            <p style={{ marginTop: '2rem', fontSize: 13, color: '#888' }}>
              No momento estamos atendendo somente ensaios para gemelares de sexo feminino e masculino.
            </p>
          </div>
        </section>

        {/* CONTATO */}
        <section id="contato" className="lp-section-wide lp-section-divider">
          <div className="lp-section-wide-inner">
            <h2 className="lp-section-title">Contato</h2>
            <p className="lp-section-subtitle">Vamos conversar</p>

            <div className="lp-contato-grid">
              <a href="https://wa.me/5511984892491" target="_blank" rel="noopener noreferrer" className="lp-contato-card">
                <div className="lp-contato-card-icon"><MessageCircle size={24} /></div>
                <span className="lp-contato-card-label">WhatsApp</span>
                <span className="lp-contato-card-value">11 98489-2491</span>
              </a>
              <a href="tel:+551120362324" className="lp-contato-card">
                <div className="lp-contato-card-icon"><Phone size={24} /></div>
                <span className="lp-contato-card-label">Telefone</span>
                <span className="lp-contato-card-value">11 2036-2324</span>
              </a>
              <a href="mailto:fotografia@samaraassi.com" className="lp-contato-card">
                <div className="lp-contato-card-icon"><Mail size={24} /></div>
                <span className="lp-contato-card-label">Email</span>
                <span className="lp-contato-card-value">fotografia@samaraassi.com</span>
              </a>
              <a href="https://www.instagram.com/samaraassifotografia/" target="_blank" rel="noopener noreferrer" className="lp-contato-card">
                <div className="lp-contato-card-icon"><IconInstagram size={24} /></div>
                <span className="lp-contato-card-label">Instagram</span>
                <span className="lp-contato-card-value">@samaraassifotografia</span>
              </a>
            </div>

            <div className="lp-contato-info">
              <p><strong>Samara Assis / Erick Batista</strong> — Fotógrafos</p>
              <p>Atendimento de Segunda à Sexta, das 9h às 18h</p>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="lp-section" style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '5rem' }}>
          <h2 className="lp-section-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Pronto para criar memórias?</h2>
          <button onClick={onIrParaCatalogo} className="lp-hero-cta">
            <Camera size={20} />
            Ver Catálogo de Cenários
            <ArrowRight size={20} />
          </button>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <p>
            © 2026 Samara Assis Fotografia<span className="lp-footer-sep-desktop"> - </span><br className="lp-footer-sep-mobile" />Todos os direitos reservados
          </p>
          <a href="https://brazildigital.ag" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', lineHeight: 0, opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.7'} aria-label="BrazilDigital.ag">
            <img src="https://brazildigital.ag/wp-content/uploads/2025/04/cropped-versao_Principal-80x80.png" alt="BrazilDigital" width="32" height="32" style={{ display: 'block' }} />
          </a>
        </footer>
      </div>
    </>
  );
}
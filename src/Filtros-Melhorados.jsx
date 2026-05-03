import React, { useState } from 'react';
import { Calendar, Tag, Users, Heart } from 'lucide-react';

// Ícones SVG personalizados
const AgeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ThemeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M7 7h10M7 12h10M7 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TypeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="16" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const GenderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v8M8 6h8M7 11c0-2.76 2.24-5 5-5s5 2.24 5 5v3H7v-3Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

export default function FiltrosMemhorados({ filters, setFilters }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAgeChange = (type, value) => {
    const numValue = Math.max(0, Math.min(60, parseInt(value) || 0));
    if (type === 'min') {
      setFilters({
        ...filters,
        ageMin: Math.min(numValue, filters.ageMax)
      });
    } else {
      setFilters({
        ...filters,
        ageMax: Math.max(numValue, filters.ageMin)
      });
    }
  };

  const handleSliderChange = (type, value) => {
    const numValue = parseInt(value);
    if (type === 'min') {
      if (numValue <= filters.ageMax) {
        setFilters({ ...filters, ageMin: numValue });
      }
    } else {
      if (numValue >= filters.ageMin) {
        setFilters({ ...filters, ageMax: numValue });
      }
    }
  };

  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #f0f0f0',
      padding: '2rem 2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Título */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            margin: 0,
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Filter size={20} style={{ color: '#0066cc' }} />
            Filtrar Cenários
          </h2>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0066cc',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '4px 8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.target.style.color = '#004499'}
            onMouseOut={e => e.target.style.color = '#0066cc'}
          >
            {showAdvanced ? '↑ Menos' : '↓ Mais'} opções
          </button>
        </div>

        {/* Grid de Filtros */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: showAdvanced ? '1.5rem' : 0
        }}>
          {/* FILTRO 1: Faixa Etária */}
          <FilterCard
            icon={<AgeIcon />}
            title="Faixa Etária"
            subtitle={`${filters.ageMin} - ${filters.ageMax} meses`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Slider Visual */}
              <div style={{ padding: '0 8px' }}>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={filters.ageMin}
                  onChange={e => handleSliderChange('min', e.target.value)}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: `linear-gradient(to right, #0066cc 0%, #0066cc ${(filters.ageMin / 60) * 100}%, #e0e0e0 ${(filters.ageMin / 60) * 100}%, #e0e0e0 100%)`,
                    outline: 'none',
                    cursor: 'pointer',
                    WebkitAppearance: 'slider-horizontal',
                    margin: '0'
                  }}
                />
              </div>

              {/* Inputs Numéricos */}
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={filters.ageMin}
                    onChange={e => handleAgeChange('min', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#000',
                      background: '#f9f9f9',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#0066cc';
                      e.target.style.background = '#fff';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.background = '#f9f9f9';
                    }}
                  />
                </div>

                <div style={{ fontSize: '20px', color: '#ddd', fontWeight: '300' }}>−</div>

                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Máximo
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={filters.ageMax}
                    onChange={e => handleAgeChange('max', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#000',
                      background: '#f9f9f9',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#0066cc';
                      e.target.style.background = '#fff';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.background = '#f9f9f9';
                    }}
                  />
                </div>
              </div>
            </div>
          </FilterCard>

          {/* FILTRO 2: Temas */}
          <FilterCard
            icon={<ThemeIcon />}
            title="Estilos"
            subtitle={filters.theme === 'all' ? 'Todos' : filters.theme.charAt(0).toUpperCase() + filters.theme.slice(1)}
          >
            <select
              value={filters.theme}
              onChange={e => setFilters({ ...filters, theme: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000',
                background: '#f9f9f9',
                cursor: 'pointer',
                transition: 'all 0.2s',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23000' d='M0 0l6 8 6-8z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#0066cc';
                e.target.style.background = '#fff url(data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%230066cc\' d=\'M0 0l6 8 6-8z\'/%3E%3C/svg%3E)';
                e.target.backgroundRepeat = 'no-repeat';
                e.target.backgroundPosition = 'right 12px center';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.background = '#f9f9f9 url(data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%23000\' d=\'M0 0l6 8 6-8z\'/%3E%3C/svg%3E)';
                e.target.backgroundRepeat = 'no-repeat';
                e.target.backgroundPosition = 'right 12px center';
              }}
            >
              <option value="all">Todos os estilos</option>
              <option value="clean">Clean</option>
              <option value="tema">Temático</option>
              <option value="natural">Natural</option>
            </select>
          </FilterCard>

          {/* FILTRO 3: Tipo de Foto */}
          <FilterCard
            icon={<TypeIcon />}
            title="Tipo de Foto"
            subtitle={filters.type === 'all' ? 'Todos' : filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}
          >
            <select
              value={filters.type}
              onChange={e => setFilters({ ...filters, type: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000',
                background: '#f9f9f9',
                cursor: 'pointer',
                transition: 'all 0.2s',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23000' d='M0 0l6 8 6-8z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#0066cc';
                e.target.style.background = '#fff url(data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%230066cc\' d=\'M0 0l6 8 6-8z\'/%3E%3C/svg%3E)';
                e.target.backgroundRepeat = 'no-repeat';
                e.target.backgroundPosition = 'right 12px center';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.background = '#f9f9f9 url(data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%23000\' d=\'M0 0l6 8 6-8z\'/%3E%3C/svg%3E)';
                e.target.backgroundRepeat = 'no-repeat';
                e.target.backgroundPosition = 'right 12px center';
              }}
            >
              <option value="all">Todos os tipos</option>
              <option value="individual">Individual</option>
              <option value="familia">Família</option>
              <option value="gemeos">Gêmeos</option>
            </select>
          </FilterCard>

          {/* FILTRO 4: Gênero */}
          <FilterCard
            icon={<GenderIcon />}
            title="Gênero"
            subtitle={filters.gender === 'all' ? 'Ambos' : filters.gender === 'menina' ? 'Menina' : 'Menino'}
          >
            <select
              value={filters.gender}
              onChange={e => setFilters({ ...filters, gender: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#000',
                background: '#f9f9f9',
                cursor: 'pointer',
                transition: 'all 0.2s',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23000' d='M0 0l6 8 6-8z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#0066cc';
                e.target.style.background = '#fff url(data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%230066cc\' d=\'M0 0l6 8 6-8z\'/%3E%3C/svg%3E)';
                e.target.backgroundRepeat = 'no-repeat';
                e.target.backgroundPosition = 'right 12px center';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.background = '#f9f9f9 url(data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%23000\' d=\'M0 0l6 8 6-8z\'/%3E%3C/svg%3E)';
                e.target.backgroundRepeat = 'no-repeat';
                e.target.backgroundPosition = 'right 12px center';
              }}
            >
              <option value="all">Ambos</option>
              <option value="menina">Menina</option>
              <option value="menino">Menino</option>
            </select>
          </FilterCard>
        </div>

        {/* Filtros Avançados */}
        {showAdvanced && (
          <div style={{
            borderTop: '2px solid #f0f0f0',
            paddingTop: '1.5rem',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#999',
              margin: '0 0 1rem',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ℹ️ Dica: Ajuste os filtros para encontrar o cenário perfeito
            </p>
            <div style={{
              background: '#f9f9f9',
              borderRadius: '8px',
              padding: '1rem',
              fontSize: '13px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              <strong>Dicas de uso:</strong><br/>
              • Use o slider de faixa etária para visualizar cenários apropriados<br/>
              • Filtre por gênero para ver opções específicas<br/>
              • Combine filtros para resultados mais precisos
            </div>
          </div>
        )}

        {/* Botão Limpar Filtros */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setFilters({
              ageMin: 0,
              ageMax: 60,
              theme: 'all',
              type: 'all',
              gender: 'all',
              search: ''
            })}
            style={{
              padding: '10px 24px',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#666',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.target.style.borderColor = '#0066cc';
              e.target.style.color = '#0066cc';
            }}
            onMouseOut={e => {
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.color = '#666';
            }}
          >
            ✕ Limpar Filtros
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Componente auxiliar para cards de filtro
function FilterCard({ icon, title, subtitle, children }) {
  return (
    <div style={{
      background: '#f9f9f9',
      border: '1px solid #f0f0f0',
      borderRadius: '12px',
      padding: '1.25rem',
      transition: 'all 0.2s'
    }}
    onMouseOver={e => {
      e.currentTarget.style.background = '#fff';
      e.currentTarget.style.borderColor = '#e0e0e0';
    }}
    onMouseOut={e => {
      e.currentTarget.style.background = '#f9f9f9';
      e.currentTarget.style.borderColor = '#f0f0f0';
    }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '0.75rem'
      }}>
        <div style={{ color: '#0066cc' }}>
          {icon}
        </div>
        <div>
          <p style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#666',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </p>
          <p style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#000',
            margin: '2px 0 0'
          }}>
            {subtitle}
          </p>
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {children}
      </div>
    </div>
  );
}

// Ícone de filtro
function Filter({ size, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

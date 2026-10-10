import { useEffect, useState } from 'react'
import { TYPE_NAMES, getDefenseProfile } from '../utils/types.js'

const STAT_NAMES = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Atq. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidade',
}

const MAX_STAT = 255

function TypeBadge({ type, label }) {
  return (
    <span className={`type type-${type}`}>
      {TYPE_NAMES[type] || type}
      {label && <small> {label}</small>}
    </span>
  )
}

// Escolhe o texto em espanhol (mais próximo do português) ou, se não houver, em inglês
function pickLanguage(entries, field) {
  const entry =
    entries.find((e) => e.language.name === 'es') ||
    entries.find((e) => e.language.name === 'en')
  return entry ? entry[field].replace(/[\n\f]/g, ' ') : null
}

function PokemonDetail({ pokemon, selected, duelFull, onToggleDuel, onClose }) {
  const [species, setSpecies] = useState(null)
  const [loadingSpecies, setLoadingSpecies] = useState(true)
  const [shiny, setShiny] = useState(false)

  // Busca os dados da espécie (descrição, categoria, habitat...) ao abrir
  useEffect(() => {
    let ignore = false

    async function fetchSpecies() {
      setLoadingSpecies(true)
      try {
        const res = await fetch(pokemon.speciesUrl)
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (ignore) return
        setSpecies({
          description: pickLanguage(data.flavor_text_entries, 'flavor_text'),
          genus: pickLanguage(data.genera, 'genus'),
          habitat: data.habitat?.name,
          captureRate: data.capture_rate,
          generation: data.generation.name.replace('generation-', '').toUpperCase(),
          legendary: data.is_legendary,
          mythical: data.is_mythical,
        })
      } catch {
        if (!ignore) setSpecies(null)
      } finally {
        if (!ignore) setLoadingSpecies(false)
      }
    }

    fetchSpecies()
    return () => {
      ignore = true
    }
  }, [pokemon.speciesUrl])

  // Fecha com Esc
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function playCry() {
    new Audio(pokemon.cry).play().catch(() => {})
  }

  const totalStats = Object.values(pokemon.stats).reduce((sum, value) => sum + value, 0)
  const profile = getDefenseProfile(pokemon.types)
  const weaknesses = profile.filter((p) => p.multiplier > 1)
  const resistances = profile.filter((p) => p.multiplier > 0 && p.multiplier < 1)
  const immunities = profile.filter((p) => p.multiplier === 0)
  const image = shiny && pokemon.shinyImage ? pokemon.shinyImage : pokemon.image

  return (
    <div className="duel-overlay" onClick={onClose}>
      <div className="detail" onClick={(e) => e.stopPropagation()}>
        <button className="duel-close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        <div className="detail-hero">
          <div className="detail-image">
            {image ? (
              <img src={image} alt={pokemon.name} key={image} />
            ) : (
              <div className="no-image">?</div>
            )}
          </div>

          <div className="detail-info">
            <span className="card-id static">#{String(pokemon.id).padStart(3, '0')}</span>
            <h2>{pokemon.name}</h2>
            {species?.genus && <p className="detail-genus">{species.genus}</p>}
            <div className="types left">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>

            <div className="detail-actions">
              {pokemon.shinyImage && (
                <button
                  className={`chip ${shiny ? 'active' : ''}`}
                  onClick={() => setShiny((prev) => !prev)}
                >
                  ✨ Shiny
                </button>
              )}
              {pokemon.cry && (
                <button className="chip" onClick={playCry}>
                  🔊 Grito
                </button>
              )}
              <button
                className={`chip duel ${selected ? 'active' : ''}`}
                onClick={onToggleDuel}
                disabled={duelFull && !selected}
              >
                {selected ? '✓ No duelo' : '⚔ Duelar'}
              </button>
            </div>
          </div>
        </div>

        <p className="detail-description">
          {loadingSpecies
            ? 'Carregando descrição...'
            : species?.description || 'Sem descrição disponível.'}
        </p>

        <div className="detail-facts">
          <div>
            <span>Altura</span>
            <strong>{pokemon.height} m</strong>
          </div>
          <div>
            <span>Peso</span>
            <strong>{pokemon.weight} kg</strong>
          </div>
          <div>
            <span>Exp. base</span>
            <strong>{pokemon.baseExperience ?? '—'}</strong>
          </div>
          <div>
            <span>Geração</span>
            <strong>{species?.generation ?? '—'}</strong>
          </div>
          <div>
            <span>Habitat</span>
            <strong className="capitalize">{species?.habitat?.replace('-', ' ') ?? '—'}</strong>
          </div>
          <div>
            <span>Captura</span>
            <strong>{species?.captureRate ?? '—'}</strong>
          </div>
        </div>

        {(species?.legendary || species?.mythical) && (
          <p className="detail-legendary">
            ★ Pokémon {species.mythical ? 'mítico' : 'lendário'}
          </p>
        )}

        <section>
          <h3>Habilidades</h3>
          <div className="detail-abilities">
            {pokemon.abilities.map((ability) => (
              <span key={ability.name} className="chip static">
                {ability.name.replace('-', ' ')}
                {ability.hidden && <small> (oculta)</small>}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3>
            Stats base <small>total {totalStats}</small>
          </h3>
          <ul className="stats">
            {Object.entries(pokemon.stats).map(([name, value]) => (
              <li key={name}>
                <span className="stat-name">{STAT_NAMES[name] || name}</span>
                <span className="stat-value">{value}</span>
                <div className="stat-bar">
                  <div
                    className="stat-fill"
                    style={{ width: `${(value / MAX_STAT) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Defesa por tipo</h3>
          <div className="matchups">
            <div>
              <span className="matchup-label">Fraco contra</span>
              <div className="types left">
                {weaknesses.length === 0 && <span className="muted">—</span>}
                {weaknesses.map((w) => (
                  <TypeBadge key={w.type} type={w.type} label={`×${w.multiplier}`} />
                ))}
              </div>
            </div>
            <div>
              <span className="matchup-label">Resiste a</span>
              <div className="types left">
                {resistances.length === 0 && <span className="muted">—</span>}
                {resistances.map((r) => (
                  <TypeBadge key={r.type} type={r.type} label={`×${r.multiplier}`} />
                ))}
              </div>
            </div>
            {immunities.length > 0 && (
              <div>
                <span className="matchup-label">Imune a</span>
                <div className="types left">
                  {immunities.map((i) => (
                    <TypeBadge key={i.type} type={i.type} label="×0" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default PokemonDetail

import { useEffect, useRef, useState } from 'react'
import PokemonCard from './PokemonCard.jsx'
import DuelBar from './DuelBar.jsx'
import Duel from './Duel.jsx'
import PokemonDetail from './PokemonDetail.jsx'

const API_URL = 'https://pokeapi.co/api/v2/pokemon'
const PAGE_SIZE = 20

function Pokedex() {
  const [pokemons, setPokemons] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [retry, setRetry] = useState(0)
  const [duelists, setDuelists] = useState([])
  const [duelOpen, setDuelOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const sentinelRef = useRef(null)

  // Busca uma página sempre que o offset muda (0, 20, 40, ...)
  useEffect(() => {
    let ignore = false

    async function fetchPokemons() {
      setLoading(true)
      setError(null)
      try {
        // 1) Lista a página atual de Pokémon
        const response = await fetch(`${API_URL}?limit=${PAGE_SIZE}&offset=${offset}`)
        if (!response.ok) throw new Error('Falha ao buscar a lista de Pokémon')
        const data = await response.json()

        // 2) Busca os detalhes (foto, tipos) de cada um em paralelo
        const details = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(`${API_URL}/${pokemon.name}`)
            if (!res.ok) throw new Error(`Falha ao buscar ${pokemon.name}`)
            return res.json()
          })
        )

        if (ignore) return

        const newPokemons = details.map((p) => ({
          id: p.id,
          name: p.name,
          image:
            p.sprites.other['official-artwork'].front_default ||
            p.sprites.front_default,
          types: p.types.map((t) => t.type.name),
          // Sprites pixelados para a arena de Game Boy (Red/Blue quando existir)
          pixelFront:
            p.sprites.versions['generation-i']['red-blue'].front_transparent ||
            p.sprites.front_default,
          pixelBack:
            p.sprites.versions['generation-i']['red-blue'].back_transparent ||
            p.sprites.back_default ||
            p.sprites.front_default,
          // Dados extras para o card ampliado
          shinyImage: p.sprites.other['official-artwork'].front_shiny,
          height: p.height / 10, // decímetros -> metros
          weight: p.weight / 10, // hectogramas -> kg
          baseExperience: p.base_experience,
          abilities: p.abilities.map((a) => ({ name: a.ability.name, hidden: a.is_hidden })),
          cry: p.cries?.latest,
          speciesUrl: p.species.url,
          // { hp: 45, attack: 49, defense: 49, 'special-attack': 65, ... }
          stats: Object.fromEntries(p.stats.map((s) => [s.stat.name, s.base_stat])),
        }))

        // Adiciona ao final da lista, evitando duplicados
        setPokemons((prev) => {
          const ids = new Set(prev.map((p) => p.id))
          return [...prev, ...newPokemons.filter((p) => !ids.has(p.id))]
        })
        setHasMore(data.next !== null)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchPokemons()

    return () => {
      ignore = true
    }
  }, [offset, retry])

  function loadMore() {
    if (!loading && hasMore) setOffset((prev) => prev + PAGE_SIZE)
  }

  // Scroll infinito: carrega a próxima página quando o fim da lista aparece na tela
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || loading || !hasMore || search || error) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setOffset((prev) => prev + PAGE_SIZE)
    })
    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [loading, hasMore, search, error])

  // Seleciona/deseleciona um Pokémon para o duelo (máximo 2)
  function toggleDuelist(pokemon) {
    setDuelists((prev) =>
      prev.some((p) => p.id === pokemon.id)
        ? prev.filter((p) => p.id !== pokemon.id)
        : [...prev, pokemon].slice(0, 2)
    )
  }

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  const isFirstLoad = loading && pokemons.length === 0

  return (
    <main className="pokedex">
      <header className="header">
        <h1>
          <span className="accent">&gt;</span> Pokédex<span className="cursor">_</span>
        </h1>
        <p className="subtitle">
          {'// '}{pokemons.length} registros carregados da PokeAPI
        </p>
      </header>

      <input
        type="text"
        className="search"
        placeholder="$ buscar --nome pikachu"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isFirstLoad && (
        <div className="status">
          <div className="spinner" />
          <p>Carregando Pokémon...</p>
        </div>
      )}

      {!loading && !error && filteredPokemons.length === 0 && (
        <p className="status">Nenhum Pokémon encontrado entre os carregados.</p>
      )}

      <div className="grid">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            image={pokemon.image}
            types={pokemon.types}
            selected={duelists.some((p) => p.id === pokemon.id)}
            disabled={duelists.length === 2 && !duelists.some((p) => p.id === pokemon.id)}
            onToggleDuel={() => toggleDuelist(pokemon)}
            onOpen={() => setDetail(pokemon)}
          />
        ))}
      </div>

      {error && (
        <div className="status error">
          <p>Erro: {error}</p>
          <button className="load-more" onClick={() => setRetry((prev) => prev + 1)}>
            Tentar novamente
          </button>
        </div>
      )}

      {!isFirstLoad && !error && (
        <div className="footer" ref={sentinelRef}>
          {loading ? (
            <div className="spinner small" />
          ) : hasMore ? (
            <button className="load-more" onClick={loadMore}>
              Carregar mais
            </button>
          ) : (
            <p className="status">Fim da Pokédex!</p>
          )}
        </div>
      )}

      <DuelBar
        selected={duelists}
        onStart={() => setDuelOpen(true)}
        onClear={() => setDuelists([])}
      />

      {detail && (
        <PokemonDetail
          pokemon={detail}
          selected={duelists.some((p) => p.id === detail.id)}
          duelFull={duelists.length === 2}
          onToggleDuel={() => toggleDuelist(detail)}
          onClose={() => setDetail(null)}
        />
      )}

      {duelOpen && duelists.length === 2 && (
        <Duel p1={duelists[0]} p2={duelists[1]} onClose={() => setDuelOpen(false)} />
      )}
    </main>
  )
}

export default Pokedex

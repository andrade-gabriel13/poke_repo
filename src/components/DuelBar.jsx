function DuelBar({ selected, onStart, onClear }) {
  if (selected.length === 0) return null

  return (
    <div className="duel-bar">
      <div className="duel-bar-slots">
        {[0, 1].map((i) => {
          const pokemon = selected[i]
          return (
            <div key={i} className={`duel-slot ${pokemon ? 'filled' : ''}`}>
              {pokemon ? (
                <>
                  <img src={pokemon.image} alt={pokemon.name} />
                  <span>{pokemon.name}</span>
                </>
              ) : (
                <span className="muted">escolha o oponente</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="duel-bar-actions">
        <button className="load-more" onClick={onClear}>
          Limpar
        </button>
        <button
          className="load-more primary"
          onClick={onStart}
          disabled={selected.length < 2}
        >
          ⚔ Duelar
        </button>
      </div>
    </div>
  )
}

export default DuelBar

import { TYPE_NAMES } from '../utils/types.js'

function PokemonCard({ id, name, image, types, selected, disabled, onToggleDuel, onOpen }) {
  return (
    <article
      className={`card ${selected ? 'selected' : ''}`}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      role="button"
      tabIndex={0}
    >
      <span className="card-id">#{String(id).padStart(3, '0')}</span>
      {image ? (
        <img src={image} alt={name} loading="lazy" />
      ) : (
        <div className="no-image">?</div>
      )}
      <h2>{name}</h2>
      <div className="types">
        {types.map((type) => (
          <span key={type} className={`type type-${type}`}>
            {TYPE_NAMES[type] || type}
          </span>
        ))}
      </div>
      <button
        className="duel-btn"
        onClick={(e) => {
          e.stopPropagation() // não abre o card ampliado
          onToggleDuel()
        }}
        disabled={disabled}
      >
        {selected ? '✓ Selecionado' : '⚔ Duelar'}
      </button>
    </article>
  )
}

export default PokemonCard

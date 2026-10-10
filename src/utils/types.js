export const TYPE_NAMES = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  grass: 'Grama',
  electric: 'Elétrico',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Veneno',
  ground: 'Terra',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  dark: 'Sombrio',
  steel: 'Aço',
  fairy: 'Fada',
}

// Tabela de efetividade: tipo do ataque -> { tipo do defensor: multiplicador }
// (tipos não listados recebem dano normal, 1x)
const TYPE_CHART = {
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
  fire: { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
  grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
  ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
  poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
  flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
  ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
  fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
}

// Multiplicador de um ataque de `attackType` contra um Pokémon com `defenderTypes`
export function getMultiplier(attackType, defenderTypes) {
  const chart = TYPE_CHART[attackType] || {}
  return defenderTypes.reduce((total, type) => total * (chart[type] ?? 1), 1)
}

// Golpe usado na arena para cada tipo (nomes no estilo dos jogos clássicos)
export const MOVE_NAMES = {
  normal: 'TACKLE',
  fire: 'EMBER',
  water: 'WATER GUN',
  grass: 'VINE WHIP',
  electric: 'THUNDERSHOCK',
  ice: 'ICE BEAM',
  fighting: 'KARATE CHOP',
  poison: 'POISON STING',
  ground: 'MUD-SLAP',
  flying: 'GUST',
  psychic: 'CONFUSION',
  bug: 'BUG BITE',
  rock: 'ROCK THROW',
  ghost: 'LICK',
  dragon: 'DRAGON RAGE',
  dark: 'BITE',
  steel: 'IRON TAIL',
  fairy: 'FAIRY WIND',
}

// Quanto cada tipo de ataque causa contra um Pokémon com esses tipos
export function getDefenseProfile(defenderTypes) {
  return Object.keys(TYPE_NAMES).map((type) => ({
    type,
    multiplier: getMultiplier(type, defenderTypes),
  }))
}

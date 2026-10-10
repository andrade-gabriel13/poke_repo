import { getMultiplier } from './types.js'

const LEVEL = 50
const MOVE_POWER = 40
const MAX_TURNS = 40

// HP no nível 50 (fórmula simplificada dos jogos)
export function getMaxHp(pokemon) {
  return pokemon.stats.hp + LEVEL + 10
}

// Escolhe o melhor tipo de ataque do atacante contra o defensor
function bestAttack(attacker, defender) {
  return attacker.types
    .map((type) => ({ type, multiplier: getMultiplier(type, defender.types) }))
    .sort((a, b) => b.multiplier - a.multiplier)[0]
}

function calculateDamage(attacker, defender) {
  const { type, multiplier } = bestAttack(attacker, defender)

  // Usa ataque físico ou especial, o que for maior
  const physical = attacker.stats.attack >= attacker.stats['special-attack']
  const atk = physical ? attacker.stats.attack : attacker.stats['special-attack']
  const def = physical ? defender.stats.defense : defender.stats['special-defense']

  const critical = Math.random() < 1 / 16
  const random = 0.85 + Math.random() * 0.15
  const stab = 1.5 // o ataque é sempre do tipo do próprio Pokémon

  const base = ((((2 * LEVEL) / 5 + 2) * MOVE_POWER * (atk / def)) / 50 + 2)
  const damage = multiplier === 0
    ? 0
    : Math.max(1, Math.floor(base * stab * multiplier * random * (critical ? 1.5 : 1)))

  return { type, multiplier, critical, damage }
}

// Simula a batalha inteira e devolve a lista de turnos + vencedor
export function simulateBattle(p1, p2) {
  const fighters = [p1, p2]
  const hp = [getMaxHp(p1), getMaxHp(p2)]

  // Quem tem mais velocidade ataca primeiro (empate = sorteio)
  let current =
    p1.stats.speed === p2.stats.speed
      ? Math.round(Math.random())
      : p1.stats.speed > p2.stats.speed ? 0 : 1

  const turns = []

  while (hp[0] > 0 && hp[1] > 0 && turns.length < MAX_TURNS) {
    const target = 1 - current
    const result = calculateDamage(fighters[current], fighters[target])
    hp[target] = Math.max(0, hp[target] - result.damage)

    turns.push({ attacker: current, defender: target, hpAfter: hp[target], ...result })
    current = target
  }

  let winner = null // null = empate
  if (hp[0] === 0) winner = 1
  else if (hp[1] === 0) winner = 0
  else {
    // Limite de turnos: vence quem tiver mais % de HP
    const pct = [hp[0] / getMaxHp(p1), hp[1] / getMaxHp(p2)]
    if (pct[0] !== pct[1]) winner = pct[0] > pct[1] ? 0 : 1
  }

  return { turns, winner }
}

import { useEffect, useMemo, useState } from 'react'
import { getMaxHp, simulateBattle } from '../utils/battle.js'
import { MOVE_NAMES } from '../utils/types.js'
import GameBoy from './GameBoy.jsx'

const MESSAGE_DELAY = 1800
const TYPE_SPEED = 30

// Transforma os turnos da batalha em mensagens no estilo do Game Boy.
// Cada mensagem guarda o HP de cada lado naquele momento.
function buildScript(battle, p1, p2) {
  const names = [p1.name.toUpperCase(), p2.name.toUpperCase()]
  const hp = [getMaxHp(p1), getMaxHp(p2)]
  const fainted = [false, false]
  const script = []

  const push = (text, extra = {}) =>
    script.push({ text, hp: [...hp], fainted: [...fainted], ...extra })

  push(`${names[1]} quer duelar!`)
  push(`Vai! ${names[0]}!`)

  battle.turns.forEach((turn) => {
    const attacker = names[turn.attacker]
    const defender = names[turn.defender]

    hp[turn.defender] = turn.hpAfter
    push(`${attacker} usou ${MOVE_NAMES[turn.type] || 'TACKLE'}!`, {
      attacker: turn.attacker,
      defender: turn.defender,
    })

    if (turn.multiplier === 0) {
      push(`Não afetou ${defender}...`)
      return
    }
    if (turn.critical) push('Um acerto crítico!')
    if (turn.multiplier > 1) push('É super eficaz!')
    if (turn.multiplier < 1) push('Não é muito eficaz...')

    if (turn.hpAfter === 0) {
      fainted[turn.defender] = true
      push(`${defender} desmaiou!`, { faint: turn.defender })
    }
  })

  if (battle.winner === null) push('Os dois estão exaustos! Empate!')
  else push(`${names[battle.winner]} venceu o duelo!`)

  return script
}

// Texto que aparece letra por letra
function TypedText({ text }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count >= text.length) return
    const timer = setTimeout(() => setCount((prev) => prev + 1), TYPE_SPEED)
    return () => clearTimeout(timer)
  }, [count, text])

  return <>{text.slice(0, count)}</>
}

function HpBox({ pokemon, hp, maxHp, showNumbers, className }) {
  const pct = (hp / maxHp) * 100

  return (
    <div className={`gb-hpbox ${className}`}>
      <p className="gb-name">{pokemon.name.toUpperCase()}</p>
      <p className="gb-level">:L50</p>
      <div className="gb-hpline">
        <span className="gb-hplabel">HP:</span>
        <div className="gb-hpbar">
          <div className="gb-hpfill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {showNumbers && (
        <p className="gb-hpnum">
          {hp}/ {maxHp}
        </p>
      )}
    </div>
  )
}

function Duel({ p1, p2, onClose }) {
  const [round, setRound] = useState(0)
  const [step, setStep] = useState(0)

  // Calcula a batalha inteira de uma vez; a cada revanche (round) gera outra
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const script = useMemo(() => buildScript(simulateBattle(p1, p2), p1, p2), [p1, p2, round])
  const message = script[step]
  const finished = step === script.length - 1

  // Avança as mensagens automaticamente
  useEffect(() => {
    if (finished) return
    const timer = setTimeout(() => setStep((prev) => prev + 1), MESSAGE_DELAY)
    return () => clearTimeout(timer)
  }, [step, finished])

  // Botão A: próxima mensagem (ou revanche no final)
  function pressA() {
    if (finished) {
      setRound((prev) => prev + 1)
      setStep(0)
    } else {
      setStep((prev) => prev + 1)
    }
  }

  // Teclado: Enter/Espaço/Z = A, Esc/X = B
  useEffect(() => {
    function onKeyDown(e) {
      if (['Enter', ' ', 'z', 'Z'].includes(e.key)) {
        e.preventDefault()
        pressA()
      }
      if (['Escape', 'x', 'X'].includes(e.key)) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  function spriteClass(index) {
    const classes = ['gb-sprite', index === 0 ? 'gb-player' : 'gb-enemy']
    if (step === 0) classes.push('entering')
    if (message.faint === index) classes.push('fainting')
    else if (message.fainted[index]) classes.push('fainted')
    if (message.attacker === index) classes.push('attacking')
    if (message.defender === index) classes.push('hit')
    return classes.join(' ')
  }

  return (
    <div className="duel-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <GameBoy onA={pressA} onB={onClose} onStart={pressA}>
          <div className="gb-battle">
            <HpBox
              pokemon={p2}
              hp={message.hp[1]}
              maxHp={getMaxHp(p2)}
              className="gb-hpbox-enemy"
            />
            <img
              key={`enemy-${round}-${step}`}
              className={spriteClass(1)}
              src={p2.pixelFront}
              alt={p2.name}
            />

            <img
              key={`player-${round}-${step}`}
              className={spriteClass(0)}
              src={p1.pixelBack}
              alt={p1.name}
            />
            <HpBox
              pokemon={p1}
              hp={message.hp[0]}
              maxHp={getMaxHp(p1)}
              showNumbers
              className="gb-hpbox-player"
            />

            <div className="gb-textbox">
              <p>
                <TypedText key={`${round}-${step}`} text={message.text} />
              </p>
              <span className="gb-arrow">{finished ? '↺' : '▼'}</span>
            </div>
          </div>
        </GameBoy>
        <p className="gb-help">
          A / Enter: avançar {finished && '· revanche'} &nbsp;·&nbsp; B / Esc: sair
        </p>
      </div>
    </div>
  )
}

export default Duel

// Carcaça de Game Boy clássico: a tela recebe o conteúdo via children
function GameBoy({ children, onA, onB, onStart }) {
  return (
    <div className="gameboy">
      {/* Filtro que converte qualquer imagem para a paleta verde de 4 tons */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="gb-palette" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0.059 0.188 0.545 0.608" />
            <feFuncG type="discrete" tableValues="0.220 0.384 0.675 0.737" />
            <feFuncB type="discrete" tableValues="0.059 0.188 0.059 0.059" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="gb-bezel">
        <div className="gb-bezel-top">
          <span className="gb-line" />
          <span className="gb-bezel-label">DOT MATRIX WITH STEREO SOUND</span>
          <span className="gb-line" />
        </div>
        <div className="gb-bezel-body">
          <div className="gb-power">
            <span className="gb-led" />
            <span>POWER</span>
          </div>
          <div className="gb-screen">{children}</div>
        </div>
      </div>

      <p className="gb-brand">
        Poké<span>Boy</span>
      </p>

      <div className="gb-controls">
        <div className="gb-dpad" aria-hidden="true">
          <span className="up" />
          <span className="right" />
          <span className="down" />
          <span className="left" />
          <span className="center" />
        </div>

        <div className="gb-ab">
          <div className="gb-btn-wrap b">
            <button className="gb-btn" onClick={onB} aria-label="Botão B (sair)" />
            <span>B</span>
          </div>
          <div className="gb-btn-wrap a">
            <button className="gb-btn" onClick={onA} aria-label="Botão A (avançar)" />
            <span>A</span>
          </div>
        </div>
      </div>

      <div className="gb-menu">
        <div className="gb-pill-wrap">
          <button className="gb-pill" aria-label="Select" />
          <span>SELECT</span>
        </div>
        <div className="gb-pill-wrap">
          <button className="gb-pill" onClick={onStart} aria-label="Start" />
          <span>START</span>
        </div>
      </div>

      <div className="gb-speaker" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  )
}

export default GameBoy

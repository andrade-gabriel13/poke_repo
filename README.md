# Pokédex em React

Aplicação em **React + Vite** que consome a [PokeAPI](https://pokeapi.co/) para listar Pokémon com nome, imagem oficial e tipos. Também tem busca, scroll infinito, um card ampliado com informações detalhadas e um **duelo entre Pokémon simulado dentro de um Game Boy**.

**🔗 Acesse online:** https://andrade-gabriel13.github.io/poke_repo/

Projeto desenvolvido como atividade prática de React, usando os conceitos vistos em aula: **componentes, props, `useState`, `useEffect` e `fetch`**.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Requisitos da atividade](#requisitos-da-atividade)
- [Como rodar](#como-rodar)
- [Como usar](#como-usar)
- [Conceitos de React aplicados](#conceitos-de-react-aplicados)
- [Endpoints da PokeAPI utilizados](#endpoints-da-pokeapi-utilizados)
- [Como funciona o duelo](#como-funciona-o-duelo)
- [Deploy (GitHub Pages)](#deploy-github-pages)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Tecnologias](#tecnologias)
- [Créditos](#créditos)

---

## Funcionalidades

### Listagem (Pokédex)
- Lista de Pokémon com **nome, número, imagem oficial e tipos** (traduzidos para português e coloridos por tipo).
- **Scroll infinito:** a próxima página (20 Pokémon por vez) é buscada automaticamente ao chegar no fim da lista. Também há um botão **"Carregar mais"**.
- **Busca por nome** em tempo real (filtra os Pokémon já carregados).
- **Indicador de carregamento** (spinner) na primeira carga e ao buscar novas páginas.
- **Tratamento de erros**, com botão "Tentar novamente".

### Card ampliado
Ao clicar em um Pokémon, abre um painel com:
- Arte oficial em tamanho grande, com botão **✨ Shiny** para ver a versão alternativa.
- Botão **🔊 Grito**, que toca o som oficial do Pokémon.
- **Descrição da espécie** e categoria (ex.: "Pokémon Llama"). A PokeAPI não tem textos em português, então é usado espanhol, com inglês como alternativa.
- Altura, peso, experiência base, geração, habitat e taxa de captura.
- Indicação de Pokémon **lendário** ou **mítico**.
- **Habilidades**, marcando a habilidade oculta.
- Os **6 stats base** em barras (HP, Ataque, Defesa, Atq. Esp., Def. Esp., Velocidade), com o total.
- **Defesa por tipo:** fraquezas (×2, ×4), resistências (×0.5, ×0.25) e imunidades (×0), calculadas a partir da tabela de tipos.

### Duelo no Game Boy
- Selecione dois Pokémon pelo botão **⚔ Duelar** e inicie o duelo pela barra inferior.
- A batalha acontece dentro de um **Game Boy clássico**:
  - tela com a paleta verde de 4 tons;
  - **sprites originais de Pokémon Red/Blue** (Pokémon #1 a #151; os demais usam o sprite pixelado padrão);
  - caixas de HP e mensagens no estilo da 1ª geração, com texto aparecendo letra por letra.
- **Animações:** entrada deslizando, ataque, Pokémon atingido piscando e desmaio.
- **Controles funcionais:** botões A, B e Start, ou pelo teclado.
- O Game Boy se ajusta ao tamanho da tela, do celular ao monitor Full HD.

### Visual
- Tema **dark tech**: neon ciano/magenta, fonte monoespaçada (JetBrains Mono), fundo em grade e efeitos de brilho.
- Layout responsivo.

---

## Requisitos da atividade

| Requisito | Onde foi atendido |
|---|---|
| Componente principal + componente filho reutilizável | `Pokedex.jsx` renderiza vários `PokemonCard.jsx` |
| Dados passados via props | `id`, `name`, `image`, `types` (e callbacks) passados ao `PokemonCard` |
| `useEffect` com `fetch` ao carregar a página | `Pokedex.jsx`: busca a lista e os detalhes de cada Pokémon |
| Lista armazenada em `useState` | estado `pokemons` em `Pokedex.jsx` |
| Exibir nome, foto e tipo(s) | `PokemonCard.jsx` |
| **Opcional:** campo de busca com `useState` | estado `search` + filtro por nome |
| **Opcional:** estado de carregamento | estado `loading` + spinner |

---

## Como rodar

**Pré-requisitos:** [Node.js](https://nodejs.org/) 18 ou superior (testado com Node 20) e npm.

```bash
# 1. Clonar o repositório
git clone git@github.com:andrade-gabriel13/poke_repo.git
cd poke_repo

# 2. Instalar as dependências
npm install

# 3. Rodar em modo de desenvolvimento
npm run dev
```

Acesse o endereço exibido no terminal (por padrão http://localhost:5173).

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com recarregamento automático |
| `npm run build` | Gera a versão de produção na pasta `dist/` |
| `npm run preview` | Serve localmente a versão gerada pelo build |
| `npm run lint` | Verifica o código com o ESLint |

---

## Como usar

1. **Navegar:** role a página; novos Pokémon são carregados automaticamente.
2. **Buscar:** digite parte do nome no campo de busca (ex.: `char`).
3. **Ver detalhes:** clique em qualquer card. Para fechar, clique fora, no ✕ ou pressione `Esc`.
4. **Duelar:**
   1. Clique em **⚔ Duelar** em dois Pokémon (pelo card ou pelo card ampliado).
   2. Na barra que aparece embaixo, clique em **⚔ Duelar**.
   3. O primeiro escolhido é o seu Pokémon (de costas); o segundo é o oponente.

### Controles do Game Boy

| Ação | Botão | Teclado |
|---|---|---|
| Avançar mensagem | **A** | `Enter`, `Espaço` ou `Z` |
| Revanche (no fim do duelo) | **A** ou **START** | `Enter`, `Espaço` ou `Z` |
| Sair do duelo | **B** | `Esc` ou `X` |

As mensagens também avançam sozinhas.

---

## Conceitos de React aplicados

### Componentização e props
O `Pokedex` é o componente principal e cuida dos dados. O `PokemonCard` só exibe o que recebe por props, por isso pode ser reutilizado para todos os Pokémon:

```jsx
<PokemonCard
  key={pokemon.id}
  id={pokemon.id}
  name={pokemon.name}
  image={pokemon.image}
  types={pokemon.types}
  onOpen={() => setDetail(pokemon)}
/>
```

### `useState`
Estados principais do `Pokedex`:

| Estado | Para que serve |
|---|---|
| `pokemons` | Lista de Pokémon já carregados |
| `loading` / `error` | Controle de carregamento e erro |
| `offset` / `hasMore` | Paginação (qual página buscar e se ainda há mais) |
| `search` | Texto do campo de busca |
| `duelists` / `duelOpen` | Pokémon escolhidos para o duelo e se a arena está aberta |
| `detail` | Pokémon exibido no card ampliado |

### `useEffect` + `fetch`
Sempre que o `offset` muda (0, 20, 40, ...), o efeito busca uma página da lista e, em seguida, os detalhes de cada Pokémon **em paralelo** com `Promise.all`:

```js
useEffect(() => {
  async function fetchPokemons() {
    const response = await fetch(`${API_URL}?limit=20&offset=${offset}`)
    const data = await response.json()

    const details = await Promise.all(
      data.results.map((pokemon) => fetch(`${API_URL}/${pokemon.name}`).then((r) => r.json()))
    )
    // ...transforma e adiciona ao estado `pokemons`
  }
  fetchPokemons()
}, [offset])
```

Outros usos de `useEffect` no projeto:
- **Scroll infinito** com `IntersectionObserver`, que detecta quando o fim da lista aparece na tela.
- **Card ampliado:** busca os dados da espécie (`/pokemon-species`) quando é aberto.
- **Duelo:** timer que avança as mensagens e efeito de "digitação" do texto.
- **Atalhos de teclado** (`Esc`, `Enter`...), com remoção do listener na limpeza do efeito.

---

## Endpoints da PokeAPI utilizados

| Endpoint | Uso |
|---|---|
| `GET https://pokeapi.co/api/v2/pokemon?limit=20&offset={n}` | Lista paginada de Pokémon |
| `GET https://pokeapi.co/api/v2/pokemon/{id_ou_nome}` | Detalhes: imagens, tipos, stats, altura, peso, habilidades, grito |
| `GET https://pokeapi.co/api/v2/pokemon-species/{id}` | Descrição, categoria, habitat, geração, taxa de captura, lendário/mítico |

A PokeAPI é pública e não exige chave de acesso.

---

## Como funciona o duelo

A lógica fica em `src/utils/battle.js` e `src/utils/types.js`, separada dos componentes.

1. **Quem ataca primeiro:** o Pokémon com maior **Velocidade**. Em caso de empate, é sorteado.
2. **Golpe:** cada Pokémon usa o golpe do seu tipo mais eficaz contra o oponente (ex.: Fogo → *EMBER*, Água → *WATER GUN*).
3. **HP:** calculado para o nível 50 (`HP base + 60`).
4. **Dano:** fórmula simplificada dos jogos clássicos:

   ```
   dano = ((22 × 40 × Ataque / Defesa) / 50 + 2) × STAB × Efetividade × Crítico × Aleatório
   ```

   - **Ataque/Defesa:** usa o físico ou o especial, o que for maior para o atacante.
   - **STAB:** ×1.5, bônus por usar golpe do próprio tipo.
   - **Efetividade:** tabela completa dos 18 tipos (×2, ×0.5, ×0, e combinações como ×4).
   - **Crítico:** 1 chance em 16 de causar ×1.5.
   - **Aleatório:** variação entre 85% e 100%.
5. **Fim:** vence quem zerar o HP do oponente. Se a luta passar de 40 turnos (por exemplo, dois Pokémon imunes um ao outro), vence quem tiver mais % de HP restante.

---

## Deploy (GitHub Pages)

O site é publicado automaticamente no GitHub Pages a cada `push` na branch `main`, pelo workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Instala as dependências (`npm ci`) e gera o build (`npm run build`).
2. Publica a pasta `dist/` no GitHub Pages.

Como o site fica em `https://andrade-gabriel13.github.io/poke_repo/` (e não na raiz do domínio), o `vite.config.js` define `base: '/poke_repo/'` para o build. Em desenvolvimento (`npm run dev`) continua na raiz.

**Configuração (feita uma única vez):** no repositório do GitHub, em *Settings → Pages → Build and deployment → Source*, selecione **GitHub Actions**.

O andamento de cada publicação aparece na aba **Actions** do repositório.

---

## Estrutura do projeto

```
poke_repo/
├── .github/workflows/
│   └── deploy.yml           # build + publicação no GitHub Pages
├── index.html               # página base (fontes e título)
├── package.json
├── vite.config.js           # inclui o caminho base do GitHub Pages
├── eslint.config.js
└── src/
    ├── main.jsx             # ponto de entrada do React
    ├── App.jsx              # renderiza a Pokédex
    ├── index.css            # todos os estilos (tema, cards, card ampliado, Game Boy)
    ├── components/
    │   ├── Pokedex.jsx      # componente principal: busca dados, paginação, busca, estados
    │   ├── PokemonCard.jsx  # card reutilizável de cada Pokémon
    │   ├── PokemonDetail.jsx# card ampliado com informações detalhadas
    │   ├── DuelBar.jsx      # barra inferior com os 2 Pokémon escolhidos
    │   ├── Duel.jsx         # batalha: roteiro de mensagens, HP, animações, controles
    │   └── GameBoy.jsx      # carcaça do Game Boy (tela, botões, filtro de cores)
    └── utils/
        ├── types.js         # nomes dos tipos em PT, tabela de efetividade, golpes
        └── battle.js        # simulação da batalha
```

---

## Tecnologias

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [PokeAPI](https://pokeapi.co/)
- CSS puro, sem bibliotecas de UI
- Fontes: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) e [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts)

---

## Créditos

- Dados, imagens e sons: [PokeAPI](https://pokeapi.co/) e [PokeAPI/sprites](https://github.com/PokeAPI/sprites).
- Pokémon e seus nomes são marcas de Nintendo, Game Freak e The Pokémon Company. Projeto feito apenas para fins educacionais, sem fins comerciais.

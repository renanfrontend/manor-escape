# Manor Escape

[![CI](https://github.com/renanfrontend/manor-escape/actions/workflows/ci.yml/badge.svg)](https://github.com/renanfrontend/manor-escape/actions/workflows/ci.yml)

**Demo:** https://renanfrontend.github.io/manor-escape/

> © 2026 Renan Augusto dos Santos. **Todos os direitos reservados.** Código público apenas para avaliação de portfólio: copiar, adaptar ou reutilizar exige autorização por escrito. Veja [Licença e direitos autorais](#licença-e-direitos-autorais).

![Enigma do relógio de pêndulo no Manor Escape, com o mostrador em algarismos romanos, o ajuste de horas e minutos e o botão de dica](docs/screenshot.png)

Um escape room vitoriano jogável no navegador. Três cômodos da Mansão Blackwood, quatro enigmas encadeados, um cofre em 3D e trinta minutos no relógio.

Projeto de estudo: React 19 + TypeScript estrito, orquestração de fluxo com XState, estado de UI com Zustand, animações com Framer Motion, cena 3D com react-three-fiber e testes com Vitest + Playwright, organizado em Clean Architecture.

## Como jogar

1. **Saguão:** inspecione o retrato, ajuste o relógio de pêndulo para o horário certo e vasculhe o vaso.
2. **Biblioteca:** reordene os volumes na ordem em que foram escritos, decifre a carta (cifra de César) e encontre a chave de ferro.
3. **Escritório:** leia a página rasgada, monte a combinação no cofre 3D e saia pela porta dos fundos.

Cada dica custa 60 segundos. São 3 por partida. O progresso é salvo automaticamente: recarregar a página não zera a fuga.

## Stack

| Camada | Tecnologia | Papel |
| --- | --- | --- |
| Build | Vite 8 + TypeScript 6 (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) | Bundle, aliases `@/`, code-splitting do chunk `three` |
| UI | React 19, Tailwind CSS 4, Framer Motion | Componentes, tema, transições entre salas, `Reorder` da estante |
| Fluxo do jogo | XState 5 (`setup` tipado, guards/actions com params, actor `fromCallback` para o timer) | Máquina `idle → playing(exploring ⇄ solving) → won \| lost` |
| Estado de UI | Zustand + `persist` | Toasts, item inspecionado, preferências, melhor tempo |
| 3D | three.js + @react-three/fiber | Cofre com disco arrastável (`useFrame`, `CanvasTexture`, pointer capture) |
| Testes | Vitest + Testing Library, Playwright | Validadores, máquina de estados, componente; walkthrough E2E completo |

## Arquitetura

```
src/
├─ domain/           # Regras puras, zero dependência de framework
│  ├─ entities/      # Ids, Item, Puzzle (union discriminada), Room/Hotspot
│  ├─ puzzles/       # Definições dos enigmas + validateAnswer<P extends Puzzle>
│  ├─ rooms/         # Definições dos cômodos e hotspots
│  └─ services/      # caesar, normalizeAnswer
├─ application/      # Casos de uso e orquestração
│  ├─ machine/       # gameMachine (XState) + GameProvider (persistência de snapshot)
│  ├─ store/         # createUiStore (Zustand) — recebe o port de storage
│  └─ ports/         # KeyValueStorage (interface)
├─ infrastructure/   # Adapters: localStorage / memória
├─ presentation/     # React: screens, components, rooms, puzzles, three
└─ composition.ts    # Composition root — único ponto que liga ports a adapters
```

Decisões que valem a leitura:

- `domain/puzzles/validators.ts`: `validateAnswer<P extends Puzzle>(puzzle: P, answer: AnswerOf<P>)`. O tipo da resposta é inferido do enigma, então passar a resposta errada para o enigma errado não compila.
- `application/machine/gameMachine.ts`: guards e actions recebem `params` tipados; o timer é um actor invocado apenas no estado `playing`, então pausar/encerrar é gratuito.
- `presentation/puzzles/PuzzleModal.tsx`: `switch` exaustivo sobre `puzzle.kind`; adicionar um tipo de enigma quebra o build até a view existir.
- `presentation/hooks/useHotspotAction.ts`: handlers leem `actor.getSnapshot()` no clique, nunca uma closure de render.

## Rodando localmente

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | O que faz |
| --- | --- |
| `npm run build` | `tsc -b && vite build` |
| `npm run preview` | Serve `dist` em `:4173` |
| `npm run typecheck` | App + testes |
| `npm run lint` | oxlint |
| `npm test` | Vitest |
| `npm run test:e2e` | Playwright (usa build + preview) |

Para o E2E com um Chromium já instalado: `PW_CHROMIUM_PATH=/caminho/para/chromium npm run test:e2e`. Caso contrário, `npx playwright install chromium` uma vez.

## Deploy

O workflow em `.github/workflows/ci.yml` roda typecheck, lint, testes unitários e E2E em cada push/PR, e publica a build no GitHub Pages a partir da `main` (`VITE_BASE_PATH` é definido automaticamente com o nome do repositório).

## Autoria

Concepção, narrativa, enigmas, interface, cena 3D do cofre e textos por **Renan Augusto dos Santos** ([renanaugusto.com.br](https://renanaugusto.com.br) · [contato@renanaugusto.com.br](mailto:contato@renanaugusto.com.br)). A Mansão Blackwood e seus personagens são fictícios. As fontes Cormorant Garamond e IBM Plex Sans (SIL Open Font License) vêm do Google Fonts.

## Licença e direitos autorais

© 2026 Renan Augusto dos Santos. **Todos os direitos reservados.**

Este não é um projeto open source. O código está público apenas para fins de portfólio e avaliação profissional. Sem autorização por escrito, não é permitido:

- copiar, modificar, redistribuir ou usar comercialmente o projeto, no todo ou em parte;
- reescrever o projeto em outra stack a partir deste repositório, ou reutilizar a narrativa, os enigmas, a interface e a cena 3D;
- apresentar o projeto, ou parte dele, como trabalho próprio em portfólios, processos seletivos ou propostas comerciais;
- usar o conteúdo do repositório ou da demo para treinar ou avaliar modelos de IA.

Os termos completos estão em [LICENSE](LICENSE). Dependências e fontes mantêm suas próprias licenças. Versões anteriores do repositório foram publicadas sob a licença MIT, e quem obteve uma cópia naquela época mantém os direitos daquela versão. Pedidos de autorização: [contato@renanaugusto.com.br](mailto:contato@renanaugusto.com.br).

---

## 🇺🇸 English

Manor Escape is a Victorian escape room you play in the browser, by **Renan Augusto dos Santos**: three rooms of Blackwood Manor, four chained puzzles, a 3D safe and thirty minutes on the clock. Built with React 19, strict TypeScript, XState 5, Zustand, Framer Motion, react-three-fiber, Vitest and Playwright, organized in Clean Architecture. Each hint costs 60 seconds and progress is saved automatically.

© 2026 Renan Augusto dos Santos. All rights reserved. This is not open source. The source is public for portfolio evaluation only; copying, modifying, porting, redistributing, commercial use, presenting it as your own work or using it to train AI models requires written permission. See [LICENSE](LICENSE). Earlier versions were released under the MIT license and remain so for anyone who obtained them at the time. Contact: [contato@renanaugusto.com.br](mailto:contato@renanaugusto.com.br) · [renanaugusto.com.br](https://renanaugusto.com.br).

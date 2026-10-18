# EatMate 🥗

**Diário alimentar simples, com termômetro da qualidade da alimentação e relatórios semanais.**

A pessoa registra o que comeu (na hora ou depois), do jeito que falaria — _"tomei café com leite e comi 2 torradas"_ — e o EatMate separa os alimentos sozinho. Depois de 7 dias de registros aparece um **termômetro** com a nota da alimentação, numa escala **A–E** inspirada no Nutri-Score. Tocando nele, abre o **relatório completo**, que pode ser copiado para uma IA (ChatGPT, Gemini, Claude…) pedir sugestões, salvo em PDF para o nutricionista ou compartilhado pelo WhatsApp.

Sem contar calorias, sem cadastro e sem servidor: **os dados ficam só no aparelho da pessoa**.

|                                         Início                                          |                                            Registro                                            |                                   Relatório                                    |                                   Histórico                                    |
| :-------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
| <img src="docs/screenshots/inicio.png" width="200" alt="Tela inicial com o termômetro"> | <img src="docs/screenshots/registro.png" width="200" alt="Registro de refeição com sugestões"> | <img src="docs/screenshots/relatorio.png" width="200" alt="Relatório semanal"> | <img src="docs/screenshots/historico.png" width="200" alt="Histórico de dias"> |

## Telas

1. **Boas-vindas** — aparece só na primeira vez: a pessoa diz como quer ser chamada.
2. **Início (painel)** — botão grande para registrar refeição, termômetro da alimentação (liberado após 7 dias com registro), refeições de hoje, sequência de dias seguidos e dica do dia.
3. **Registrar refeição** — data (dá para registrar dias anteriores), horário, tipo de refeição (café da manhã, lanche da manhã, almoço, café da tarde, jantar, ceia), alimentos com quantidade opcional e observações.
   - Entende frases inteiras: _"arroz, feijão, bife acebolado e um copo de suco de laranja"_.
   - Sugere alimentos enquanto a pessoa digita, mostrando a nota de cada um (A–E).
   - Mostra os alimentos que a pessoa costuma comer naquela refeição.
   - Alimento que o app não conhece? A pessoa escolhe a categoria uma vez e ele passa a ser reconhecido.
4. **Histórico** — dias registrados (com busca por alimento), nota de cada dia; dá para editar ou excluir qualquer refeição, ou o dia inteiro.
5. **Relatório** — aberto pelo termômetro: nota de 0 a 100 e letra A–E, como a nota foi calculada, pontos positivos e de atenção, marcadores de consumo, qualidade e grau de processamento dos alimentos, grupos alimentares, regularidade das refeições, alimentos mais frequentes, nota dia a dia e o diário alimentar completo. Botões para **copiar para uma IA**, **PDF/imprimir**, compartilhar, copiar texto e baixar o arquivo.
6. **Histórico de relatórios** — a cada semana encerrada um relatório é salvo automaticamente (Semana 1, Semana 2…). Se a pessoa corrigir algum dia depois, o relatório aparece como **desatualizado** e pode ser **gerado novamente**. Também dá para excluir relatórios ou gerar um relatório de qualquer período de 7 dias.

E mais: tela de **Perfil** (nome, tema claro/escuro, instalar o app, backup e restauração, alimentos personalizados, explicação da nota e apagar dados) e um **relatório de exemplo** para mostrar como vai ficar antes de completar os 7 dias.

## Como a nota é calculada

A base tem **280 alimentos** do dia a dia brasileiro, reconhecidos por mais de **1.100 nomes e apelidos** ("aipim", "macaxeira", "x-tudo", "cafezinho"…). Cada alimento tem:

- uma **nota de A a E**, estimada a partir da lógica do [Nutri-Score](https://www.santepubliquefrance.fr/en/nutri-score) (açúcar, gordura saturada, sal e calorias pesam contra; fibras, proteínas, frutas, verduras e leguminosas pesam a favor);
- o **grau de processamento** da classificação NOVA, usada no [Guia Alimentar para a População Brasileira](https://www.gov.br/saude/pt-br/assuntos/saude-brasil/publicacoes-para-promocao-a-saude/guia_alimentar_populacao_brasileira_2ed.pdf) (in natura, ingredientes culinários, processados e ultraprocessados).

A nota da semana vai de 0 a 100:

| Critério                                                       | Peso |
| -------------------------------------------------------------- | ---- |
| Qualidade nutricional (média das notas dos alimentos)          | 40%  |
| Grau de processamento (mais in natura, menos ultraprocessados) | 20%  |
| Frutas, verduras e legumes (meta: 5 porções por dia)           | 20%  |
| Variedade de alimentos de boa qualidade                        | 10%  |
| Regularidade do café da manhã, almoço e jantar                 | 10%  |

E vira letra: **A** ≥ 85, **B** ≥ 70, **C** ≥ 55, **D** ≥ 40 e **E** abaixo disso. O relatório também traz os **marcadores de consumo** do formulário do SISVAN (Ministério da Saúde): feijão, frutas, verduras, embutidos, bebidas adoçadas, salgadinhos/macarrão instantâneo e doces.

> ⚠️ As notas são estimativas para ajudar a perceber padrões. O EatMate não substitui a orientação de um(a) nutricionista.

O código da pontuação está em [`src/domain/scoring.ts`](src/domain/scoring.ts) e a base de alimentos em [`src/domain/foods.ts`](src/domain/foods.ts) — uma linha por alimento, fácil de corrigir ou ampliar.

## Usando no celular

O EatMate é um **PWA** (aplicativo web instalável): abre no navegador e pode ser instalado na tela inicial, funcionando até sem internet.

- **Android (Chrome):** menu ⋮ → _Instalar app_ (ou pelo botão em Perfil → Instalar o app).
- **iPhone (Safari):** botão Compartilhar → _Adicionar à Tela de Início_.

Como os dados ficam no aparelho, use **Perfil → Exportar backup** de vez em quando (e **Importar backup** para levar tudo para outro celular).

## Rodando no computador

Requisitos: [Node.js](https://nodejs.org/) 22 ou mais novo.

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

Outros comandos:

| Comando                                                 | O que faz                                                                                                   |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm run build`                                         | gera a versão final em `dist/`                                                                              |
| `npm run preview`                                       | serve a versão final localmente                                                                             |
| `npm test`                                              | testes unitários (Vitest)                                                                                   |
| `npm run test:e2e`                                      | testes de ponta a ponta no navegador (Playwright) — na primeira vez, rode `npx playwright install chromium` |
| `npm run lint` / `npm run typecheck` / `npm run format` | qualidade do código                                                                                         |
| `npm run icons`                                         | gera os ícones PNG a partir do desenho em SVG                                                               |
| `SCREENSHOTS_DIR=./capturas npm run screenshots`        | tira capturas de todas as telas com dados de exemplo                                                        |

## Publicando (GitHub Pages)

O repositório já vem com o workflow [`deploy.yml`](.github/workflows/deploy.yml), que publica o app a cada push na branch `main`. Só é preciso ativar uma vez:

1. Confira se a branch padrão é a `main` (**Settings → General → Default branch**). O ambiente de publicação do Pages só aceita a branch padrão.
2. Abra **Settings → Pages** e, em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Rode o workflow em **Actions → Publicar no GitHub Pages → Run workflow** (depois disso, cada push na `main` publica sozinho).

Enquanto o Pages não estiver ativado, o workflow não falha: ele só pula a publicação e deixa um aviso.

O endereço fica parecido com `https://<seu-usuario>.github.io/EatMate/`. Como o app usa caminhos relativos e rotas com `#`, ele também funciona em qualquer outra hospedagem de arquivos estáticos (Netlify, Vercel, Cloudflare Pages…) — basta publicar a pasta `dist/`.

O workflow [`ci.yml`](.github/workflows/ci.yml) roda formatação, lint, tipos, testes unitários, build e os testes no navegador a cada push.

## Como o projeto está organizado

```
src/
├── domain/        regras do app, sem interface (fáceis de testar)
│   ├── foods.ts       base de alimentos (nota A–E, NOVA, grupo, apelidos)
│   ├── parser.ts      entende o texto digitado ("2 fatias de pão…")
│   ├── scoring.ts     nota de 0 a 100 e letra A–E
│   ├── report.ts      monta o relatório (marcadores, grupos, diário…)
│   ├── insights.ts    pontos positivos e de atenção
│   ├── periods.ts     semanas, relatórios automáticos, "desatualizado"
│   └── exportText.ts  relatório em texto (Markdown) e pedido para a IA
├── data/          banco local (IndexedDB via Dexie), backup e relatórios salvos
├── components/    peças da interface (termômetro, escala A–E, relatório…)
├── screens/       as telas do app
└── styles/        visual (tema claro e escuro, impressão/PDF)
e2e/               testes de ponta a ponta (Playwright)
```

Tecnologias: React 19, TypeScript, Vite, React Router, Dexie (IndexedDB), vite-plugin-pwa, Vitest e Playwright.

## Ideias para próximas versões

- Sincronizar entre aparelhos (com conta opcional).
- Integração direta com uma IA (por exemplo, a API do Claude) para gerar sugestões dentro do app.
- Lembretes de registro nos horários das refeições.
- Registro de água e de como a pessoa se sentiu após comer.
- Escanear código de barras de produtos (Open Food Facts) para usar o Nutri-Score oficial do produto.

## Privacidade

O EatMate não tem servidor, não coleta dados e não usa rastreadores. Tudo o que a pessoa registra fica no armazenamento do próprio navegador/aparelho. O relatório só sai do aparelho quando a própria pessoa copia, compartilha ou exporta.

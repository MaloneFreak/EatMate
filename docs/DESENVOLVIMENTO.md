# EatMate — guia de desenvolvimento

O EatMate é um **PWA** (aplicativo web instalável) sem servidor: React 19, TypeScript, Vite, React Router, Dexie (IndexedDB), vite-plugin-pwa, Vitest e Playwright. Os dados ficam no navegador de cada pessoa.

## Rodando no computador

Requisitos: [Node.js](https://nodejs.org/) 22 ou mais novo.

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

| Comando                                                                         | O que faz                                                                                                    |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm run build`                                                                 | gera a versão final em `dist/`                                                                               |
| `npm run preview`                                                               | serve a versão final localmente                                                                              |
| `npm test`                                                                      | testes unitários (Vitest)                                                                                    |
| `npm run test:e2e`                                                              | testes de ponta a ponta no navegador (Playwright) — na primeira vez, rode `npx playwright install chromium`  |
| `npm run lint` / `npm run typecheck` / `npm run format`                         | qualidade do código                                                                                          |
| `npm run icons`                                                                 | gera os ícones PNG a partir do desenho em SVG                                                                |
| `SCREENSHOTS_DIR=./capturas npm run screenshots`                                | tira capturas de todas as telas com dados de exemplo                                                         |
| `README_SHOTS_DIR=docs/screenshots/en README_SHOTS_LANG=en npm run screenshots` | refaz as 4 capturas do README (início, registro, relatório e histórico) em inglês (`en`) ou português (`pt`) |

## Como o projeto está organizado

```
src/
├── domain/            regras do app, sem interface (fáceis de testar)
│   ├── foods.ts           base de alimentos (nota A–E, NOVA, grupo, apelidos em português)
│   ├── foodNames/         nomes e apelidos dos alimentos em en, es, de, fr e it, e os nomes internacionais
│   ├── lang/              regras de cada idioma para entender o texto (plural, números, unidades…)
│   ├── parser.ts          entende o texto digitado ("2 fatias de pão…", "a cup of coffee…")
│   ├── scoring.ts         nota de 0 a 100 e letra A–E
│   ├── report.ts          monta o relatório (marcadores, grupos, diário…)
│   ├── insights.ts        pontos positivos e de atenção (como chaves; o texto vem das mensagens)
│   ├── periods.ts         semanas, relatórios automáticos, "desatualizado"
│   └── exportText.ts      relatório em texto (Markdown) e pedido para a IA
├── i18n/              idiomas da interface
│   ├── messages/          textos de cada idioma (pt.ts é a referência; os outros seguem o mesmo tipo)
│   ├── format.ts          datas e números no formato de cada país (Intl)
│   └── I18nProvider.tsx   idioma escolhido (Perfil → Idioma) ou o do aparelho
├── data/              banco local (IndexedDB via Dexie), backup e relatórios salvos
├── components/        peças da interface (termômetro, escala A–E, relatório…)
├── screens/           as telas do app
└── styles/            visual (tema claro e escuro, impressão/PDF)
e2e/                   testes de ponta a ponta (Playwright), em português e em outros idiomas
```

## Idiomas

- **Textos da interface:** `src/i18n/messages/pt.ts` define todos os textos. Cada idioma (`en.ts`, `es.ts`…) tem exatamente a mesma estrutura — o TypeScript avisa se faltar algum texto. Para incluir um idioma novo, crie o arquivo de mensagens, as regras em `src/domain/lang/`, a tabela de alimentos em `src/domain/foodNames/` e adicione o código em `src/domain/language.ts` e `src/i18n/languages.ts`.
- **Alimentos:** a nota, o grupo e o grau de processamento ficam em `foods.ts` (um só lugar). Cada idioma só traduz os nomes (`foodNames/<idioma>.ts`: `id → [nome, apelidos…]`). Os testes conferem se todos os alimentos foram traduzidos e se nenhum nome aparece em dois alimentos diferentes.
- **Nomes internacionais:** `foodNames/international.ts` guarda os nomes escritos do mesmo jeito em vários idiomas ("burrata", "quark", "ramen", "tiramisu", marcas…). Eles valem em todos os idiomas, depois da tabela do idioma: se a palavra já tem outro sentido ali ("latte" é leite em italiano; "feta" é fatia na Argentina), vale o do idioma. Nomes comuns em algum idioma ("pasta", "toast", "empanada"…) ficam só nas tabelas de cada idioma.
- **Relatórios salvos** guardam números e chaves, não frases. Por isso, trocar o idioma muda também os relatórios antigos. Relatórios da versão 1 (que guardavam o texto em português) são gerados novamente no formato novo ao abrir o app ou ao importar um backup.

## Onde os dados ficam

- **Banco principal:** IndexedDB (via Dexie), em `src/data/db.ts` e `src/data/repo.ts`.
- **Cópia de segurança automática:** `src/data/mirror.ts` guarda no `localStorage` cada refeição, alimento personalizado, perfil e configuração, **antes** de gravar no banco. Em alguns aparelhos (Safari no iPhone) o IndexedDB às vezes demora ou deixa de confirmar uma gravação; se o app recarregasse nessa hora, o registro se perderia. Ao abrir o app (e ao voltar para ele), `syncWithMirror` repõe no banco o que estiver faltando e copia para o `localStorage` o que só existe no banco. Relatórios não entram na cópia: são gerados de novo a partir das refeições.
- **Backup na nuvem:** `src/lib/saveBackup.ts` manda o arquivo de backup pelo menu de compartilhar do celular (Web Share com arquivos), de onde a pessoa escolhe Google Drive, iCloud etc.; sem esse menu (computador), o arquivo é baixado. O Chrome não compartilha arquivos JSON, então lá o mesmo conteúdo vai como `.txt` (a importação aceita os dois). O arquivo é montado com os dados já carregados na tela, porque o iPhone só abre o menu logo depois do toque.
- **Lembrete de backup:** `src/domain/backupReminder.ts` decide quando a tela inicial mostra o lembrete: há registros novos desde o último backup e já passou 1 dia (diário) ou 7 dias (semanal, o padrão) do calendário. Não há notificações: notificações com o app fechado exigiriam um servidor de push.
- **Gravações não travam a tela:** cada gravação espera a confirmação do banco por no máximo 1,5 s (`writeOptions.timeoutMs`); se demorar mais, o registro já está garantido na cópia local. Se o banco recusar a gravação, a cópia é desfeita e a tela mostra o erro.

## Como a nota é calculada

A base tem **296 alimentos** reconhecidos por mais de **2.200 nomes e apelidos** em português (e tabelas equivalentes nos outros idiomas). Cada alimento tem:

- uma **nota de A a E**, estimada a partir da lógica do [Nutri-Score](https://www.santepubliquefrance.fr/en/nutri-score) (açúcar, gordura saturada, sal e calorias pesam contra; fibras, proteínas, frutas, verduras e leguminosas pesam a favor);
- o **grau de processamento** da classificação NOVA, usada no [Guia Alimentar para a População Brasileira](https://www.gov.br/saude/pt-br/assuntos/saude-brasil/publicacoes-para-promocao-a-saude/guia_alimentar_populacao_brasileira_2ed.pdf).

| Critério                                                       | Peso |
| -------------------------------------------------------------- | ---- |
| Qualidade nutricional (média das notas dos alimentos)          | 40%  |
| Grau de processamento (mais in natura, menos ultraprocessados) | 20%  |
| Frutas, verduras e legumes (meta: 5 porções por dia)           | 20%  |
| Variedade de alimentos de boa qualidade                        | 10%  |
| Regularidade do café da manhã, almoço e jantar                 | 10%  |

Letras: **A** ≥ 85, **B** ≥ 70, **C** ≥ 55, **D** ≥ 40 e **E** abaixo disso. O relatório também traz os **marcadores de consumo** do formulário do SISVAN (Ministério da Saúde). O código está em [`src/domain/scoring.ts`](../src/domain/scoring.ts).

## Publicando o site (GitHub Pages)

O workflow [`deploy.yml`](../.github/workflows/deploy.yml) publica o app a cada push na branch `main`. Para funcionar:

1. A branch padrão do repositório deve ser a `main` (**Settings → General → Default branch**). O ambiente `github-pages` só aceita publicar a partir das branches liberadas em **Settings → Environments → github-pages**.
2. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions**.
3. Para publicar na hora: **Actions → Publicar no GitHub Pages → Run workflow**.

Enquanto o Pages não estiver ativado, o workflow não falha: ele só pula a publicação e deixa um aviso. Como o app usa caminhos relativos e rotas com `#`, ele também funciona em qualquer hospedagem de arquivos estáticos (Netlify, Vercel, Cloudflare Pages…) — basta publicar a pasta `dist/`.

O workflow [`ci.yml`](../.github/workflows/ci.yml) roda formatação, lint, tipos, testes unitários, build e os testes no navegador a cada push.

## Criando uma nova versão (Release)

1. Atualize `version` no `package.json` (ex.: `1.1.0`) e escreva as novidades no topo do [`CHANGELOG.md`](../CHANGELOG.md), numa seção `## [1.1.0] - AAAA-MM-DD`.
2. Depois que isso estiver na `main`, crie a versão de um destes jeitos:
   - **Pelo site do GitHub:** **Actions → Criar versão (Release) → Run workflow** e informe a versão (`1.1.0`); ou
   - **Pelo terminal:** `git tag v1.1.0 && git push origin v1.1.0`.
3. O workflow [`release.yml`](../.github/workflows/release.yml) roda os testes, gera o build, anexa o arquivo `eatmate-web-v1.1.0.zip` (para quem quiser hospedar o app em outro lugar) e publica a Release com as notas do `CHANGELOG.md`.

Quem já usa o app recebe a atualização sozinho: o EatMate mostra o aviso "Nova versão disponível".

## Ideias para próximas versões

- Sincronizar entre aparelhos (com conta opcional).
- Integração direta com uma IA (por exemplo, a API do Claude) para gerar sugestões dentro do app.
- Lembretes de registro nos horários das refeições.
- Registro de água e de como a pessoa se sentiu após comer.
- Escanear código de barras de produtos (Open Food Facts) para usar o Nutri-Score oficial do produto.

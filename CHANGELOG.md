# Histórico de mudanças

Todas as mudanças importantes do EatMate ficam registradas aqui. As versões seguem o [versionamento semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2026-10-25

### Melhorias

- **O app abre mais rápido.** A primeira abertura baixa só o idioma escolhido, não os seis; relatórios e perfil são baixados quando abertos pela primeira vez. As bibliotecas ficam num arquivo à parte, que continua em cache entre as versões. Tudo segue funcionando sem internet.
- **Telas estreitas:** a escala de notas do relatório não passa mais da borda em celulares de 320 px, a data do registro não fica cortada (a hora desce para a linha de baixo), e títulos e rótulos da barra de navegação se ajustam à largura da tela.
- Campos em foco não ficam escondidos atrás da barra de navegação.
- O app instalado pode girar para a horizontal (tablets e Chromebooks).

### Segurança

- **Backup importado com limites:** arquivos acima de 20 MB ou com registros demais são recusados antes de travar o aparelho; nomes, observações e apelidos longos são cortados; marcações desconhecidas e campos extras são descartados.
- **Cópia de segurança local sem estourar:** quando o armazenamento do navegador enche, a cópia passa a guardar só os últimos 60 dias, em vez de parar de proteger os registros.
- Política de segurança de conteúdo (CSP): o app só carrega scripts, estilos, fontes e imagens do próprio site.
- O app não abre dentro de um iframe de outro site (proteção contra clickjacking).
- As GitHub Actions ficam fixadas pelo SHA do commit, o CI verifica vulnerabilidades conhecidas nas dependências e o Dependabot mantém tudo atualizado.

## [1.0.2] - 2026-10-18

### Correções

- **Seus registros não se perdem mais.** Em alguns celulares (principalmente iPhone), o armazenamento do navegador às vezes demorava ou deixava de confirmar uma gravação; se o app recarregasse nessa hora (por exemplo, numa atualização), o registro sumia. Agora cada alteração é guardada também numa cópia de segurança automática no aparelho, e ao abrir o app tudo o que estiver faltando é reposto. Atualizar o app nunca apaga o histórico.
- **Salvar só volta para o início com a refeição guardada.** A versão 1.0.1 voltava antes de a gravação terminar; agora o app espera a confirmação (no máximo um instante, já que a cópia de segurança garante o registro) e, se der erro, avisa e mantém você no formulário.

## [1.0.1] - 2026-10-18

### Correções

- **Salvar uma refeição volta para a tela anterior na hora**, e o aviso "Alterações salvas!" aparece assim que a gravação termina. Antes, em alguns celulares, o app ficava parado no formulário e o aviso só aparecia depois de voltar manualmente. O mesmo vale para excluir uma refeição, um dia ou um relatório.
- O botão de voltar não fica mais parado quando o app instalado é reaberto direto em uma tela: ele leva para o início.
- A setinha do seletor de idioma ficou alinhada, um pouco mais para dentro.

## [1.0.0] - 2026-10-18

Primeira versão do EatMate. 🎉

### Novidades

- **Registro de refeições do seu jeito:** escreva frases inteiras como _"tomei café com leite e comi 2 torradas"_ e o app separa os alimentos, com sugestões enquanto você digita, quantidades e observações. Dá para registrar na hora ou em dias anteriores.
- **Café da manhã, lanche da manhã, almoço, café da tarde, jantar e ceia**, com o horário sugerido automaticamente.
- **Termômetro da alimentação:** depois de 7 dias com registro, a tela inicial mostra a nota da semana (0 a 100) e a letra de **A a E**, no estilo do Nutri-Score.
- **Relatório completo:** como a nota foi calculada, pontos positivos e de atenção, marcadores de consumo, qualidade e grau de processamento dos alimentos, grupos alimentares, regularidade das refeições, alimentos mais frequentes, nota dia a dia e o diário completo.
- **Use o relatório onde quiser:** copiar para uma IA (ChatGPT, Gemini, Claude…), salvar em PDF para o nutricionista, compartilhar pelo WhatsApp ou baixar o arquivo.
- **Histórico de dias:** veja, edite ou exclua qualquer refeição ou o dia inteiro, com busca por alimento.
- **Histórico de relatórios:** um relatório é salvo automaticamente a cada semana. Se você corrigir algum dia depois, ele aparece como desatualizado e pode ser gerado de novo.
- **6 idiomas:** português, inglês, espanhol, alemão, francês e italiano — na interface, nos relatórios e no reconhecimento dos alimentos. O app abre no idioma do aparelho e pode ser trocado em **Perfil → Idioma**.
- **Funciona como aplicativo:** dá para instalar na tela inicial do celular e usar sem internet.
- **Privacidade:** sem cadastro e sem servidor — os dados ficam só no seu aparelho. Backup e restauração para trocar de celular.
- Tema claro e escuro, alimentos personalizados e um relatório de exemplo para ver como tudo funciona antes dos 7 dias.

[1.1.0]: https://github.com/MaloneFreak/EatMate/releases/tag/v1.1.0
[1.0.2]: https://github.com/MaloneFreak/EatMate/releases/tag/v1.0.2
[1.0.1]: https://github.com/MaloneFreak/EatMate/releases/tag/v1.0.1
[1.0.0]: https://github.com/MaloneFreak/EatMate/releases/tag/v1.0.0

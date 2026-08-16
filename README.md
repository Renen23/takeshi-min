# Renen Bot — versão organizada

Esta versão foi reorganizada para deixar os comandos mais simples, consistentes e fáceis de encontrar. O nome principal de cada comando aparece sem hífens desnecessários; os aliases antigos foram mantidos quando isso não causa conflito, para evitar que comandos já conhecidos deixem de funcionar.

## Estrutura dos comandos

| Categoria | Localização | Função |
|---|---|---|
| Comandos gerais | `src/commands/member` | Menu, ajuda, ping e identificador |
| Administração | `src/commands/admin` | Gestão do grupo, links, avisos e moderação |
| Dono do bot | `src/commands/owner` | Prefixo e membros autorizados |

## Comandos principais

| Comando | Utilização |
|---|---|
| Menu | `/menu` |
| Ajuda | `/help` ou `/help nome-do-comando` |
| Lista de grupos | `/listagrupo` |
| Anti-link | `/antilink 1` ou `/antilink 0` |
| Limpar chat | `/limparchat` |
| Link do grupo | `/linkgrupo` |
| Alterar nome | `/setname novo nome` |
| Alterar prefixo | `/setprefix !` |
| Meu LID | `/meulid` |

## Instalação

Execute `npm install` dentro da pasta do projeto e, depois, utilize `npm start` para iniciar o bot. A autenticação do WhatsApp continua a ser feita pelo fluxo original do projeto.

## Observações

O WhatsApp não permite alterar a cor real das letras numa mensagem comum. A identidade verde foi aplicada por meio de símbolos, títulos e separadores, mantendo a leitura organizada em telemóveis.

**Projeto organizado para Renen.**

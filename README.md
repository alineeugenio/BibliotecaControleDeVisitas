# Portal do Leitor — Biblioteca escolar

Aplicação web para controle de visitas e incentivo à leitura. Estudantes podem
registrar uma visita, consultar sua pontuação e avaliar livros. A equipe
coordenadora pode gerenciar estudantes e metas de leitura.

> **Importante:** este repositório contém a interface (frontend). Os dados são
> armazenados por uma API hospedada separadamente; não há banco de dados ou
> servidor de API neste projeto.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Instalação e execução](#instalação-e-execução)
- [Como entrar](#como-entrar)
- [Guia do estudante](#guia-do-estudante)
- [Guia da coordenação](#guia-da-coordenação)
- [API e dados](#api-e-dados)
- [Pontuação e identificadores](#pontuação-e-identificadores)
- [Configuração](#configuração)
- [Limitações conhecidas](#limitações-conhecidas)
- [Solução de problemas](#solução-de-problemas)
- [Tecnologias e estrutura](#tecnologias-e-estrutura)

## Funcionalidades

### Estudantes

- Identificação com matrícula e primeiro nome.
- Registro da primeira visita, com bônus de 10 pontos concedido uma única vez.
- Painel com pontuação, posição no ranking e título atual.
- Pesquisa de livros na [Open Library](https://openlibrary.org/).
- Registro de avaliação com nota de 0 a 10 e comentário.
- Histórico individual de livros avaliados.

### Coordenação

- Login administrativo com e-mail e senha cadastrados na API.
- Cadastro e remoção de estudantes.
- Consulta aos detalhes, pontuação, ranking e histórico de cada estudante.
- Cadastro, edição e exclusão de metas de leitura.
- Consulta ao ranking de estudantes na área de frequência.

## Requisitos

- Node.js compatível com Vite 8 (Node.js 20.19+ ou 22.12+ recomendado).
- npm, incluído com Node.js.
- Acesso à internet para consultar a API e a Open Library.

Confira as versões instaladas:

```bash
node --version
npm --version
```

## Instalação e execução

Na pasta do projeto, instale as dependências:

```bash
npm install
```

Inicie o servidor local:

```bash
npm run dev
```

O Vite informa no terminal o endereço local. Neste projeto, a porta padrão é
`8443`; se estiver disponível, abra <http://localhost:8443>.

Para validar a versão de produção:

```bash
npm run build
```

Para servir localmente o resultado compilado:

```bash
npm run preview
```

Para formatar os arquivos com o formatador configurado:

```bash
npm run format
```

## Como entrar

Na tela inicial, selecione o tipo de acesso.

### Login do aluno

1. Selecione **Aluno**.
2. Informe a matrícula cadastrada.
3. Informe o primeiro nome conforme o cadastro. A comparação do primeiro nome
   ignora diferenças entre maiúsculas e minúsculas.
4. Clique em **Entrar e registrar visita**.

O nome precisa corresponder ao primeiro elemento do campo `nome` do cadastro.
Por exemplo, para `Ana Costa`, informe `Ana`. A matrícula é comparada com o
valor cadastrado.

### Login administrativo

1. Selecione **Acesso administrativo**.
2. Informe o e-mail e a senha da conta de coordenação existente na API.
3. Clique em **Acessar metas**.

Este projeto não cria contas de coordenação nem define credenciais padrão.
Solicite à pessoa responsável pela API a criação ou recuperação da conta. Não
coloque senhas reais neste README, no código do frontend ou em commits.

## Guia do estudante

### Registrar uma visita

Depois de entrar, o sistema apresenta a confirmação de acesso. Se ainda não
houver um bônus de boas-vindas registrado para aquele estudante, o sistema tenta
salvar um bônus único de 10 pontos. Visitas seguintes não repetem esse bônus.

Use **Acessar painel** para abrir o painel do estudante. O painel mostra:

- Pontuação total calculada pelo sistema.
- Posição entre os estudantes cadastrados.
- Maior título/meta já alcançado.

### Avaliar e registrar um livro

1. No painel, clique em **Avaliar livros**.
2. Pesquise pelo título, autor ou assunto. Digite pelo menos 3 caracteres; a
   busca retorna até 20 resultados.
3. Escolha um resultado em **Registrar leitura**.
4. Informe uma nota de 0 a 10 e um comentário.
5. Clique em **Adicionar à Minha Biblioteca**.

Uma avaliação salva fica vinculada ao estudante que está conectado, aparece no
histórico e acrescenta 10 pontos. As informações do livro, a avaliação, o
comentário e a data são enviados à API. Capas e resultados vêm da Open Library;
alguns livros podem não ter capa ou autoria informada.

### Consultar livros lidos

No painel, clique em **Livros lidos**. Selecione um cartão para ver os detalhes
da avaliação, incluindo comentário, nota e data quando disponível.

### Sair

Use **Sair** no painel. Isso encerra a sessão local da interface e retorna à
tela de identificação.

## Guia da coordenação

### Gerenciar estudantes

Na área administrativa **Alunos**:

- Preencha nome completo e matrícula e clique em **Cadastrar aluno**.
- Matrículas repetidas são recusadas pela interface.
- O ranking exibe a pontuação calculada. Clique em **Detalhes** ou no nome para
  ver pontos, posição, título e histórico.
- Clique em **Remover** e confirme para remover um estudante.

Quando o estudante tem um `id` persistido, a interface tenta removê-lo pelo
endpoint de estudantes. Para registros legados sem `id`, registra um marcador
de remoção na coleção de livros. A disponibilidade e persistência dessas
operações dependem da API.

### Gerenciar metas

Na área **Metas**:

- Para cadastrar, informe os pontos necessários e o título concedido.
- Para editar, clique em **Editar**, altere os campos e salve.
- Para excluir, clique em **Excluir** e confirme a operação.

O título atual do estudante corresponde à meta de maior pontuação que ele já
alcançou. Se nenhuma meta tiver sido alcançada, o título exibido é
**Iniciante**.

### Consultar frequência e ranking

Na área **Frequência**, use **Ver ranking dos alunos** para abrir ou ocultar o
ranking. O botão **Voltar às metas** retorna à administração de metas.

## API e dados

A aplicação usa atualmente a API:

```text
https://desafio-biblioteca-api.onrender.com
```

Endpoints usados pela interface:

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/estudantes` | Carregar cadastros de estudantes |
| `POST` | `/estudantes` | Cadastrar estudante |
| `DELETE` | `/estudantes/:id` | Remover estudante com ID |
| `GET` | `/livros` | Carregar avaliações, bônus e marcadores |
| `POST` | `/livros` | Salvar avaliação, bônus ou marcador |
| `GET` | `/coordenadores` | Carregar contas usadas no login administrativo |
| `GET` | `/metas` | Carregar metas |
| `POST` | `/metas` | Cadastrar meta |
| `PATCH` | `/metas/:id` | Atualizar meta |
| `DELETE` | `/metas/:id` | Excluir meta |

Exemplo de leitura dos dados:

```bash
curl https://desafio-biblioteca-api.onrender.com/estudantes
curl https://desafio-biblioteca-api.onrender.com/livros
curl https://desafio-biblioteca-api.onrender.com/metas
```

Os registros de livros existentes podem ter apenas `titulo`, `autor`, `nota` e
`id_aluno`. Registros criados por este frontend incluem campos adicionais,
como `id`, `avaliacao`, `comentario`, `data_registro`, `tipo` e `pontos`.
Campos adicionais precisam ser aceitos e persistidos pelo backend para que as
funcionalidades associadas funcionem corretamente.

### Exemplo de cadastro de estudante

```json
{
  "id": "UUID-GERADO-PELO-CLIENTE",
  "matricula": "2026001",
  "nome": "Exemplo da Silva",
  "pontuacao": "0"
}
```

### Exemplo de avaliação

```json
{
  "id": "UUID-GERADO-PELO-CLIENTE",
  "titulo": "Título do livro",
  "autor": "Nome do autor",
  "nota": "8 - Comentário sobre a leitura",
  "avaliacao": 8,
  "comentario": "Comentário sobre a leitura",
  "data_registro": "2026-01-30T12:00:00.000Z",
  "id_aluno": "UUID-DO-ESTUDANTE",
  "tipo": "avaliacao",
  "pontos": 10
}
```

Os exemplos são ilustrativos; os UUIDs e a data são gerados no momento da
operação. Não use os valores de exemplo como credenciais ou IDs reais.

## Pontuação e identificadores

- Os novos registros recebem identificadores UUID com `crypto.randomUUID()`.
- Para registros novos, `id_aluno` usa o `id` do estudante, quando disponível.
- Estudantes antigos podem não ter `id`. Nesses casos, o sistema mantém a
  compatibilidade com matrícula e identificadores legados usados nos dados
  existentes (por exemplo, `"1"`).
- A pontuação total soma o campo `pontuacao` do estudante aos valores de
  `pontos` dos registros associados.
- O bônus de boas-vindas e cada avaliação registrada acrescentam 10 pontos.

Gerar UUIDs novos não migra os dados antigos. Uma migração de registros legados
precisa ser feita de forma coordenada no backend, atualizando também os campos
`id_aluno` das avaliações relacionadas. Não edite somente o ID de um estudante:
isso pode deixar o histórico sem vínculo.

## Configuração

O endereço da API está definido no frontend em `src/App.tsx`. Para usar outra
API, altere a constante `API_URL` nesse arquivo e confirme que o novo backend
oferece os endpoints e formatos descritos acima.

O servidor Vite usa a variável `PORT` quando definida; caso contrário, usa a
porta `8443`. Para evitar conflitos, feche o processo que ocupa a porta ou
defina uma porta alternativa antes de iniciar o servidor.

Para permitir acesso ao servidor Vite pelo domínio publicado no Render,
`bibliotecacontroledevisitas.onrender.com` está listado em `server.allowedHosts`
em `vite.config.ts`. Se o domínio do serviço mudar, atualize essa lista e faça
um novo deploy.

## Limitações conhecidas

- **Autenticação administrativa:** a interface carrega a lista de coordenadores
  pelo endpoint `/coordenadores` e compara e-mail/senha no próprio navegador.
  Isso não é uma autenticação segura para produção: o backend deve validar
  credenciais e proteger as operações administrativas no servidor. Nunca
  considere a interface como controle de acesso suficiente.
- **Dados de frequência:** os cartões de resumo e o gráfico mensal exibidos na
  tela de frequência usam valores fixos no frontend; não são um relatório
  calculado a partir de visitas reais.
- **Tela de catálogo antigo:** existe uma tela de catálogo/avaliação legada no
  código, mas não está conectada ao fluxo principal atual. As avaliações
  persistidas são feitas em **Minha Biblioteca**, pela pesquisa da Open
  Library.
- **Tela de pontuação detalhada:** há uma tela antiga de conquistas, mas ela
  depende do fluxo legado do catálogo, que não está acessível na navegação
  atual. A pontuação e o título continuam visíveis no painel e nos detalhes
  administrativos.
- **Serviços externos:** buscas e capas dependem da disponibilidade da Open
  Library. Erros `4xx` ou `5xx` desses serviços não são corrigidos pelo
  frontend.
- **API remota:** falhas de conexão, CORS ou respostas `5xx` precisam ser
  investigadas também no serviço da API. O frontend não contém o backend.

## Solução de problemas

### Não consigo entrar como aluno

- Confirme matrícula e primeiro nome conforme o cadastro da API.
- Use somente o primeiro nome, sem sobrenomes.
- Verifique se a API está disponível e se a tela terminou de carregar os dados.

### Não consigo entrar como coordenador

- Confirme que a conta está cadastrada na API.
- Verifique e-mail e senha com a pessoa que administra o backend.
- A interface não possui uma opção para criar ou redefinir credenciais.

### A avaliação não é salva ou aparece erro 500

- Confirme que o backend aceita `POST /livros` com campo `id` e os campos de
  avaliação.
- Verifique os logs do backend para identificar a causa da resposta `500`.
- Confirme que o `id` do registro é único e que `id_aluno` corresponde ao
  estudante.
- Um HTTP 500 indica erro no servidor; recompilar o frontend, por si só, não
  corrige uma falha interna da API.

### A pesquisa de livros retorna erro

- Digite pelo menos 3 caracteres.
- Tente novamente mais tarde se a Open Library estiver indisponível.
- O navegador deve ter acesso à internet e permitir requisições ao domínio
  `openlibrary.org`.

### Erro de CORS

O backend precisa permitir a origem (domínio) onde o frontend está aberto.
Configure a política CORS no servidor da API; não é possível corrigir CORS
somente no código do navegador.

### A API não responde localmente

Teste os endpoints com o navegador ou `curl`. O serviço remoto pode demorar para
acordar ou estar indisponível. Confira também a aba **Network/Rede** e o console
do navegador para ver o endpoint e o código HTTP exatos.

## Tecnologias e estrutura

- React 19 e TypeScript.
- Vite 8.
- Tailwind CSS 4.
- Open Library Search API para pesquisa e capas.
- API REST hospedada em Render para estudantes, livros, coordenadores e metas.

Arquivos principais:

```text
src/
  App.tsx       Telas, fluxos, integração com a API e regras da interface
  index.css     Estilos globais e importação do Tailwind CSS
  main.tsx      Inicialização do React
index.html      Documento HTML de entrada
vite.config.ts  Configuração do Vite
package.json    Dependências e comandos disponíveis
```

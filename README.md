# SistemaBiblioteca

Projeto acadêmico desenvolvido como desafio final de um curso de desenvolvimento frontend. O sistema é uma interface para incentivar a leitura e a frequência dos estudantes à biblioteca por meio de visitas, avaliações, pontuação e conquistas.

## Sobre o projeto

Estudantes podem se identificar, acompanhar seus pontos e avaliar livros. A equipe de coordenação tem acesso a metas de leitura e a um ranking de estudantes. A aplicação foi construída como frontend React e consulta uma API remota para carregar os dados da biblioteca.

## Funcionalidades

### Estudantes

- Identificação por matrícula e primeiro nome.
- Registro visual da visita, com indicação de 10 pontos recebidos.
- Consulta do catálogo de livros disponibilizado pela API e atribuição de notas de 0 a 10.
- Pesquisa de livros na Open Library e registro de leituras com nota e comentário na biblioteca pessoal.
- Acompanhamento de pontuação e metas/conquistas alcançadas.

### Coordenação

- Acesso por e-mail e senha cadastrados na API.
- Consulta das metas de pontuação cadastradas.
- Visualização da frequência e do ranking de estudantes, ordenado pela pontuação.

## Tecnologias

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- Open Library Search API, para pesquisar livros
- API do projeto, para consultar estudantes, livros, coordenadores e metas

## Requisitos

- Node.js compatível com Vite 8
- pnpm

## Como executar

Clone o repositório, instale as dependências e inicie o servidor de desenvolvimento:

```bash
pnpm install
pnpm dev
```

O Vite informará no terminal o endereço local da aplicação. Para gerar e visualizar a versão de produção:

```bash
pnpm build
pnpm preview
```

Para formatar os arquivos do projeto:

```bash
pnpm format
```

## Integrações e observações

A aplicação consulta a API hospedada em `https://desafio-biblioteca-api.onrender.com`, usando os recursos `/estudantes`, `/livros`, `/coordenadores` e `/metas`. A pesquisa de títulos usa a Open Library; salvar uma leitura envia os dados ao recurso `/livros` da API do projeto. Essas funcionalidades dependem de acesso à internet e da disponibilidade dos serviços externos.


## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `pnpm dev` | Inicia o servidor de desenvolvimento. |
| `pnpm build` | Gera a versão de produção em `dist/`. |
| `pnpm preview` | Serve localmente a versão gerada. |
| `pnpm format` | Formata os arquivos com o Oxfmt. |

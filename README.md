# Auto Escola Strada — Versão Profissional

Projeto React profissional para autoescola com domínio próprio, área do aluno, login real com Supabase, simulado teórico e painel administrativo.

## Recursos incluídos

- Site institucional responsivo
- Página inicial profissional
- Serviços
- Como funciona
- Simulado
- Login real com Supabase
- Cadastro de alunos
- Painel do aluno
- Simulado com modos: rápido, completo e por categoria
- Perguntas aleatórias
- Correção automática
- Explicação das respostas
- Histórico de resultados
- Painel administrativo
- Cadastro, edição e exclusão de perguntas
- Página de resultados administrativos
- Páginas de privacidade e termos
- Configuração para Netlify
- Arquivo SQL do Supabase
- SEO básico

## Como rodar

```bash
npm install
npm run dev
```

## Configurar Supabase

1. Crie um projeto em Supabase.
2. Vá em SQL Editor.
3. Rode `supabase/schema.sql`.
4. Copie a URL e a chave pública anon.
5. Crie `.env` baseado em `.env.example`.

## Tornar usuário admin

Depois de criar seu cadastro pelo site:

```sql
update public.profiles
set role = 'admin'
where email = 'seuemail@email.com';
```

## Publicar na Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Configure as variáveis de ambiente
- Conecte seu domínio próprio no painel da Netlify

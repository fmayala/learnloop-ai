  <img alt="Next.js 14 and App Router-ready AI chatbot." src="https://i.postimg.cc/7ZJWKZC6/Group-72.png">
  <h1 align="center">Learnloop Ed-Tech AI Platform</h1>

<p align="center">
  An open-source AI-powered platform for educational content creation/generation and learning tools built with Next.js, the Vercel AI SDK, OpenAI, OpenRouter, Prisma, Kysely, and NextAuth.js. Initially built using Vercel's AI Chatbot <a href="https://github.com/vercel/ai-chatbot">template</a>.
</p>

<p align="center">
  <a href="#features"><strong>Features and Planned Improvements</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#model-providers"><strong>Models</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a> ·
  <a href="#authors"><strong>Authors</strong></a>
</p>
<br/>

## Features and Planned Improvements

- Canvas Integration for creating and editing quizzes for direct publishing to an institution's Canvas LMS
- Interactive Lessons provided through generative AI, supply course materials and get a short lesson exercise with various modules.
- Voice/Chat assistant augmented with AI-powered features for accessing and interacting with the Canvas API (planned)
- Voice/Chat assistant augmented with AI-powered features for interactive lessons (planned)
- A RAG-based note-making tool for creating and managing notes (planned)
- Auto-feedback system for Canvas course submissions (planned)
- Insights and analytics dashboard for tracking student progress and performance using the Canvas API (planned)

## Architecture

- [Next.js](https://nextjs.org) App Router
- [Kysely](https://www.npmjs.com/package/kysely) for database interactions
- [Prisma](https://www.prisma.io/) for database schema
- [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) for interacting with AWS services
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) for interacting with Google Cloud services
- React Server Components (RSCs), Suspense, and Server Actions
- [Vercel AI SDK](https://sdk.vercel.ai/docs) for streaming chat UI
- Support for OpenAI (default), Anthropic, Cohere, Hugging Face, or custom AI chat models and/or LangChain
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - [Radix UI](https://radix-ui.com) for headless component primitives
  - Icons from [Phosphor Icons](https://phosphoricons.com)
- [NextAuth.js](https://github.com/nextauthjs/next-auth) for authentication

## Models

- Large-language model (LLMs) are available through OpenRouter and OpenAI. Support for local models is coming soon.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run the Learnloop platform. It is recommended you use pnpm to install dependencies and run the project.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install pnpm `npm i -g pnpm`
2. Install the dependencies `pnpm install`
3. Create a `.env` file based on the `.env.example` file and set the necessary environment variables
3. Run the project `pnpm dev`

Your app template should now be running on [localhost:3000](http://localhost:3000/).

## Authors

This platform is created by Francisco Ayala ([https://franciscoayala.me](https://franciscoayala.me)) supported by the University of Tennessee, Chattanooga ([UTC](https://www.utc.edu/)).

Main contributors to the features and improvements of the platform are:

- [@fmayala](https://github.com/fmayala) - [Francisco Ayala](https://franciscoayala.me)


Initial UI template provided by [Vercel](https://vercel.com) and [Next.js](https://nextjs.org) team members, with contributions from:
- Jared Palmer ([@jaredpalmer](https://twitter.com/jaredpalmer)) - [Vercel](https://vercel.com)
- Shu Ding ([@shuding\_](https://twitter.com/shuding_)) - [Vercel](https://vercel.com)
- shadcn ([@shadcn](https://twitter.com/shadcn)) - [Vercel](https://vercel.com)

# --- Dockerfile ---
FROM public.ecr.aws/docker/library/node:20-alpine AS base
WORKDIR /app

# install runtime deps
COPY client/package.json client/pnpm-*.yaml* ./
RUN npm i -g pnpm && pnpm install --prod

# copy source and build Next.js
COPY client .
RUN pnpm run build          # -> .next/

# expose & start
EXPOSE 3000
CMD ["pnpm", "start", "-p", "3000"]

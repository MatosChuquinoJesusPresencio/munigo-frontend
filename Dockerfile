FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_SUPABASE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL

ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD sh -c "sed -i 's/listen 80/listen ${PORT:-80}/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"

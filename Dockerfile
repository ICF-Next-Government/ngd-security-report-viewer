FROM oven/bun:1 AS build
WORKDIR /code

COPY . .

RUN bun i
RUN bun run build

FROM oven/bun:1

WORKDIR /code

COPY --from=build /code/dist /code/dist
COPY --from=build /code/server.ts /code/server.ts

EXPOSE 9876

CMD ["bun", "server.ts"]

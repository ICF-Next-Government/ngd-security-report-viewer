FROM oven/bun:1 AS build
WORKDIR /code

COPY dist ./dist
COPY server.ts ./server.ts

FROM oven/bun:1

WORKDIR /code

COPY --from=build /code/dist /code/dist
COPY --from=build /code/server.ts /code/server.ts

EXPOSE 9876

CMD ["bun", "server.ts"]

const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// * Express, Http Server
const app = express();
const httpServer = createServer(app);
app.use(express.json());

// * routing
app.use('/login');

// * GraphQL関連ファイル
// schema.graphqlのインポート
const typeDefs = fs.readFileSync(path.join(__dirname, './graphql/schema.graphql'), 'utf-8');
// resolversのインポート
const Query = require('./graphql/resolvers/Query');
const resolvers = {
  Query,
};
// * Apollo Serverの初期化
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// * Serverの起動
(async () => {
  await apolloServer.start();
  // expressアプリでgraphqlエンドポイントを指定
  app.use('/graphql', expressMiddleware(apolloServer));
  httpServer.listen({ port: 8000 }, () => {
    console.log('Server is Running');
  });
})();


# Contexto Backend

## Arquitetura

O projeto segue uma arquitetura simples de camadas:

- Rotas > Controllers > Services
- O `router` define os endpoints e aplica middlewares de autenticação, autorização e validação.
- O `Controller` recebe a requisição, extrai dados (`body`, `query`, `params`, `file`) e chama o `Service`.
- O `Service` contém a lógica de negócio, executa uploads/processamentos externos, interage com o banco de dados via Prisma e retorna os dados para o `Controller`.
- O `Controller` envia a resposta formatada (JSON) ao cliente.

## Organização de pastas

- `src/`
  - `server.ts` - inicializa o Express, configura middlewares gerais (JSON, CORS), tratamento de erros e registra rotas.
  - `routes.ts` - define os endpoints, uploads com Multer, controllers e validações com Zod.
  - `config/` - configurações de integrações externas e upload.
    - `cloudinary.ts` - inicialização do SDK do Cloudinary com credenciais de ambiente.
    - `multer.ts` - configuração de armazenamento em memória e filtro de extensão de arquivos.
  - `controllers/` - lógica de controle de requisição e resposta HTTP.
    - `user/`
      - `CreateUserController.ts`
      - `AuthUserController.ts`
      - `DetailUserController.ts`
    - `category/`
      - `CreateCategoryController.ts`
      - `ListCategoryController.ts`
    - `product/`
      - `CreateProductController.ts`
      - `ListProductController.ts`
      - `ListProductCategoryController.ts`
      - `DeleteProductController.ts`
    - `order/`
      - `CreateOrderController.ts`
      - `ListOrderController.ts`
      - `DetailOrderController.ts`
      - `AddItemOrderController.ts`
      - `RemoveItemOrderController.ts`
      - `SendOrderController.ts`
      - `FinishOrderController.ts`
      - `DeleteOrderController.ts`
  - `services/` - lógica de negócio e manipulação do banco de dados.
    - `user/`
      - `CreateUserService.ts`
      - `AuthUserService.ts`
      - `DetailUserService.ts`
    - `category/`
      - `CreateCategoryService.ts`
      - `ListCategoryService.ts`
    - `product/`
      - `CreateProductService.ts`
      - `ListProductService.ts`
      - `ListProductCategoryService.ts`
      - `DeleteProductService.ts`
    - `order/`
      - `CreateOrderService.ts`
      - `ListOrderService.ts`
      - `DetailOrderService.ts`
      - `AddItemOrderService.ts`
      - `RemoveItemOrderService.ts`
      - `SendOrderService.ts`
      - `FinishOrderService.ts`
      - `DeleteOrderService.ts`
  - `schemas/` - schemas de validação com Zod.
    - `userSchema.ts`
    - `categorySchema.ts`
    - `productSchema.ts`
    - `orderSchema.ts`
  - `middlewares/` - middlewares utilitários, de proteção e validação.
    - `validateSchema.ts` - intercepta requisições e valida schemas com Zod.
    - `isAuthenticated.ts` - valida token JWT via header `Authorization: Bearer <token>`.
    - `isAdmin.ts` - verifica se o usuário autenticado possui role `ADMIN`.
  - `prisma/`
    - `index.ts` - instancia do Prisma Client com adapter PostgreSQL (`@prisma/adapter-pg`).
  - `generated/prisma/` - cliente Prisma gerado localmente.
  - `@types/`
    - `index.d.ts` - tipagem customizada para injetar `user_id` na interface `Request` do Express.

## Endpoints

### Usuários e Autenticação
- `POST /users`
  - Validação: `createUserSchema`
  - Controller: `CreateUserController`
  - Service: `CreateUserService`
  - Função: cadastrar um novo usuário (senha com hash bcrypt).

- `POST /session`
  - Validação: `authUserSchema`
  - Controller: `AuthUserController`
  - Service: `AuthUserService`
  - Função: autenticar usuário e retornar token JWT.

- `GET /me`
  - Middleware: `isAuthenticated`
  - Controller: `DetailUserController`
  - Service: `DetailUserService`
  - Função: buscar dados do perfil do usuário autenticado.

### Categorias
- `POST /category`
  - Middlewares: `isAuthenticated`, `isAdmin`, `validateSchema(createCategorySchema)`
  - Controller: `CreateCategoryController`
  - Service: `CreateCategoryService`
  - Função: cadastrar nova categoria de produtos.

- `GET /category`
  - Middleware: `isAuthenticated`
  - Controller: `ListCategoryController`
  - Service: `ListCategoryService`
  - Função: listar todas as categorias cadastradas.

### Produtos
- `POST /product`
  - Middlewares: `isAuthenticated`, `isAdmin`, `upload.single('file')`, `validateSchema(createProductSchema)`
  - Controller: `CreateProductController`
  - Service: `CreateProductService`
  - Função: cadastrar produto, enviando a imagem para o Cloudinary e salvando a URL gerada.

- `GET /product`
  - Middleware: `isAuthenticated`
  - Controller: `ListProductController`
  - Service: `ListProductService`
  - Query Params: `disabled` (`true` ou `false`)
  - Função: listar produtos ativos ou inativos.

- `GET /product/category`
  - Middleware: `isAuthenticated`
  - Controller: `ListProductCategoryController`
  - Service: `ListProductCategoryService`
  - Query Params: `category_id`
  - Função: listar todos os produtos ativos vinculados a uma categoria específica.

- `DELETE /product`
  - Middlewares: `isAuthenticated`, `isAdmin`
  - Controller: `DeleteProductController`
  - Service: `DeleteProductService`
  - Query Params: `id`
  - Função: desativar logicamente um produto (`disabled: true`).

### Pedidos (Orders)
- `POST /order`
  - Middlewares: `isAuthenticated`, `validateSchema(createOrderSchema)`
  - Controller: `CreateOrderController`
  - Service: `CreateOrderService`
  - Função: abrir um novo pedido em estado de rascunho (`draft: true`).

- `GET /order`
  - Middleware: `isAuthenticated`
  - Controller: `ListOrderController`
  - Service: `ListOrderService`
  - Query Params: `draft` (`true` ou `false`, opcional)
  - Função: listar pedidos ordenados por data de criação decrescente.

- `GET /order/detail`
  - Middlewares: `isAuthenticated`, `validateSchema(detailOrderSchema)`
  - Controller: `DetailOrderController`
  - Service: `DetailOrderService`
  - Query Params: `orderId`
  - Função: detalhar pedido com seus itens e dados dos produtos vinculados.

- `PUT /order/send`
  - Middlewares: `isAuthenticated`, `validateSchema(sendOrderSchema)`
  - Controller: `SendOrderController`
  - Service: `SendOrderService`
  - Função: remover pedido do estado de rascunho (`draft: false`) para preparo.

- `PUT /order/finish`
  - Middlewares: `isAuthenticated`, `validateSchema(finishOrderSchema)`
  - Controller: `FinishOrderController`
  - Service: `FinishOrderService`
  - Função: finalizar o pedido (`status: true`).

- `DELETE /order/delete`
  - Middlewares: `isAuthenticated`, `isAdmin`, `validateSchema(deleteOrderSchema)`
  - Controller: `DeleteOrderController`
  - Service: `DeleteOrderService`
  - Query Params: `orderId`
  - Função: excluir permanentemente um pedido do sistema.

### Itens do Pedido
- `POST /order/add`
  - Middlewares: `isAuthenticated`, `validateSchema(addItemOrderSchema)`
  - Controller: `AddItemOrderController`
  - Service: `AddItemOrderService`
  - Função: adicionar um produto e sua quantidade a um pedido em aberto.

- `DELETE /order/remove`
  - Middlewares: `isAuthenticated`, `isAdmin`, `validateSchema(removeItemOrderSchema)`
  - Controller: `RemoveItemOrderController`
  - Service: `RemoveItemOrderService`
  - Query Params: `itemId`
  - Função: remover um item de pedido específico.

## Modelagem do banco de dados (Prisma)

### User
- `id: String @id @default(uuid())`
- `name: String`
- `email: String @unique`
- `password: String`
- `role: Role @default(STAFF)`
- `createdAt: DateTime @default(now())`
- `updatedAt: DateTime @updatedAt`
- Mapeado para a tabela `users`.

### Category
- `id: String @id @default(uuid())`
- `name: String @unique`
- `createdAt: DateTime @default(now())`
- `updatedAt: DateTime @updatedAt`
- Relação: `products: Product[]`
- Mapeado para a tabela `categories`.

### Product
- `id: String @id @default(uuid())`
- `name: String`
- `price: Float`
- `description: String`
- `banner: String`
- `disabled: Boolean @default(false)`
- `categoryId: String`
- `category: Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)`
- `createdAt: DateTime @default(now())`
- `updatedAt: DateTime @updatedAt`
- Relação: `items: Item[]`
- Mapeado para a tabela `products`.

### Order
- `id: String @id @default(uuid())`
- `name: String?`
- `table: Int`
- `status: Boolean @default(false)`
- `draft: Boolean @default(true)`
- `createdAt: DateTime @default(now())`
- `updatedAt: DateTime @updatedAt`
- Relação: `items: Item[]`
- Mapeado para a tabela `orders`.

### Item
- `id: String @id @default(uuid())`
- `amount: Int`
- `orderId: String`
- `productId: String`
- `name: String?`
- `order: Order @relation(fields: [orderId], references: [id], onDelete: Cascade)`
- `product: Product @relation(fields: [productId], references: [id], onDelete: Cascade)`
- `createdAt: DateTime @default(now())`
- `updatedAt: DateTime @updatedAt`
- Mapeado para a tabela `items`.

### Enum
- `Role` com os valores `STAFF` e `ADMIN`.

## Validação de schema

As validações são aplicadas em `routes.ts` via `validateSchema` utilizando o Zod (`schema.parseAsync(...)`). Se a validação falhar, é retornado status `400` com os campos problemáticos e mensagens correspondentes.

- `createUserSchema`
  - `body.name`: string, mínimo 1 caractere.
  - `body.email`: string, formato de email.
  - `body.password`: string, mínimo 6 caracteres.

- `authUserSchema`
  - `body.email`: string, formato de email.
  - `body.password`: string, mínimo 6 caracteres.

- `createCategorySchema`
  - `body.name`: string, mínimo 1 caractere.

- `createProductSchema`
  - `body.name`: string, mínimo 1 caractere.
  - `body.description`: string, mínimo 1 caractere.
  - `body.price`: número positivo (coerção numérica).
  - `body.category_id`: string opcional.

- `createOrderSchema`
  - `body.table`: número inteiro positivo.
  - `body.name`: string opcional.

- `addItemOrderSchema`
  - `body.orderId`: string, mínimo 1 caractere.
  - `body.productId`: string, mínimo 1 caractere.
  - `body.amount`: número inteiro positivo.

- `removeItemOrderSchema`
  - `query.itemId`: string, mínimo 1 caractere.

- `detailOrderSchema`
  - `query.orderId`: string, mínimo 1 caractere.

- `sendOrderSchema`
  - `body.orderId`: string, mínimo 1 caractere.

- `finishOrderSchema`
  - `body.orderId`: string, mínimo 1 caractere.

- `deleteOrderSchema`
  - `query.orderId`: string, mínimo 1 caractere.

## Bibliotecas e versões

### Dependências principais:
- `@prisma/adapter-pg`: ^7.8.0
- `@prisma/client`: ^7.8.0
- `bcryptjs`: ^3.0.3
- `cloudinary`: ^2.10.0
- `cors`: ^2.8.6
- `dotenv`: ^17.4.2
- `express`: ^5.2.1
- `jsonwebtoken`: ^9.0.3
- `multer`: ^2.2.0
- `pg`: ^8.22.0
- `tsx`: ^4.22.4
- `zod`: ^4.4.3

### Dependências de desenvolvimento:
- `@types/cors`: ^2.8.19
- `@types/dotenv`: ^6.1.1
- `@types/express`: ^5.0.6
- `@types/jsonwebtoken`: ^9.0.10
- `@types/multer`: ^2.2.0
- `@types/node`: ^25.9.4
- `@types/pg`: ^8.20.0
- `prisma`: ^7.8.0
- `typescript`: ^6.0.3

## Fluxo geral

1. Requisição HTTP chega ao servidor Express (`server.ts`) e é direcionada ao roteador (`routes.ts`).
2. Middlewares de segurança (`isAuthenticated`), permissão (`isAdmin`), upload (`multer`) e validação (`validateSchema` com Zod) são executados em ordem.
3. O `Controller` correspondente extrai os parâmetros necessários do `req`.
4. O `Service` executa a regra de negócio (hashing de senha, autenticação JWT, integração com o Cloudinary ou consultas ao banco de dados).
5. O Prisma Client acessa a base PostgreSQL através do adapter de conexão (`@prisma/adapter-pg`).
6. A resposta formatada é retornada pelo Service ao Controller.
7. O `Controller` envia a resposta em formato JSON com o código HTTP adequado (ex: `200`, `201`, `400`, `401`, `403`, `404` ou `500`).
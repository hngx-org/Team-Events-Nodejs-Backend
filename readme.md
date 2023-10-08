# Team Event
## Overview
This is an event application.

## Prisma Usage
The database has already been setup. The only thing you need to is include this in any controller file you are working on:
```
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
```

Also run:
```
  npx prisma studio
```
To view added tables and content. You can also manipulate fields when necessary.

Look at prisma [docs](https://www.prisma.io/docs/concepts/components/prisma-client/crud) for CRUD operations.

## Installation
1. Clone this repository:
```bash
 git clone https://github.com/hngx-org/Team-Events-Nodejs-Backend.git
```
2. Install dependencies:
```bash
  yarn install
```
3. Create .env file and add keys

4. Prisma generate
```
  npx prisma generate
```
5. Start the server:
  ```bash
    yarn start:dev
  ```

## Usage
After looking at what your ticket create a branch checkout into that branch locate your route and controller and add the logic. After testing push to your branch and create a PR on github. 
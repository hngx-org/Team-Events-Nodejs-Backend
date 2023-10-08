# Team Event
## Overview
This is an event application.

## Prisma Usage
The database has already been setup. The only thing you need to is include this in any controller file you are working on:
```
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
```

## Installation
1. Clone this repository:
```bash
 git clone https://github.com/hngx-org/Team-Events-Nodejs-Backend.git
```
2. Install dependencies:
```bash
  yarn install
```
3. Start the server:
  ```bash
    yarn start:dev
  ```

import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt'
import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

config()

const prisma = new PrismaClient()

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
}

const passportConfig = (passport: any) => {
  passport.use(
    new JwtStrategy(opts, async (jwtPayload: string, done: any) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: jwtPayload,
          },
        })

        if (!user) {
          return done(null, false)
        }

        return done(null, user)
      } catch (error) {
        return done(error, false)
      }
    })
  )
}

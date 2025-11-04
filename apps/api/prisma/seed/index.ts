import { env } from '@/env'
import {PrismaClient} from 'generated/client'
import {PrismaMariaDb} from "@prisma/adapter-mariadb"
import crypto from "node:crypto";

const server_configs: Array<{
  key: string,
  value: string
}> = [{
  key: "db_version",
  value: "57" // migration from crystalserver only to no trigger on the server
}, {
  key: "motd_hash",
  value: ""
}, {
  key: "motd_num",
  value: "0"
}, {
  key: "players_record",
  value: "0"
}]

const adapter = new PrismaMariaDb({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
})

const prisma = new PrismaClient({
				adapter,
				log: ["info", "warn", "error"],
			});

async function main() {
  for (const config of server_configs) {
    const existing = await prisma.server_config.findUnique({
      where: {
        config: config.key
      }
    })

    if (!existing) {
      await prisma.server_config.create({
        data: {
          config: config.key,
          value: config.value
        }
      })
      console.log("[seed] Created server_config:", config.key)
      continue
    }

    console.log("[seed] server_config already exists:", config.key)
  }

  const boostedBoss = await prisma.boosted_boss.findFirst()

  if (!boostedBoss) {
    await prisma.boosted_boss.create({
      data: {
        boostname: "default",
        date: "0",
        raceid: "0"
      }
    })
    console.log("[seed] Created default boosted_boss")
  }

  const boostedCreature = await prisma.boosted_creature.findFirst()

  if (!boostedCreature) {
    await prisma.boosted_creature.create({
      data: {
        boostname: "default",
        date: "0",
        raceid: "0"
      }
    })
    console.log("[seed] Created default boosted_creature")
  }
  

  let godAccount = await prisma.accounts.findFirst({
    where: {
      email: "@god"
    }
  })

  const defaultPassword = crypto.hash("sha1", "god")

  if (!godAccount) {
    await prisma.accounts.create({
      data: {
        email: "god@god.com",
        password: defaultPassword, // "god",
        name:"god",
        type: 5
      }
    })
    console.log("[seed] Created god account")

    godAccount = await prisma.accounts.findFirst({
      where: {
        email: "god@god.com"
      }
    })
  }

  const godPlayer = await prisma.players.findFirst({
    where: {
      name: "GOD"
    }
  })

  if (!godPlayer && godAccount) {
    await prisma.players.create({
      data: {
        id: 7,
        name: "GOD",
        group_id: 6,
        account_id: godAccount.id,
        level: 2,
        vocation: 0,
        health: 155,
        healthmax: 155,
        experience: 100,
        lookbody: 113,
        lookfeet: 115,
        lookhead: 95,
        looklegs: 39,
        looktype: 75,
        maglevel: 0,
        mana: 60,
        manamax: 60,
        manaspent: 0,
        town_id: 8,
        conditions: new Uint8Array(0),
        cap: 400,
        sex: 1,
        skill_club: 10,
        skill_club_tries: 0,
        skill_sword: 10,
        skill_sword_tries: 0,
        skill_axe: 10,
        skill_axe_tries: 0,
        skill_dist: 10,
        skill_dist_tries: 0,
      }
    })
  }
}


main().then(async () => {
  await prisma.$disconnect()
}).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
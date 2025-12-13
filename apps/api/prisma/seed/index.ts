import { env } from '@/infra/env'
import {PrismaClient, type miforge_shop_service} from 'generated/client'
import {PrismaMariaDb} from "@prisma/adapter-mariadb"
import crypto from "node:crypto";
import { MiforgeConfigSchema } from '@/shared/schemas/Config';

const server_configs: Array<{
  key: string,
  value: string
}> = [{
  key: "db_version",
  value: "59" // migration from crystalserver only to no trigger on the server
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

const adapter = new PrismaMariaDb(env.DATABASE_URL)

const prisma = new PrismaClient({
				adapter,
				log: ["info", "warn", "error"],
			});

const miforgeConfig = MiforgeConfigSchema.decode({
  maintenance: {
    enabled: false,
    message: "We'll be back soon."
  },
  mailer: {
    enabled: Boolean(env.MAILER_PROVIDER)
  },
  discord: {
    enabled: Boolean(env.DISCORD_ENABLED)
  },
  mercado_pago: {
    enabled: Boolean(env.MERCADO_PAGO_ENABLED)
  },
  account: {
    emailConfirmationRequired: Boolean(env.MAILER_PROVIDER),
    emailChangeConfirmationRequired: Boolean(env.MAILER_PROVIDER),
    passwordResetConfirmationRequired: Boolean(env.MAILER_PROVIDER)
  }
})

const DEFAULT_SHOP_SERVICES: Pick<miforge_shop_service, "title" | "slug" | "unit_price" | "quantity" | "description" | "type">[] = [{
  type: "COINS",
  title: "250 Coins",
  slug: "250-coins",
  unit_price: 10, // cents = 0.10 = 10/100 = 0.1
  quantity: 250,
  description: null
}, {
  type: "COINS",
  title: "750 Coins",
  slug: "750-coins",
  unit_price: 10,
  quantity: 750,
  description: null
}, {
  type: "COINS",
  title: "1500 Coins",
  slug: "1500-coins",
  unit_price: 10,
  quantity: 1500,
  description: null
}, {
  type: "COINS",
  title: "3000 Coins",
  slug: "3000-coins",
  unit_price: 10,
  quantity: 3000,
  description: null
}, {
  type: "COINS",
  title: "4000 Coins",
  slug: "4000-coins",
  unit_price: 10,
  quantity: 4000,
  description: null
}, {
  type: "COINS",
  title: "12000 Coins",
  slug: "12000-coins",
  unit_price: 10, 
  quantity: 12000, 
  description: null
}]

async function main() {
  console.log("[seed] Seeding miforge_configs")
  await prisma.miforge_config.upsert({
    where: {
      id: 1
    },
    create: {
      id: 1,
      data: JSON.stringify(miforgeConfig)
    },
    update: {
      data: JSON.stringify(miforgeConfig)
    }
  })

  console.log("[seed] Seeding default shop services")
  for (const service of DEFAULT_SHOP_SERVICES) {
    await prisma.miforge_shop_service.upsert({
      where: {
        slug: service.slug
      },
      create: service,
      update: service
    })
  }

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

  const defaultPassword = crypto.hash("sha1", "god")

  console.log("[seed] ensuring god account exists")
  const account = await prisma.accounts.upsert({
    where: {
      email: "god@god.com"
    },
    create: {
      email: "god@god.com",
        password: defaultPassword, // "god",
        name:"god",
        type: 5,
        email_confirmed: true
    },
    update: {}
  });

  console.log("[seed] ensuring GOD player exists")
  await prisma.players.upsert({
    where: {
      name: "GOD"
    },
    create: {
      id: 7,
        name: "GOD",
        group_id: 6,
        account_id: account.id,
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
    },
    update: {}
  })



  const samplePlayers = [
    {
      id: 1,
      name: 'Rook Sample',
      group_id: 1,
      account_id: account.id,
      level: 2,
      vocation: 0,
      health: 155,
      healthmax: 155,
      experience: 100,
      lookbody: 113,
      lookfeet: 115,
      lookhead: 95,
      looklegs: 39,
      looktype: 128,
      maglevel: 2,
      mana: 60,
      manamax: 60,
      manaspent: 5936,
      town_id: 1,
      conditions: new Uint8Array(0),
      cap: 410,
      sex: 1,
      skill_club: 12,
      skill_club_tries: 155,
      skill_sword: 12,
      skill_sword_tries: 155,
      skill_axe: 12,
      skill_axe_tries: 155,
      skill_dist: 12,
      skill_dist_tries: 93,
    },
    {
      id: 2,
      name: 'Sorcerer Sample',
      group_id: 1,
      account_id: account.id,
      level: 8,
      vocation: 1,
      health: 185,
      healthmax: 185,
      experience: 4200,
      lookbody: 113,
      lookfeet: 115,
      lookhead: 95,
      looklegs: 39,
      looktype: 130,
      maglevel: 0,
      mana: 90,
      manamax: 90,
      manaspent: 0,
      town_id: 8,
      conditions: new Uint8Array(0),
      cap: 470,
      sex: 1,
      skill_club: 10,
      skill_club_tries: 0,
      skill_sword: 10,
      skill_sword_tries: 0,
      skill_axe: 10,
      skill_axe_tries: 0,
      skill_dist: 10,
      skill_dist_tries: 0,
    },
    {
      id: 3,
      name: 'Druid Sample',
      group_id: 1,
      account_id: account.id,
      level: 8,
      vocation: 2,
      health: 185,
      healthmax: 185,
      experience: 4200,
      lookbody: 113,
      lookfeet: 115,
      lookhead: 95,
      looklegs: 39,
      looktype: 144,
      maglevel: 0,
      mana: 90,
      manamax: 90,
      manaspent: 0,
      town_id: 8,
      conditions: new Uint8Array(0),
      cap: 470,
      sex: 1,
      skill_club: 10,
      skill_club_tries: 0,
      skill_sword: 10,
      skill_sword_tries: 0,
      skill_axe: 10,
      skill_axe_tries: 0,
      skill_dist: 10,
      skill_dist_tries: 0,
    },
    {
      id: 4,
      name: 'Paladin Sample',
      group_id: 1,
      account_id: account.id,
      level: 8,
      vocation: 3,
      health: 185,
      healthmax: 185,
      experience: 4200,
      lookbody: 113,
      lookfeet: 115,
      lookhead: 95,
      looklegs: 39,
      looktype: 129,
      maglevel: 0,
      mana: 90,
      manamax: 90,
      manaspent: 0,
      town_id: 8,
      conditions: new Uint8Array(0),
      cap: 470,
      sex: 1,
      skill_club: 10,
      skill_club_tries: 0,
      skill_sword: 10,
      skill_sword_tries: 0,
      skill_axe: 10,
      skill_axe_tries: 0,
      skill_dist: 10,
      skill_dist_tries: 0,
    },
    {
      id: 5,
      name: 'Knight Sample',
      group_id: 1,
      account_id: account.id,
      level: 8,
      vocation: 4,
      health: 185,
      healthmax: 185,
      experience: 4200,
      lookbody: 113,
      lookfeet: 115,
      lookhead: 95,
      looklegs: 39,
      looktype: 131,
      maglevel: 0,
      mana: 90,
      manamax: 90,
      manaspent: 0,
      town_id: 8,
      conditions: new Uint8Array(0),
      cap: 470,
      sex: 1,
      skill_club: 10,
      skill_club_tries: 0,
      skill_sword: 10,
      skill_sword_tries: 0,
      skill_axe: 10,
      skill_axe_tries: 0,
      skill_dist: 10,
      skill_dist_tries: 0,
    },
    {
      id: 6,
      name: 'Monk Sample',
      group_id: 1,
      account_id: account.id,
      level: 8,
      vocation: 9,
      health: 185,
      healthmax: 185,
      experience: 4200,
      lookbody: 113,
      lookfeet: 115,
      lookhead: 95,
      looklegs: 39,
      looktype: 1824,
      maglevel: 0,
      mana: 90,
      manamax: 90,
      manaspent: 0,
      town_id: 8,
      conditions: new Uint8Array(0),
      cap: 470,
      sex: 1,
      skill_club: 10,
      skill_club_tries: 0,
      skill_sword: 10,
      skill_sword_tries: 0,
      skill_axe: 10,
      skill_axe_tries: 0,
      skill_dist: 10,
      skill_dist_tries: 0,
    },
  ]

  for (const playerData of samplePlayers) {
    console.log(`[seed] ensuring sample player exists: ${playerData.name}`)
    await prisma.players.upsert({
      where: {
        name: playerData.name
      },
      create: playerData,
      update: {}
    })
  }


  console.log("[seed] Ensuring world Miforge exists")
  await prisma.worlds.upsert({
    where: {
      name: env.SERVER_NAME
    },
    create: {
      ip: env.SERVER_HOST,
      location: env.SERVER_LOCATION,
      motd: "Welcome to Miforge!",
      name: env.SERVER_NAME,
      port: env.SERVER_GAME_PROTOCOL_PORT,
      port_status: env.SERVER_STATUS_PROTOCOL_PORT,
      type: env.SERVER_PVP_TYPE,
    },
    update: {}
  })
}


main().then(async () => {
  await prisma.$disconnect()
}).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
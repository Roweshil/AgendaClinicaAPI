import { createClient } from 'redis'

const client = createClient({
  username: 'default',
  password: 'UY6vhDU5iLsIqENqSK6X2Z9ebnbXLkgk',
  socket: {
    host: 'cook-verse-pipe-92545.db.redis.io',
    port: 14343
  }
})

client.on('error', err => console.log('Redis Client Error', err))

await client.connect()

await client.set('foo', 'bar')
const result = await client.get('foo')
console.log(result) // >>> bar

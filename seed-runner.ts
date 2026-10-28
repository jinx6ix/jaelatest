import { seedAll } from './src/endpoints/seed/index'
// Mocking Payload object to run seedAll
const payload = {
  create: async (data: any) => console.log('Creating:', data.collection, data.data.title),
  logger: { info: (msg: string) => console.log(msg) }
}
seedAll(payload as any)

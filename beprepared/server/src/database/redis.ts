import { RedisClientType, createClient } from "redis";
 class Redis {

    #client : RedisClientType;
    constructor() {
        createClient()
        .on('error', (err) => {
        console.log('Redis Client Error', err);
        throw new Error(err);
        })
        .connect()
        .then((client)=> {
            this.#client = client;

            console.log("Conexao estabelecida com redis");
        });
    }

    async set(key: string, value: string | number, duration: number) {
await this.#client.set(key, value, {
    EX: duration
});
    }
    async get (key: string) {
const value = await this.#client.get(key);
return value;
    }


    async delete(key: string) {
        await this.#client.del(key);
    }
}
export const redis = new Redis();
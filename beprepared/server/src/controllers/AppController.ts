import { FastifyReply, FastifyRequest } from "fastify";
import { Stats } from "fs";
import { db } from "../database";
import { number } from "zod";
import dayjs from "dayjs";

//interface 
interface SQLStatsProps{
total: number;
last: number;
}

interface StatsProps {
[key: string]: SQLStatsProps;
}

export class AppController {
    async getStats (request: FastifyRequest, reply: FastifyReply) {
        const stats:StatsProps = {};

        const last28Days = new Date (dayjs().subtract(28, 'day').format());
        
        const subscribers = await db.$queryRaw<SQLStatsProps[]>`
        SELECT 
          COUNT (*) FILTER (WHERE verified = true) AS total,
          COUNT (*) FILTER (WHERE created_at >= ${last28Days} AND verified = true) AS last

        FROM subscribers`; 

        const alerts = await db.$queryRaw<SQLStatsProps[]>`
        SELECT 
          COUNT (*)  AS total,
          COUNT (*) FILTER (WHERE created_at >= ${last28Days}) AS last

        FROM alerts`; 
       
       const notifications = await db.$queryRaw<SQLStatsProps[]>`
        SELECT 
          COUNT (*)  AS total,
          COUNT (*) FILTER (WHERE created_at >= ${last28Days}) AS last

        FROM notifications`; 

        const serializedSubscribers =
           { 
            total: Number(subscribers[0].total),
            last: Number(subscribers[0].last)
        };
        const serializedAlerts =
           { 
            total: Number(alerts[0].total),
            last: Number(alerts[0].last)
        };
        const serializedNotifications =
           { 
            total: Number(notifications[0].total),
            last: Number(notifications[0].last)
        };

        stats.subscribers = serializedSubscribers;
        stats.alerts = serializedAlerts;
        stats.subscribers = serializedNotifications;
        return reply.send(stats);
    }
}
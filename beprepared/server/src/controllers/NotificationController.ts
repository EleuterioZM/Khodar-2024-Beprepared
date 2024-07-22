import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { db } from "../database";
import dayjs from "dayjs";

export class NotificationController {
  async  create(request: FastifyRequest, reply: FastifyReply){
      const deviceId = z.string().parse(request.headers.authorization);
      
      const notificationSchema = z.object({
        message: z.string()
        
    });
    
    const { message }   = notificationSchema.parse (request.body);
    const subscriber = await db.subscriber.findUnique({ 
        where:{
            deviceId,
            verified: true
        }
    });
    if(!subscriber) return reply.status(401).send({ error: 'Erro de autenticacao' });
    const notification = await db.notification.create({
        data:{
            message,
            subscriberId: subscriber.id
        }
    })
    return reply.send(notification)
}
async  show(request: FastifyRequest, reply: FastifyReply){
    const paramsSchema = z.object({
        phone: z.string()
        
    });
    const deviceId = z.string().parse(request.headers.authorization);
    const { phone }   = paramsSchema.parse (request.params);
    const subscriber = await db.subscriber.findUnique({ 
      where:{
          deviceId,
          verified: true,
          phone
      }
    });
    if(!subscriber){ return reply.status(401).send({ error: 'Erro de autenticacao' });}

    const notifications = await db.notification.findMany({
        where:{
            subscriberId: subscriber.id
        }
    });
  
    return reply.send(notifications);
}
async  list(request: FastifyRequest, reply: FastifyReply){
    const QuerySchema = z.object({
        page: z.coerce.number().optional()
      });
     
      const { page = 0 } = QuerySchema.parse(request.query);
    const notifications = await db.notification.findMany({
        where:{
            createdAt:{
                gte: dayjs().subtract(28, 'day').format()
              }
        },
        
      include:{
        subscriber: true
        
      },
      orderBy:{
        createdAt: 'desc'
      },
      skip: page * 10,
      take: 10
    });
  
    return reply.send(notifications);
}
}
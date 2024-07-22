import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { generate6DigitsNumber } from '../utils/utils';
import { db } from "../database";
import { redis } from "../database/redis";
import { twilio, twilioConfig } from "../config/twilio";



export class SubscriberController {
    async create(request: FastifyRequest, reply: FastifyReply) {
        const SubscriberSchema = z.object({
            phone: z.string().regex(/8[2-7]\d{7}/),
            provinceId: z.string(),
            districtId: z.string()
        });

        const { phone, provinceId, districtId }   = SubscriberSchema.parse (request.body);
        // verificar se existe um user com nr phone
        const subscriberExists = await db.subscriber.findUnique({ where: { phone: String(phone) } });
        if(subscriberExists){
            return reply.status(401).send({ error: 'Usuario ja existente' });
        }
        // Verificar se o distrito esta relacionado com a provincia 
        const district = await db.district.findUnique({ 
            where: {
            id: districtId, 
            provinceId
     } });

     if(!district) {
        return reply.status(400).send({ error: 'Distrito nao pertecente a provincia' });
     }
        
      
        // Gerar um OTP SMS
        //Enviar o OTP
        const otp = generate6DigitsNumber();
        console.log(otp);
        await redis.set(
            `otp_${otp}`,
            phone, 
            60 * 3);
    //Enviar o OTP
   const message = await twilio.messages.create({
        body: `Use esse codigo para confirmar o seu numero: ${otp}`,
        from: twilioConfig.from,
        to: `+258${phone}`,
      });
      
      console.log(message);
      //Guradr na BD
      const savedSubscriber = await db.subscriber.create({ 
        data: {
            phone: String(phone),
            provinceId,
            districtId
            
        }
                });
      
        return reply.status(201).send(savedSubscriber);
    }
    async update (request: FastifyRequest, reply: FastifyReply) {
     
       const deviceId = z.string().parse(request.headers.authorization);
       
       const SubscriberSchema = z.object({
        
        provinceId: z.string().optional(),
        districtId: z.string().optional()
    });

    const { provinceId, districtId }   = SubscriberSchema.parse (request.body);
const subscriber = await db.subscriber.findUnique({ 
    where:{
        deviceId,
        verified: true
    }
 });
 if(!subscriber) return reply.status(401).send({ error: 'Erro de autenticacao' });



   // Verificar se o distrito esta relacionado com a provincia 
   const district = await db.district.findUnique({ 
    where: {
    id: districtId, 
    provinceId
} });

if(!district) {
return reply.status(400).send({ error: 'Distrito nao pertecente a provincia' });
}


 const updatedSubscriber = await db.subscriber.update({ 
    where:{
        deviceId
    },
    data:{
        provinceId,
        districtId
    }});

        return reply.send(updatedSubscriber);
    }
}
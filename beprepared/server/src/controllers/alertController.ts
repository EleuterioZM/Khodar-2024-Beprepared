import { FastifyReply, FastifyRequest } from "fastify";
import { getMessaging } from 'firebase-admin/messaging';
import { string, z } from "zod";
import { db } from "../database";
import { error } from "console";
import dayjs from "dayjs";
import { twilio, twilioConfig } from "../config/twilio";


export class AlertController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const AlertSchema = z.object({
      title: z.string(),
      message: z.string(),
      provinceId: z.string(),
      districtId: z.string(),
    });

    const { title, message, districtId, provinceId } = AlertSchema.parse(request.body);

    const district = await db.district.findUnique({
      where: {
        id: districtId,
      },
      include: {
        province: true,
      },
    });

    if (!district || district.provinceId !== provinceId) {
      return reply.status(400).send({ error: 'Distrito não pertence à província' });
    }
const subscribers = await db.subscriber.findMany({
    select: {
deviceId: true,
phone: true
    },
    where:{
        districtId,
        deviceId:{
            not: null
        },
        verified: true
    }
});
    // Criar o alerta no banco de dados
    const alert = await db.alert.create({
      data: {
        title,
        message,
        districtId,
        provinceId,
      },
      select:{
        id:true,
        title:true,
        message:true,
        districtId:true,
        provinceId:true
      }
    });
subscribers.forEach((subscriber) =>{
  twilio.messages.create({
    body: `${alert.title}\n${alert.message}`,
    from: twilioConfig.from,
    to: `+258${subscriber.phone}`,
  }).then((Response) =>{
    console.log(message);
  }).catch((error) =>{
    console.log(error);
  });
  
});

    const tokens = subscribers.map((deviceId) => String( deviceId.deviceId));

    const alertNotification = {
        data: alert,
        tokens: tokens,
      };
      
      try{
const response =  await getMessaging().sendMulticast(alertNotification)
        console.log(response.successCount + ' messages were sent successfully');
        return reply.send(alert);
 
      } catch(error){
          return reply.status(500).send({error: 'Notifications failed'});

      }
  }
  async list(request: FastifyRequest, reply: FastifyReply) {
    const QuerySchema = z.object({
      provinceId: z.string().optional(),
      districtId: z.string().optional(),
      page: z.coerce.number().optional()
    });
   
    const { provinceId, districtId, page = 0 } = QuerySchema.parse(request.query);
    const alerts = await db.alert.findMany({
      where:{
        provinceId,
        districtId,
        createdAt:{
          gte: dayjs().subtract(28, 'day').format()
        }
      },
      include:{
        province: true,
        district: true
      },
      orderBy:{
        createdAt: 'desc'
      },
      skip: page * 10,
      take: 10
    });
    return reply.send(alerts);

  }
}

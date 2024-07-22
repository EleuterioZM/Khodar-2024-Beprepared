import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../database";
import { z } from "zod";

export class LocationController {
    async listProvices (request: FastifyRequest, reply: FastifyReply){
        const provinces = await db.province.findMany();
        return reply.send(provinces);
    }
    async listDistricts(request: FastifyRequest, reply: FastifyReply){
        const paramsSchema = z.object({
            provinceId: z.string()
        });
        const { provinceId } = paramsSchema.parse(request.params);
        const districs = await db.district.findMany({
            where: {
                provinceId
            }
        });
        return reply.send(districs);
    }
}
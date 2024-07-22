import { FastifyInstance } from "fastify";
import { SubscriberController } from "../controllers/SubscriberController";
import { request } from "http";
import { AuthController } from "../controllers/authController";
import { NotificationController } from "../controllers/NotificationController";
import { AlertController } from "../controllers/alertController";
import { authHook } from "../hooks/auth";
import { LocationController } from "../controllers/LocationController";
import { AppController } from "../controllers/AppController";



const subscriberController = new SubscriberController();
const authController = new AuthController();
const notificationController = new NotificationController();
const alertController = new AlertController();
const locationController = new LocationController();
const appController = new AppController();
export async function routes (fastify: FastifyInstance){

  fastify.get('/stats', (request, reply) => appController.getStats(request, reply));
 
  fastify.post('/subscribers',(request, reply)=>subscriberController.create(request, reply));
  fastify.put('/subscribers',(request, reply)=>subscriberController.update(request, reply));
   
  fastify.post('/auth/subscribers/otp', (request, reply) =>authController.authOTP(request, reply));
  fastify.post('/auth/subscribers', (request, reply) =>authController.loginSubscriber(request, reply));
  fastify.post('/auth/admin', (request, reply) =>authController.loginAdmin(request, reply));
  fastify.post('/notifications', (request, reply) =>notificationController.create(request, reply));
  fastify.get('/notifications/:phone', (request, reply) =>notificationController.show(request, reply));
  fastify.get('/notifications',{ preHandler: authHook }, (request, reply) =>notificationController.list(request, reply));
  
  fastify.post('/alerts', { preHandler: authHook }, (request, reply)=> alertController.create(request, reply));
  fastify.get('/alerts', (request, reply)=> alertController.list(request, reply));
  
  fastify.get('/provinces', (request, reply) =>locationController.listProvices(request, reply));

  fastify.get('/districs/:provinceId', (request, reply) => locationController.listDistricts(request, reply));

  
  
}
import Twilio from 'twilio';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from './firebase';


export const twilio = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const twilioConfig = {
    from: "+19295957242"
}
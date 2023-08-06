import twilio from "twilio";

const accountSid = "AC174c3063ef213347d818e09103650e56";
const authToken = "6bc6b60cc39a40da68ce9058c768eccc";

const client = twilio(accountSid, authToken);

export const GenerateAccessCode = () => {
  const code = Math.floor(10000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { code, expiry };
};
export const SendVerificationCode = async (
  code: number,
  toPhoneNumber: string
) => {
  const response = await client.messages.create({
    body: `Your OTP for verification is ${code}. It will be valid for 30 minutes. Hi this is me :-)`,
    from: "+12187747321",
    to: toPhoneNumber.trim(),
  });
  console.log(response);
  return response;
};

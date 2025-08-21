import bcrypt from "bcryptjs";
export const generateHush = async (plainText = "") => {
    return await bcrypt.hash(plainText, parseInt(process.env.SALT));
  };
  
export const compareHush=({plainText="",hashValue=""}={})=>{
    const match =bcrypt.compareSync(plainText,hashValue)
    return match

    }
    import CryptoJS from "crypto-js";

// خليه في .env
const PASSPHRASE = process.env.CHAT_SECRET_KEY || "very-strong-passphrase";

export const encryptText = (plain) => {
  if (typeof plain !== "string") plain = JSON.stringify(plain ?? "");
  return CryptoJS.AES.encrypt(plain, PASSPHRASE).toString(); // صيغة OpenSSL مع ملح مدمج
};

export const decryptText = (cipher) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, PASSPHRASE);
    const text = bytes.toString(CryptoJS.enc.Utf8);
    return text;
  } catch (e) {
    return ""; // لو حصل خطأ في فك التشفير
  }
};

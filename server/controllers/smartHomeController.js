import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_ID = process.env.TUYA_ACCESS_ID;
const ACCESS_SECRET = process.env.TUYA_ACCESS_SECRET;
const API_ENDPOINT = "https://openapi.tuyaeu.com";
const DEVICE_ID = process.env.TUYA_DEVICE_ID;

console.log("🔹 ACCESS_ID:", ACCESS_ID);
console.log("🔹 ACCESS_SECRET:", ACCESS_SECRET.length, "(délka by měla být přibližně 32 znaků)");

// Funkce pro generování podpisu
async function generateSign(stringToSign, secret) {
    console.log("🔹 Generování podpisu...");
    console.log("🔹 String to sign:", stringToSign);

    return crypto.createHmac("sha256", secret)
        .update(stringToSign, "utf8")
        .digest("hex")
        .toUpperCase(); // Tuya API vyžaduje velká písmena
}

// Získání access tokenu
async function getAccessToken(){
    const timestamp = Date.now().toString();

    console.log("🔹 Kontrola timestampu:", timestamp, " Délka:", timestamp.length);
    
    // ✅ Opravený signString (NEOBSAHUJE ACCESS_SECRET!)
    const signString = ACCESS_ID + timestamp;
    const signature = generateSign(signString, ACCESS_SECRET);

    const url = `${API_ENDPOINT}/v1.0/token`;  // ✅ Správný endpoint
    const body = { "grant_type": "1" };  // ✅ Oprava JSON těla

    const headers = {
        "client_id": ACCESS_ID,
        "sign": signature,
        "t": timestamp,
        "sign_method": "HMAC-SHA256",
        "Content-Type": "application/json"
    };

    console.log("🔹 Odesílám požadavek na URL:", url);
    console.log("🔹 Hlavičky požadavku:", headers);
    console.log("🔹 Tělo požadavku:", body);

    try {
        const response = await axios.post(url, body, { headers });

        console.log("✅ API odpověď na získání tokenu:", JSON.stringify(response.data, null, 2));

        if (response.data.success) {
            return response.data.result.access_token;
        } else {
            console.error("❌ Chyba: Tuya API odpovědělo neúspěšně.");
            return null;
        }
    } catch (error) {
        console.error("❌ Chyba při získání tokenu:", error.response?.data || error.message);
        return null;
    }
}

// API endpoint pro získání dat ze senzoru
export const getSensorData = async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return res.status(500).json({ error: "Nepodařilo se získat přístupový token." });
        }

        const timestamp = Date.now().toString();

        // ✅ Opravený signString pro získání dat ze senzoru
        const signString = ACCESS_ID + timestamp;  // ✅ OPRAVA – odstraněn ACCESS_SECRET!
        const signature = generateSign(signString, ACCESS_SECRET);


        const response = await axios.get(`${API_ENDPOINT}/v1.0/devices/${DEVICE_ID}/status`, {
            headers: {
                "client_id": ACCESS_ID,
                "access_token": accessToken,
                "sign": signature,
                "t": timestamp,
                "sign_method": "HMAC-SHA256"
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ Chyba při načítání dat ze senzoru:", error.response?.data || error.message);
        res.status(500).json({ error: "Nepodařilo se získat data ze senzoru." });
    }
};



// Используем ES Modules вместо CommonJS
import nacl from 'tweetnacl';

// Функция для генерации ключей
function generateKeys() {
    const keyPair = nacl.box.keyPair();
    return {
        privKey: btoa(String.fromCharCode(...keyPair.secretKey)), // Преобразуем Uint8Array в base64
        pubKey: btoa(String.fromCharCode(...keyPair.publicKey)), // Преобразуем Uint8Array в base64
    };
}

// Функция для отправки запросов к API Cloudflare
async function apiRequest(method, endpoint, body = null, token = null) {
    const headers = {
        'User-Agent': '',
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`https://api.cloudflareclient.com/v0i1909051800/${endpoint}`, options);
    return response.json();
}

// Функция для генерации конфига WARP
async function generateWarpConfig() {
    const { privKey, pubKey } = generateKeys();

    // Регистрация устройства
    const regBody = {
        install_id: "",
        tos: new Date().toISOString(),
        key: pubKey,
        fcm_token: "",
        type: "ios",
        locale: "en_US"
    };
    const regResponse = await apiRequest('POST', 'reg', regBody);

    const id = regResponse.result.id;
    const token = regResponse.result.token;

    // Включение WARP
    const warpResponse = await apiRequest('PATCH', `reg/${id}`, { warp_enabled: true }, token);

    const peer_pub = warpResponse.result.config.peers[0].public_key;
    const peer_endpoint = warpResponse.result.config.peers[0].endpoint.host;
    const client_ipv4 = warpResponse.result.config.interface.addresses.v4;
    const client_ipv6 = warpResponse.result.config.interface.addresses.v6;

    // Формируем конфиг
    const conf = `[Interface]
PrivateKey = ${privKey}
S1 = 0
S2 = 0
Jc = 120
Jmin = 23
Jmax = 911
H1 = 1
H2 = 2
H3 = 3
H4 = 4
MTU = 1280
Address = ${client_ipv4}, ${client_ipv6}
DNS = 1.1.1.1, 2606:4700:4700::1111, 1.0.0.1, 2606:4700:4700::1001

[Peer]
PublicKey = ${peer_pub}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = 188.114.97.66:3138`;

    // Возвращаем конфиг
    return conf;
}

// Основная функция для генерации ссылки на скачивание конфига
export async function getWarpConfigLink() {
    try {
        const conf = await generateWarpConfig();
        const confBase64 = btoa(conf); // Преобразуем строку в base64
        return `${confBase64}`;
    } catch (error) {
        console.error('Ошибка при генерации конфига:', error);
        return null;
    }
}

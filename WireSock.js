const fetch = require('node-fetch');
const nacl = require('tweetnacl');
const { Buffer } = require('buffer');

function generateRandomEndpoint() {
    const prefixes = ["162.159.192.", "162.159.195.", "engage.cloudflareclient.com"];
    const ports = [4500, 2408, 1701, 500];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    const port = ports[Math.floor(Math.random() * ports.length)];

    if (prefix === "engage.cloudflareclient.com") {
        return `${prefix}:${port}`;
    } else {
        return `${prefix}${randomNumber}:${port}`;
    }
}

function generateKeys() {
    const keyPair = nacl.box.keyPair();
    return {
        privKey: Buffer.from(keyPair.secretKey).toString('base64'),
        pubKey: Buffer.from(keyPair.publicKey).toString('base64')
    };
}

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

async function generateWarpConfig(dns = "1.1.1.1, 2606:4700:4700::1111, 1.0.0.1, 2606:4700:4700::1001", allowedIPs = "0.0.0.0/0, ::/0") {
    const { privKey, pubKey } = generateKeys();

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

    const warpResponse = await apiRequest('PATCH', `reg/${id}`, { warp_enabled: true }, token);

    const peer_pub = warpResponse.result.config.peers[0].public_key;
    const peer_endpoint = warpResponse.result.config.peers[0].endpoint.host;
    const client_ipv4 = warpResponse.result.config.interface.addresses.v4;
    const client_ipv6 = warpResponse.result.config.interface.addresses.v6;

    const randomEndpoint = generateRandomEndpoint();
	const domains = ['ozon.ru', 'apteka.ru', 'mail.ru', 'psbank.ru', 'lenta.ru', 'www.pochta.ru', 'rzd.ru', 'rutube.ru', 'gosuslugi.ru'];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const conf = `[Interface]
PrivateKey = ${privKey}
S1 = 0
S2 = 0
Jc = 4
Jmin = 40
Jmax = 70
H1 = 1
H2 = 2
H3 = 3
H4 = 4
MTU = 1280
Address = ${client_ipv4}, ${client_ipv6}
DNS = ${dns}

# Protocol masking

Id = ${randomDomain}
Ip = quic
Ib = firefox

[Peer]
PublicKey = ${peer_pub}
AllowedIPs = ${allowedIPs}
Endpoint = ${randomEndpoint}`;

    return conf;
}

async function getWarpConfigLink10(dns, allowedIPs) {
    try {
        const conf = await generateWarpConfig(dns, allowedIPs);
        const confBase64 = Buffer.from(conf).toString('base64');
        return `${confBase64}`;
    } catch (error) {
        console.error('Ошибка при генерации конфига:', error);
        return null;
    }
}

module.exports = { getWarpConfigLink10 };

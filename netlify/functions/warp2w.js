const { getWarpConfigLink2 } = require('./modules/AWGm1');

exports.handler = async (event) => {
    try {
        const dns = event.queryStringParameters?.dns || "1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001";
        const allowedIPs = event.queryStringParameters?.allowedIPs || "0.0.0.0/0, ::/0";
        const content = await getWarpConfigLink2(dns, allowedIPs);
        
        if (content) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, content }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ success: false, message: 'Не удалось сгенерировать конфиг.' })
            };
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Произошла ошибка на сервере.' })
        };
    }
};

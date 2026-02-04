const { getWarpConfigLink6 } = require('./modules/Throne');

exports.handler = async (event) => {
    try {
        const content = await getWarpConfigLink6();
        
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

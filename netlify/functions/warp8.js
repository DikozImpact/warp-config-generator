const path = require('path');
const { getWarpConfigLink8 } = require(path.join(process.cwd(), 'Husi'));

exports.handler = async (event) => {
    try {
        const content = await getWarpConfigLink8();
        
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

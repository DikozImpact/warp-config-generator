const express = require('express');
const { verify } = require('hcaptcha');
const { getWarpConfigLink } = require('./AWGp');
const { getWarpConfigLink2 } = require('./Karing');
const { getWarpConfigLink3 } = require('./WarpInWarp');
const { getWarpConfigLink4 } = require('./AWGr');
const { getWarpConfigLink5 } = require('./Neko');
const { getWarpConfigLink6 } = require('./AWGm');
const { getWarpConfigLink7 } = require('./Clash');
const { getWarpConfigLink8 } = require('./Husi');
const { getWarpConfigLink9 } = require('./Throne');
const { getWarpConfigLink10 } = require('./Clash15');
const path = require('path');

const app = express();

// Добавляем middleware для обработки JSON
app.use(express.json());

// Подключаем статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Секретный ключ hCaptcha (получите его на https://dashboard.hcaptcha.com/)
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET || null;

// Middleware для проверки hCaptcha
async function verifyCaptcha(req, res, next) {
    const token = req.body.captchaToken || req.query.captchaToken;
    
    if (!token) {
        return res.status(400).json({ 
            success: false, 
            message: 'Токен капчи отсутствует.' 
        });
    }

    try {
        const verification = await verify(HCAPTCHA_SECRET, token);
        
        if (verification.success) {
            next();
        } else {
            res.status(400).json({ 
                success: false, 
                message: 'Проверка капчи не пройдена.' 
            });
        }
    } catch (error) {
        console.error('Ошибка проверки капчи:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка при проверке капчи.' 
        });
    }
}

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Маршруты для генерации конфигов с проверкой капчи
app.post('/warps', verifyCaptcha, async (req, res) => {
    try {
        const dns = req.body.dns || "1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001";
        const allowedIPs = req.body.allowedIPs || "0.0.0.0/0, ::/0";
        const content = await getWarpConfigLink(dns, allowedIPs);
        if (content) {
            res.json({ success: true, content });
        } else {
            res.status(500).json({ success: false, message: 'Не удалось сгенерировать конфиг.' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка на сервере.' });
    }
});

app.post('/warp2', verifyCaptcha, async (req, res) => {
    try {
        const content = await getWarpConfigLink2();
        if (content) {
            res.json({ success: true, content });
        } else {
            res.status(500).json({ success: false, message: 'Не удалось сгенерировать конфиг.' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка на сервере.' });
    }
});

app.post('/warp3', verifyCaptcha, async (req, res) => {
    try {
        const content = await getWarpConfigLink3();
        if (content) {
            res.json({ success: true, content });
        } else {
            res.status(500).json({ success: false, message: 'Не удалось сгенерировать конфиг.' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка на сервере.' });
    }
});

app.post('/warp4s', verifyCaptcha, async (req, res) => {
    try {
        const dns = req.body.dns || "1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001"; 
        const allowedIPs = req.body.allowedIPs || "0.0.0.0/0, ::/0"; 
        const content = await getWarpConfigLink4(dns, allowedIPs);
        if (content) {
            res.json({ success: true, content });
        } else {
            res.status(500).json({ success: false, message: 'Не удалось сгенерировать конфиг.' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка на сервере.' });
    }
});

app.post('/warp5', verifyCaptcha, async (req, res) => {
    try {
        const content = await getWarpConfigLink5();
        if (content) {
            res.json({ success: true, content });
        } else {
            res.status(500).json({ success: false, message: 'Не удалось сгенерировать конфиг.' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка на сервере.' });
    }
});

app.post('/warp6s', verifyCaptcha, async (req, res) => {
    try {
        const dns = req.body.dns || "1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001";
        const allowedIPs = req.body.allowedIPs || "0.0.0.0/0, ::/0";
        const content = await getWarpConfigLink6(dns, allowedIPs);
        if (content) {
            res.json({ success: true, content });
        } else {
            res.status(500).json({ success: false, message: 'Не удалось сгенерировать конфиг.' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка на сервере.' });
    }
});

app.post('/warp7', verifyCaptcha, async (req, res) => {
    try {
        const content = await getWarpConfigLink7();
        if (content) {
            res.json({ success: true, content });
        } else {
            res.status(500).json({ success: false, message: 'Не удалось сгенерировать конфиг.' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка на сервере.' });
    }
});

app.post('/warp8', verifyCaptcha, async (req, res) => {
    try {
        const content = await getWarpConfigLink8();
        if (content) {
            res.json({ success: true, content });
        } else {
            res.status(500).json({ success: false, message: 'Не удалось сгенерировать конфиг.' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка на сервере.' });
    }
});

app.post('/warp9', verifyCaptcha, async (req, res) => {
    try {
        const content = await getWarpConfigLink9();
        if (content) {
            res.json({ success: true, content });
        } else {
            res.status(500).json({ success: false, message: 'Не удалось сгенерировать конфиг.' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка на сервере.' });
    }
});

app.post('/warp10', verifyCaptcha, async (req, res) => {
    try {
        const content = await getWarpConfigLink10();
        if (content) {
            res.json({ success: true, content });
        } else {
            res.status(500).json({ success: false, message: 'Не удалось сгенерировать конфиг.' });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка на сервере.' });
    }
});

module.exports = app;
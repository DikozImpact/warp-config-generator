// Глобальные переменные для хранения текущего действия
let currentAction = null;
let currentEndpoint = null;
let pendingRequestData = null;
let hcaptchaWidgetId = null;

// Функция для показа модального окна капчи
function showCaptchaModal(action, endpoint, requestData = null) {
    currentAction = action;
    currentEndpoint = endpoint;
    pendingRequestData = requestData;
    
    const modal = document.getElementById('captchaModal');
    modal.style.display = 'block';
    
    // Рендерим капчу если еще не отрендерена
    if (typeof hcaptcha !== 'undefined') {
        if (hcaptchaWidgetId === null) {
            try {
                hcaptchaWidgetId = hcaptcha.render(document.querySelector('.h-captcha'), {
                    sitekey: 'YOUR_SITE_KEY' // Замените на ваш Site Key
                });
            } catch (e) {
                console.error('Ошибка рендеринга hCaptcha:', e);
            }
        }
    } else if (typeof hcaptcha !== 'undefined') {
        // Сбрасываем капчу если уже была отрендерена
        hcaptcha.reset(hcaptchaWidgetId);
    }
}

// Функция для скрытия модального окна капчи
function closeCaptchaModal() {
    const modal = document.getElementById('captchaModal');
    modal.style.display = 'none';
    
    if (typeof hcaptcha !== 'undefined') {
        hcaptcha.reset();
    }
    
    document.getElementById('captchaError').style.display = 'none';
    currentAction = null;
    currentEndpoint = null;
    pendingRequestData = null;
}

// Обработчик закрытия модального окна капчи
document.getElementById('closeCaptcha').addEventListener('click', closeCaptchaModal);

// Обработчик кнопки подтверждения капчи
document.getElementById('verifyCaptchaButton').addEventListener('click', async function() {
    const captchaToken = hcaptcha.getResponse(hcaptchaWidgetId);
    const errorDiv = document.getElementById('captchaError');
    
    if (!captchaToken) {
        errorDiv.textContent = 'Пожалуйста, пройдите проверку капчи';
        errorDiv.style.display = 'block';
        return;
    }
    
    errorDiv.style.display = 'none';
    
    // Сохраняем action перед закрытием модалки
    const actionToExecute = currentAction;
    
    closeCaptchaModal();
    
    // Выполняем отложенное действие с токеном капчи
    if (actionToExecute) {
        await actionToExecute(captchaToken);
    }
});

// Универсальная функция для генерации конфига с капчей
async function generateConfigWithCaptcha(endpoint, filename, button, captchaToken) {
    const button_text = document.querySelector(`#${button.id} .button__text`);
    const status = document.getElementById('status');
    const info = document.getElementById('info');
    const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;

    const selectedDNS = getSelectedDNS();
    const allowedIPs = getSelectedSites();

    button.disabled = true;
    button.classList.add("button--loading");

    try {
        const requestData = {
            captchaToken: captchaToken,
            dns: selectedDNS,
            allowedIPs: allowedIPs
        };

        const response = await fetch(`/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (data.success) {
            const downloadFile = () => {
                const link = document.createElement('a');
                link.href = 'data:application/octet-stream;base64,' + data.content;
                link.download = filename.replace('{random}', randomNumber);
                link.click();
            };

            button_text.textContent = `Скачать ${filename.replace('{random}', randomNumber)}`;
            button.onclick = downloadFile;
            downloadFile();
        } else {
            status.textContent = 'Ошибка: ' + data.message;
        }
    } catch (error) {
        status.textContent = 'Произошла ошибка при генерации.';
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    }
    info.textContent = status.textContent;
}

// Функция для генерации конфига (оборачивает в капчу)
async function generateConfig() {
    const button = document.getElementById('generateButton');
    showCaptchaModal(
        (token) => generateConfigWithCaptcha('warps', 'WARPr_{random}.conf', button, token),
        'warps'
    );
}

async function generateConfig2() {
    const button = document.getElementById('generateButton2');
    showCaptchaModal(
        async (captchaToken) => {
            const button_text = document.querySelector('#generateButton2 .button__text');
            const status = document.getElementById('status');
            const info = document.getElementById('info');
            const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;

            button.disabled = true;
            button.classList.add("button--loading");

            try {
                const response = await fetch('/warp2', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ captchaToken })
                });
                
                const data = await response.json();

                if (data.success) {
                    const downloadFile = () => {
                        const link = document.createElement('a');
                        link.href = 'data:application/octet-stream;base64,' + data.content;
                        link.download = `KaringWARP_${randomNumber}.conf`;
                        link.click();
                    };

                    button_text.textContent = `Скачать KaringWARP_${randomNumber}.conf`;
                    button.onclick = downloadFile;
                    downloadFile();
                } else {
                    status.textContent = 'Ошибка: ' + data.message;
                }
            } catch (error) {
                status.textContent = 'Произошла ошибка при генерации.';
            } finally {
                button.disabled = false;
                button.classList.remove("button--loading");
            }
            info.textContent = status.textContent;
        },
        'warp2'
    );
}

async function generateConfig3() {
    const button = document.getElementById('generateButton3');
    showCaptchaModal(
        async (captchaToken) => {
            const button_text = document.querySelector('#generateButton3 .button__text');
            const status = document.getElementById('status');
            const info = document.getElementById('info');
            const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;

            button.disabled = true;
            button.classList.add("button--loading");

            try {
                const response = await fetch('/warp3', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ captchaToken })
                });
                
                const data = await response.json();

                if (data.success) {
                    const downloadFile = () => {
                        const link = document.createElement('a');
                        link.href = 'data:application/octet-stream;base64,' + data.content;
                        link.download = `WARPinWARP_${randomNumber}.conf`;
                        link.click();
                    };

                    button_text.textContent = `Скачать WARPinWARP_${randomNumber}.conf`;
                    button.onclick = downloadFile;
                    downloadFile();
                } else {
                    status.textContent = 'Ошибка: ' + data.message;
                }
            } catch (error) {
                status.textContent = 'Произошла ошибка при генерации.';
            } finally {
                button.disabled = false;
                button.classList.remove("button--loading");
            }
            info.textContent = status.textContent;
        },
        'warp3'
    );
}

async function generateConfig4() {
    const button = document.getElementById('generateButton4');
    showCaptchaModal(
        (token) => generateConfigWithCaptcha('warp4s', 'WARPm2_{random}.conf', button, token),
        'warp4s'
    );
}

async function generateConfig5() {
    const button = document.getElementById('generateButton5');
    showCaptchaModal(
        async (captchaToken) => {
            const button_text = document.querySelector('#generateButton5 .button__text');
            const status = document.getElementById('status');
            const info = document.getElementById('info');
            const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;

            button.disabled = true;
            button.classList.add("button--loading");

            try {
                const response = await fetch('/warp5', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ captchaToken })
                });
                
                const data = await response.json();

                if (data.success) {
                    const downloadFile = () => {
                        const link = document.createElement('a');
                        link.href = 'data:application/octet-stream;base64,' + data.content;
                        link.download = `NekoWARP_${randomNumber}.conf`;
                        link.click();
                    };

                    button_text.textContent = `Скачать NekoWARP_${randomNumber}.conf`;
                    button.onclick = downloadFile;
                    downloadFile();
                } else {
                    status.textContent = 'Ошибка: ' + data.message;
                }
            } catch (error) {
                status.textContent = 'Произошла ошибка при генерации.';
            } finally {
                button.disabled = false;
                button.classList.remove("button--loading");
            }
            info.textContent = status.textContent;
        },
        'warp5'
    );
}

async function generateConfig6() {
    const button = document.getElementById('generateButton6');
    showCaptchaModal(
        (token) => generateConfigWithCaptcha('warp6s', 'WARPm1_{random}.conf', button, token),
        'warp6s'
    );
}

async function generateConfig7() {
    const button = document.getElementById('generateButton7');
    showCaptchaModal(
        async (captchaToken) => {
            const button_text = document.querySelector('#generateButton7 .button__text');
            const status = document.getElementById('status');
            const info = document.getElementById('info');
            const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;

            button.disabled = true;
            button.classList.add("button--loading");

            try {
                const response = await fetch('/warp7', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ captchaToken })
                });
                
                const data = await response.json();

                if (data.success) {
                    const downloadFile = () => {
                        const link = document.createElement('a');
                        link.href = 'data:application/octet-stream;base64,' + data.content;
                        link.download = `ClashWARP_${randomNumber}.yaml`;
                        link.click();
                    };

                    button_text.textContent = `Скачать ClashWARP_${randomNumber}.yaml`;
                    button.onclick = downloadFile;
                    downloadFile();
                } else {
                    status.textContent = 'Ошибка: ' + data.message;
                }
            } catch (error) {
                status.textContent = 'Произошла ошибка при генерации.';
            } finally {
                button.disabled = false;
                button.classList.remove("button--loading");
            }
            info.textContent = status.textContent;
        },
        'warp7'
    );
}

async function generateConfig8() {
    const button = document.getElementById('generateButton8');
    showCaptchaModal(
        async (captchaToken) => {
            const button_text = document.querySelector('#generateButton8 .button__text');
            const status = document.getElementById('status');
            const info = document.getElementById('info');
            const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;

            button.disabled = true;
            button.classList.add("button--loading");

            try {
                const response = await fetch('/warp8', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ captchaToken })
                });
                
                const data = await response.json();

                if (data.success) {
                    const downloadFile = () => {
                        const link = document.createElement('a');
                        link.href = 'data:application/octet-stream;base64,' + data.content;
                        link.download = `HusiWARP_${randomNumber}.conf`;
                        link.click();
                    };

                    button_text.textContent = `Скачать HusiWARP_${randomNumber}.conf`;
                    button.onclick = downloadFile;
                    downloadFile();
                } else {
                    status.textContent = 'Ошибка: ' + data.message;
                }
            } catch (error) {
                status.textContent = 'Произошла ошибка при генерации.';
            } finally {
                button.disabled = false;
                button.classList.remove("button--loading");
            }
            info.textContent = status.textContent;
        },
        'warp8'
    );
}

async function generateConfig9() {
    const button = document.getElementById('generateButton9');
    showCaptchaModal(
        async (captchaToken) => {
            const button_text = document.querySelector('#generateButton9 .button__text');
            const status = document.getElementById('status');
            const info = document.getElementById('info');
            const modal2 = document.getElementById('ThroneModal');
            const throneText = document.getElementById('throneText');

            button.disabled = true;
            button.classList.add("button--loading");

            try {
                const response = await fetch('/warp9', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ captchaToken })
                });
                
                const data = await response.json();

                if (data.success) {
                    const conf = atob(data.content);
                    throneText.value = conf;
                    modal2.style.display = "block";
                    button_text.textContent = "WARP";
                } else {
                    status.textContent = 'Ошибка: ' + data.message;
                }
            } catch (error) {
                status.textContent = 'Произошла ошибка при генерации.';
            } finally {
                button.disabled = false;
                button.classList.remove("button--loading");
            }
            info.textContent = status.textContent;
        },
        'warp9'
    );
}

async function generateConfig10() {
    const button = document.getElementById('generateButton10');
    showCaptchaModal(
        async (captchaToken) => {
            const button_text = document.querySelector('#generateButton10 .button__text');
            const status = document.getElementById('status');
            const info = document.getElementById('info');
            const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;

            button.disabled = true;
            button.classList.add("button--loading");

            try {
                const response = await fetch('/warp10', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ captchaToken })
                });
                
                const data = await response.json();

                if (data.success) {
                    const downloadFile = () => {
                        const link = document.createElement('a');
                        link.href = 'data:application/octet-stream;base64,' + data.content;
                        link.download = `ClashWARP_${randomNumber}.yaml`;
                        link.click();
                    };

                    button_text.textContent = `Скачать ClashWARP_${randomNumber}.yaml`;
                    button.onclick = downloadFile;
                    downloadFile();
                } else {
                    status.textContent = 'Ошибка: ' + data.message;
                }
            } catch (error) {
                status.textContent = 'Произошла ошибка при генерации.';
            } finally {
                button.disabled = false;
                button.classList.remove("button--loading");
            }
            info.textContent = status.textContent;
        },
        'warp10'
    );
}

// Привязка кнопок
document.getElementById('generateButton').onclick = generateConfig;
document.getElementById('generateButton2').onclick = generateConfig2;
document.getElementById('generateButton3').onclick = generateConfig3;
document.getElementById('generateButton4').onclick = generateConfig4;
document.getElementById('generateButton5').onclick = generateConfig5;
document.getElementById('generateButton6').onclick = generateConfig6;
document.getElementById('generateButton7').onclick = generateConfig7;
document.getElementById('generateButton8').onclick = generateConfig8;
document.getElementById('generateButton9').onclick = generateConfig9;
document.getElementById('generateButton10').onclick = generateConfig10;

document.getElementById('telegramButton').onclick = function() {
    window.location.href = 'https://t.me/warp_1_1_1_1';
}

document.getElementById('githubButton').onclick = function() {
    window.location.href = 'https://help-guide.notion.site/1f72684dab0d8092a582ed6328632d06';
}

document.getElementById('promoButton').onclick = function() {
    window.location.href = 'https://help-guide.notion.site/Amnezia-Premium-1f72684dab0d8013a057ed6562c8bdca';
}

function getSelectedDNS() {
    if (document.getElementById('dns1').checked) {
        return "1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001";
    } else if (document.getElementById('dns2').checked) {
        return "84.21.189.133, 2a12:bec4:1460:d5::2, 64.188.98.242, 2a01:ecc0:2c1:2::2";
    } else if (document.getElementById('dns3').checked) {
        return "176.99.11.77, 80.78.247.254, 2a00:f940:2:4:2::5d1b, 2a00:f940:2:4:2::21ed";
    }
}

function getSelectedSites() {
    const sites = [
        { id: 'st1', ip: '1.0.0.0/9, 1.192.0.0/10, 101.64.0.0/10, 103.0.0.0/14, 103.100.128.0/19, 103.101.0.0/18, 103.103.128.0/17, 103.105.0.0/16, 103.106.192.0/18, 103.107.128.0/17, 103.108.0.0/17, 103.111.128.0/17, 103.111.64.0/19, 103.112.48.0/21, 103.118.64.0/18, 103.119.0.0/16, 103.12.0.0/16, 103.120.0.0/16, 103.122.0.0/15, 103.124.0.0/16, 103.132.16.0/20, 103.132.64.0/18, 103.137.0.0/17, 103.139.128.0/17, 103.14.16.0/20, 103.140.0.0/16, 103.141.64.0/22, 103.144.0.0/16, 103.146.0.0/15, 103.148.0.0/14, 103.15.0.0/16, 103.152.0.0/13, 103.160.0.0/11, 103.17.128.0/17, 103.192.0.0/17, 103.193.0.0/17, 103.196.128.0/17, 103.199.0.0/18, 103.199.192.0/19, 103.199.224.0/21, 103.199.64.0/20, 103.20.0.0/16, 103.200.28.0/22, 103.200.32.0/19, 103.206.128.0/18, 103.21.0.0/17, 103.21.128.0/18, 103.211.104.0/21, 103.211.16.0/20, 103.214.160.0/20, 103.214.192.0/18, 103.218.0.0/16, 103.221.128.0/17, 103.225.176.0/20, 103.225.96.0/19, 103.226.128.0/18, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.232.128.0/19, 103.233.0.0/16, 103.234.0.0/17, 103.240.180.0/22, 103.242.0.0/19, 103.242.128.0/17, 103.243.0.0/18, 103.243.112.0/21, 103.246.240.0/21, 103.249.0.0/16, 103.25.128.0/17, 103.251.0.0/17, 103.251.192.0/18, 103.252.96.0/19, 103.26.208.0/20, 103.27.0.0/17, 103.28.0.0/15, 103.38.0.0/16, 103.39.128.0/17, 103.39.64.0/18, 103.40.0.0/16, 103.41.0.0/19, 103.42.0.0/16, 103.44.0.0/16, 103.52.0.0/16, 103.54.32.0/19, 103.56.0.0/17, 103.58.64.0/18, 103.59.128.0/17, 103.62.128.0/17, 103.66.64.0/18, 103.7.0.0/17, 103.70.0.0/16, 103.73.160.0/21, 103.73.64.0/18, 103.76.192.0/18, 103.80.0.0/17, 103.85.128.0/17, 103.85.64.0/18, 103.88.192.0/19, 103.89.0.0/16, 103.94.128.0/17, 103.97.0.0/18, 103.97.128.0/18, 104.16.0.0/12, 104.237.160.0/19, 104.244.40.0/21, 104.36.192.0/21, 105.0.0.0/8, 106.0.0.0/8, 107.181.160.0/19, 108.160.160.0/20, 108.177.0.0/17, 109.224.41.0/24, 109.239.184.0/21, 110.0.0.0/10, 110.128.0.0/10, 110.64.0.0/12, 110.93.128.0/17, 111.0.0.0/8, 112.0.0.0/8, 113.128.0.0/10, 113.192.0.0/13, 113.64.0.0/10, 114.0.0.0/9, 114.136.0.0/13, 114.250.63.0/24, 114.250.64.0/23, 114.250.67.0/24, 114.250.69.0/24, 114.250.70.0/24, 115.126.0.0/15, 115.164.0.0/15, 115.176.0.0/12, 115.64.0.0/11, 116.204.128.0/18, 116.206.0.0/18, 116.206.128.0/19, 116.212.128.0/19, 116.56.0.0/13, 116.64.0.0/10, 117.0.0.0/12, 117.128.0.0/9, 117.52.0.0/15, 117.55.224.0/19, 117.96.0.0/12, 118.107.180.0/22, 118.128.0.0/9, 118.68.0.0/14, 118.96.0.0/13, 119.0.0.0/13, 119.152.0.0/13, 119.16.0.0/12, 119.160.0.0/11, 119.32.0.0/11, 120.0.0.0/8, 121.64.0.0/12, 122.0.0.0/10, 122.144.0.0/14, 122.152.0.0/13, 122.192.0.0/11, 122.248.0.0/14, 122.252.0.0/15, 123.104.0.0/13, 123.128.0.0/10, 123.192.0.0/11, 123.240.0.0/13, 123.253.0.0/18, 124.0.0.0/9, 124.192.0.0/11, 124.248.0.0/14, 125.128.0.0/9, 125.64.0.0/10, 128.0.0.0/16, 128.121.0.0/16, 128.242.0.0/16, 128.75.0.0/16, 130.211.0.0/16, 137.59.16.0/20, 137.59.32.0/20, 137.59.64.0/18, 139.5.64.0/19, 14.102.128.0/18, 14.128.0.0/9, 140.213.0.0/16, 142.161.0.0/16, 142.250.0.0/15, 144.48.128.0/18, 145.236.72.0/23, 145.255.0.0/20, 148.163.0.0/17, 148.64.96.0/20, 148.69.0.0/16, 149.54.0.0/17, 150.107.0.0/18, 150.107.204.0/22, 150.129.0.0/21, 150.129.32.0/19, 150.129.96.0/19, 154.0.0.0/13, 154.64.0.0/10, 156.233.0.0/16, 157.20.0.0/16, 157.240.0.0/16, 157.8.0.0/14, 159.106.0.0/16, 159.138.0.0/16, 159.192.0.0/16, 159.65.0.0/16, 161.49.0.0/17, 162.125.0.0/16, 162.220.8.0/21, 162.252.180.0/22, 163.40.0.0/13, 163.53.64.0/18, 164.215.0.0/16, 165.165.0.0/16, 165.21.0.0/16, 166.70.0.0/16, 168.143.0.0/16, 170.238.0.0/16, 171.128.0.0/9, 171.96.0.0/11, 172.217.0.0/16, 172.253.0.0/16, 172.64.0.0/13, 173.194.0.0/16, 173.208.128.0/17, 173.231.0.0/18, 173.234.32.0/19, 173.236.128.0/17, 173.244.192.0/19, 173.252.192.0/18, 173.252.64.0/18, 173.255.192.0/18, 174.36.0.0/15, 175.104.0.0/14, 175.112.0.0/12, 175.96.0.0/13, 176.28.128.0/17, 177.64.0.0/12, 178.151.230.0/24, 178.176.156.0/24, 178.22.168.0/24, 179.32.0.0/12, 179.60.0.0/16, 179.64.0.0/10, 180.149.224.0/19, 180.149.48.0/20, 180.149.64.0/18, 180.160.0.0/11, 180.192.0.0/11, 181.0.0.0/11, 181.208.0.0/14, 182.0.0.0/9, 182.176.0.0/12, 182.192.0.0/10, 183.0.0.0/8, 184.150.0.0/17, 184.150.128.0/18, 184.172.0.0/15, 184.72.0.0/15, 185.100.209.0/24, 185.158.208.0/23, 185.192.248.0/26, 185.192.249.0/24, 185.192.251.192/26, 185.23.124.0/23, 185.45.4.0/22, 185.48.9.0/24, 185.5.161.0/26, 185.60.216.0/22, 185.61.94.0/23, 186.128.0.0/9, 187.0.0.0/11, 187.128.0.0/9, 188.114.96.0/22, 188.120.127.0/24, 188.21.9.0/24, 188.43.61.0/24, 188.43.68.0/23, 188.93.174.0/24, 189.128.0.0/9, 190.0.0.0/10, 190.224.0.0/11, 192.133.76.0/22, 192.135.88.0/21, 192.178.0.0/15, 192.248.0.0/17, 192.86.0.0/24, 193.109.164.0/22, 193.126.242.0/26, 194.78.0.0/24, 194.9.24.0/24, 194.9.25.0/24, 195.12.177.0/26, 195.176.255.192/26, 195.187.0.0/16, 195.87.177.0/24, 195.95.178.0/24, 196.1.128.0/17, 196.128.0.0/9, 196.32.0.0/11, 197.0.0.0/8, 198.27.64.0/18, 198.44.160.0/19, 199.16.156.0/22, 199.193.112.0/21, 199.59.148.0/22, 199.85.224.0/21, 199.96.56.0/21, 200.96.0.0/11, 201.0.0.0/11, 201.160.0.0/11, 201.48.0.0/16, 202.128.0.0/14, 202.136.0.0/13, 202.148.0.0/14, 202.152.0.0/13, 202.160.0.0/15, 202.163.0.0/16, 202.165.0.0/16, 202.166.0.0/15, 202.168.0.0/15, 202.182.0.0/15, 202.184.0.0/13, 202.24.0.0/13, 202.39.0.0/16, 202.51.64.0/21, 202.51.72.0/22, 202.51.79.0/24, 202.52.0.0/14, 202.60.0.0/16, 202.64.0.0/14, 202.68.0.0/15, 202.70.0.0/16, 202.72.0.0/14, 202.79.0.0/17, 202.80.0.0/13, 202.88.0.0/14, 202.93.0.0/16, 203.101.0.0/16, 203.110.0.0/15, 203.112.0.0/12, 203.128.0.0/12, 203.144.0.0/13, 203.162.0.0/15, 203.167.0.0/16, 203.170.0.0/16, 203.171.128.0/17, 203.176.0.0/13, 203.184.0.0/14, 203.189.0.0/17, 203.192.0.0/10, 203.64.0.0/13, 203.76.0.0/15, 203.78.0.0/17, 203.80.0.0/13, 204.145.2.0/23, 204.79.196.0/23, 204.84.0.0/15, 205.186.128.0/18, 206.144.0.0/14, 207.231.168.0/21, 208.0.0.0/11, 208.101.0.0/18, 208.110.64.0/19, 208.187.128.0/17, 208.192.0.0/10, 208.43.0.0/16, 208.54.0.0/17, 208.77.40.0/21, 208.84.220.0/22, 208.98.128.0/18, 209.115.128.0/17, 209.141.112.0/20, 209.145.96.0/19, 209.146.0.0/17, 209.148.128.0/17, 209.191.192.0/19, 209.52.0.0/15, 209.85.128.0/17, 209.91.64.0/18, 209.95.32.0/19, 210.0.0.0/7, 212.106.200.0/21, 212.113.52.0/24, 212.156.0.0/16, 212.188.10.0/24, 212.188.34.0/24, 212.188.35.0/24, 212.188.37.0/24, 212.188.49.0/24, 212.20.18.0/24, 212.39.86.0/24, 212.43.1.0/24, 212.43.8.0/21, 212.55.184.0/22, 212.90.48.0/20, 213.152.1.64/27, 213.202.0.0/21, 213.55.64.0/18, 213.59.192.0/18, 216.105.64.0/20, 216.123.192.0/18, 216.19.176.0/20, 216.239.32.0/19, 216.58.192.0/19, 217.119.118.64/26, 217.130.7.0/25, 217.175.200.64/26, 217.197.248.0/23, 217.73.128.0/22, 218.0.0.0/7, 220.0.0.0/9, 220.160.0.0/11, 221.0.0.0/8, 222.0.0.0/8, 223.128.0.0/9, 223.25.128.0/17, 223.27.128.0/17, 223.32.0.0/11, 23.142.48.0/24, 23.152.160.0/24, 23.192.0.0/11, 23.224.0.0/15, 23.234.0.0/18, 23.96.0.0/13, 24.244.0.0/18, 27.112.0.0/13, 27.128.0.0/9, 27.2.0.0/15, 27.64.0.0/11, 27.96.0.0/12, 31.13.64.0/18, 31.145.0.0/16, 34.64.0.0/10, 36.0.0.0/9, 37.152.0.0/22, 38.0.0.0/7, 4.0.0.0/9, 40.136.0.0/15, 41.0.0.0/8, 42.0.0.0/8, 43.224.0.0/16, 43.226.16.0/20, 43.228.0.0/16, 43.230.128.0/21, 43.245.128.0/20, 43.245.144.0/21, 43.245.192.0/20, 43.245.96.0/20, 43.250.0.0/16, 43.252.16.0/21, 45.112.128.0/18, 45.113.128.0/18, 45.114.8.0/21, 45.116.192.0/19, 45.116.224.0/20, 45.118.240.0/21, 45.121.128.0/17, 45.124.0.0/18, 45.127.0.0/17, 45.14.108.0/22, 45.249.0.0/16, 45.253.0.0/16, 45.54.0.0/17, 45.64.0.0/16, 45.76.0.0/15, 46.134.192.0/18, 46.32.101.0/24, 46.36.112.0/20, 46.61.0.0/16, 47.88.0.0/14, 49.192.0.0/11, 49.224.0.0/13, 49.32.0.0/11, 5.195.0.0/16, 5.21.228.0/22, 5.30.0.0/15, 5.32.175.0/24, 50.0.0.0/15, 50.117.0.0/17, 50.128.0.0/9, 50.22.0.0/15, 50.87.0.0/16, 51.39.0.0/16, 52.0.0.0/10, 52.160.0.0/11, 54.144.0.0/12, 54.224.0.0/11, 54.64.0.0/11, 58.0.0.0/10, 58.112.0.0/12, 58.128.0.0/9, 58.64.0.0/11, 59.0.0.0/9, 59.152.0.0/18, 59.152.96.0/20, 59.153.128.0/17, 59.160.0.0/11, 61.0.0.0/13, 61.128.0.0/9, 61.16.0.0/12, 61.32.0.0/11, 61.64.0.0/10, 62.0.0.0/16, 62.149.96.0/20, 62.212.240.0/20, 62.231.75.0/24, 63.64.0.0/10, 64.13.192.0/18, 64.15.112.0/20, 64.233.160.0/19, 64.4.224.0/20, 64.53.128.0/17, 65.192.0.0/11, 65.240.0.0/13, 65.49.0.0/17, 66.102.0.0/20, 66.112.176.0/20, 66.220.144.0/20, 66.248.254.0/24, 66.58.128.0/17, 66.96.224.0/19, 67.15.0.0/16, 67.204.128.0/18, 67.228.0.0/16, 67.230.160.0/19, 67.50.0.0/17, 69.162.128.0/18, 69.171.224.0/19, 69.197.128.0/18, 69.30.0.0/18, 69.48.216.0/21, 69.50.192.0/19, 69.51.64.0/18, 69.59.192.0/19, 69.63.176.0/20, 72.19.32.0/19, 72.234.0.0/15, 74.125.0.0/16, 74.86.0.0/16, 75.126.0.0/16, 75.98.144.0/20, 77.120.12.0/22, 77.37.252.0/23, 79.133.76.0/23, 80.253.29.0/24, 80.77.172.0/22, 80.87.198.0/23, 80.87.64.0/19, 80.97.192.0/18, 81.130.96.0/20, 81.192.0.0/16, 81.200.2.0/24, 81.23.16.0/21, 81.23.24.0/21, 81.27.242.128/27, 82.114.162.0/23, 82.147.133.128/26, 82.148.96.0/19, 82.76.231.64/26, 83.219.145.0/24, 83.224.64.0/20, 84.15.64.0/24, 84.235.64.0/22, 84.235.77.0/24, 84.235.78.0/24, 85.112.112.0/20, 86.120.7.128/27, 86.62.126.64/27, 87.245.192.0/20, 87.245.216.0/21, 88.191.249.0/24, 88.201.0.0/17, 89.27.128.0/17, 90.180.0.0/14, 90.200.0.0/14, 91.185.2.0/24, 92.80.0.0/13, 93.123.23.0/24, 93.179.96.0/21, 94.142.38.0/24, 94.203.108.0/23, 94.24.192.0/18, 94.31.189.0/24, 94.96.0.0/14, 95.142.107.0/27, 95.167.73.0/24, 95.168.192.0/19, 95.59.170.0/24, 95.66.0.0/18, 96.30.64.0/18, 96.44.128.0/18, 96.63.128.0/19, 96.9.128.0/19, 98.159.96.0/20' },
        { id: 'st2', ip: '103.224.0.0/16, 104.16.0.0/12, 108.136.0.0/14, 108.156.0.0/14, 13.224.0.0/12, 13.248.0.0/14, 13.32.0.0/12, 138.128.136.0/21, 143.204.0.0/16, 15.196.0.0/14, 15.204.0.0/16, 162.158.0.0/15, 162.210.192.0/21, 170.178.160.0/19, 172.64.0.0/13, 18.128.0.0/9, 18.64.0.0/10, 185.107.56.0/24, 188.114.96.0/22, 192.157.48.0/20, 199.115.112.0/21, 204.11.56.0/23, 207.244.64.0/18, 208.91.196.0/23, 216.137.32.0/19, 23.227.32.0/19, 3.128.0.0/9, 34.0.0.0/15, 34.2.0.0/15, 35.192.0.0/12, 35.208.0.0/12, 37.1.216.0/21, 37.48.64.0/18, 45.134.10.0/24, 5.200.14.128/25, 51.81.0.0/16, 52.222.0.0/16, 52.84.0.0/14, 65.8.0.0/14, 66.22.192.0/18, 69.162.64.0/18, 70.32.0.0/20, 74.63.192.0/18, 76.223.0.0/17, 8.0.0.0/13, 8.32.0.0/11, 82.192.64.0/19' },
        { id: 'st3', ip: '104.16.0.0/12, 104.244.40.0/21, 146.75.0.0/16, 151.101.0.0/16, 152.192.0.0/13, 162.158.0.0/15, 172.64.0.0/13, 192.229.128.0/17, 199.232.0.0/16, 209.237.192.0/19, 68.232.32.0/20, 69.195.160.0/19, 93.184.220.0/22' },
        { id: 'st4', ip: '102.0.0.0/8, 103.200.28.0/22, 103.214.160.0/20, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19, 103.39.64.0/18, 103.42.0.0/16, 103.56.0.0/17, 103.73.160.0/21, 103.97.0.0/18, 103.97.128.0/18, 104.16.0.0/12, 104.244.40.0/21, 107.181.160.0/19, 108.160.160.0/20, 111.0.0.0/8, 114.0.0.0/10, 115.126.0.0/15, 116.64.0.0/10, 118.107.180.0/22, 118.128.0.0/9, 119.16.0.0/12, 122.0.0.0/10, 122.248.0.0/14, 124.0.0.0/9, 128.121.0.0/16, 128.242.0.0/16, 129.134.0.0/16, 130.211.0.0/16, 148.163.0.0/17, 150.107.0.0/18, 154.64.0.0/10, 156.233.0.0/16, 157.240.0.0/16, 159.106.0.0/16, 159.138.0.0/16, 159.65.0.0/16, 162.125.0.0/16, 162.220.8.0/21, 163.70.128.0/17, 168.143.0.0/16, 173.208.128.0/17, 173.231.0.0/18, 173.234.32.0/19, 173.236.128.0/17, 173.244.192.0/19, 173.252.192.0/18, 173.252.64.0/18, 173.255.192.0/18, 174.36.0.0/15, 179.60.0.0/16, 182.0.0.0/9, 184.172.0.0/15, 184.72.0.0/15, 185.45.4.0/22, 185.60.216.0/22, 192.133.76.0/22, 195.229.0.0/16, 198.27.64.0/18, 198.44.160.0/19, 199.16.156.0/22, 199.193.112.0/21, 199.59.148.0/22, 199.96.56.0/21, 202.160.0.0/15, 202.182.0.0/15, 202.52.0.0/14, 203.110.0.0/15, 204.79.196.0/23, 205.186.128.0/18, 208.0.0.0/11, 208.101.0.0/18, 208.43.0.0/16, 208.77.40.0/21, 209.95.32.0/19, 210.0.0.0/7, 212.95.183.192/26, 213.169.57.64/26, 23.224.0.0/15, 23.234.0.0/18, 23.96.0.0/13, 31.13.64.0/18, 38.0.0.0/7, 4.0.0.0/9, 43.226.16.0/20, 45.114.8.0/21, 45.76.0.0/15, 47.88.0.0/14, 50.117.0.0/17, 50.22.0.0/15, 50.87.0.0/16, 52.0.0.0/10, 52.160.0.0/11, 54.224.0.0/11, 54.64.0.0/11, 57.0.0.0/8, 59.0.0.0/9, 59.160.0.0/11, 64.13.192.0/18, 65.49.0.0/17, 66.220.144.0/20, 67.15.0.0/16, 67.228.0.0/16, 67.230.160.0/19, 69.162.128.0/18, 69.171.224.0/19, 69.197.128.0/18, 69.30.0.0/18, 69.50.192.0/19, 69.63.176.0/20, 74.86.0.0/16, 75.126.0.0/16, 80.87.198.0/23, 87.245.208.0/20, 88.191.249.0/24, 93.179.96.0/21, 96.44.128.0/18, 98.159.96.0/20' },
        { id: 'st5', ip: '102.0.0.0/8, 103.200.28.0/22, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19, 103.42.0.0/16, 103.56.0.0/17, 103.73.160.0/21, 103.97.0.0/18, 103.97.128.0/18, 104.16.0.0/12, 104.244.40.0/21, 104.64.0.0/10, 107.181.160.0/19, 108.160.160.0/20, 111.0.0.0/8, 112.0.0.0/8, 114.0.0.0/10, 115.126.0.0/15, 116.64.0.0/10, 118.107.180.0/22, 118.128.0.0/9, 119.16.0.0/12, 122.0.0.0/10, 122.248.0.0/14, 124.0.0.0/9, 128.121.0.0/16, 128.242.0.0/16, 129.134.0.0/16, 13.104.0.0/14, 148.163.0.0/17, 150.107.0.0/18, 152.192.0.0/13, 154.64.0.0/10, 156.233.0.0/16, 157.240.0.0/16, 159.106.0.0/16, 159.138.0.0/16, 159.65.0.0/16, 162.125.0.0/16, 162.220.8.0/21, 163.70.128.0/17, 168.143.0.0/16, 173.208.128.0/17, 173.231.0.0/18, 173.236.128.0/17, 173.244.192.0/19, 173.252.192.0/18, 173.252.64.0/18, 173.255.192.0/18, 174.36.0.0/15, 179.60.0.0/16, 182.0.0.0/9, 184.172.0.0/15, 184.24.0.0/13, 184.50.0.0/15, 184.72.0.0/15, 185.45.4.0/22, 185.60.216.0/22, 192.133.76.0/22, 195.229.0.0/16, 198.27.64.0/18, 198.44.160.0/19, 199.16.156.0/22, 199.193.112.0/21, 199.59.148.0/22, 199.96.56.0/21, 2.16.102.0/23, 2.16.154.0/24, 2.16.16.0/23, 2.16.168.0/23, 2.16.172.0/23, 2.16.52.0/23, 2.17.251.0/24, 2.18.16.0/20, 2.18.64.0/20, 2.19.192.0/24, 2.19.204.0/22, 2.20.45.0/24, 2.21.244.0/23, 2.22.61.0/24, 2.23.144.0/20, 2.23.96.0/20, 202.160.0.0/15, 202.182.0.0/15, 202.52.0.0/14, 203.110.0.0/15, 205.186.128.0/18, 208.0.0.0/11, 208.101.0.0/18, 208.43.0.0/16, 208.77.40.0/21, 209.95.32.0/19, 210.0.0.0/7, 212.95.165.0/26, 213.155.157.0/24, 23.0.0.0/12, 23.192.0.0/11, 23.224.0.0/15, 23.234.0.0/18, 23.32.0.0/11, 23.72.0.0/13, 23.96.0.0/13, 31.13.64.0/18, 38.0.0.0/7, 4.0.0.0/9, 43.226.16.0/20, 45.114.8.0/21, 45.76.0.0/15, 47.88.0.0/14, 50.117.0.0/17, 50.22.0.0/15, 50.87.0.0/16, 52.0.0.0/10, 52.160.0.0/11, 54.224.0.0/11, 54.64.0.0/11, 57.0.0.0/8, 59.0.0.0/9, 59.160.0.0/11, 62.115.252.0/24, 62.115.253.0/24, 64.13.192.0/18, 65.49.0.0/17, 66.220.144.0/20, 67.15.0.0/16, 67.228.0.0/16, 67.230.160.0/19, 69.162.128.0/18, 69.171.224.0/19, 69.197.128.0/18, 69.30.0.0/18, 69.50.192.0/19, 69.63.176.0/20, 72.246.0.0/15, 74.86.0.0/16, 75.126.0.0/16, 80.67.82.0/24, 80.87.198.0/23, 88.191.249.0/24, 88.221.110.0/24, 88.221.111.0/24, 88.221.128.0/21, 92.122.100.0/22, 92.122.224.0/21, 92.123.96.0/20, 93.179.96.0/21, 95.100.128.0/20, 95.100.176.0/20, 95.101.108.0/22, 95.101.20.0/22, 95.101.35.0/24, 95.101.72.0/22, 95.101.76.0/22, 96.44.128.0/18, 98.159.96.0/20' },
        { id: 'st6', ip: '100.24.0.0/13, 103.224.0.0/16, 104.16.0.0/12, 104.64.0.0/10, 107.20.0.0/14, 108.136.0.0/14, 108.156.0.0/14, 108.177.0.0/17, 13.208.0.0/12, 13.224.0.0/12, 13.248.0.0/14, 13.32.0.0/12, 136.143.176.0/20, 139.162.0.0/16, 142.250.0.0/15, 143.204.0.0/16, 15.184.0.0/14, 15.196.0.0/14, 152.228.128.0/17, 16.24.0.0/13, 172.104.0.0/15, 172.217.0.0/16, 172.64.0.0/13, 173.194.0.0/16, 173.222.0.0/15, 174.129.0.0/16, 18.128.0.0/9, 18.64.0.0/10, 184.24.0.0/13, 184.50.0.0/15, 184.72.0.0/15, 185.199.108.0/22, 185.53.177.0/24, 188.114.96.0/22, 192.155.80.0/20, 194.90.0.0/16, 199.59.240.0/22, 199.60.103.0/24, 2.19.16.0/20, 2.20.16.0/22, 2.20.208.0/20, 2.21.192.0/20, 2.22.128.0/20, 204.141.0.0/16, 204.236.128.0/17, 209.85.128.0/17, 216.137.32.0/19, 216.198.0.0/18, 216.58.192.0/19, 23.0.0.0/12, 23.192.0.0/11, 23.20.0.0/14, 23.239.0.0/19, 23.32.0.0/11, 23.64.0.0/14, 3.0.0.0/9, 3.128.0.0/9, 34.192.0.0/10, 34.64.0.0/10, 13, 37.59.32.0/19, 44.192.0.0/10, 50.16.0.0/14, 51.24.0.0/16, 51.91.18.0/24, 52.0.0.0/10, 52.192.0.0/12, 52.208.0.0/13, 52.222.0.0/16, 52.64.0.0/12, 52.84.0.0/14, 54.144.0.0/12, 54.160.0.0/11, 54.192.0.0/12, 54.208.0.0/13, 54.220.0.0/15, 54.224.0.0/11, 54.38.0.0/16, 54.64.0.0/11, 64.233.160.0/19, 65.8.0.0/14, 66.175.208.0/20, 67.202.0.0/18, 69.192.0.0/16, 72.44.32.0/19, 74.125.0.0/16, 74.207.224.0/19, 75.101.128.0/17, 8.0.0.0/13, 8.32.0.0/11, 88.221.68.0/22, 88.221.96.0/22, 92.122.12.0/22, 92.122.68.0/22, 92.123.160.0/21, 92.123.176.0/22, 95.100.224.0/20, 95.100.48.0/20, 95.213.180.0/23, 96.16.0.0/15, 96.6.0.0/15, 98.80.0.0/12, 99.83.128.0/17, 99.84.0.0/16, 99.86.0.0/16' },
        { id: 'st7', ip: '104.16.0.0/12, 162.158.0.0/15, 172.64.0.0/13, 185.81.128.0/23, 188.114.96.0/22' },
        { id: 'st8', ip: '162.19.0.0/16, 186.2.165.0/24, 188.124.37.0/24, 188.165.24.0/21, 54.36.0.0/15, 94.23.152.0/21, 95.129.232.0/24' },
        { id: 'st9', ip: '104.16.0.0/12, 172.64.0.0/13, 185.178.208.0/22, 49.13.80.0/20' },
        { id: 'st10', ip: '103.200.28.0/22, 103.214.160.0/20, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19, 103.39.64.0/18, 103.42.0.0/16, 103.56.0.0/17, 103.73.160.0/21, 103.97.0.0/18, 103.97.128.0/18, 104.16.0.0/12, 104.244.40.0/21, 107.181.160.0/19, 108.160.160.0/20, 111.0.0.0/8, 114.0.0.0/10, 115.126.0.0/15, 116.64.0.0/10, 118.107.180.0/22, 118.128.0.0/9, 119.16.0.0/12, 122.0.0.0/10, 122.248.0.0/14, 124.0.0.0/9, 128.121.0.0/16, 128.242.0.0/16, 13.64.0.0/11, 130.211.0.0/16, 148.163.0.0/17, 150.107.0.0/18, 154.64.0.0/10, 156.233.0.0/16, 157.240.0.0/16, 159.106.0.0/16, 159.138.0.0/16, 159.65.0.0/16, 162.125.0.0/16, 162.220.8.0/21, 167.89.0.0/17, 168.143.0.0/16, 173.208.128.0/17, 173.231.0.0/18, 173.234.32.0/19, 173.236.128.0/17, 173.244.192.0/19, 173.252.192.0/18, 173.252.64.0/18, 173.255.192.0/18, 174.36.0.0/15, 179.60.0.0/16, 18.128.0.0/9, 182.0.0.0/9, 184.172.0.0/15, 184.72.0.0/15, 185.45.4.0/22, 185.60.216.0/22, 192.133.76.0/22, 198.27.64.0/18, 198.44.160.0/19, 199.16.156.0/22, 199.193.112.0/21, 199.59.148.0/22, 199.96.56.0/21, 20.64.0.0/10, 202.160.0.0/15, 202.182.0.0/15, 202.52.0.0/14, 203.110.0.0/15, 204.79.196.0/23, 205.186.128.0/18, 208.0.0.0/11, 208.101.0.0/18, 208.43.0.0/16, 208.77.40.0/21, 209.95.32.0/19, 210.0.0.0/7, 216.198.0.0/18, 23.224.0.0/15, 23.234.0.0/18, 23.96.0.0/13, 3.0.0.0/9, 31.13.64.0/18, 34.64.0.0/10, 35.208.0.0/12, 38.0.0.0/7, 4.0.0.0/9, 40.126.0.0/18, 43.226.16.0/20, 45.114.8.0/21, 45.76.0.0/15, 46.51.192.0/20, 47.88.0.0/14, 50.117.0.0/17, 50.22.0.0/15, 50.87.0.0/16, 52.0.0.0/10, 52.160.0.0/11, 52.224.0.0/11, 52.84.0.0/14, 54.216.0.0/14, 54.224.0.0/11, 54.64.0.0/11, 59.0.0.0/9, 59.160.0.0/11, 64.13.192.0/18, 65.49.0.0/17, 66.220.144.0/20, 67.15.0.0/16, 67.228.0.0/16, 67.230.160.0/19, 69.162.128.0/18, 69.171.224.0/19, 69.197.128.0/18, 69.30.0.0/18, 69.50.192.0/19, 69.63.176.0/20, 74.86.0.0/16, 75.126.0.0/16, 80.87.198.0/23, 88.191.249.0/24, 93.179.96.0/21, 96.44.128.0/18, 98.159.96.0/20' },
        { id: 'st11', ip: '104.16.0.0/12, 136.243.0.0/16, 146.255.0.0/16, 152.89.28.0/23, 162.255.116.0/22, 172.64.0.0/13, 176.58.38.0/23, 176.58.40.0/24, 176.58.41.0/24, 176.58.42.0/24, 176.58.45.0/24, 176.58.46.0/24, 176.58.48.0/23, 176.58.50.0/24, 176.58.54.0/24, 176.58.56.0/24, 176.58.57.0/24, 178.63.75.0/26, 179.32.0.0/12, 185.190.188.0/24, 185.190.190.0/24, 199.59.240.0/22, 199.80.52.0/22, 212.124.124.0/25, 212.124.96.0/24, 45.10.216.0/23, 5.45.76.0/22, 5.45.84.0/22, 5.9.51.64/27, 82.221.104.144/29, 82.221.105.0/24, 85.217.222.0/24, 89.105.207.64/26, 91.132.188.0/23' }
    ];

    const selectedSites = sites.filter(site => document.getElementById(site.id).checked);
    
    if (selectedSites.length === 0) {
        return "0.0.0.0/0, ::/0";
    } else {
        const ips = selectedSites.map(site => site.ip).join(', ');
        return ips; 
    }
}

// Модальные окна
const modal = document.getElementById("infoModal");
const infoBtn = document.getElementById("infoButton");
const span = document.getElementsByClassName("close")[0];
const span1 = document.getElementById("close2");
const modal2 = document.getElementById("ThroneModal");

infoBtn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
    modal2.style.display = "none";
}

span1.onclick = function() {
    modal.style.display = "none";
    modal2.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
    // Закрытие модального окна капчи по клику вне его
    const captchaModal = document.getElementById('captchaModal');
    if (event.target == captchaModal) {
        closeCaptchaModal();
    }
}

// Обработчик кнопки копирования в модальном окне Throne
document.getElementById('copyThroneButton').addEventListener('click', function() {
    const throneText = document.getElementById('throneText');
    throneText.select();
    document.execCommand('copy');
    
    // Показываем уведомление о копировании
    const popup = document.createElement('div');
    popup.className = 'popup-message';
    popup.textContent = 'Скопировано!';
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 2500);
});
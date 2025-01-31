import { getWarpConfigLink, getWarpConfigLink2, getWarpConfigLink3, getWarpConfigLink4, getWarpConfigLink5, getWarpConfigLink6 } from './warpConfig';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === '/warp') {
    return handleWarpRequest(getWarpConfigLink);
  } else if (url.pathname === '/warp2') {
    return handleWarpRequest(getWarpConfigLink2);
  } else if (url.pathname === '/warp3') {
    return handleWarpRequest(getWarpConfigLink3);
  } else if (url.pathname === '/warp4') {
    return handleWarpRequest(getWarpConfigLink4);
  } else if (url.pathname === '/warp5') {
    return handleWarpRequest(getWarpConfigLink5);
  } else if (url.pathname === '/warp6') {
    return handleWarpRequest(getWarpConfigLink6);
  } else {
    return new Response('Not found', { status: 404 });
  }
}

async function handleWarpRequest(handler) {
  try {
    const content = await handler();
    if (content) {
      return new Response(JSON.stringify({ success: true, content }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Не удалось сгенерировать конфиг.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return new Response(JSON.stringify({ success: false, message: 'Произошла ошибка на сервере.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

import socketio from 'socket.io-client';

let disconnects = 0;
let reconnects = 0;
function conn(i: number) {
  const socket = socketio('wss://link-to-server', {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('CONNECTED', i);
  });

  socket.on('reconnect', (r) => {
    reconnects++;
    console.log('RECONNECT', r);
    console.log('RECONNECTS', reconnects);
  });

  socket.on('disconnect', (e) => {
    disconnects++;
    console.log('disconnect', e);
    console.log('DISCONNECTS', disconnects);
  });

  socket.on('connect_error', (e) => {
    console.log('connect_error', e);
  });

  socket.on('error', (err) => {
    console.log('ERROR', err);
  });
}

async function spawn(batchSize = 1000, rounds = 10) {
  for (let index = 0; index < rounds; index++) {
    Array.from({ length: batchSize }).forEach((_, i) => {
      conn(i + index * batchSize);
    });
    const delayBetweenBatches = 35_000;
    await new Promise((r) => setTimeout(r, delayBetweenBatches));
  }
}

spawn();
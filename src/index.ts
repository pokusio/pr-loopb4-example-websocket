import { WebSocketDemoApplication } from './application';
import { ApplicationConfig } from '@loopback/core';

export { WebSocketDemoApplication };
export * from './websocket.server';
export * from './decorators/websocket.decorator';
export * from './websocket-controller-factory';

export async function main(options: ApplicationConfig = {}) {
  const app = new WebSocketDemoApplication(options);

  console.log(' HAZE listening on PORT = %s', app.httpServer.port);
  console.log(' HAZE listening on HOST = %s', app.httpServer.host);
  console.log(' HAZE listening on ADDRESS = %s', app.httpServer.address);


  await app.start();

  console.log('listening on %s', app.httpServer.url);

  return app;
}

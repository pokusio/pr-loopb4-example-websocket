import { Constructor, Context } from '@loopback/context';
import { HttpServer } from '@loopback/http-server';
import { Server, ServerOptions, Socket } from 'socket.io';
import { getWebSocketMetadata } from './decorators/websocket.decorator';
import { WebSocketControllerFactory } from './websocket-controller-factory';
// const { SocketIOServer } = require('socket.io');
// const { SocketIOServer } = require('socket.io')(httpServer);

const debug = require('debug')('loopback:websocket');

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SockIOMiddleware = (
  socket: Socket,
  fn: (err?: any) => void,
) => void;



const { SocketIOAdapter } = require("socket.io-adapter"); //, https://github.com/socketio/socket.io-adapter
const { SocketIOParser } = require("socket.io-parser"); //,

/**
 * A websocket server
 */
export class WebSocketServer extends Context {
  private io: Server;

  constructor(
    public readonly httpServer: HttpServer,
    /**
     * private options: ServerOptions = {},   THROWS :
     *  is missing the following properties
     *  from type 'ServerOptions':
     *    path, serveClient, adapter, parser, connectTimeout
     */
    private options: ServerOptions = {
      path: "/socket.io/", // supposed to be the default value anyway
      serveClient: false,
      adapter: SocketIOAdapter, // https://github.com/socketio/socket.io-adapter
      // adapter: {},
      parser: SocketIOParser, //
      // parser: {},
      connectTimeout: 45000
    }) {
    super();
    // this.io = SocketIOServer(httpServer, options);
    this.io = require('socket.io')(httpServer);
  }

  /**
   * Register a sock.io middleware function
   * @param fn
   */
  use(fn: SockIOMiddleware) {
    return this.io.use(fn);
  }

  /**
   * Register a websocket controller
   * @param ControllerClass
   * @param namespace
   */
  route(ControllerClass: Constructor<any>, namespace?: string | RegExp) {
    if (namespace == null) {
      const meta = getWebSocketMetadata(ControllerClass);
      namespace = meta && meta.namespace;
    }

    const nsp = namespace ? this.io.of(namespace) : this.io;
    /* eslint-disable @typescript-eslint/no-misused-promises */
    nsp.on('connection', async socket => {
      debug(
        'Websocket connected: id=%s namespace=%s',
        socket.id,
        socket.nsp.name,
      );
      // Create a request context
      const reqCtx = new Context(this);
      // Bind websocket
      reqCtx.bind('ws.socket').to(socket);
      // Instantiate the controller instance
      await new WebSocketControllerFactory(reqCtx, ControllerClass).create(
        socket,
      );
    });
    return nsp;
  }

  /**
   * Start the websocket server
   */
  async start() {
    await this.httpServer.start();
    // FIXME: Access HttpServer.server
    const server = (this.httpServer as any).server;
    this.io.attach(server, this.options);
  }

  /**
   * Stop the websocket server
   */
  async stop() {
    const close = new Promise<void>((resolve, reject) => {
      this.io.close(() => {
        resolve();
      });
    });
    await close;
    await this.httpServer.stop();
  }
}

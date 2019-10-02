/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next-images" />

declare module 'worker-loader?name=static/[hash].worker.js!*' {
  class WebpackWorker extends Worker {
    public constructor();
  }

  export default WebpackWorker;
}
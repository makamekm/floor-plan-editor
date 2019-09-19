export class Callback<T = null> {
  callbacks: Array<(event?: T) => void> = [];
 
  fire(event?: T) {
    this.callbacks.forEach(cb => cb(event));
  }
 
  add(fn: (event?: T) => void) {
    this.callbacks.push(fn);
  }
 
  remove(fn: (event?: T) => void) {
    this.callbacks = this.callbacks.filter(
      f => f !== fn,
    );
  }
}
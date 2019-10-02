import React, { Component } from "react";
import * as THREE from "three";
import SceneWorker from "worker-loader?name=static/[hash].worker.js!././demo.worker";

class ThreeScene extends Component {
  private canvas: HTMLCanvasElement;
  private worker: any;

  private mount: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cube: THREE.Mesh;
  private frameId: number;

  componentDidMount() {
    // const width = this.mount.clientWidth;
    // const height = this.mount.clientHeight;
    // //ADD SCENE
    // this.scene = new THREE.Scene();
    // //ADD CAMERA
    // this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // this.camera.position.z = 4;

    // //ADD RENDERER
    // this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // this.renderer.setClearColor("#000000");
    // this.renderer.setSize(width, height);
    // this.mount.appendChild(this.renderer.domElement);

    // //ADD CUBE
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: "#433F81" });
    // this.cube = new THREE.Mesh(geometry, material);
    // this.scene.add(this.cube);
    // this.start();



    const offscreen = this.canvas.transferControlToOffscreen();

    this.worker = new SceneWorker();
    this.worker.addEventListener("message", this.onWorkerMessage);
    this.worker.postMessage({type: "main", canvas: offscreen}, [offscreen]);
  
    window.addEventListener("resize", this.sendSize);
    this.sendSize();
  }

  sendSize = () => {
    this.worker.postMessage({
      type: 'size',
      width: this.canvas.clientWidth,
      height: this.canvas.clientHeight,
    });
  }

  onWorkerMessage = (event: any) => {
    // this.aggregatedTicketList.replace(event.data);
    // this.loading = false;
    // this.handling = false;
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.sendSize);
    this.worker.removeEventListener("message", this.onWorkerMessage);
  //   this.stop();
  //   this.mount.removeChild(this.renderer.domElement);
  }

  // start = () => {
  //   if (!this.frameId) {
  //     this.frameId = requestAnimationFrame(this.animate);
  //   }
  // };

  // stop = () => {
  //   cancelAnimationFrame(this.frameId);
  // };

  // animate = () => {
  //   this.cube.rotation.x += 0.01;
  //   this.cube.rotation.y += 0.01;
  //   this.renderScene();
  //   this.frameId = window.requestAnimationFrame(this.animate);
  // };

  // renderScene = () => {
  //   this.renderer.render(this.scene, this.camera);
  // };

  render() {
    return (
      <div
        style={{ width: "400px", height: "400px" }}
        ref={mount => this.mount = mount}>
        <canvas ref={el => this.canvas = el}></canvas>
      </div>
    );
  }
}

export default ThreeScene;

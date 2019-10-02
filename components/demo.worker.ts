import * as THREE from 'three';

const state = {
  width: 300,
  height: 150,
};

function main(data: { canvas: HTMLCanvasElement }) {
  const { canvas } = data;
  const renderer = new THREE.WebGLRenderer({ canvas });

  state.width = canvas.width;
  state.height = canvas.height;

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 4;

  const scene = new THREE.Scene();

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry: THREE.Geometry, color: THREE.Color, x: number) {
    const material = new THREE.MeshPhongMaterial({
      color
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88 as any, 0),
    makeInstance(geometry, 0x8844aa as any, -2),
    makeInstance(geometry, 0xaa8844 as any, 2)
  ];

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const width = state.width;
    const height = state.height;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time: number) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = state.width / state.height;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function size(data: {
  width: number;
  height: number;
}) {
  state.width = data.width;
  state.height = data.height;
}

const handlers: any = {
  main,
  size
};

self.addEventListener("message", async ({ data }: {
  data: {
    type: string;
  };
}) => {
  console.log(data);
  
  const fn = handlers[data.type];
  if (!fn) {
    throw new Error("no handler for type: " + data.type);
  }
  fn(data);
});

export default {} as typeof Worker & (new () => Worker);
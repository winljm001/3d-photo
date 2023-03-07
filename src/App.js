import "./App.css";
import { useEffect } from "react";
import * as THREE from "three";
function App() {
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6);
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("./images/cat.jpg");
    const depthTexture = textureLoader.load("./images/cat_.pic_depth.jpg");
    const geometry = new THREE.PlaneGeometry(19.2, 12);
    const mouse = new THREE.Vector2();
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uDepthTexture: { value: depthTexture },
        uMouse: { value: mouse },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv=uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform sampler2D uDepthTexture;
        uniform vec2 uMouse;
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vec4 color = texture2D(uTexture,vUv);
          vec4 depth = texture2D(uDepthTexture,vUv);
          float depthValue = depth.r;
          float x =vUv.x + (uMouse.x+sin(uTime))*0.01*depthValue;
          float y =vUv.y + (uMouse.y+cos(uTime))*0.01*depthValue;
          vec4 newColor= texture2D(uTexture,vec2(x,y));
          gl_FragColor = newColor;
        }
      `,
    });
    // const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    requestAnimationFrame(function animate() {
      material.uniforms.uMouse.value = mouse;
      material.uniforms.uTime.value = performance.now() / 1000;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    });
    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientX / window.innerWidth) * 2 + 1;
    });
  };
  return <div className="App"></div>;
}

export default App;

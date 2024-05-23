import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  AnimationMixer,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  PointLight,
} from "three";

const Model: React.FC = () => {
  useEffect(() => {
    const scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();
    const backgroundTexture = textureLoader.load("/pexels-pixabay-355887.jpg");

    scene.background = backgroundTexture;

    const loader = new GLTFLoader();
    const clock = new THREE.Clock();

    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 5, -10); // Initial position behind the mesh
    camera.rotation.y = Math.PI;

    const renderer: WebGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const ambientLight: AmbientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight: PointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);

    let mixer: AnimationMixer | null = null;
    let mixer2: AnimationMixer | null = null;
    let mesh2: THREE.Object3D | null = null;
    let action2: THREE.AnimationAction | null = null; // Store the animation action for mesh2

    loader.load("/forest.glb", function (gltf) {
      const mesh = gltf.scene;
      mesh.position.set(0, 0, 0);
      mesh.scale.set(2, -2, 2);

      const animations = gltf.animations;
      mixer = new AnimationMixer(mesh);

      animations.forEach((walk: THREE.AnimationClip) => {
        const action = mixer!.clipAction(walk);
        action.play();
      });

      scene.add(mesh);

      loader.load("/walking_lady.glb", function (glft) {
        mesh2 = glft.scene;
        mesh2.position.set(0, 0, 300);
        mesh2.rotation.y = Math.PI; // Rotate 180 degrees along Y-axis
        mesh2.scale.set(3.5, 3.5, 3.5);
        mesh2.add(pointLight);

        const animations = glft.animations;
        if (animations.length > 0) {
          mixer2 = new AnimationMixer(mesh2);

          action2 = mixer2.clipAction(animations[0]);
          action2.play();
          action2.timeScale = 1;
          action2.paused = true; // Start with the animation paused

          scene.add(mesh2);

          // Key press event listeners for movement controls
          const moveSpeed = 0.5;
          let isMoving = false;

          const onKeyDown = (event: KeyboardEvent) => {
            if (!isMoving) {
              isMoving = true;
              action2!.paused = false; // Play the animation when moving
            }

            switch (event.key) {
              case "w":
              case "W":
                mesh2!.position.z -= moveSpeed;
                break;
              case "s":
              case "S":
                mesh2!.position.z += moveSpeed;
                break;
              default:
                break;
            }
          };

          const onKeyUp = (event: KeyboardEvent) => {
            // Optionally stop the animation when no keys are pressed
            if(event.key)
            isMoving = false;
            action2!.paused = true;
          };

          window.addEventListener("keydown", onKeyDown);
          window.addEventListener("keyup", onKeyUp);

          const animate = () => {
            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);
            if (mixer2) mixer2.update(delta);

            if (mesh2) {
              // Calculate the new camera position behind mesh2
              const offset = new THREE.Vector3(0, 10, 25); // Offset to position camera behind
              const newCameraPosition = mesh2.position.clone().add(offset);
              camera.position.copy(newCameraPosition);
              camera.lookAt(mesh2.position);
            }

            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
          };
          animate();
        } else {
          console.log("No animations found for mesh2");
        }
      });
    });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, []);

  return (
    <div>
      <button
        className="z-10 h-10 w-14 absolute text-white bg-red-500"
        onClick={() => {}}
      >
        Click
      </button>
    </div>
  );
};

export default Model;

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector(".lesson-canvas");
const renderer = new THREE.WebGLRenderer({ canvas });

const camera = new THREE.OrthographicCamera(0, canvas.width, 0, canvas.height, 1, 1000);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);


const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0); // view direction perpendicular to XY-plane
controls.enableRotate = false;
// controls.enableZoom = true; // optional
// controls.enablePan = true;
// controls.screenSpacePanning = true; // optional
// controls.panSpeed = 50; // optional
controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }; // swapping left and right buttons

camera.position.z = 20;
controls.update();

// let floorGeometry = new THREE.PlaneBufferGeometry(250, 250, 100, 100);
// floorGeometry.rotateY(Math.PI);

// let floorMaterial = new THREE.MeshBasicMaterial({ color: 0x55FF55 });
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// scene.add(floor);
// floor.position.x = 50;
// floor.position.y = 100;

export function createLine(linePos, pointCoords, matProps) {
    const points = [];
    pointCoords.forEach(pos => points.push(new THREE.Vector3(...pos)));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    if ("color" in matProps && typeof matProps.color === "string") matProps.color = parseInt(matProps.color);
    const material = new THREE.LineBasicMaterial(matProps);
    const line = new THREE.Line(geometry, material);
    line.position.set(...linePos);
    scene.add(line);
}





window.addEventListener("resize", handleResize);

function handleResize() {
    const canvas = renderer.domElement;

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.right = canvas.clientWidth;
    camera.bottom = canvas.clientHeight;
    camera.updateProjectionMatrix();
}
handleResize();

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render)
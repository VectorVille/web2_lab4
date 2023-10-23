const div = document.querySelector(".threejs");

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = div.clientWidth / div.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(div.clientWidth, div.clientHeight);
}

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  div.clientWidth / div.clientHeight,
  0.1,
  100
);
camera.position.set(0, 0, 10);
camera.rotation.set(Math.PI / 2, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(div.clientWidth, div.clientHeight);

div.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
/////////////////////////////////// горизонтальная плоскость
const horizontalPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshPhongMaterial({ color: 0x4682b4, dithering: true })
);

horizontalPlane.position.set(0, 0, 0);
horizontalPlane.receiveShadow = true;

scene.add(horizontalPlane);
/////////////////////////////////// вертикальная плоскость
const vertices = [
  { pos: [-100, -100, 0], norm: [0, 0, 1], uv: [0, 0] },
  { pos: [100, -100, 0], norm: [0, 0, 1], uv: [1, 0] },
  { pos: [-100, 100, 0], norm: [0, 0, 1], uv: [0, 1] },

  { pos: [-100, 100, 0], norm: [0, 0, 1], uv: [0, 1] },
  { pos: [100, -100, 0], norm: [0, 0, 1], uv: [1, 0] },
  { pos: [100, 100, 0], norm: [0, 0, 1], uv: [1, 1] },
];
const positions = [];
const normals = [];
const uvs = [];
for (const vertex of vertices) {
  positions.push(...vertex.pos);
  normals.push(...vertex.norm);
  uvs.push(...vertex.uv);
}
const verticalGeometry = new THREE.BufferGeometry();
const positionNumComponents = 3;
const normalNumComponents = 3;
const uvNumComponents = 2;
verticalGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents)
);
verticalGeometry.setAttribute(
  "normal",
  new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
);
verticalGeometry.setAttribute(
  "uv",
  new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)
);

const verticalMaterial = new THREE.MeshPhongMaterial({
  color: 0xafeeee,
  dithering: true,
});
const verticalMesh = new THREE.Mesh(verticalGeometry, verticalMaterial);
verticalMesh.position.set(0, 50, 0);
verticalMesh.rotation.set(Math.PI / 2, 0, 0);
verticalMesh.receiveShadow = true;

scene.add(verticalMesh);
////////////////////////////////// сфера
const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(7, 30, 30),
  new THREE.MeshPhongMaterial({
    color: 0xffd700,
    dithering: true,
  })
);

sphereMesh.position.set(-8, 30, 7);
sphereMesh.castShadow = true;

scene.add(sphereMesh);
///////////////////////////////// треугольная пирамида
var pts = [
  new THREE.Vector3(Math.sqrt(8 / 9) * 10, 0, -(1 / 3) * 10),
  new THREE.Vector3(
    -Math.sqrt(2 / 9) * 10,
    Math.sqrt(2 / 3) * 10,
    -(1 / 3) * 10
  ),
  new THREE.Vector3(
    -Math.sqrt(2 / 9) * 10,
    -Math.sqrt(2 / 3) * 10,
    -(1 / 3) * 10
  ),
  new THREE.Vector3(0, 0, 10),
];

var faces = [
  pts[0].clone(),
  pts[2].clone(),
  pts[1].clone(),
  pts[0].clone(),
  pts[1].clone(),
  pts[3].clone(),
  pts[1].clone(),
  pts[2].clone(),
  pts[3].clone(),
  pts[2].clone(),
  pts[0].clone(),
  pts[3].clone(),
];

var geom = new THREE.BufferGeometry().setFromPoints(faces);
geom.rotateX(-Math.PI * 0.8);
geom.computeVertexNormals();

geom.setAttribute(
  "uv",
  new THREE.Float32BufferAttribute(
    [
      0.5, 1, 0.06698729810778059, 0.2500000000000001, 0.9330127018922194,
      0.2500000000000001, 0.06698729810778059, 0.2500000000000001,
      0.9330127018922194, 0.2500000000000001, 0.5, 1, 0.06698729810778059,
      0.2500000000000001, 0.9330127018922194, 0.2500000000000001, 0.5, 1,
      0.06698729810778059, 0.2500000000000001, 0.9330127018922194,
      0.2500000000000001, 0.5, 1,
    ],
    2
  )
);

const tetrahedronMesh = new THREE.Mesh(
  geom,
  new THREE.MeshPhongMaterial({
    color: 0xda70d6,
    dithering: true,
  })
);

tetrahedronMesh.position.set(8, 30, 10);
tetrahedronMesh.castShadow = true;

scene.add(tetrahedronMesh);
///////////////////////////////// освещение
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(hemiLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-5, -10, 10);
directionalLight.target.position.set(0, 30, 0);
directionalLight.castShadow = true;

directionalLight.shadow.camera.width = 1000;
directionalLight.shadow.camera.height = 1000;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.zoom = 0.3;

scene.add(directionalLight);
scene.add(directionalLight.target);
/////////////////////////////////
renderer.render(scene, camera);
/////////////////////////////////

const form = document.querySelector(".choose");

form.addEventListener("change", (e) => {
  if (e.target.name == "color") {
    sphereMesh.material.color.set(e.target.value);
    tetrahedronMesh.material.color.set(e.target.value);
  } else if (e.target.name == "directionalLight") {
    if (e.target.checked == true) directionalLight.intensity = 1;
    else directionalLight.intensity = 0;
  } else if (e.target.name == "hemiLight") {
    if (e.target.checked == true) hemiLight.intensity = 1;
    else hemiLight.intensity = 0;
  }
  renderer.render(scene, camera);
});

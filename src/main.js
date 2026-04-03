import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

// --- Scene Setup ---
const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1117);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 25);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2, 0);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
scene.add(dirLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 50);
pointLight.position.set(-5, 5, -5);
scene.add(pointLight);

// FRONT LIGHT (Fix for "hướng trực diện bị tối")
const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
frontLight.position.set(0, 5, 15);
scene.add(frontLight);

// --- 2D Canvas UI (Virtual Screen) ---
const canvas2D = document.createElement('canvas');
canvas2D.width = 512;
canvas2D.height = 1024;
const ctx = canvas2D.getContext('2d');
let currentAmount = "0";
let isProcessing = false;

// Draw function for the POS Screen
function drawScreen() {
  // Clear canvas completely
  ctx.clearRect(0, 0, 512, 1024);

  // Define rounded corner clipping path for bottom
  const r = 40;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(512, 0);
  ctx.lineTo(512, 1024 - r);
  ctx.quadraticCurveTo(512, 1024, 512 - r, 1024);
  ctx.lineTo(r, 1024);
  ctx.quadraticCurveTo(0, 1024, 0, 1024 - r);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.clip();

  // Background White (covers entire screen, numpad and header)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 1024);

  // Status Bar (Top)
  ctx.fillStyle = '#111';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('12:30', 490, 35);
  
  // Status icons mock (shifted left so they don't overlap time)
  // Battery (at 400)
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#111';
  ctx.strokeRect(400, 20, 24, 12); // pin border
  ctx.fillRect(402, 22, 16, 8); // pin charge level
  ctx.fillRect(425, 23, 2, 6);   // pin tip

  // Wifi (at 375)
  ctx.beginPath(); 
  ctx.arc(375, 32, 12, Math.PI + 0.7, -0.7); 
  ctx.stroke();
  ctx.beginPath(); 
  ctx.arc(375, 32, 8, Math.PI + 0.7, -0.7); 
  ctx.stroke();
  ctx.beginPath(); 
  ctx.arc(375, 32, 3, 0, Math.PI * 2); 
  ctx.fill();

  // Smart Kasa Logo (Top Leftish)
  ctx.fillStyle = '#333';
  ctx.font = '900 30px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText("SMART KACA", 30, 90);
  ctx.font = '16px sans-serif';
  ctx.fillText("Terminal Oplata", 30, 120);

  // Black Wave Area (covers middle down to 500)
  ctx.fillStyle = '#2f2f2f'; // Similar to image
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.bezierCurveTo(200, 260, 300, 160, 512, 220);
  ctx.lineTo(512, 500); // To Numpad start
  ctx.lineTo(0, 500);   // To Numpad start
  ctx.closePath();
  ctx.fill();

  // Blue Ribbon (between Header and Black Area)
  ctx.fillStyle = '#54b9d1';
  ctx.beginPath();
  // Bottom edge matches top of black area
  ctx.moveTo(0, 200);
  ctx.bezierCurveTo(200, 260, 300, 160, 512, 220);
  // Top edge smoothly follows
  ctx.lineTo(512, 180);
  ctx.bezierCurveTo(300, 120, 200, 220, 0, 160);
  ctx.closePath();
  ctx.fill();

  // Amount Display (Inside Black Area)
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';

  if (isProcessing) {
    ctx.font = 'bold 45px sans-serif';
    ctx.fillText("Processing...", 470, 380);
  } else {
    // Format numeric string as dollars.cents
    let dollars = currentAmount; // Giữ nguyên cách nhập số cũ của bạn
    let cents = "00"; // Luôn hiển thị .00 cho giống thiết kế chuẩn

    ctx.font = 'bold 50px sans-serif';
    const centsWidth = ctx.measureText(cents).width;
    ctx.fillText(cents, 470, 420);

    ctx.font = 'bold 90px sans-serif';
    ctx.fillText(dollars + ".", 470 - centsWidth - 5, 420);
  }

  // --- Numpad Grid ---
  // Push Numpad down to balance whitespace
  const startY = 500;
  const rowH = (1024 - startY) / 4; // 131
  const colW = 512 / 3;

  // Thin grid lines
  ctx.beginPath();
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 3; i++) { // Include top horiz line
    const y = startY + i * rowH;
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
  }
  for (let i = 1; i <= 2; i++) {
    const x = i * colW;
    ctx.moveTo(x, startY);
    ctx.lineTo(x, 1024);
  }
  ctx.stroke();

  // Numpad Numbers
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['BACK', '0', 'OK']
  ];

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let row = 0; row < 4; row++) {
    for (let c = 0; c < 3; c++) {
      const char = buttons[row][c];
      const x = c * colW;
      const y = startY + row * rowH;
      const cx = x + colW / 2;
      const cy = y + rowH / 2;

      if (char === 'BACK') {
        // Draw the <x icon shape
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy);
        ctx.lineTo(cx - 5, cy - 15);
        ctx.lineTo(cx + 25, cy - 15);
        ctx.lineTo(cx + 25, cy + 15);
        ctx.lineTo(cx - 5, cy + 15);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx + 5, cy - 5);
        ctx.lineTo(cx + 15, cy + 5);
        ctx.moveTo(cx + 15, cy - 5);
        ctx.lineTo(cx + 5, cy + 5);
        ctx.stroke();

      } else if (char === 'OK') {
        // Draw green circle
        ctx.fillStyle = '#2bd46d';
        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 15, cy);
        ctx.lineTo(cx - 4, cy + 12);
        ctx.lineTo(cx + 15, cy - 12);
        ctx.stroke();

      } else {
        ctx.fillStyle = '#111';
        ctx.font = '500 70px sans-serif';
        ctx.fillText(char, cx, cy);
      }
    }
  }

  // Outline over clip
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(512, 0);
  ctx.lineTo(512, 1024 - r);
  ctx.quadraticCurveTo(512, 1024, 512 - r, 1024);
  ctx.lineTo(r, 1024);
  ctx.quadraticCurveTo(0, 1024, 0, 1024 - r);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

drawScreen();
const screenTexture = new THREE.CanvasTexture(canvas2D);
screenTexture.colorSpace = THREE.SRGBColorSpace;

// --- Virtual Screen Plane ---
// Screen material with the CanvasTexture
const screenMaterial = new THREE.MeshBasicMaterial({
  map: screenTexture,
  transparent: true,
});

// The plane dimensions should mimic a phone or pos aspect ratio 1:2
const screenPlaneGeometry = new THREE.PlaneGeometry(4.5, 9);
const screenMesh = new THREE.Mesh(screenPlaneGeometry, screenMaterial);
scene.add(screenMesh);

const screenConf = {
  posX: -0.01,
  posY: 3.6,
  posZ: 1.1,
  rotX: -1.29433,
  rotY: 0,
  rotZ: 0,
  scaleX: 0.8,
  scaleY: 0.75,
  slideY: -0.48, // Tọa độ slideY đẹp nhất bạn vừa căn
};

// Initial set
function updateScreenTransform() {
  screenMesh.position.set(screenConf.posX, screenConf.posY, screenConf.posZ);
  screenMesh.rotation.set(screenConf.rotX, screenConf.rotY, screenConf.rotZ);
  screenMesh.translateY(screenConf.slideY); // Trượt dọc mặt phẳng nghiêng
  screenMesh.scale.set(screenConf.scaleX, screenConf.scaleY, 1);
}
updateScreenTransform();

const gui = new GUI();
const folder = gui.addFolder('Căn chỉnh màn hình cảm ứng');
folder.add(screenConf, 'posX', -10, 10).onChange(updateScreenTransform);
folder.add(screenConf, 'posY', -10, 10).onChange(updateScreenTransform);
folder.add(screenConf, 'posZ', -10, 10).onChange(updateScreenTransform);
folder.add(screenConf, 'rotX', -Math.PI, Math.PI).onChange(updateScreenTransform);
folder.add(screenConf, 'rotY', -Math.PI, Math.PI).onChange(updateScreenTransform);
folder.add(screenConf, 'rotZ', -Math.PI, Math.PI).onChange(updateScreenTransform);
folder.add(screenConf, 'scaleX', 0.1, 5).onChange(updateScreenTransform);
folder.add(screenConf, 'scaleY', 0.1, 5).onChange(updateScreenTransform);
folder.add(screenConf, 'slideY', -10, 10).name('Trượt Dọc (slideY)').onChange(updateScreenTransform);

// --- Credit Card Animation Config ---
const cardConf = {
  targetX: 0,
  targetY: 4.5,
  targetZ: -1.6,
  rotX: -1.4,
  rotY: 0,
  rotZ: 0,
  testAnimation: () => triggerPayment()
};

const cardFolder = gui.addFolder('Căn chỉnh Tọa độ Quẹt thẻ');
cardFolder.add(cardConf, 'targetX', -15, 15).name('Vị trí X');
cardFolder.add(cardConf, 'targetY', -15, 15).name('Vị trí Y');
cardFolder.add(cardConf, 'targetZ', -15, 15).name('Vị trí Z');
cardFolder.add(cardConf, 'rotX', -Math.PI, Math.PI).name('Xoay X');
cardFolder.add(cardConf, 'rotY', -Math.PI, Math.PI).name('Xoay Y');
cardFolder.add(cardConf, 'rotZ', -Math.PI, Math.PI).name('Xoay Z');
cardFolder.add(cardConf, 'testAnimation').name('Test Quẹt Thẻ ngay');


// --- Model Loading ---
let posTerminal;
const loader = new GLTFLoader();
loader.load('/pos_terminal/scene.gltf', (gltf) => {
  posTerminal = gltf.scene;

  const box = new THREE.Box3().setFromObject(posTerminal);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 10 / maxDim;
  posTerminal.scale.set(scale, scale, scale);

  box.setFromObject(posTerminal);
  box.getCenter(center);
  posTerminal.position.sub(center);
  posTerminal.position.y += (box.getSize(new THREE.Vector3()).y / 2);

  posTerminal.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(posTerminal);
}, undefined, (error) => {
  console.error('Error loading model:', error);
});


// --- Raycaster UV Tracking ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const paymentStatus = document.getElementById('payment-status');
const receipt = document.getElementById('receipt');
const closeBtn = document.getElementById('close-receipt');
closeBtn.addEventListener('click', () => {
  receipt.classList.add('hidden');
});

function handleVirtualScreenClick(uv) {
  if (isProcessing) return;

  // UV coordinates: u is X (0 to 1), v is Y (0 to 1). Note that webgl v=0 is bottom, v=1 is top.
  // Wait, we are mapping to 2D canvas, so Y=0 is TOP in canvas.
  // Let's invert Y: Canvas Y = (1 - v) * 1024
  const cx = uv.x * 512;
  const cy = (1 - uv.y) * 1024;

  const startY = 500;
  if (cy < startY) {
    // Clicked in the display area, ignore
    return;
  }

  // Determine row and col
  const rowH = (1024 - startY) / 4;
  const colW = 512 / 3;
  const r = Math.floor((cy - startY) / rowH);
  const c = Math.floor(cx / colW);

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['BACK', '0', 'OK']
  ];

  if (r >= 0 && r < 4 && c >= 0 && c < 3) {
    const btn = buttons[r][c];

    // Removed scale effect

    if (btn === 'BACK') {
      currentAmount = currentAmount.slice(0, -1) || "0";
    } else if (btn === 'OK') {
      triggerPayment();
    } else {
      if (currentAmount === "0") {
        currentAmount = btn;
      } else if (currentAmount.length < 8) { // max format 999999.99
        currentAmount += btn;
      }
    }

    // Refresh texture
    drawScreen();
    screenTexture.needsUpdate = true;
  }
}

// --- Credit Card 3D Object ---
const cardCanvas = document.createElement('canvas');
cardCanvas.width = 512;
cardCanvas.height = 300;
const cCtx = cardCanvas.getContext('2d');

// Draw card background
const cr = 20; // corner radius
cCtx.fillStyle = '#1c1c1c'; // Dark card
cCtx.beginPath();
cCtx.moveTo(cr, 0); cCtx.lineTo(512-cr, 0); cCtx.quadraticCurveTo(512, 0, 512, cr);
cCtx.lineTo(512, 300-cr); cCtx.quadraticCurveTo(512, 300, 512-cr, 300);
cCtx.lineTo(cr, 300); cCtx.quadraticCurveTo(0, 300, 0, 300-cr);
cCtx.lineTo(0, cr); cCtx.quadraticCurveTo(0, 0, cr, 0);
cCtx.fill();

// Draw chip
cCtx.fillStyle = '#d4af37'; // Gold
cCtx.fillRect(60, 100, 60, 50);
cCtx.fillStyle = '#1c1c1c';
cCtx.fillRect(85, 100, 2, 50);
cCtx.fillRect(60, 115, 60, 2);
cCtx.fillRect(60, 135, 60, 2);

// Wifi NFC logo
cCtx.strokeStyle = '#fff';
cCtx.lineWidth = 4;
cCtx.beginPath(); cCtx.arc(160, 125, 20, Math.PI+0.5, -0.5); cCtx.stroke();
cCtx.beginPath(); cCtx.arc(160, 125, 12, Math.PI+0.5, -0.5); cCtx.stroke();
cCtx.beginPath(); cCtx.arc(160, 125, 4, 0, 2*Math.PI); cCtx.fill();

// Card text
cCtx.fillStyle = '#ffffff';
cCtx.font = 'bold 40px monospace';
cCtx.fillText('4242 4242 4242 4242', 60, 210);
cCtx.font = '24px sans-serif';
cCtx.fillText('H O A N G', 60, 260); // Student name
cCtx.textAlign = 'right';
cCtx.font = 'bold italic 50px sans-serif';
cCtx.fillText('VISA', 480, 260);

const cardTex = new THREE.CanvasTexture(cardCanvas);
cardTex.colorSpace = THREE.SRGBColorSpace;

const cardMaterial = new THREE.MeshStandardMaterial({ 
  map: cardTex, 
  color: 0xcccccc,
  roughness: 0.4, 
  metalness: 0.1 
});
// 512x300 ratio -> width 3.8, depth 2.22 (height thickness is 0.03)
const creditCardMesh = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.03, 2.22), cardMaterial);
creditCardMesh.position.set(10, 15, 15); // hidden / out of view
creditCardMesh.visible = false;
creditCardMesh.castShadow = true;
scene.add(creditCardMesh);

// --- Payment Animation Logic ---
function animateCardPayment() {
  isProcessing = true;
  drawScreen();
  screenTexture.needsUpdate = true;
  
  receipt.classList.add('hidden');
  paymentStatus.classList.remove('hidden');
  document.getElementById('status-text').innerText = "Vui lòng chạm thẻ để thanh toán...";

  creditCardMesh.position.set(10, 15, 10); 
  creditCardMesh.rotation.set(-2, Math.PI, 0.5); // Card enters flying chaotically
  creditCardMesh.visible = true;

  const tl = gsap.timeline({
    onComplete: () => {
      creditCardMesh.visible = false;
      document.getElementById('status-text').innerText = "Đang xử lý $" + currentAmount + "...";
      setTimeout(() => {
        finishPayment();
      }, 1000);
    }
  });

  // Fly in & Hover
  tl.to(creditCardMesh.position, {
    x: cardConf.targetX,
    y: cardConf.targetY + 2, // Hover slightly above target
    z: cardConf.targetZ,
    duration: 1.0,
    ease: "power2.out"
  }, 0);
  tl.to(creditCardMesh.rotation, {
    x: cardConf.rotX,
    y: cardConf.rotY,
    z: cardConf.rotZ,
    duration: 1.0,
    ease: "power2.out"
  }, 0);

  // The Tap (Quick movement toward screen target)
  tl.to(creditCardMesh.position, {
    y: cardConf.targetY, 
    z: cardConf.targetZ - 0.5, // Slide slight forward
    duration: 0.3,
    ease: "power1.inOut"
  });
  
  // Freeze on tap
  tl.to({}, { duration: 0.5 }); 
  
  // Fly out gracefully
  tl.to(creditCardMesh.position, {
    x: -12,
    y: 15,
    z: 5,
    duration: 1.0,
    ease: "power2.in"
  });
}

function finishPayment() {
  isProcessing = false;
  currentAmount = "0";
  drawScreen();
  screenTexture.needsUpdate = true;

  paymentStatus.classList.add('hidden');
  receipt.classList.remove('hidden');
  gsap.fromTo(receipt, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
}

function triggerPayment() {
  animateCardPayment();
}


window.addEventListener('pointerdown', (event) => {
  // Prevent tracking when clicking lil-gui
  if (event.clientX > window.innerWidth - 300 && event.clientY < 400) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Check intersection with our Virtual Screen Mesh
  const intersects = raycaster.intersectObject(screenMesh);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    if (intersect.uv) {
      handleVirtualScreenClick(intersect.uv);
    }
  }
});

// --- Animation Loop ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

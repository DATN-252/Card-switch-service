'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCreditCard,
  faDeleteLeft,
  faPrint,
  faRotateLeft,
  faStore,
  faTriangleExclamation,
  faWifi,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';

type Merchant = {
  merchantId: string;
  name: string;
};

type PosStatus = 'IDLE' | 'PROCESSING' | 'APPROVED' | 'DECLINED' | 'ERROR';

type ReceiptData = Record<string, unknown> & {
  status?: string;
  code?: string;
  message?: string;
  pan?: string;
  stan?: string;
  amount: string;
};

type ScreenBinding = {
  texture: THREE.CanvasTexture;
  context: CanvasRenderingContext2D;
};

type ScreenConfig = {
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scaleX: number;
  scaleY: number;
  slideY: number;
};

type CardConfig = {
  targetX: number;
  targetY: number;
  targetZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
};

const SCREEN_W = 512;
const SCREEN_H = 1024;
const NUMPAD_TOP = 500;
const CARD_HOVER_DURATION = 1.0;
const CARD_PRE_INSERT_PAUSE = 0.2;
const CARD_TAP_DURATION = 0.4;
const CARD_HOLD_DURATION = 0.5;
const CARD_EXIT_DURATION = 2.5;
const BUTTON_LAYOUT = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['BACK', '0', 'OK'],
];

const DEFAULT_SCREEN_CONFIG: ScreenConfig = {
  posX: -0.01,
  posY: 3.88,
  posZ: 1.34,
  rotX: -1.29433,
  rotY: 0,
  rotZ: 0,
  scaleX: 0.765,
  scaleY: 0.67,
  slideY: -0.4,
};

const DEFAULT_CARD_CONFIG: CardConfig = {
  targetX: 0,
  targetY: 4.5,
  targetZ: -1.6,
  rotX: -1.25,
  rotY: 0,
  rotZ: 0,
};

function currency(amount: string) {
  return Number(amount || '0').toLocaleString('en-US');
}

function maskPan(pan?: string) {
  if (!pan) return '**** **** **** ****';
  return `**** **** **** ${pan.slice(-4)}`;
}

function resolveBrand(pan?: string) {
  if (!pan) return 'LOCAL CARD';
  if (pan.startsWith('4')) return 'VISA';
  if (pan.startsWith('5')) return 'MASTERCARD';
  return 'LOCAL CARD';
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

export default function Pos3DSimulator() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const screenBindingRef = useRef<ScreenBinding | null>(null);
  const cardMeshRef = useRef<THREE.Mesh | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cardAnimationStartedRef = useRef<number | null>(null);
  const cardExitStartedRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const screenConfigRef = useRef<ScreenConfig>(DEFAULT_SCREEN_CONFIG);
  const cardConfigRef = useRef<CardConfig>(DEFAULT_CARD_CONFIG);
  const statusRef = useRef<PosStatus>('IDLE');

  const [amount, setAmount] = useState('0');
  const [pan, setPan] = useState('9999888877776666');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [merchantId, setMerchantId] = useState('SP0001');
  const [merchantName, setMerchantName] = useState('Điện lực EVN');
  const [status, setStatus] = useState<PosStatus>('IDLE');
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [screenConfig, setScreenConfig] = useState<ScreenConfig>(DEFAULT_SCREEN_CONFIG);
  const [cardConfig, setCardConfig] = useState<CardConfig>(DEFAULT_CARD_CONFIG);

  const nowStamp = useMemo(
    () =>
      new Date().toLocaleString('vi-VN', {
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [receiptData, status],
  );

  useEffect(() => {
    mountedRef.current = true;

    fetch('/api/merchants')
      .then((res) => res.json())
      .then((data) => {
        if (!mountedRef.current || !Array.isArray(data) || data.length === 0) {
          return;
        }
        setMerchants(data);
        setMerchantId(data[0].merchantId);
        setMerchantName(data[0].name);
      })
      .catch((error) => console.error('Failed to load merchants:', error));

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    screenConfigRef.current = screenConfig;
    const screenMesh = screenMeshRef.current;
    if (!screenMesh) {
      return;
    }

    screenMesh.position.set(screenConfig.posX, screenConfig.posY, screenConfig.posZ);
    screenMesh.rotation.set(screenConfig.rotX, screenConfig.rotY, screenConfig.rotZ);
    screenMesh.updateMatrixWorld();
    screenMesh.translateY(screenConfig.slideY);
    screenMesh.scale.set(screenConfig.scaleX, screenConfig.scaleY, 1);
  }, [screenConfig]);

  useEffect(() => {
    cardConfigRef.current = cardConfig;
  }, [cardConfig]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);
    scene.fog = new THREE.Fog(0x0b1220, 12, 34);

    const camera = new THREE.PerspectiveCamera(
      45,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 15, 25);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    mountNode.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 12;
    controls.maxDistance = 34;
    controls.target.set(0, 2, 0);
    controls.autoRotate = false;
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.95));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.55);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x7dd3fc, 22, 50);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.35);
    frontLight.position.set(0, 5, 15);
    scene.add(frontLight);

    const canvas2D = document.createElement('canvas');
    canvas2D.width = SCREEN_W;
    canvas2D.height = SCREEN_H;
    const context = canvas2D.getContext('2d');
    if (!context) {
      return;
    }

    const screenTexture = new THREE.CanvasTexture(canvas2D);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenBindingRef.current = {
      texture: screenTexture,
      context,
    };

    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });

    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 9), screenMaterial);
    screenMesh.position.set(screenConfigRef.current.posX, screenConfigRef.current.posY, screenConfigRef.current.posZ);
    screenMesh.rotation.set(screenConfigRef.current.rotX, screenConfigRef.current.rotY, screenConfigRef.current.rotZ);
    screenMesh.translateY(screenConfigRef.current.slideY);
    screenMesh.scale.set(screenConfigRef.current.scaleX, screenConfigRef.current.scaleY, 1);
    screenMesh.renderOrder = 10;
    screenMeshRef.current = screenMesh;
    scene.add(screenMesh);

    const loader = new GLTFLoader();
    loader.load(
      '/pos_terminal/scene.gltf',
      (gltf: GLTF) => {
        const posTerminal = gltf.scene;
        const box = new THREE.Box3().setFromObject(posTerminal);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 10 / maxDim;
        posTerminal.scale.setScalar(scale);

        box.setFromObject(posTerminal);
        posTerminal.position.sub(center);
        posTerminal.position.y += box.getSize(new THREE.Vector3()).y / 2;

        posTerminal.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(posTerminal);
      },
      undefined,
      (error: unknown) => console.error('Error loading model:', error),
    );

    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 512;
    cardCanvas.height = 300;
    const cardContext = cardCanvas.getContext('2d');
    if (cardContext) {
      const gradient = cardContext.createLinearGradient(0, 0, 512, 300);
      gradient.addColorStop(0, '#0f1e39');
      gradient.addColorStop(0.5, '#184a7f');
      gradient.addColorStop(1, '#12b8a5');
      cardContext.fillStyle = gradient;
      drawRoundedRect(cardContext, 0, 0, 512, 300, 20);
      cardContext.fill();
      cardContext.fillStyle = '#f5d36b';
      drawRoundedRect(cardContext, 58, 98, 62, 48, 8);
      cardContext.fill();
      cardContext.fillStyle = '#f8fafc';
      cardContext.font = '700 22px Arial';
      cardContext.fillText('BKBank', 56, 52);
      cardContext.font = '700 38px monospace';
      cardContext.fillText('9999 8888 7777 6666', 56, 210);
      cardContext.font = '600 18px Arial';
      cardContext.fillText('NGUYEN VAN A', 56, 252);
      cardContext.font = '700 italic 40px Arial';
      cardContext.fillText('VISA', 384, 252);
    }

    const cardTexture = new THREE.CanvasTexture(cardCanvas);
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    const cardMaterial = new THREE.MeshStandardMaterial({
      map: cardTexture,
      roughness: 0.34,
      metalness: 0.1,
    });
    const creditCardMesh = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.03, 2.22), cardMaterial);
    creditCardMesh.position.set(10, 15, 10);
    creditCardMesh.rotation.set(-2, Math.PI, 0.5);
    creditCardMesh.visible = false;
    creditCardMesh.castShadow = true;
    cardMeshRef.current = creditCardMesh;
    scene.add(creditCardMesh);

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    const tick = () => {
      controls.update();

      if (screenMeshRef.current && cameraRef.current) {
        const screenWorldPosition = new THREE.Vector3();
        const screenWorldQuaternion = new THREE.Quaternion();
        const screenNormal = new THREE.Vector3(0, 0, 1);
        const toCamera = new THREE.Vector3();

        screenMeshRef.current.getWorldPosition(screenWorldPosition);
        screenMeshRef.current.getWorldQuaternion(screenWorldQuaternion);
        screenNormal.applyQuaternion(screenWorldQuaternion).normalize();
        toCamera.copy(cameraRef.current.position).sub(screenWorldPosition).normalize();
        screenMeshRef.current.visible = screenNormal.dot(toCamera) > 0;
      }

      if (cardMeshRef.current && cardAnimationStartedRef.current !== null) {
        const elapsed = (performance.now() - cardAnimationStartedRef.current) / 1000;
        const insertCompletedAt =
          CARD_HOVER_DURATION + CARD_PRE_INSERT_PAUSE + CARD_TAP_DURATION;

        if (elapsed <= CARD_HOVER_DURATION) {
          const p = elapsed / CARD_HOVER_DURATION;
          cardMeshRef.current.visible = true;
          cardMeshRef.current.position.set(
            THREE.MathUtils.lerp(10, cardConfigRef.current.targetX, p),
            THREE.MathUtils.lerp(15, cardConfigRef.current.targetY + 2, p),
            THREE.MathUtils.lerp(10, cardConfigRef.current.targetZ, p),
          );
          cardMeshRef.current.rotation.set(
            THREE.MathUtils.lerp(-2, cardConfigRef.current.rotX, p),
            THREE.MathUtils.lerp(Math.PI, cardConfigRef.current.rotY, p),
            THREE.MathUtils.lerp(0.5, cardConfigRef.current.rotZ, p),
          );
        } else if (elapsed <= CARD_HOVER_DURATION + CARD_PRE_INSERT_PAUSE) {
          cardMeshRef.current.position.set(
            cardConfigRef.current.targetX,
            cardConfigRef.current.targetY + 2,
            cardConfigRef.current.targetZ,
          );
          cardMeshRef.current.rotation.set(
            cardConfigRef.current.rotX,
            cardConfigRef.current.rotY,
            cardConfigRef.current.rotZ,
          );
        } else if (elapsed <= CARD_HOVER_DURATION + CARD_PRE_INSERT_PAUSE + CARD_TAP_DURATION) {
          const p =
            (elapsed - CARD_HOVER_DURATION - CARD_PRE_INSERT_PAUSE) / CARD_TAP_DURATION;
          cardMeshRef.current.position.set(
            cardConfigRef.current.targetX,
            THREE.MathUtils.lerp(cardConfigRef.current.targetY + 2, cardConfigRef.current.targetY, p),
            THREE.MathUtils.lerp(cardConfigRef.current.targetZ, cardConfigRef.current.targetZ - 0.5, p),
          );
          cardMeshRef.current.rotation.set(
            cardConfigRef.current.rotX,
            cardConfigRef.current.rotY,
            cardConfigRef.current.rotZ,
          );
        } else if (elapsed <= insertCompletedAt) {
          cardMeshRef.current.position.set(
            cardConfigRef.current.targetX,
            cardConfigRef.current.targetY,
            cardConfigRef.current.targetZ - 0.5,
          );
          cardMeshRef.current.rotation.set(
            cardConfigRef.current.rotX,
            cardConfigRef.current.rotY,
            cardConfigRef.current.rotZ,
          );
        } else {
          cardMeshRef.current.position.set(
            cardConfigRef.current.targetX,
            cardConfigRef.current.targetY,
            cardConfigRef.current.targetZ - 0.5,
          );
          cardMeshRef.current.rotation.set(
            cardConfigRef.current.rotX,
            cardConfigRef.current.rotY,
            cardConfigRef.current.rotZ,
          );

          const currentStatus = statusRef.current;
          const isFinalStatus =
            currentStatus === 'APPROVED' ||
            currentStatus === 'DECLINED' ||
            currentStatus === 'ERROR';

          if (isFinalStatus && cardExitStartedRef.current === null) {
            cardExitStartedRef.current = performance.now();
          }

          if (cardExitStartedRef.current !== null) {
            const exitElapsed = (performance.now() - cardExitStartedRef.current) / 1000;

            if (exitElapsed <= CARD_EXIT_DURATION) {
              const p = exitElapsed / CARD_EXIT_DURATION;
              cardMeshRef.current.position.set(
                THREE.MathUtils.lerp(cardConfigRef.current.targetX, -12, p),
                THREE.MathUtils.lerp(cardConfigRef.current.targetY, 15, p),
                THREE.MathUtils.lerp(cardConfigRef.current.targetZ - 0.5, 5, p),
              );
              cardMeshRef.current.rotation.set(
                THREE.MathUtils.lerp(cardConfigRef.current.rotX, -0.8, p),
                THREE.MathUtils.lerp(cardConfigRef.current.rotY, -1.1, p),
                THREE.MathUtils.lerp(cardConfigRef.current.rotZ, 0.25, p),
              );
            } else {
              cardMeshRef.current.visible = false;
              cardAnimationStartedRef.current = null;
              cardExitStartedRef.current = null;
            }
          }
        }
      }

      renderer.render(scene, camera);
      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      controls.dispose();
      renderer.dispose();
      mountNode.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const binding = screenBindingRef.current;
    if (!binding) {
      return;
    }

    const context = binding.context;
    context.clearRect(0, 0, SCREEN_W, SCREEN_H);
    const clipRadius = 40;
    context.save();
    drawRoundedRect(context, 0, 0, SCREEN_W, SCREEN_H, clipRadius);
    context.clip();

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, SCREEN_W, SCREEN_H);

    context.fillStyle = '#111';
    context.font = 'bold 20px Arial';
    context.textAlign = 'right';
    context.textBaseline = 'alphabetic';
    context.fillText('BKBank POS', 488, 35);

    context.fillStyle = '#333';
    context.font = '900 30px Arial';
    context.textAlign = 'left';
    context.fillText('BKBank POS', 30, 90);
    context.font = '16px Arial';
    context.fillText(merchantName, 30, 118);
    context.fillText(`Merchant ID: ${merchantId}`, 30, 142);

    context.fillStyle = '#2f2f2f';
    context.beginPath();
    context.moveTo(0, 200);
    context.bezierCurveTo(200, 260, 300, 160, 512, 220);
    context.lineTo(512, NUMPAD_TOP);
    context.lineTo(0, NUMPAD_TOP);
    context.closePath();
    context.fill();

    context.fillStyle = '#54b9d1';
    context.beginPath();
    context.moveTo(0, 200);
    context.bezierCurveTo(200, 260, 300, 160, 512, 220);
    context.lineTo(512, 180);
    context.bezierCurveTo(300, 120, 200, 220, 0, 160);
    context.closePath();
    context.fill();

    context.fillStyle = '#ffffff';
    context.textAlign = 'right';
    if (status === 'PROCESSING') {
      context.font = 'bold 45px Arial';
      context.fillText('Processing...', 470, 380);
    } else {
      context.font = 'bold 50px Arial';
      context.fillText('00', 470, 420);
      context.font = 'bold 90px Arial';
      context.fillText(`${amount}.`, 390, 420);
    }

    if (status === 'APPROVED' || status === 'DECLINED' || status === 'ERROR') {
      context.fillStyle =
        status === 'APPROVED' ? '#18a874' : status === 'DECLINED' ? '#dc2626' : '#f59e0b';
      drawRoundedRect(context, 26, 430, SCREEN_W - 52, 56, 18);
      context.fill();
      context.fillStyle = '#ffffff';
      context.textAlign = 'left';
      context.font = '700 22px Arial';
      context.fillText(
        status === 'APPROVED'
          ? 'Giao dịch chấp thuận'
          : status === 'DECLINED'
            ? 'Giao dịch bị từ chối'
            : 'Lỗi kết nối jPOS',
        44,
        466,
      );
    }

    const rowHeight = (SCREEN_H - NUMPAD_TOP) / 4;
    const colWidth = SCREEN_W / 3;
    context.strokeStyle = '#d6dce5';
    context.lineWidth = 2;
    context.beginPath();
    for (let i = 0; i <= 4; i += 1) {
      const y = NUMPAD_TOP + i * rowHeight;
      context.moveTo(0, y);
      context.lineTo(SCREEN_W, y);
    }
    for (let i = 1; i <= 2; i += 1) {
      const x = i * colWidth;
      context.moveTo(x, NUMPAD_TOP);
      context.lineTo(x, SCREEN_H);
    }
    context.stroke();

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    BUTTON_LAYOUT.forEach((row, rowIndex) => {
      row.forEach((char, colIndex) => {
        const x = colIndex * colWidth;
        const y = NUMPAD_TOP + rowIndex * rowHeight;
        const centerX = x + colWidth / 2;
        const centerY = y + rowHeight / 2;

        if (char === 'BACK') {
          context.fillStyle = '#111827';
          context.beginPath();
          context.moveTo(centerX - 26, centerY);
          context.lineTo(centerX - 8, centerY - 18);
          context.lineTo(centerX + 26, centerY - 18);
          context.lineTo(centerX + 26, centerY + 18);
          context.lineTo(centerX - 8, centerY + 18);
          context.closePath();
          context.fill();

          context.strokeStyle = '#ffffff';
          context.lineWidth = 3;
          context.beginPath();
          context.moveTo(centerX + 4, centerY - 8);
          context.lineTo(centerX + 16, centerY + 8);
          context.moveTo(centerX + 16, centerY - 8);
          context.lineTo(centerX + 4, centerY + 8);
          context.stroke();
        } else if (char === 'OK') {
          context.fillStyle = '#2bd46d';
          context.beginPath();
          context.arc(centerX, centerY, 44, 0, Math.PI * 2);
          context.fill();

          context.strokeStyle = '#ffffff';
          context.lineWidth = 8;
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.beginPath();
          context.moveTo(centerX - 15, centerY);
          context.lineTo(centerX - 4, centerY + 12);
          context.lineTo(centerX + 16, centerY - 12);
          context.stroke();
        } else {
          context.fillStyle = '#0f172a';
          context.font = '500 68px Arial';
          context.fillText(char, centerX, centerY);
        }
      });
    });

    context.restore();
    binding.texture.needsUpdate = true;
  }, [amount, merchantId, merchantName, status]);

  const handleReset = () => {
    setStatus('IDLE');
    setAmount('0');
    setReceiptData(null);
    cardAnimationStartedRef.current = null;
    cardExitStartedRef.current = null;
    if (cardMeshRef.current) {
      cardMeshRef.current.visible = false;
    }
  };

  const handleScreenKey = async (key: string) => {
    if (status !== 'IDLE' && status !== 'ERROR') {
      return;
    }

    if (key === 'BACK') {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }

    if (key === 'OK') {
      await processPayment();
      return;
    }

    setAmount((prev) => {
      if (prev === '0') return key;
      if (prev.length >= 8) return prev;
      return prev + key;
    });
  };

  const processPayment = async () => {
    if (amount === '0' || !pan) return;

    setStatus('PROCESSING');
    cardAnimationStartedRef.current = performance.now();
    cardExitStartedRef.current = null;

    try {
      const res = await fetch('/api/pos/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pan,
          amount: Number(amount),
          merchantId,
          merchantName,
        }),
      });

      const data = await res.json();

      setStatus(data.status === 'APPROVED' ? 'APPROVED' : 'DECLINED');
      setReceiptData({ ...data, amount });
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
      setReceiptData({
        amount,
        pan,
        code: 'XX',
        message: 'Không thể kết nối máy chủ Mạng lõi (jPOS)',
      });
    }
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      const screenMesh = screenMeshRef.current;

      if (!renderer || !camera || !screenMesh || !mountRef.current) {
        return;
      }

      const bounds = renderer.domElement.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      ) {
        return;
      }

      mouseRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersections = raycasterRef.current.intersectObject(screenMesh);
      if (intersections.length === 0 || !intersections[0].uv) {
        return;
      }

      const uv = intersections[0].uv;
      const canvasX = uv.x * SCREEN_W;
      const canvasY = (1 - uv.y) * SCREEN_H;
      if (canvasY < NUMPAD_TOP) {
        return;
      }

      const rowHeight = (SCREEN_H - NUMPAD_TOP) / 4;
      const colWidth = SCREEN_W / 3;
      const row = Math.floor((canvasY - NUMPAD_TOP) / rowHeight);
      const col = Math.floor(canvasX / colWidth);

      if (row < 0 || row > 3 || col < 0 || col > 2) {
        return;
      }

      const key = BUTTON_LAYOUT[row][col];
      void handleScreenKey(key);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [amount, pan, merchantId, merchantName, status]);

  return (
    <main className="pos3d-shell">
      <div className="pos3d-stage">
        <div ref={mountRef} className="pos3d-canvas" />
      </div>

      <aside className="pos3d-sidebar">
        <div className="pos3d-panel">
          <h1>Payment Terminal</h1>
          <p>
            Nhập số tiền trực tiếp trên màn hình máy POS. Kéo chuột để xoay và dùng
            con lăn để zoom.
          </p>

          <div className="pos3d-panel-meta">
            <span><FontAwesomeIcon icon={faStore} /> {merchantId}</span>
            <span className="pos3d-online"><FontAwesomeIcon icon={faWifi} /> ONLINE</span>
          </div>

          <label className="pos3d-field">
            <span>Số thẻ</span>
            <input
              type="text"
              value={pan}
              onChange={(event) => setPan(event.target.value)}
              disabled={status === 'PROCESSING'}
            />
          </label>

          <label className="pos3d-field">
            <span>Đơn vị chấp nhận thanh toán</span>
            <select
              value={merchantId}
              onChange={(event) => {
                const selectedId = event.target.value;
                setMerchantId(selectedId);
                const merchant = merchants.find((item) => item.merchantId === selectedId);
                if (merchant) {
                  setMerchantName(merchant.name);
                }
              }}
              disabled={status === 'PROCESSING' || merchants.length === 0}
            >
              {merchants.length === 0 ? (
                <option value={merchantId}>{merchantName} ({merchantId})</option>
              ) : (
                merchants.map((merchant) => (
                  <option key={merchant.merchantId} value={merchant.merchantId}>
                    {merchant.name} ({merchant.merchantId})
                  </option>
                ))
              )}
            </select>
          </label>

          <div className="pos3d-inline-actions">
            <button type="button" className="pos3d-primary-btn" onClick={handleReset}>
              <FontAwesomeIcon icon={faRotateLeft} /> Làm mới
            </button>
            <button type="button" className="pos3d-ghost-btn" onClick={() => void handleScreenKey('BACK')}>
              <FontAwesomeIcon icon={faDeleteLeft} /> Xóa số
            </button>
          </div>

          {status === 'PROCESSING' && (
            <div className="pos3d-processing-box">
              <div className="pos3d-loader" />
              <p>Đang xử lý giao dịch...</p>
            </div>
          )}
        </div>

        {(status === 'APPROVED' || status === 'DECLINED' || status === 'ERROR') && (
          <div className="pos3d-receipt">
            <div className="pos3d-receipt-head">
              <h3>Receipt</h3>
              <FontAwesomeIcon icon={faPrint} className="pos3d-receipt-icon" />
            </div>

            <div className="pos3d-receipt-grid">
              <span>Merchant</span>
              <strong>{merchantName}</strong>
              <span>Thời gian</span>
              <strong>{nowStamp}</strong>
              <span>Số thẻ</span>
              <strong>{maskPan((receiptData?.pan as string | undefined) ?? pan)}</strong>
              <span>Loại thẻ</span>
              <strong>{resolveBrand((receiptData?.pan as string | undefined) ?? pan)}</strong>
              <span>STAN</span>
              <strong>{(receiptData?.stan as string | undefined) || 'N/A'}</strong>
              <span>Response code</span>
              <strong>{(receiptData?.code as string | undefined) || 'N/A'}</strong>
              <span>Tổng tiền</span>
              <strong>{currency((receiptData?.amount as string | undefined) ?? amount)} USD</strong>
            </div>

            <div className="pos3d-receipt-foot">
              {status === 'APPROVED' && <span className="pos3d-badge success">Approved</span>}
              {status === 'DECLINED' && <span className="pos3d-badge danger">Declined</span>}
              {status === 'ERROR' && <span className="pos3d-badge warning">Connection Error</span>}
            </div>
          </div>
        )}

        <div className="pos3d-instructions">Mouse: Left click to rotate, scroll to zoom.</div>

      </aside>
    </main>
  );
}

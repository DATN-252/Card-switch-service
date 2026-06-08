(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/Pos3DSimulator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Pos3DSimulator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$controls$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/controls/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/loaders/GLTFLoader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/react-fontawesome/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const SCREEN_W = 512;
const SCREEN_H = 1024;
const NUMPAD_TOP = 500;
const CARD_HOVER_DURATION = 1.0;
const CARD_PRE_INSERT_PAUSE = 0.2;
const CARD_TAP_DURATION = 0.4;
const CARD_HOLD_DURATION = 0.5;
const CARD_EXIT_DURATION = 2.5;
const BUTTON_LAYOUT = [
    [
        '1',
        '2',
        '3'
    ],
    [
        '4',
        '5',
        '6'
    ],
    [
        '7',
        '8',
        '9'
    ],
    [
        'BACK',
        '0',
        'OK'
    ]
];
const DEFAULT_SCREEN_CONFIG = {
    posX: -0.01,
    posY: 3.88,
    posZ: 1.34,
    rotX: -1.29433,
    rotY: 0,
    rotZ: 0,
    scaleX: 0.765,
    scaleY: 0.67,
    slideY: -0.4
};
const DEFAULT_CARD_CONFIG = {
    targetX: 0,
    targetY: 4.5,
    targetZ: -1.6,
    rotX: -1.25,
    rotY: 0,
    rotZ: 0
};
function currency(amount) {
    return Number(amount || '0').toLocaleString('en-US');
}
function maskPan(pan) {
    if (!pan) return '**** **** **** ****';
    return `**** **** **** ${pan.slice(-4)}`;
}
function resolveBrand(pan) {
    if (!pan) return 'LOCAL CARD';
    if (pan.startsWith('4')) return 'VISA';
    if (pan.startsWith('5')) return 'MASTERCARD';
    return 'LOCAL CARD';
}
function drawRoundedRect(context, x, y, width, height, radius) {
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
function Pos3DSimulator() {
    _s();
    const mountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const screenMeshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const screenBindingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cardMeshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const raycasterRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Raycaster"]());
    const mouseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"]());
    const cameraRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rendererRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const controlsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animationFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cardAnimationStartedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cardExitStartedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    const screenConfigRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(DEFAULT_SCREEN_CONFIG);
    const cardConfigRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(DEFAULT_CARD_CONFIG);
    const statusRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('IDLE');
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('0');
    const [pan, setPan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('9999888877776666');
    const [merchants, setMerchants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [merchantId, setMerchantId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('SP0001');
    const [merchantName, setMerchantName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Điện lực EVN');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('IDLE');
    const [receiptData, setReceiptData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [screenConfig, setScreenConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SCREEN_CONFIG);
    const [cardConfig, setCardConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_CARD_CONFIG);
    const [fraudTestMode, setFraudTestMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const nowStamp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Pos3DSimulator.useMemo[nowStamp]": ()=>new Date().toLocaleString('vi-VN', {
                hour12: false,
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
    }["Pos3DSimulator.useMemo[nowStamp]"], [
        receiptData,
        status
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Pos3DSimulator.useEffect": ()=>{
            mountedRef.current = true;
            fetch('/api/merchants').then({
                "Pos3DSimulator.useEffect": (res)=>res.json()
            }["Pos3DSimulator.useEffect"]).then({
                "Pos3DSimulator.useEffect": (data)=>{
                    if (!mountedRef.current || !Array.isArray(data) || data.length === 0) {
                        return;
                    }
                    setMerchants(data);
                    setMerchantId(data[0].merchantId);
                    setMerchantName(data[0].name);
                }
            }["Pos3DSimulator.useEffect"]).catch({
                "Pos3DSimulator.useEffect": (error)=>console.error('Failed to load merchants:', error)
            }["Pos3DSimulator.useEffect"]);
            return ({
                "Pos3DSimulator.useEffect": ()=>{
                    mountedRef.current = false;
                }
            })["Pos3DSimulator.useEffect"];
        }
    }["Pos3DSimulator.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Pos3DSimulator.useEffect": ()=>{
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
        }
    }["Pos3DSimulator.useEffect"], [
        screenConfig
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Pos3DSimulator.useEffect": ()=>{
            cardConfigRef.current = cardConfig;
        }
    }["Pos3DSimulator.useEffect"], [
        cardConfig
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Pos3DSimulator.useEffect": ()=>{
            statusRef.current = status;
        }
    }["Pos3DSimulator.useEffect"], [
        status
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Pos3DSimulator.useEffect": ()=>{
            const mountNode = mountRef.current;
            if (!mountNode) {
                return;
            }
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            scene.background = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](0x0b1220);
            scene.fog = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fog"](0x0b1220, 12, 34);
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](45, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
            camera.position.set(0, 15, 25);
            cameraRef.current = camera;
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                antialias: true
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PCFSoftShadowMap"];
            renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            rendererRef.current = renderer;
            mountNode.appendChild(renderer.domElement);
            const controls = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$controls$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"](camera, renderer.domElement);
            controls.enableDamping = true;
            controls.enablePan = false;
            controls.enableZoom = true;
            controls.minDistance = 12;
            controls.maxDistance = 34;
            controls.target.set(0, 2, 0);
            controls.autoRotate = false;
            controlsRef.current = controls;
            scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmbientLight"](0xffffff, 0.95));
            const dirLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0xffffff, 1.55);
            dirLight.position.set(5, 10, 7);
            dirLight.castShadow = true;
            scene.add(dirLight);
            const pointLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](0x7dd3fc, 22, 50);
            pointLight.position.set(-5, 5, -5);
            scene.add(pointLight);
            const frontLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0xffffff, 1.35);
            frontLight.position.set(0, 5, 15);
            scene.add(frontLight);
            const canvas2D = document.createElement('canvas');
            canvas2D.width = SCREEN_W;
            canvas2D.height = SCREEN_H;
            const context = canvas2D.getContext('2d');
            if (!context) {
                return;
            }
            const screenTexture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas2D);
            screenTexture.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            screenBindingRef.current = {
                texture: screenTexture,
                context
            };
            const screenMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                map: screenTexture,
                transparent: true,
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"],
                depthTest: false,
                depthWrite: false,
                toneMapped: false
            });
            const screenMesh_0 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](4.5, 9), screenMaterial);
            screenMesh_0.position.set(screenConfigRef.current.posX, screenConfigRef.current.posY, screenConfigRef.current.posZ);
            screenMesh_0.rotation.set(screenConfigRef.current.rotX, screenConfigRef.current.rotY, screenConfigRef.current.rotZ);
            screenMesh_0.translateY(screenConfigRef.current.slideY);
            screenMesh_0.scale.set(screenConfigRef.current.scaleX, screenConfigRef.current.scaleY, 1);
            screenMesh_0.renderOrder = 10;
            screenMeshRef.current = screenMesh_0;
            scene.add(screenMesh_0);
            const loader = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLTFLoader"]();
            loader.load('/pos_terminal/scene.gltf', {
                "Pos3DSimulator.useEffect": (gltf)=>{
                    const posTerminal = gltf.scene;
                    const box = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box3"]().setFromObject(posTerminal);
                    const center = box.getCenter(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]());
                    const size = box.getSize(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 10 / maxDim;
                    posTerminal.scale.setScalar(scale);
                    box.setFromObject(posTerminal);
                    posTerminal.position.sub(center);
                    posTerminal.position.y += box.getSize(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()).y / 2;
                    posTerminal.traverse({
                        "Pos3DSimulator.useEffect": (child)=>{
                            if (child instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"]) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        }
                    }["Pos3DSimulator.useEffect"]);
                    scene.add(posTerminal);
                }
            }["Pos3DSimulator.useEffect"], undefined, {
                "Pos3DSimulator.useEffect": (error_0)=>console.error('Error loading model:', error_0)
            }["Pos3DSimulator.useEffect"]);
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
            const cardTexture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](cardCanvas);
            cardTexture.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            const cardMaterial = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                map: cardTexture,
                roughness: 0.34,
                metalness: 0.1
            });
            const creditCardMesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BoxGeometry"](3.8, 0.03, 2.22), cardMaterial);
            creditCardMesh.position.set(10, 15, 10);
            creditCardMesh.rotation.set(-2, Math.PI, 0.5);
            creditCardMesh.visible = false;
            creditCardMesh.castShadow = true;
            cardMeshRef.current = creditCardMesh;
            scene.add(creditCardMesh);
            const handleResize = {
                "Pos3DSimulator.useEffect.handleResize": ()=>{
                    if (!mountRef.current || !cameraRef.current || !rendererRef.current) {
                        return;
                    }
                    cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                    cameraRef.current.updateProjectionMatrix();
                    rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
                }
            }["Pos3DSimulator.useEffect.handleResize"];
            const tick = {
                "Pos3DSimulator.useEffect.tick": ()=>{
                    controls.update();
                    if (screenMeshRef.current && cameraRef.current) {
                        const screenWorldPosition = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
                        const screenWorldQuaternion = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Quaternion"]();
                        const screenNormal = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0, 1);
                        const toCamera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
                        screenMeshRef.current.getWorldPosition(screenWorldPosition);
                        screenMeshRef.current.getWorldQuaternion(screenWorldQuaternion);
                        screenNormal.applyQuaternion(screenWorldQuaternion).normalize();
                        toCamera.copy(cameraRef.current.position).sub(screenWorldPosition).normalize();
                        screenMeshRef.current.visible = screenNormal.dot(toCamera) > 0;
                    }
                    if (cardMeshRef.current && cardAnimationStartedRef.current !== null) {
                        const elapsed = (performance.now() - cardAnimationStartedRef.current) / 1000;
                        const insertCompletedAt = CARD_HOVER_DURATION + CARD_PRE_INSERT_PAUSE + CARD_TAP_DURATION;
                        if (elapsed <= CARD_HOVER_DURATION) {
                            const p = elapsed / CARD_HOVER_DURATION;
                            cardMeshRef.current.visible = true;
                            cardMeshRef.current.position.set(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(10, cardConfigRef.current.targetX, p), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(15, cardConfigRef.current.targetY + 2, p), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(10, cardConfigRef.current.targetZ, p));
                            cardMeshRef.current.rotation.set(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(-2, cardConfigRef.current.rotX, p), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(Math.PI, cardConfigRef.current.rotY, p), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(0.5, cardConfigRef.current.rotZ, p));
                        } else if (elapsed <= CARD_HOVER_DURATION + CARD_PRE_INSERT_PAUSE) {
                            cardMeshRef.current.position.set(cardConfigRef.current.targetX, cardConfigRef.current.targetY + 2, cardConfigRef.current.targetZ);
                            cardMeshRef.current.rotation.set(cardConfigRef.current.rotX, cardConfigRef.current.rotY, cardConfigRef.current.rotZ);
                        } else if (elapsed <= CARD_HOVER_DURATION + CARD_PRE_INSERT_PAUSE + CARD_TAP_DURATION) {
                            const p_0 = (elapsed - CARD_HOVER_DURATION - CARD_PRE_INSERT_PAUSE) / CARD_TAP_DURATION;
                            cardMeshRef.current.position.set(cardConfigRef.current.targetX, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(cardConfigRef.current.targetY + 2, cardConfigRef.current.targetY, p_0), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(cardConfigRef.current.targetZ, cardConfigRef.current.targetZ - 0.5, p_0));
                            cardMeshRef.current.rotation.set(cardConfigRef.current.rotX, cardConfigRef.current.rotY, cardConfigRef.current.rotZ);
                        } else if (elapsed <= insertCompletedAt) {
                            cardMeshRef.current.position.set(cardConfigRef.current.targetX, cardConfigRef.current.targetY, cardConfigRef.current.targetZ - 0.5);
                            cardMeshRef.current.rotation.set(cardConfigRef.current.rotX, cardConfigRef.current.rotY, cardConfigRef.current.rotZ);
                        } else {
                            cardMeshRef.current.position.set(cardConfigRef.current.targetX, cardConfigRef.current.targetY, cardConfigRef.current.targetZ - 0.5);
                            cardMeshRef.current.rotation.set(cardConfigRef.current.rotX, cardConfigRef.current.rotY, cardConfigRef.current.rotZ);
                            const currentStatus = statusRef.current;
                            const isFinalStatus = currentStatus === 'APPROVED' || currentStatus === 'DECLINED' || currentStatus === 'ERROR';
                            if (isFinalStatus && cardExitStartedRef.current === null) {
                                cardExitStartedRef.current = performance.now();
                            }
                            if (cardExitStartedRef.current !== null) {
                                const exitElapsed = (performance.now() - cardExitStartedRef.current) / 1000;
                                if (exitElapsed <= CARD_EXIT_DURATION) {
                                    const p_1 = exitElapsed / CARD_EXIT_DURATION;
                                    cardMeshRef.current.position.set(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(cardConfigRef.current.targetX, -12, p_1), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(cardConfigRef.current.targetY, 15, p_1), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(cardConfigRef.current.targetZ - 0.5, 5, p_1));
                                    cardMeshRef.current.rotation.set(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(cardConfigRef.current.rotX, -0.8, p_1), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(cardConfigRef.current.rotY, -1.1, p_1), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(cardConfigRef.current.rotZ, 0.25, p_1));
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
                }
            }["Pos3DSimulator.useEffect.tick"];
            animationFrameRef.current = window.requestAnimationFrame(tick);
            window.addEventListener('resize', handleResize);
            return ({
                "Pos3DSimulator.useEffect": ()=>{
                    window.removeEventListener('resize', handleResize);
                    if (animationFrameRef.current !== null) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                    controls.dispose();
                    renderer.dispose();
                    mountNode.removeChild(renderer.domElement);
                }
            })["Pos3DSimulator.useEffect"];
        }
    }["Pos3DSimulator.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Pos3DSimulator.useEffect": ()=>{
            const binding = screenBindingRef.current;
            if (!binding) {
                return;
            }
            const context_0 = binding.context;
            context_0.clearRect(0, 0, SCREEN_W, SCREEN_H);
            const clipRadius = 40;
            context_0.save();
            drawRoundedRect(context_0, 0, 0, SCREEN_W, SCREEN_H, clipRadius);
            context_0.clip();
            context_0.fillStyle = '#ffffff';
            context_0.fillRect(0, 0, SCREEN_W, SCREEN_H);
            context_0.fillStyle = '#111';
            context_0.font = 'bold 20px Arial';
            context_0.textAlign = 'right';
            context_0.textBaseline = 'alphabetic';
            context_0.fillText('BKBank POS', 488, 35);
            context_0.fillStyle = '#333';
            context_0.font = '900 30px Arial';
            context_0.textAlign = 'left';
            context_0.fillText('BKBank POS', 30, 90);
            context_0.font = '16px Arial';
            context_0.fillText(merchantName, 30, 118);
            context_0.fillText(`Merchant ID: ${merchantId}`, 30, 142);
            context_0.fillStyle = '#2f2f2f';
            context_0.beginPath();
            context_0.moveTo(0, 200);
            context_0.bezierCurveTo(200, 260, 300, 160, 512, 220);
            context_0.lineTo(512, NUMPAD_TOP);
            context_0.lineTo(0, NUMPAD_TOP);
            context_0.closePath();
            context_0.fill();
            context_0.fillStyle = '#54b9d1';
            context_0.beginPath();
            context_0.moveTo(0, 200);
            context_0.bezierCurveTo(200, 260, 300, 160, 512, 220);
            context_0.lineTo(512, 180);
            context_0.bezierCurveTo(300, 120, 200, 220, 0, 160);
            context_0.closePath();
            context_0.fill();
            context_0.fillStyle = '#ffffff';
            context_0.textAlign = 'right';
            if (status === 'PROCESSING') {
                context_0.font = 'bold 45px Arial';
                context_0.fillText('Processing...', 470, 380);
            } else {
                context_0.font = 'bold 50px Arial';
                context_0.fillText('00', 470, 420);
                context_0.font = 'bold 90px Arial';
                context_0.fillText(`${amount}.`, 390, 420);
            }
            if (status === 'APPROVED' || status === 'DECLINED' || status === 'ERROR') {
                context_0.fillStyle = status === 'APPROVED' ? '#18a874' : status === 'DECLINED' ? '#dc2626' : '#f59e0b';
                drawRoundedRect(context_0, 26, 430, SCREEN_W - 52, 56, 18);
                context_0.fill();
                context_0.fillStyle = '#ffffff';
                context_0.textAlign = 'left';
                context_0.font = '700 22px Arial';
                context_0.fillText(status === 'APPROVED' ? 'Giao dịch chấp thuận' : status === 'DECLINED' ? 'Giao dịch bị từ chối' : 'Lỗi kết nối jPOS', 44, 466);
            }
            const rowHeight = (SCREEN_H - NUMPAD_TOP) / 4;
            const colWidth = SCREEN_W / 3;
            context_0.strokeStyle = '#d6dce5';
            context_0.lineWidth = 2;
            context_0.beginPath();
            for(let i = 0; i <= 4; i += 1){
                const y = NUMPAD_TOP + i * rowHeight;
                context_0.moveTo(0, y);
                context_0.lineTo(SCREEN_W, y);
            }
            for(let i_0 = 1; i_0 <= 2; i_0 += 1){
                const x = i_0 * colWidth;
                context_0.moveTo(x, NUMPAD_TOP);
                context_0.lineTo(x, SCREEN_H);
            }
            context_0.stroke();
            context_0.textAlign = 'center';
            context_0.textBaseline = 'middle';
            BUTTON_LAYOUT.forEach({
                "Pos3DSimulator.useEffect": (row, rowIndex)=>{
                    row.forEach({
                        "Pos3DSimulator.useEffect": (char, colIndex)=>{
                            const x_0 = colIndex * colWidth;
                            const y_0 = NUMPAD_TOP + rowIndex * rowHeight;
                            const centerX = x_0 + colWidth / 2;
                            const centerY = y_0 + rowHeight / 2;
                            if (char === 'BACK') {
                                context_0.fillStyle = '#111827';
                                context_0.beginPath();
                                context_0.moveTo(centerX - 26, centerY);
                                context_0.lineTo(centerX - 8, centerY - 18);
                                context_0.lineTo(centerX + 26, centerY - 18);
                                context_0.lineTo(centerX + 26, centerY + 18);
                                context_0.lineTo(centerX - 8, centerY + 18);
                                context_0.closePath();
                                context_0.fill();
                                context_0.strokeStyle = '#ffffff';
                                context_0.lineWidth = 3;
                                context_0.beginPath();
                                context_0.moveTo(centerX + 4, centerY - 8);
                                context_0.lineTo(centerX + 16, centerY + 8);
                                context_0.moveTo(centerX + 16, centerY - 8);
                                context_0.lineTo(centerX + 4, centerY + 8);
                                context_0.stroke();
                            } else if (char === 'OK') {
                                context_0.fillStyle = '#2bd46d';
                                context_0.beginPath();
                                context_0.arc(centerX, centerY, 44, 0, Math.PI * 2);
                                context_0.fill();
                                context_0.strokeStyle = '#ffffff';
                                context_0.lineWidth = 8;
                                context_0.lineCap = 'round';
                                context_0.lineJoin = 'round';
                                context_0.beginPath();
                                context_0.moveTo(centerX - 15, centerY);
                                context_0.lineTo(centerX - 4, centerY + 12);
                                context_0.lineTo(centerX + 16, centerY - 12);
                                context_0.stroke();
                            } else {
                                context_0.fillStyle = '#0f172a';
                                context_0.font = '500 68px Arial';
                                context_0.fillText(char, centerX, centerY);
                            }
                        }
                    }["Pos3DSimulator.useEffect"]);
                }
            }["Pos3DSimulator.useEffect"]);
            context_0.restore();
            binding.texture.needsUpdate = true;
        }
    }["Pos3DSimulator.useEffect"], [
        amount,
        merchantId,
        merchantName,
        status
    ]);
    const handleReset = ()=>{
        setStatus('IDLE');
        setAmount('0');
        setReceiptData(null);
        cardAnimationStartedRef.current = null;
        cardExitStartedRef.current = null;
        if (cardMeshRef.current) {
            cardMeshRef.current.visible = false;
        }
    };
    const handleScreenKey = async (key)=>{
        if (status !== 'IDLE' && status !== 'ERROR') {
            return;
        }
        if (key === 'BACK') {
            setAmount((prev)=>prev.length > 1 ? prev.slice(0, -1) : '0');
            return;
        }
        if (key === 'OK') {
            await processPayment();
            return;
        }
        setAmount((prev_0)=>{
            if (prev_0 === '0') return key;
            if (prev_0.length >= 8) return prev_0;
            return prev_0 + key;
        });
    };
    const processPayment = async ()=>{
        if (amount === '0' || !pan) return;
        setStatus('PROCESSING');
        cardAnimationStartedRef.current = performance.now();
        cardExitStartedRef.current = null;
        try {
            const res_0 = await fetch('/api/pos/swipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pan,
                    amount: Number(amount),
                    merchantId,
                    merchantName,
                    fraudTestMode
                })
            });
            const data_0 = await res_0.json();
            setStatus(data_0.status === 'APPROVED' ? 'APPROVED' : 'DECLINED');
            setReceiptData({
                ...data_0,
                amount
            });
        } catch (error_1) {
            console.error(error_1);
            setStatus('ERROR');
            setReceiptData({
                amount,
                pan,
                code: 'XX',
                message: 'Không thể kết nối máy chủ Mạng lõi (jPOS)'
            });
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Pos3DSimulator.useEffect": ()=>{
            const handlePointerDown = {
                "Pos3DSimulator.useEffect.handlePointerDown": (event)=>{
                    const renderer_0 = rendererRef.current;
                    const camera_0 = cameraRef.current;
                    const screenMesh_1 = screenMeshRef.current;
                    if (!renderer_0 || !camera_0 || !screenMesh_1 || !mountRef.current) {
                        return;
                    }
                    const bounds = renderer_0.domElement.getBoundingClientRect();
                    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
                        return;
                    }
                    mouseRef.current.x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
                    mouseRef.current.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
                    raycasterRef.current.setFromCamera(mouseRef.current, camera_0);
                    const intersections = raycasterRef.current.intersectObject(screenMesh_1);
                    if (intersections.length === 0 || !intersections[0].uv) {
                        return;
                    }
                    const uv = intersections[0].uv;
                    const canvasX = uv.x * SCREEN_W;
                    const canvasY = (1 - uv.y) * SCREEN_H;
                    if (canvasY < NUMPAD_TOP) {
                        return;
                    }
                    const rowHeight_0 = (SCREEN_H - NUMPAD_TOP) / 4;
                    const colWidth_0 = SCREEN_W / 3;
                    const row_0 = Math.floor((canvasY - NUMPAD_TOP) / rowHeight_0);
                    const col = Math.floor(canvasX / colWidth_0);
                    if (row_0 < 0 || row_0 > 3 || col < 0 || col > 2) {
                        return;
                    }
                    const key_0 = BUTTON_LAYOUT[row_0][col];
                    void handleScreenKey(key_0);
                }
            }["Pos3DSimulator.useEffect.handlePointerDown"];
            window.addEventListener('pointerdown', handlePointerDown);
            return ({
                "Pos3DSimulator.useEffect": ()=>window.removeEventListener('pointerdown', handlePointerDown)
            })["Pos3DSimulator.useEffect"];
        }
    }["Pos3DSimulator.useEffect"], [
        amount,
        pan,
        merchantId,
        merchantName,
        status
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "pos3d-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pos3d-stage",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: mountRef,
                    className: "pos3d-canvas"
                }, void 0, false, {
                    fileName: "[project]/src/components/Pos3DSimulator.tsx",
                    lineNumber: 603,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                lineNumber: 602,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "pos3d-sidebar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pos3d-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "Payment Terminal"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 608,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Nhập số tiền trực tiếp trên màn hình máy POS. Kéo chuột để xoay và dùng con lăn để zoom."
                            }, void 0, false, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 609,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pos3d-panel-meta",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faStore"]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                                lineNumber: 615,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            merchantId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 615,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pos3d-online",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faWifi"]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                                lineNumber: 616,
                                                columnNumber: 44
                                            }, this),
                                            " ONLINE"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 616,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 614,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "pos3d-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Số thẻ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 620,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: pan,
                                        onChange: (event_0)=>setPan(event_0.target.value),
                                        disabled: status === 'PROCESSING'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 621,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 619,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "pos3d-field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Đơn vị chấp nhận thanh toán"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 625,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: merchantId,
                                        onChange: (event_1)=>{
                                            const selectedId = event_1.target.value;
                                            setMerchantId(selectedId);
                                            const merchant = merchants.find((item)=>item.merchantId === selectedId);
                                            if (merchant) {
                                                setMerchantName(merchant.name);
                                            }
                                        },
                                        disabled: status === 'PROCESSING' || merchants.length === 0,
                                        children: merchants.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: merchantId,
                                            children: [
                                                merchantName,
                                                " (",
                                                merchantId,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                            lineNumber: 634,
                                            columnNumber: 41
                                        }, this) : merchants.map((merchant_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: merchant_0.merchantId,
                                                children: [
                                                    merchant_0.name,
                                                    " (",
                                                    merchant_0.merchantId,
                                                    ")"
                                                ]
                                            }, merchant_0.merchantId, true, {
                                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                                lineNumber: 634,
                                                columnNumber: 137
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 626,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 624,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "pos3d-toggle",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: fraudTestMode,
                                        onChange: (event_2)=>setFraudTestMode(event_2.target.checked),
                                        disabled: status === 'PROCESSING'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 641,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Kích hoạt fraud test mode"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 642,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 640,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pos3d-inline-actions",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "pos3d-primary-btn",
                                    onClick: handleReset,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faRotateLeft"]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                            lineNumber: 647,
                                            columnNumber: 15
                                        }, this),
                                        " Làm mới"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                    lineNumber: 646,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 645,
                                columnNumber: 11
                            }, this),
                            status === 'PROCESSING' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pos3d-processing-box",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pos3d-loader"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 652,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Đang xử lý giao dịch..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 653,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 651,
                                columnNumber: 39
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                        lineNumber: 607,
                        columnNumber: 9
                    }, this),
                    (status === 'APPROVED' || status === 'DECLINED' || status === 'ERROR') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pos3d-receipt",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pos3d-receipt-head",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Receipt"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 659,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faPrint"],
                                        className: "pos3d-receipt-icon"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 660,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 658,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pos3d-receipt-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Merchant"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 664,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: merchantName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 665,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Thời gian"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 666,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: nowStamp
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 667,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Số thẻ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 668,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: maskPan(receiptData?.pan ?? pan)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 669,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Loại thẻ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 670,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: resolveBrand(receiptData?.pan ?? pan)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 671,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "STAN"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 672,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: receiptData?.stan || 'N/A'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 673,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Response code"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 674,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: receiptData?.code || 'N/A'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 675,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Chế độ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 676,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: receiptData?.fraudTestMode ? 'Fraud test' : 'POS normal'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 677,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Tổng tiền"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 678,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: [
                                            currency(receiptData?.amount ?? amount),
                                            " USD"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 679,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 663,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pos3d-receipt-foot",
                                children: [
                                    status === 'APPROVED' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pos3d-badge success",
                                        children: "Approved"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 683,
                                        columnNumber: 41
                                    }, this),
                                    status === 'DECLINED' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pos3d-badge danger",
                                        children: "Declined"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 684,
                                        columnNumber: 41
                                    }, this),
                                    status === 'ERROR' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pos3d-badge warning",
                                        children: "Connection Error"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                        lineNumber: 685,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                                lineNumber: 682,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                        lineNumber: 657,
                        columnNumber: 84
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pos3d-instructions",
                        children: "Mouse: Left click to rotate, scroll to zoom."
                    }, void 0, false, {
                        fileName: "[project]/src/components/Pos3DSimulator.tsx",
                        lineNumber: 689,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Pos3DSimulator.tsx",
                lineNumber: 606,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Pos3DSimulator.tsx",
        lineNumber: 601,
        columnNumber: 10
    }, this);
}
_s(Pos3DSimulator, "Tk99N8yRT+qCY3OjmwJYev2c/qo=");
_c = Pos3DSimulator;
var _c;
__turbopack_context__.k.register(_c, "Pos3DSimulator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PosPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pos3DSimulator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Pos3DSimulator.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function PosPage() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "6c4aefa8dc8635cc4ba7bbf7aeb82bc16348a48efc97dc430d92da741c9e145a") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6c4aefa8dc8635cc4ba7bbf7aeb82bc16348a48efc97dc430d92da741c9e145a";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Pos3DSimulator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 15,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c = PosPage;
var _c;
__turbopack_context__.k.register(_c, "PosPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_47968964._.js.map
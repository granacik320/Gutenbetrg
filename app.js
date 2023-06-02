import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

gsap.registerPlugin(ScrollTrigger);

//proggres bar config==============================================================================================================

const bar = new ProgressBar.Circle('#loading-container', {
    color: '#b7ab98',
    strokeWidth: 4,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1200,
    text: {
      autoStyleContainer: false
    },
    from: { color: '#b7ab98', width: 1 },
    to: { color: '#b7ab98', width: 4 },
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
  
      let value = Math.round(circle.value() * 100);
      if (value === 0) {
        circle.setText('0%');
      } else {
        circle.setText(`${value}%`);
      }
  
    }
  });
  bar.text.style.fontSize = '2rem';

//mouse follower config==============================================================================================================

const cursor = new MouseFollower({
    el: null,
    container: document.body,
    className: 'mf-cursor',
    innerClassName: 'mf-cursor-inner',
    textClassName: 'mf-cursor-text',
    mediaClassName: 'mf-cursor-media',
    mediaBoxClassName: 'mf-cursor-media-box',
    iconSvgClassName: 'mf-svgsprite',
    iconSvgNamePrefix: '-',
    iconSvgSrc: '',
    dataAttr: 'cursor',
    hiddenState: '-hidden',
    textState: '-text',
    iconState: '-icon',
    activeState: '-active',
    mediaState: '-media',
    stateDetection: {
        '-pointer': 'a,button',
        '-hidden': 'iframe'
    },
    visible: true,
    visibleOnState: false,
    speed: 0.55,
    ease: 'expo.out',
    overwrite: true,
    skewing: 0.5,
    skewingText: 0.7,
    skewingIcon: 0.7,
    skewingMedia: 0.7,
    skewingDelta: 0.01,
    skewingDeltaMax: 0.15,
    stickDelta: 0.15,
    showTimeout: 20,
    hideOnLeave: true,
    hideTimeout: 300,
    hideMediaTimeout: 300
});

//gsap and lenis==============================================================================================================

document.querySelectorAll(".nav-list li").forEach(e => {
    e.addEventListener("click", () => {
        lenis.scrollTo(e.children[0].getAttribute("data-href"), {duration: 2.5})
    })
})


const lenis = new Lenis({
    duration: 2.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
})
  
function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update;
    requestAnimationFrame(raf);
}
  
requestAnimationFrame(raf);

const lines = document.querySelectorAll('.lines-gsap');

lines.forEach(e => {
  gsap.to(e.children[0].children, {"--size": "0%", stagger: 0.7, duration: 20, scrollTrigger: {
  trigger: e,
  start: '0% center',
  scrub: 2,
}});  
});

document.querySelectorAll(".plain-gsap").forEach((section) => {
    section.children[0].children[2].innerText.split('').forEach((e) => {
        const letter = document.createElement('span');
        letter.innerHTML = e;
        letter.setAttribute("style", "--size: 100%");
        section.children[0].children[1].appendChild(letter);
    })
})

document.querySelectorAll(".plain-text-mask").forEach(e => {
    gsap.to(e.children, {"--size": "0%", stagger: .1, duration: .1, scrollTrigger: {
        trigger: e,
        start: 'top bottom',
        end: "center 20%",
        scrub: 2.8,
    }})
}); 

const horizontal = document.querySelector(".horizontal");
let cards = gsap.utils.toArray(".horizontal-card");

gsap.to(cards, {
  xPercent: -100 * (cards.length - 1),
  scrollTrigger: {
    trigger: horizontal,
    pin: true,
    scrub: 2,
    duration: 3,
    snap: 1 / (cards.length - 1),
    end: "+=" + horizontal.offsetWidth
  }
});

//THREEJS========================================================================================================

const model = new URL('./3D/globe.min.gltf', import.meta.url);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', function() {
    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

renderer.gammaOutput = true;

const Sun = new THREE.DirectionalLight( 0xffffff, 1 );
Sun.position.set(1, -1, -2);
scene.add(Sun);

const shadow = new THREE.DirectionalLight( 0xffffff, -4 );
shadow.position.set(-3, 0, -1);
scene.add(shadow);

const ambient =  new THREE.AmbientLight( 0x97DEFF, 3.2 );
scene.add(ambient);


const camera = new THREE.PerspectiveCamera(
    4,
    window.innerWidth / window.innerHeight,
    1,
    1000
);

// scene.background = new THREE.Color('#ffffff');
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enabled = false;

camera.position.set(0, 7, 10);
orbit.update();

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath('./libs/draco/');
loader.setDRACOLoader( dracoLoader );

let mixer;

loader.load(model.href, function(gltf) {
    const model = gltf.scene;

    if(window.innerWidth > 800){
        lenis.on('scroll', (e) => {
            model.rotation.y += e.velocity/500;
        })
    }
    const clock = new THREE.Clock();
    function animate() {
        if(mixer)
            mixer.update(clock.getDelta());
            model.rotation.y += 0.001;
        renderer.render(scene, camera);
    }

    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    
    renderer.setAnimationLoop(animate);
}, undefined, function(error) {
    console.error(error);
});

//Loadnig Screen===========================================================================================================

document.addEventListener('DOMContentLoaded', () => {
    bar.animate(1.0, function(){
        document.querySelector(".loading-screen").classList.add("hidden");
        setTimeout(() => {
            document.querySelector(".loading-screen").style.display = 'none';
        }, 300);
    });
});
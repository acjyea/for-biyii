let scene;
let camera;
let nearestDistance = Infinity;

let currentPlanet = null;

const raycaster = new THREE.Raycaster();

const screenCenter = new THREE.Vector2(
    0,
    0
);

let lookedPlanet = null;

const flyVelocity = new THREE.Vector3();

const flyAcceleration = 0.12;

const flyMaxSpeed = 4.5;

let renderer;

const textureLoader = new THREE.TextureLoader();

let stars;

/* ===========================
   METEOR
=========================== */

let meteors = [];

let rings = [];

let planetLights = [];

let atmosphereMeshes = [];

let nebulaGroup = [];

let starPosition = [];
let planets = [];
let earth;
let moon;
let mars;
let saturn;
let jupiter;
let neptune;
let saturnRing;

let galaxyStarted = false;

let cameraDistance = 300;

// ================= INTRO MESSAGE =================

let introProgress = 0;

let introFont = null;
let introFontLoaded = false;

// idle
// forming
// hold
// returning
// done

// ================= TEXT TARGET =================

let moveForward = 0;

let moveRight = 0;

let moveUp = 0;

let cameraOffset = {
    x: 0,
    y: 0
};

let targetOffset = {
    x: 0,
    y: 0
};

let cameraVelocity = {
    x: 0,
    y: 0
};

let cameraTarget = new THREE.Vector3();

const CAMERA_LIMIT = 700;

function loadIntroFont(callback){

    const loader = new THREE.FontLoader();

    loader.load(

        "assets/fonts/CaveatBrush_Regular.json",

        function(font){

            introFont = font;
            introFontLoaded = true;

            if(callback) callback();

        },

        undefined,

        function(err){

            console.error("Font gagal dimuat", err);

        }

    );

}

function initGalaxy() {

    if (galaxyStarted) return;

    galaxyStarted = true;

    const canvas = document.getElementById("galaxyCanvas");

    scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(
        0x000000,
        0.00045
    );

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        4000
    );

    camera.position.z = cameraDistance;

    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    createStars();

createNebula();
createEarth();

createEarthClouds();

createMoon();

createSaturn();
createJupiter();
createMars();
createNeptune();
createSun();
createLights()

const controls = document.getElementById("mobileControls");

if (controls) {
    controls.style.display = "flex";
}

animate();

document.fonts.ready.then(()=>{

});

}

function createStars() {

    const geometry = new THREE.BufferGeometry();

    const vertices = [];

    starPositions = [];

    for (let i = 0; i < 25000; i++) {

        const x = (Math.random() - 0.5) * 5000;
        const y = (Math.random() - 0.5) * 5000;
        const z = (Math.random() - 0.5) * 5000;

        vertices.push(
            x,
            y,
            z
        );

        starPositions.push(
        new THREE.Vector3(x, y, z)
    );

}

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            vertices,
            3
        )
    );

    const material = new THREE.PointsMaterial({

        color: 0xffffff,
        size: 1.8,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        vertexColors: false

    });

    stars = new THREE.Points(
    geometry,
    material
);

scene.add(stars);

// ======================
// SIMPAN ATTRIBUTE ASLI
// ======================

stars.userData.originalPositions =
    geometry.attributes.position.array.slice();

stars.userData.positionArray =
    geometry.attributes.position.array;

}

function createPlanets() {

    const colors = [

        0x6EC6FF,
        0xFFD166,
        0xEF476F,
        0x9B5DE5,
        0x06D6A0,
        0xF7B267

    ];

    for (let i = 0; i < 6; i++) {

        const geometry = new THREE.SphereGeometry(

            12 + Math.random() * 8,

            64,

            64

        );

        const material = new THREE.MeshPhysicalMaterial({

    color: colors[i],

    roughness: 0.45,

    metalness: 0.35,

    clearcoat: 0.8,

    clearcoatRoughness: 0.15,

    emissive: colors[i],

    emissiveIntensity: 0.18

});

const planet = new THREE.Mesh(

    geometry,

    material

);

        planet.position.set(

    (Math.random() - 0.5) * 1800,

    (Math.random() - 0.5) * 900,

    (Math.random() - 0.5) * 1800

);

        planets.push(planet);

        scene.add(planet);

        const atmosphereGeometry = new THREE.SphereGeometry(

    geometry.parameters.radius * 1.08,

    64,

    64

);

const atmosphereMaterial = new THREE.MeshBasicMaterial({

    color: colors[i],

    transparent: true,

    opacity: 0.12,

    side: THREE.BackSide

});

const atmosphere = new THREE.Mesh(

    atmosphereGeometry,

    atmosphereMaterial

);

atmosphere.position.copy(
    planet.position
);

scene.add(atmosphere);

atmosphereMeshes.push({

    planet,

    atmosphere

});

        const glow = new THREE.PointLight(

    colors[i],

    2,

    140

);

glow.position.copy(
    planet.position
);

scene.add(glow);

planetLights.push({

    planet,

    glow

});

        if (i === 1) {

    const ringGeometry = new THREE.RingGeometry(
        20,
        34,
        64
    );

    const ringMaterial = new THREE.MeshBasicMaterial({

        color: 0xd8c28a,

        side: THREE.DoubleSide,

        transparent: true,

        opacity: 0.8

    });

    const ring = new THREE.Mesh(
        ringGeometry,
        ringMaterial
    );

    ring.rotation.x = Math.PI / 2.4;

    ring.position.copy(
        planet.position
    );

    scene.add(ring);

    rings.push({
        planet,
        ring
    });

}

    }

}

/* ==========================================
   PLANET FACTORY
========================================== */

function createPlanet(

    radius,

    color,

    x,

    y,

    z

){

    const geometry = new THREE.SphereGeometry(

        radius,

        96,

        96

    );

    const material = new THREE.MeshPhysicalMaterial({

        color,

        roughness:0.55,

        metalness:0.25,

        clearcoat:0.9,

        emissive:color,

        emissiveIntensity:0.08

    });

    const mesh = new THREE.Mesh(

        geometry,

        material

    );

    mesh.position.set(

        x,

        y,

        z

    );

    scene.add(mesh);

const atmosphere = new THREE.Mesh(

    new THREE.SphereGeometry(

        radius * 1.06,

        96,

        96

    ),

    new THREE.MeshBasicMaterial({

        color: color,

        transparent: true,

        opacity: 0.08,

        side: THREE.BackSide

    })

);

atmosphere.position.copy(

    mesh.position

);

scene.add(

    atmosphere

);

mesh.userData.atmosphere = atmosphere;

planets.push(mesh);

return mesh;

}

/* ==========================================
   EARTH
========================================== */

function createEarth(){

    const earthTexture =
        textureLoader.load(
            "assets/textures/earth.jpg"
        );

    earth = new THREE.Mesh(

        new THREE.SphereGeometry(
            18,
            96,
            96
        ),

        new THREE.MeshStandardMaterial({

            map: earthTexture,

            roughness:0.65,

            metalness:0.02

        })

    );

    earth.name = "Earth"

    earth.position.set(

        -280,

        20,

        -400

    );
    
    scene.add(earth);

    planets.push(earth);

}

let earthClouds;

let moonAngle = 0;

function createEarthClouds(){

    const cloudTexture =
        textureLoader.load(
            "assets/textures/earth_clouds.png"
        );

    earthClouds = new THREE.Mesh(

        new THREE.SphereGeometry(

            18.3,

            96,

            96

        ),

        new THREE.MeshStandardMaterial({

            map:cloudTexture,

            transparent:true,

            opacity:0.55,

            depthWrite:false

        })

    );

    earthClouds.position.copy(

        earth.position

    );

    scene.add(

        earthClouds

    );

}

/* ==========================================
   MOON
========================================== */

function createMoon(){

    const moonTexture =
        textureLoader.load(
            "assets/textures/moon.jpg"
        );

    moon = new THREE.Mesh(

        new THREE.SphereGeometry(

            6,

            96,

            96

        ),

        new THREE.MeshStandardMaterial({

            map: moonTexture,

            roughness:1,

            metalness:0

        })

    );

    moon.name = "Moon"

    moon.position.set(

        -245,

        20,

        -400

    );

    scene.add(

        moon

    );

    planets.push(moon);

}

/* ==========================================
   SATURN
========================================== */

function createSaturn(){

    const saturnTexture = textureLoader.load(
        "assets/textures/saturn.jpg"
    );

    saturnTexture.encoding = THREE.sRGBEncoding;
saturnTexture.needsUpdate = true;

    saturn = new THREE.Mesh(

        new THREE.SphereGeometry(
            24,
            96,
            96
        ),

        new THREE.MeshPhongMaterial({

            map: saturnTexture,

            shininess:22

        })

    );

    saturn.position.set(

        180,
        20,
        -350

    );

    saturn.name = "Saturn"

    scene.add(saturn);

    planets.push(saturn);


    const ringTexture = textureLoader.load(

        "assets/textures/saturn_ring.png"

    );

    ringTexture.encoding = THREE.sRGBEncoding;
ringTexture.needsUpdate = true;



    const ringGeometry = new THREE.RingGeometry(

        30,
        46,
        128

    );



    const ringMaterial = new THREE.MeshPhongMaterial({

    map: ringTexture,

    transparent: true,

    side: THREE.DoubleSide,

    opacity: 0.95,

    color: 0xffffff,

    emissive: 0x777777,

    emissiveIntensity: 0.8

});



    saturnRing = new THREE.Mesh(

        ringGeometry,

        ringMaterial

    );



    saturnRing.rotation.x = Math.PI/2.45;

    saturnRing.position.copy(

        saturn.position

    );

    scene.add(saturnRing);

}

function createJupiter(){

    const jupiterTexture = textureLoader.load(
        "assets/textures/jupiter.jpg"
    );

    jupiterTexture.encoding = THREE.sRGBEncoding;

    jupiter = new THREE.Mesh(

        new THREE.SphereGeometry(
            34,
            96,
            96
        ),

        new THREE.MeshPhongMaterial({

            map: jupiterTexture,

            shininess:16

        })

    );

    jupiter.name = "Jupiter"

    jupiter.position.set(

        -250,
        20,
        -850

    );

    scene.add(jupiter);

const jupiterGlow = new THREE.Mesh(

    new THREE.SphereGeometry(

        35.5,

        64,

        64

    ),

    new THREE.MeshBasicMaterial({

        color: 0xffcc88,

        transparent: true,

        opacity: 0.05,

        side: THREE.BackSide

    })

);

jupiterGlow.position.copy(

    jupiter.position

);

scene.add(

    jupiterGlow

);

jupiter.userData.glow = jupiterGlow;

planets.push(jupiter);

}

function createMars(){

    const marsTexture = textureLoader.load(
        "assets/textures/mars.jpg"
    );

    marsTexture.encoding = THREE.sRGBEncoding;

    mars = new THREE.Mesh(

        new THREE.SphereGeometry(

            15,

            96,

            96

        ),

        new THREE.MeshPhongMaterial({

            map:marsTexture,

            shininess:20

        })

    );

    mars.name = "Mars"

    mars.position.set(

        420,

        20,

        -700

    );

    scene.add(

        mars

    );

    planets.push(mars);

}

function createNeptune(){

    const neptuneTexture = textureLoader.load(
        "assets/textures/neptune.jpg"
    );

    neptuneTexture.encoding = THREE.sRGBEncoding;

    neptune = new THREE.Mesh(

        new THREE.SphereGeometry(

            22,

            96,

            96

        ),

        new THREE.MeshPhongMaterial({

            map: neptuneTexture,

            shininess: 8

        })

    );

    neptune.name = "Neptune"

    neptune.position.set(

        -520,

        20,

        -1200

    );

    scene.add(

        neptune

    );

    planets.push(neptune);

}

let sun;

function createSun(){

    const sunTexture = textureLoader.load(
        "assets/textures/sun.jpg"
    );

    sunTexture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(
        60,
        96,
        96
    );

    const material = new THREE.MeshBasicMaterial({

    map: sunTexture,

    color: 0xfff6dd

});

    sun = new THREE.Mesh(

        geometry,

        material

    );

    sun.name = "Sun"

    sun.position.set(

        0,
        0,
        -1800

    );

    scene.add(

        sun

    );

    planets.push(sun);


}

function createLights() {

    scene.add(
        new THREE.AmbientLight(
            0xffffff,
            1
        )
    );

    const light = new THREE.PointLight(

    0xfff4d6,

    4.2,

    9000

);

light.position.copy(

    sun.position

);

scene.add(

    light

);

    const ambient =
new THREE.AmbientLight(

    0x8fa8ff,

    0.10

);

scene.add(

    ambient

);

}

setTimeout(() => {

    messageStarted = true;

}, 1500);

function animate() {

    requestAnimationFrame(animate);

    planets.forEach((planet, index) => {

        planet.rotation.x += 0.0015;
        planet.rotation.y += 0.0035;

        if(planet.userData.atmosphere){

    planet.userData.atmosphere.position.copy(

        planet.position

    );

}

        planet.rotation.z += 0.0008;

        planet.position.y += Math.sin(
            Date.now() * 0.0005 + index
        ) * 0.03;

    });

    if(earthClouds){

    earthClouds.position.copy(

        earth.position

    );

    earthClouds.rotation.y += 0.0018;

}

if(earth){

    earth.rotation.y += 0.001;

    if(earth.userData.atmosphere){

        earth.userData.atmosphere.rotation.y += 0.0004;

    }

}

if(earth && moon){

    moonAngle += 0.003;

    moon.position.x =
        earth.position.x +
        Math.cos(moonAngle) * 42;

    moon.position.z =
        earth.position.z +
        Math.sin(moonAngle) * 42;

    moon.position.y =
        earth.position.y;

    moon.rotation.y += 0.002;

}

if(saturn){

    saturn.rotation.y += 0.0015;

    if(saturnRing){

        saturnRing.position.copy(

            saturn.position

        );

        saturnRing.rotation.z += 0.0002;

    }

}

if(jupiter){

    jupiter.rotation.y += 0.0018;

}

if(mars){

    mars.rotation.y += 0.0016;

}

if(neptune){

    neptune.rotation.y += 0.0012;

}


    rings.forEach((item) => {

    item.ring.position.copy(
        item.planet.position
    );

    item.ring.rotation.y += 0.003;

});

if(sun){

    sun.rotation.y += 0.0006;

    if(sun.userData.halo){

        sun.userData.halo.scale.setScalar(

            1 + Math.sin(Date.now() * 0.002) * 0.03

        );

    }

}

planetLights.forEach((item) => {

    item.glow.position.copy(
        item.planet.position
    );

    item.glow.intensity =

        1.8 +

        Math.sin(

            Date.now() * 0.002

        ) * 0.5;

});

atmosphereMeshes.forEach((item) => {

    item.atmosphere.position.copy(

        item.planet.position

    );

    item.atmosphere.rotation.y += 0.001;

    item.atmosphere.material.opacity =

        0.10 +

        Math.sin(

            Date.now() * 0.0015

        ) * 0.03;

});

    nebulaGroup.forEach((cloud)=>{

    cloud.rotation.y += 0.00015;

    cloud.rotation.x += 0.00005;

});

for (let i = meteors.length - 1; i >= 0; i--) {

    const meteor = meteors[i];

    meteor.position.x += meteor.userData.speed;

    meteor.position.y -= meteor.userData.speed * 0.25;

    meteor.rotation.x += 0.15;
    meteor.rotation.y += 0.15;

    if (meteor.position.x > 2200) {

        scene.remove(meteor);

        meteors.splice(i, 1);

    }

}

if(stars){

    stars.rotation.y +=0.00012;
    stars.rotation.x+=0.00003;

    starOpacity += starDirection;

    if(starOpacity <= 0.55){

        starOpacity = 0.55;

        starDirection = 0.0015;

    }

    if(starOpacity >= 0.95){

        starOpacity = 0.95;

        starDirection = -0.0015;

    }

    stars.material.opacity = starOpacity;

}

    updateCamera();

renderer.render(scene,camera);

}
function createNebula() {

    const colors = [
        0x6a5acd,
        0x5b8cff,
        0xff66cc,
        0x66ffff,
        0x9966ff
    ];

    for (let i = 0; i < 80; i++) {

        const geometry = new THREE.SphereGeometry(
            18 + Math.random() * 40,
            16,
            16
        );

        const material = new THREE.MeshBasicMaterial({

            color: colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ],

            transparent: true,

            opacity: 0.03,

            depthWrite: false

        });

        const cloud = new THREE.Mesh(
            geometry,
            material
        );

        cloud.position.set(

            (Math.random() - 0.5) * 4500,

            (Math.random() - 0.5) * 2500,

            (Math.random() - 0.5) * 4500

        );

        cloud.rotation.set(

            Math.random() * Math.PI,

            Math.random() * Math.PI,

            Math.random() * Math.PI

        );

        scene.add(cloud);

        nebulaGroup.push(cloud);

    }

}

function createMeteor() {

    const geometry = new THREE.SphereGeometry(
        0.5,
        8,
        8
    );

    const material = new THREE.MeshBasicMaterial({

        color: 0xffffff

    });

    const meteor = new THREE.Mesh(
        geometry,
        material
    );

    meteor.name = "Meteor"

    meteor.position.set(

        -2200,

        Math.random() * 1200 - 600,

        Math.random() * 2000 - 1000

    );

    meteor.userData.speed =
        8 + Math.random() * 6;

    scene.add(meteor);

    meteors.push(meteor);

}

/* ===========================
   STAR TWINKLE
=========================== */

let starOpacity = 0.9;
let starDirection = -0.002;

function animateStars() {

    if (!stars) return;

    starOpacity += starDirection;

    if (starOpacity <= 0.45) {

        starDirection = 0.002;

    }

    if (starOpacity >= 0.9) {

        starDirection = -0.002;

    }

stars.material.opacity = starOpacity

}
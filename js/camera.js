// ===============================
// CAMERA SYSTEM V2
// ===============================

let moveSpeed = 2.5;

let sprintSpeed = 6;

let currentSpeed = moveSpeed;

let cameraYaw = 0;

let cameraPitch = 0;

const keys = {};

let isDragging = false;

const previousMouse = {

    x: 0,

    y: 0

};

const lookSensitivity = 0.0025;

// ===============================
// MOBILE JOYSTICK
// ===============================

const joystickBase = document.getElementById("joystickBase");

const joystickStick = document.getElementById("joystickStick");

const upBtn = document.getElementById("upBtn");

const downBtn = document.getElementById("downBtn");

let joyActive = false;

let joyCenterX = 0;

let joyCenterY = 0;

let joyForward = 0;

let joyRight = 0;

let moveUpMobile = 0;

// ===============================
// KEYBOARD
// ===============================

window.addEventListener("keydown", (e)=>{

    keys[e.key.toLowerCase()] = true;

});

window.addEventListener("keyup",(e)=>{

    keys[e.key.toLowerCase()] = false;

});

// ===============================
// MOUSE
// ===============================

window.addEventListener("mousedown",(e)=>{

    isDragging = true;

    previousMouse.x = e.clientX;

    previousMouse.y = e.clientY;

});

window.addEventListener("mouseup",()=>{

    isDragging = false;

});

window.addEventListener("mousemove",(e)=>{

    if(!isDragging) return;

    const dx = e.clientX - previousMouse.x;

    const dy = e.clientY - previousMouse.y;

    cameraYaw -= dx * lookSensitivity;

    cameraPitch -= dy * lookSensitivity;

    cameraPitch = Math.max(

        -Math.PI/2.2,

        Math.min(

            Math.PI/2.2,

            cameraPitch

        )

    );

    previousMouse.x = e.clientX;

    previousMouse.y = e.clientY;

});

// ===============================
// TOUCH
// ===============================

window.addEventListener("touchstart",(e)=>{

    isDragging = true;

    previousMouse.x = e.touches[0].clientX;

    previousMouse.y = e.touches[0].clientY;

});

window.addEventListener("touchend",()=>{

    isDragging = false;

});

window.addEventListener("touchmove",(e)=>{

    if(!isDragging) return;

    const dx =

        e.touches[0].clientX -

        previousMouse.x;

    const dy =

        e.touches[0].clientY -

        previousMouse.y;

    cameraYaw -= dx * lookSensitivity;

    cameraPitch -= dy * lookSensitivity;

    cameraPitch = Math.max(

        -Math.PI/2.2,

        Math.min(

            Math.PI/2.2,

            cameraPitch

        )

    );

    previousMouse.x =

        e.touches[0].clientX;

    previousMouse.y =

        e.touches[0].clientY;

});

// ===============================
// UPDATE CAMERA
// ===============================

function updateCamera(){

    if(!camera) return;

    currentSpeed =

        keys["shift"]

        ? sprintSpeed

        : moveSpeed;

    camera.rotation.order = "YXZ";

    camera.rotation.y = cameraYaw;

    camera.rotation.x = cameraPitch;

    const forward = new THREE.Vector3();

    camera.getWorldDirection(forward);

    const right = new THREE.Vector3();

    right.crossVectors(

        forward,

        camera.up

    ).normalize();

    if(keys["w"]){

        camera.position.add(

            forward.clone().multiplyScalar(

                currentSpeed

            )

        );

    }

    if(keys["s"]){

        camera.position.add(

            forward.clone().multiplyScalar(

                -currentSpeed

            )

        );

    }

    if(keys["a"]){

        camera.position.add(

            right.clone().multiplyScalar(

                currentSpeed

            )

        );

    }

    if(keys["d"]){

        camera.position.add(

            right.clone().multiplyScalar(

                -currentSpeed

            )

        );

    }

    if(keys["q"]){

        camera.position.y += currentSpeed;

    }

    if(keys["e"]){

        camera.position.y -= currentSpeed;

    }

    // ===============================
// MOBILE MOVEMENT
// ===============================

if(joyForward !== 0){

    camera.position.add(

        forward.clone().multiplyScalar(

            joyForward * currentSpeed

        )

    );

}

if(joyRight !== 0){

    camera.position.add(

        right.clone().multiplyScalar(

            -joyRight * currentSpeed

        )

    );

}

if(moveUpMobile !== 0){

    camera.position.y +=

        moveUpMobile * currentSpeed;

}

}

window.addEventListener("touchstart", (e) => {

    for (const touch of e.changedTouches) {

        if (touch.clientX < window.innerWidth * 0.4) {

            touchMove = true;

            moveTouchId = touch.identifier;

            joystickStartX = touch.clientX;

            joystickStartY = touch.clientY;

        } else {

            touchLook = true;

            lookTouchId = touch.identifier;

            lastLookX = touch.clientX;

            lastLookY = touch.clientY;

        }

    }

});

// ===============================
// JOYSTICK
// ===============================

joystickBase.addEventListener("touchstart",(e)=>{

    e.preventDefault();

    joyActive = true;

    const rect = joystickBase.getBoundingClientRect();

    joyCenterX = rect.left + rect.width/2;

    joyCenterY = rect.top + rect.height/2;

});

joystickBase.addEventListener("touchmove",(e)=>{

    if(!joyActive) return;

    e.preventDefault();

    const touch = e.touches[0];

    let dx = touch.clientX - joyCenterX;

    let dy = touch.clientY - joyCenterY;

    const max = 45;

    const len = Math.sqrt(dx*dx+dy*dy);

    if(len>max){

        dx = dx/len*max;

        dy = dy/len*max;

    }

    joystickStick.style.transform =
        `translate(${dx}px,${dy}px)`;

    joyRight = dx/max;

    joyForward = -dy/max;

});

joystickBase.addEventListener("touchend",()=>{

    joyActive = false;

    joyForward = 0;

    joyRight = 0;

    joystickStick.style.transform = "translate(0px,0px)";

});

upBtn.addEventListener("touchstart",()=>{

    moveUpMobile = 1;

});

upBtn.addEventListener("touchend",()=>{

    moveUpMobile = 0;

});

downBtn.addEventListener("touchstart",()=>{

    moveUpMobile = -1;

});

downBtn.addEventListener("touchend",()=>{

    moveUpMobile = 0;

});
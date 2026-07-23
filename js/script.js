const loadingScreen = document.getElementById("loading-screen");
const envelopeScreen = document.getElementById("envelope-screen");
const letterScreen = document.getElementById("letter-screen");
const galleryScreen = document.getElementById("gallery-screen");
const galaxyScreen = document.getElementById("galaxy-screen");

const envelope = document.getElementById("envelope");
const typing = document.getElementById("typing");

const nextBtn = document.getElementById("nextBtn");
const galaxyBtn = document.getElementById("galaxyBtn");

const gallery = document.getElementById("gallery");
const music = document.getElementById("bgMusic");

music.volume = 1;

music.addEventListener("canplaythrough", () => {
    console.log("MP3 BERHASIL DIMUAT");
});

music.addEventListener("error", () => {
    console.log("MP3 GAGAL DIMUAT");
});

const message = `HUAA ADA YANG BIRTHDAY NIII 
selamat ulang taun yang ke-20 ya biyyy.
semoga semua doa dan harapan biyi satu persatu bisa tercapai di tahun ini aamiin.
terimakasi yaa uda selalu jadi orang baik dan kuat di sela-sela kehidupan kamu yang mungkin aja terasa berat buat kamu...
AKU SUPER DUPER BANGGA SAMA KAMUUU, KAMU HEBATTT!!!
semoga biyi selalu sehat.
selalu bahagia.
selalu jadi biyi yang aku kenal yaa.
i love u more biy, than u know..
aku punya hadiah kecil ni buat kamuu, semoga suka yaa hihi🤍`;

const photos = [
    "assets/photos/1.jpg",
    "assets/photos/2.jpg",
    "assets/photos/3.jpg",
    "assets/photos/4.jpg",
    "assets/photos/5.jpg",
    "assets/photos/6.jpg"
];

window.addEventListener("load", () => {

    setTimeout(() => {

        loadingScreen.classList.add("hidden");
        envelopeScreen.classList.remove("hidden");

    }, 2500);

});

envelope.addEventListener("click", () => {

    music.play();

    envelope.classList.add("open");

    setTimeout(() => {

        envelopeScreen.classList.add("hidden");

        letterScreen.classList.remove("hidden");

        startTyping();

    },800);

});

let index = 0;

function startTyping() {

    if (index >= message.length) return;

    typing.textContent += message.charAt(index);

    index++;

    setTimeout(startTyping, 40);

}

nextBtn.addEventListener("click", () => {

    letterScreen.classList.add("hidden");
    galleryScreen.classList.remove("hidden");

    loadGallery();

});

function loadGallery() {

    gallery.innerHTML = "";

    photos.forEach((photo,index) => {

        const img = document.createElement("img");

        img.src = photo;

        img.style.opacity = "0";

        img.style.transform = "translateY(30px)";

        img.style.transition = "all .8s ease";

        gallery.appendChild(img);

        setTimeout(()=>{

            img.style.opacity = "1";

            img.style.transform = "translateY(0)";

        },index*500);

    });

}

galaxyBtn.addEventListener("click", () => {

    galleryScreen.classList.add("hidden");
    galaxyScreen.classList.remove("hidden");

    initGalaxy();

});

function checkOrientation(){

    const overlay =

        document.getElementById(

            "rotateOverlay"

        );

    if(

        window.innerHeight >

        window.innerWidth

    ){

        overlay.style.display="flex";

    }else{

        overlay.style.display="none";

    }

}

window.addEventListener(

    "resize",

    checkOrientation

);

window.addEventListener(

    "orientationchange",

    checkOrientation

);

checkOrientation();
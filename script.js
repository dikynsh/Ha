
// Efek delay gambar galeri
const galleryImgs = document.querySelectorAll(".image-grid img");
galleryImgs.forEach((img, index) => {
  img.style.animationDelay = `${index * 0.0}s`;
});

// Modal Pop Up Gambar
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("caption");
const closeBtn = document.getElementsByClassName("close")[0];

galleryImgs.forEach(img => {
  img.addEventListener("click", function() {
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.getAttribute("data-desc");
  });
});

// Close Modal
closeBtn.onclick = function() {
  modal.style.display = "none";
};

// Tutup modal jika klik luar gambar
modal.onclick = function(e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};
// Kolom Pencarian (berdasarkan nama gambar dari atribut alt)
const searchInput = document.getElementById("searchInput");
const noResult = document.getElementById("noResult");

searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  let found = false;

  galleryImgs.forEach(img => {
    const name = img.getAttribute("alt").toLowerCase(); // 🔹 pakai ALT
    if (name.includes(filter)) {
      img.style.display = "inline-block";
      found = true;
    } else {
      img.style.display = "none";
    }
  });

  // Jika tidak ada hasil
  if (!found && filter !== "") {
    noResult.style.display = "block";
  } else {
    noResult.style.display = "none";
  }

  // Jika input kosong → tampilkan semua gambar
  if (filter === "") {
    galleryImgs.forEach(img => img.style.display = "inline-block");
    noResult.style.display = "none";
  }
});

const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");
const slider = document.getElementById("videoSlider");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

// Pause otomatis
video1.addEventListener("", () => video2.pause());
video2.addEventListener("", () => video1.pause());

// Fungsi update indikator
function updateIndicator(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// Observer untuk cek slide mana yang sedang tampil
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = Array.from(slides).indexOf(entry.target);
      updateIndicator(index);
    }
  });
}, { threshold: 0.6 }); // 60% dari slide harus kelihatan

slides.forEach(slide => observer.observe(slide));

// Klik dot → pindah slide
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    slider.scrollTo({
      left: i * slider.clientWidth,
      behavior: "smooth"
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const introOverlay = document.getElementById("intro-overlay");
  const introVideo = document.getElementById("intro-video");
  const allVideos = document.querySelectorAll("video:not(#intro-video)");

  if (introVideo) {
    document.body.classList.add("freeze");
    document.body.classList.add("noscroll");

    allVideos.forEach(v => v.pause());

    function finishIntro() {
      introOverlay.style.transition = "opacity 1s ease"; // durasi animasi tetap
      introOverlay.style.opacity = "0";

      setTimeout(() => {
        introOverlay.style.display = "none";
        document.body.classList.remove("freeze");
        document.body.classList.remove("noscroll");
        allVideos.forEach(v => {
          if (v.id !== "video2") v.play();
        });
      }, 1000);
    }

    // Begitu video selesai → tutup overlay
    introVideo.addEventListener("ended", finishIntro);
  }
});

// Cegah zoom pakai keyboard (Ctrl +, Ctrl -, Ctrl 0)
document.addEventListener('keydown', function(event) {
  if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '0')) {
    event.preventDefault();
  }
});

// Cegah zoom pakai Ctrl + scroll (desktop & mode desktop HP)
document.addEventListener('wheel', function(event) {
  if (event.ctrlKey) {
    event.preventDefault();
  }
}, { passive: false });

// Cegah pinch zoom & gesture zoom (iOS Safari & Chrome)
document.addEventListener("DOMContentLoaded", () => {
  const introOverlay = document.getElementById("intro-overlay");
  const allVideos = document.querySelectorAll("video"); // ambil semua video

  if (introOverlay) {
    // Saat intro mulai → pause semua video
    allVideos.forEach(v => v.pause());

    setTimeout(() => {
      // Sembunyikan intro
      introOverlay.style.transition = "opacity 1s ease";
      introOverlay.style.opacity = "0";

      setTimeout(() => {
        introOverlay.style.display = "none";

        // Lepas freeze supaya animasi normal lagi
        document.body.classList.remove("freeze");
        document.body.classList.remove("noscroll");

        // Lanjutkan semua video (kecuali yang ada controls manual)
        allVideos.forEach(v => {
          if (!v.hasAttribute("controls")) {
            v.play().catch(()=>{}); // biar aman kalau autoplay diblokir
          }
        });

      }, 500);

    }, 7500); // total durasi intro
  }
});

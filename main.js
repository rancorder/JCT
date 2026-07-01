const slides = Array.from(document.querySelectorAll('.slide'));
const current = document.getElementById('current');
const total = document.getElementById('total');
const progressBar = document.getElementById('progressBar');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
let index = 0;

total.textContent = String(slides.length);

function showSlide(nextIndex) {
  index = Math.min(Math.max(nextIndex, 0), slides.length - 1);
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('is-active', slideIndex === index);
    slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true');
  });
  current.textContent = String(index + 1);
  progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
  prevButton.disabled = index === 0;
  nextButton.disabled = index === slides.length - 1;
  document.title = `${index + 1}/${slides.length} ${slides[index].dataset.title}｜有限会社ジェイシーティー`;
}

function nextSlide() { showSlide(index + 1); }
function prevSlide() { showSlide(index - 1); }

nextButton.addEventListener('click', nextSlide);
prevButton.addEventListener('click', prevSlide);

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === ' ') {
    event.preventDefault();
    nextSlide();
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    prevSlide();
  }
});

showSlide(0);

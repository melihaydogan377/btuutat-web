/**
 * BTÜ UTAT - Etkileşim ve Animasyon Dosyası
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Reveal (Sayfa kaydıkça beliren öğeler)
    const observerOptions = {
        threshold: 0.15 // Öğenin %15'i göründüğünde başlasın
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Animasyon uygulanacak tüm alanları seçiyoruz
    const elementsToAnimate = document.querySelectorAll('.animate, .member-card, .news-card, .unit-header');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('animate'); // Başlangıçta görünmez yap
        observer.observe(el);
    });

    // 2. Navbar Kaydırma Efekti (Cam efektini güçlendirir)
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.padding = "0.7rem 8%";
            nav.style.background = "rgba(255, 255, 255, 0.95)";
        } else {
            nav.style.padding = "1rem 8%";
            nav.style.background = "rgba(255, 255, 255, 0.85)";
        }
    });
});

// Haber Kaydırma Fonksiyonun (Bunu buraya taşıdık)
let isScrolling = false;
function scrollNews(distance) {
    if (isScrolling) return;
    isScrolling = true;
    const slider = document.getElementById('news-slider');
    slider.scrollBy({ left: distance, behavior: 'smooth' });
    setTimeout(() => { isScrolling = false; }, 400);
}

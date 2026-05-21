const SUPABASE_URL = "https://YOUR_PROJECT_URL.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('anketFormu');
const btnGonder = document.getElementById('btnGonder');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    btnGonder.disabled = true;
    btnGonder.innerText = "İşleniyor, lütfen bekleyin...";

    const adSoyad = document.getElementById('adSoyad').value.trim();
    const eposta = document.getElementById('eposta').value.trim();
    const soru1 = document.getElementById('soru1').value;
    const soru2 = document.getElementById('soru2').value.trim();

    try {
        // Verileri Supabase'e gönderiyoruz
        const { data, error } = await _supabase
            .from('katilimcilar')
            .insert([
                { ad_soyad: adSoyad, eposta: eposta, soru_1: soru1, soru_2: soru2 }
            ]);

        if (error) {
            if(error.code === "23505") { // Çift kayıt engelleme (Unique e-posta)
                throw new Error("Bu e-posta adresi ile daha önce sertifika alınmış.");
            }
            throw error;
        }

        // Sertifikayı yerelde üretip indirtiyoruz
        await sertifikaUret(adSoyad);

        btnGonder.innerText = "Sertifikanız İndirildi!";
        alert("Anket için teşekkürler! Sertifikanız başarıyla oluşturuldu.");

    } catch (err) {
        alert("Bir hata oluştu: " + err.message);
        btnGonder.disabled = false;
        btnGonder.innerText = "Anketi Tamamla & Sertifikamı İndir";
    }
});

async function sertifikaUret(isim) {
    const { PDFDocument, rgb } = PDFLib;

    // Aynı klasördeki assets'ten resmi çekiyoruz
    const imageUrl = './assets/sertifika-tasarimi.png';
    const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([1123, 794]); // A4 Yatay

    const embeddedImage = await pdfDoc.embedPng(imageBytes);
    page.drawImage(embeddedImage, { x: 0, y: 0, width: 1123, height: 794 });

    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

    // İsmin geleceği koordinatları buradan test ederek ayarlayabilirsin
    page.drawText(isim, {
        x: 400, 
        y: 380, 
        size: 36, 
        font: helveticaFont,
        color: rgb(0, 0, 0)
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${isim}_UTAT_Zirve_Sertifikasi.pdf`;
    link.click();
}

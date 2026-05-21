const form = document.getElementById('sertifikaFormu');
const btnGonder = document.getElementById('btnGonder');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    btnGonder.disabled = true;
    btnGonder.innerText = "Sertifikanız Hazırlanıyor...";

    const adSoyad = document.getElementById('adSoyad').value.trim();

    try {
        // Doğrudan sertifika üretme fonksiyonunu çağırıyoruz
        await sertifikaUret(adSoyad);

        btnGonder.disabled = false;
        btnGonder.innerText = "Sertifikamı İndir";

    } catch (err) {
        alert("Sertifika oluşturulurken bir hata oluştu: " + err.message);
        btnGonder.disabled = false;
        btnGonder.innerText = "Sertifikamı İndir";
    }
});

async function sertifikaUret(isim) {
    const { PDFDocument, rgb } = PDFLib;

    // Arka plandaki boş sertifika görselini klasörden çekiyoruz
    const imageUrl = './assets/sertifika-tasarimi.png';
    const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([1123, 794]); // A4 Yatay Boyutu

    const embeddedImage = await pdfDoc.embedPng(imageBytes);
    page.drawImage(embeddedImage, { x: 0, y: 0, width: 1123, height: 794 });

    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

    // İsmin geleceği yerin ince ayarı (X: Soldan sağa, Y: Aşağıdan yukarıya)
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

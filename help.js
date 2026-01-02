{
type: uploaded file
fileName: help.js
fullContent:
// =========================================================
// HELP.JS - TRILINGUAL USER GUIDE (FI/EN/VI) v5.96
// =========================================================

// --- KÄÄNNÖKSET / TRANSLATIONS / BẢN DỊCH ---
const helpData = {
    fi: {
        title: "Käyttöopas",
        version: "Versio",
        sections: [
            {
                title: "🚀 1. Asennus (Tärkeä!)",
                content: `
                    <p>Tämä on verkkosovellus (PWA). Jotta se toimii kuin oikea sovellus (eikä osoitepalkki vie tilaa), se kannattaa asentaa kotinäytölle.</p>
                    <div class="help-step">
                        <strong>🍎 iPhone / iPad (Safari):</strong>
                        <ol>
                            <li>Avaa tämä sivu <strong>Safarilla</strong>.</li>
                            <li>Paina alareunan <strong>Jaa-painiketta</strong> (Ikoni: Neliö, josta lähtee nuoli ylös <span style="font-size:16px">share</span>).</li>
                            <li>Vieritä valikkoa alaspäin ja valitse <strong>"Lisää Koti-valikkoon"</strong> (Add to Home Screen).</li>
                            <li>Paina yläkulmasta "Lisää".</li>
                        </ol>
                    </div>
                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Paina selaimen yläkulman kolmea pistettä (⋮).</li>
                            <li>Valitse <strong>"Asenna sovellus"</strong> tai <strong>"Lisää aloitusnäytölle"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "⚠️ Luvat ja Asetukset",
                content: `
                    <p>Sovellus vaatii toimiakseen oikeudet:</p>
                    <ul>
                        <li>📍 <strong>Sijainti (Location):</strong> Valitse "Salli aina" tai "Käytettäessä", jotta nopeusmittari toimii.</li>
                        <li>📱 <strong>Liikeanturit (Motion):</strong> (Vain iOS) Tarvitaan G-voimamittariin. Salli pyydettäessä.</li>
                        <li>🔊 <strong>Ääni (Audio):</strong> Sovellus soittaa äänetöntä ääntä taustalla, jotta GPS pysyy päällä puhelimen ollessa taskussa.</li>
                    </ul>`
            },
            {
                title: "🏎️ Mittaristo & Näkymät",
                content: `
                    <p><strong>Pystynäkymä:</strong> Nopeus ylhäällä, tilastot keskellä, osoite ja sää alhaalla.</p>
                    <p><strong>Vaakanäkymä:</strong> Käännä puhelin sivuttain saadaksesi laajan mittariston.</p>
                    <p><strong>G-Voima:</strong> Pieni "tähtäin" näyttää kiihdytykset ja jarrutukset. Jos pallo menee punaiselle, ajotapa on aggressiivinen.</p>`
            },
            {
                title: "🚗 Auton valinta & Arkisto",
                content: `
                    <p>Valitse auto yläpalkista ennen ajoa. "Kaikki autot" -tilassa et voi tallentaa ajoa.</p>
                    <p><strong>Arkistointi:</strong> Voit piilottaa vanhat autot Asetukset-sivulta painamalla 🗄️-nappia. Saat ne näkyviin valitsemalla ylävalikosta <em>"Kaikki (sis. arkistoidut)"</em>.</p>`
            },
            {
                title: "💾 Tallennus & Työajo",
                content: `
                    <p>Kun lopetat tallennuksen (STOP), voit valita:</p>
                    <ul>
                        <li><strong>🏠 Oma ajo:</strong> Normaalit ajot.</li>
                        <li><strong>💼 Työajo:</strong> Työmatkat (näkyvät raporteissa erikseen).</li>
                    </ul>
                    <p>Muista kirjoittaa ajolle lyhyt aihe (esim. "Asiakaskäynti").</p>`
            },
            {
                title: "📝 Historia & Raportit",
                content: `
                    <p><strong>Muokkaus:</strong> Paina kynä-ikonia (✏️) listassa korjataksesi tietoja jälkikäteen.</p>
                    <p><strong>Excel/CSV:</strong> Paina "Lataa CSV" saadaksesi ajopäiväkirjan tiedostona, jonka voi avata Excelissä.</p>
                    <p><strong>Manuaalinen lisäys:</strong> Unohditko sovelluksen? Lisää ajo käsin "+ Manuaalinen lisäys" -napista.</p>`
            }
        ]
    },
    en: {
        title: "User Guide",
        version: "Version",
        sections: [
            {
                title: "🚀 1. Installation (Important!)",
                content: `
                    <p>This is a Progressive Web App (PWA). For the best experience, add it to your home screen.</p>
                    <div class="help-step">
                        <strong>🍎 iPhone / iPad (Safari):</strong>
                        <ol>
                            <li>Open this page in <strong>Safari</strong>.</li>
                            <li>Tap the <strong>Share button</strong> at the bottom (Icon: Square with an arrow pointing up <span style="font-size:16px">share</span>).</li>
                            <li>Scroll down and select <strong>"Add to Home Screen"</strong>.</li>
                            <li>Tap "Add" in the top corner.</li>
                        </ol>
                    </div>
                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Tap the three dots (⋮) in the top right corner.</li>
                            <li>Select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "⚠️ Permissions",
                content: `
                    <p>The app requires the following permissions:</p>
                    <ul>
                        <li>📍 <strong>Location:</strong> Select "Allow while using" for the speedometer to work.</li>
                        <li>📱 <strong>Motion Sensors:</strong> (iOS only) Required for the G-force meter. Tap Allow if asked.</li>
                        <li>🔊 <strong>Audio:</strong> The app plays silent audio in the background to keep the GPS active while your phone is locked.</li>
                    </ul>`
            },
            {
                title: "🏎️ Dashboard & Views",
                content: `
                    <p><strong>Portrait:</strong> Speed on top, stats in the middle, address/weather at the bottom.</p>
                    <p><strong>Landscape:</strong> Turn your phone sideways for a widescreen dashboard.</p>
                    <p><strong>G-Force:</strong> The "bubble" shows acceleration/braking. If it hits red, the driving style is marked as aggressive.</p>`
            },
            {
                title: "🚗 Car Selection & Archive",
                content: `
                    <p>Select a vehicle from the top bar before driving. You cannot record in "All Vehicles" mode.</p>
                    <p><strong>Archiving:</strong> You can hide old cars in Settings by tapping 🗄️. To see them, select <em>"All (inc. archived)"</em> from the top menu.</p>`
            },
            {
                title: "💾 Saving & Work Trips",
                content: `
                    <p>When you stop recording, you can choose:</p>
                    <ul>
                        <li><strong>🏠 Private:</strong> Personal drives.</li>
                        <li><strong>💼 Work:</strong> Business trips (separated in reports).</li>
                    </ul>
                    <p>Remember to add a subject (e.g., "Client meeting").</p>`
            },
            {
                title: "📝 History & Reports",
                content: `
                    <p><strong>Edit:</strong> Tap the pencil icon (✏️) to fix data later.</p>
                    <p><strong>Excel/CSV:</strong> Tap "Download CSV" to get a file compatible with Excel.</p>
                    <p><strong>Manual Entry:</strong> Forgot to record? Use "+ Manual Entry" to add a drive by hand.</p>`
            }
        ]
    },
    vi: {
        title: "Hướng dẫn sử dụng",
        version: "Phiên bản",
        sections: [
            {
                title: "🚀 1. Cài đặt (Quan trọng!)",
                content: `
                    <p>Đây là ứng dụng web (PWA). Hãy cài đặt vào màn hình chính để sử dụng tốt nhất.</p>
                    <div class="help-step">
                        <strong>🍎 iPhone / iPad (Safari):</strong>
                        <ol>
                            <li>Mở trang này bằng <strong>Safari</strong>.</li>
                            <li>Nhấn nút <strong>Chia sẻ (Share)</strong> ở dưới cùng (Biểu tượng: Hình vuông có mũi tên hướng lên <span style="font-size:16px">share</span>).</li>
                            <li>Kéo xuống và chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong>.</li>
                            <li>Nhấn "Thêm" (Add) ở góc trên.</li>
                        </ol>
                    </div>
                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Nhấn vào dấu ba chấm (⋮) ở góc trên bên phải.</li>
                            <li>Chọn <strong>"Cài đặt ứng dụng" (Install App)</strong> hoặc <strong>"Thêm vào màn hình chính"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "⚠️ Quyền truy cập",
                content: `
                    <p>Ứng dụng cần các quyền sau:</p>
                    <ul>
                        <li>📍 <strong>Vị trí (Location):</strong> Chọn "Cho phép khi sử dụng" để đồng hồ tốc độ hoạt động.</li>
                        <li>📱 <strong>Cảm biến chuyển động:</strong> (Chỉ iOS) Cần thiết cho đồng hồ đo lực G. Nhấn Cho phép nếu được hỏi.</li>
                        <li>🔊 <strong>Âm thanh:</strong> Ứng dụng phát âm thanh im lặng trong nền để giữ GPS hoạt động khi tắt màn hình.</li>
                    </ul>`
            },
            {
                title: "🏎️ Bảng điều khiển",
                content: `
                    <p><strong>Dọc:</strong> Tốc độ ở trên, thống kê ở giữa, địa chỉ/thời tiết ở dưới.</p>
                    <p><strong>Ngang:</strong> Xoay ngang điện thoại để xem màn hình rộng.</p>
                    <p><strong>Lực G:</strong> "Bong bóng" hiển thị gia tốc/phanh. Nếu chạm vùng đỏ, lái xe được coi là không êm ái.</p>`
            },
            {
                title: "🚗 Chọn xe & Lưu trữ",
                content: `
                    <p>Chọn xe ở thanh trên cùng trước khi lái. Không thể ghi hình ở chế độ "Tất cả xe".</p>
                    <p><strong>Lưu trữ:</strong> Bạn có thể ẩn xe cũ trong Cài đặt bằng cách nhấn 🗄️. Để xem lại, chọn <em>"Tất cả (bao gồm đã lưu trữ)"</em> từ menu trên cùng.</p>`
            },
            {
                title: "💾 Lưu & Công tác",
                content: `
                    <p>Khi dừng ghi, bạn có thể chọn:</p>
                    <ul>
                        <li><strong>🏠 Cá nhân (Private):</strong> Lái xe cá nhân.</li>
                        <li><strong>💼 Công việc (Work):</strong> Đi công tác (tách biệt trong báo cáo).</li>
                    </ul>
                    <p>Nhớ ghi chú chủ đề (ví dụ: "Gặp khách hàng").</p>`
            },
            {
                title: "📝 Lịch sử & Báo cáo",
                content: `
                    <p><strong>Sửa:</strong> Nhấn biểu tượng bút chì (✏️) để sửa dữ liệu.</p>
                    <p><strong>Excel/CSV:</strong> Nhấn "Tải xuống CSV" để lấy file dùng cho Excel.</p>
                    <p><strong>Nhập thủ công:</strong> Quên bật ứng dụng? Dùng "+ Nhập thủ công" để thêm chuyến đi.</p>`
            }
        ]
    }
};

// --- LOGIIKKA / LOGIC ---

let currentHelpLang = 'fi'; // Oletuskieli

function renderHelp(lang) {
    currentHelpLang = lang;
    const container = document.getElementById('help-view');
    if (!container) return;

    const data = helpData[lang] || helpData['fi'];
    const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '5.96';

    // Generoidaan napit
    const buttons = `
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
            <button onclick="renderHelp('fi')" class="action-btn ${lang==='fi'?'blue-btn':''}" style="width:auto; padding:5px 15px; background-color:${lang==='fi'?'':'#333'};">🇫🇮 Suomi</button>
            <button onclick="renderHelp('en')" class="action-btn ${lang==='en'?'blue-btn':''}" style="width:auto; padding:5px 15px; background-color:${lang==='en'?'':'#333'};">🇬🇧 English</button>
            <button onclick="renderHelp('vi')" class="action-btn ${lang==='vi'?'blue-btn':''}" style="width:auto; padding:5px 15px; background-color:${lang==='vi'?'':'#333'};">🇻🇳 Tiếng Việt</button>
        </div>
    `;

    // Generoidaan sisältö
    let contentHtml = buttons;
    
    // Otsikko
    contentHtml += `
        <div style="text-align:center; margin-bottom: 30px;">
            <img src="ajopaivakirja_logo.png" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
            <h2 style="color:var(--accent-color); text-transform: uppercase; letter-spacing: 1px; margin:0;">${data.title}</h2>
            <p style="opacity:0.7; font-size:12px;">Mikkokalevin Ajopäiväkirja Pro - ${data.version} ${ver}</p>
        </div>
    `;

    // Osiot
    data.sections.forEach(section => {
        contentHtml += `
            <div class="help-section">
                <h3>${section.title}</h3>
                ${section.content}
            </div>
        `;
    });

    // Footer
    contentHtml += `
        <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
            Designed for drivers.
        </div>
    `;

    container.innerHTML = contentHtml;
}

// Alustetaan oletuksena suomi (tai voidaan tallentaa valinta localStorageen tulevaisuudessa)
// Kutsutaan tätä globaalisti jotta napit toimivat HTML:stä käsin
window.renderHelp = renderHelp;

// Alustetaan heti latauksessa
document.addEventListener('DOMContentLoaded', () => {
    renderHelp('fi');
});

// Varmistus jos view vaihdetaan ja sisältö on tyhjä
const helpObserver = new MutationObserver((mutations) => {
    const container = document.getElementById('help-view');
    if (container && container.style.display !== 'none' && container.innerHTML.trim() === "") {
        renderHelp(currentHelpLang);
    }
});

const helpViewEl = document.getElementById('help-view');
if (helpViewEl) {
    helpObserver.observe(helpViewEl, { attributes: true, attributeFilter: ['style'] });
}
// Renderöidään kertaalleen varmuuden vuoksi
if(helpViewEl) renderHelp('fi');

}

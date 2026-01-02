// =========================================================
// HELP.JS - TRILINGUAL USER GUIDE (FI/EN/VI) v5.96 FIX
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
                    <p>Tämä on verkkosovellus (PWA). Jotta se toimii kuin oikea sovellus, asenna se kotinäytölle.</p>
                    <div class="help-step">
                        <strong>🍎 iPhone / iPad (Safari):</strong>
                        <ol>
                            <li>Avaa sivu <strong>Safarilla</strong>.</li>
                            <li>Paina alareunan <strong>Jaa-painiketta</strong> (Neliö, josta nuoli ylös <span style="font-size:16px">share</span>).</li>
                            <li>Valitse <strong>"Lisää Koti-valikkoon"</strong> (Add to Home Screen).</li>
                            <li>Paina "Lisää".</li>
                        </ol>
                    </div>
                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Paina yläkulman kolmea pistettä (⋮).</li>
                            <li>Valitse <strong>"Asenna sovellus"</strong> tai <strong>"Lisää aloitusnäytölle"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "⚠️ Luvat ja Asetukset",
                content: `
                    <p>Sovellus vaatii toimiakseen:</p>
                    <ul>
                        <li>📍 <strong>Sijainti (Location):</strong> "Salli aina" tai "Käytettäessä".</li>
                        <li>📱 <strong>Liikeanturit (Motion):</strong> (iOS) G-voimamittaria varten.</li>
                        <li>🔊 <strong>Ääni (Audio):</strong> Tausta-ajoa varten (GPS pysyy päällä taskussa).</li>
                    </ul>`
            },
            {
                title: "🏎️ Mittaristo",
                content: `
                    <p><strong>Pystynäkymä:</strong> Nopeus ylhäällä, tilastot keskellä.</p>
                    <p><strong>Vaakanäkymä:</strong> Käännä puhelin sivuttain.</p>
                    <p><strong>G-Voima:</strong> "Pallo" näyttää kiihdytykset. Punainen = aggressiivinen.</p>`
            },
            {
                title: "💾 Tallennus & Työajo",
                content: `
                    <p>Lopetuksessa (STOP) valitse:</p>
                    <ul>
                        <li><strong>🏠 Oma ajo:</strong> Omat menot.</li>
                        <li><strong>💼 Työajo:</strong> Työmatkat (eritelty raportissa).</li>
                    </ul>`
            },
            {
                title: "📝 Historia & Raportit",
                content: `
                    <p><strong>Muokkaus:</strong> Paina kynä-ikonia (✏️) listassa.</p>
                    <p><strong>Excel/CSV:</strong> Paina "Lataa CSV" saadaksesi raportin.</p>
                    <p><strong>Manuaalinen:</strong> Lisää ajo käsin "+ Manuaalinen lisäys" -napista.</p>`
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
                    <p>For the best experience, add this PWA to your home screen.</p>
                    <div class="help-step">
                        <strong>🍎 iPhone / iPad (Safari):</strong>
                        <ol>
                            <li>Open in <strong>Safari</strong>.</li>
                            <li>Tap <strong>Share</strong> (Square with arrow up <span style="font-size:16px">share</span>).</li>
                            <li>Select <strong>"Add to Home Screen"</strong>.</li>
                            <li>Tap "Add".</li>
                        </ol>
                    </div>
                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Tap menu dots (⋮).</li>
                            <li>Select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "⚠️ Permissions",
                content: `
                    <ul>
                        <li>📍 <strong>Location:</strong> "Allow while using" for speedometer.</li>
                        <li>📱 <strong>Motion:</strong> (iOS) For G-force meter.</li>
                        <li>🔊 <strong>Audio:</strong> Keeps GPS active in background.</li>
                    </ul>`
            },
            {
                title: "🏎️ Dashboard",
                content: `
                    <p><strong>Portrait/Landscape:</strong> Rotates automatically.</p>
                    <p><strong>G-Force:</strong> Bubble shows braking/acceleration. Red = Aggressive.</p>`
            },
            {
                title: "💾 Saving & Work",
                content: `
                    <p>When stopping, choose:</p>
                    <ul>
                        <li><strong>🏠 Private:</strong> Personal drives.</li>
                        <li><strong>💼 Work:</strong> Business trips.</li>
                    </ul>`
            },
            {
                title: "📝 Reports",
                content: `
                    <p><strong>Edit:</strong> Use pencil icon (✏️).</p>
                    <p><strong>CSV:</strong> Download Excel-compatible file.</p>`
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
                    <p>Cài đặt vào màn hình chính để sử dụng tốt nhất.</p>
                    <div class="help-step">
                        <strong>🍎 iPhone / iPad (Safari):</strong>
                        <ol>
                            <li>Mở bằng <strong>Safari</strong>.</li>
                            <li>Nhấn nút <strong>Chia sẻ (Share)</strong> (Hình vuông có mũi tên lên <span style="font-size:16px">share</span>).</li>
                            <li>Chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong>.</li>
                            <li>Nhấn "Thêm" (Add).</li>
                        </ol>
                    </div>
                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Nhấn dấu ba chấm (⋮).</li>
                            <li>Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào màn hình chính"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "⚠️ Quyền truy cập",
                content: `
                    <ul>
                        <li>📍 <strong>Vị trí (Location):</strong> Để đo tốc độ.</li>
                        <li>📱 <strong>Cảm biến (Motion):</strong> (iOS) Để đo lực G.</li>
                        <li>🔊 <strong>Âm thanh:</strong> Giữ GPS chạy ngầm.</li>
                    </ul>`
            },
            {
                title: "🏎️ Bảng điều khiển",
                content: `
                    <p><strong>Xoay màn hình:</strong> Hỗ trợ ngang và dọc.</p>
                    <p><strong>Lực G:</strong> Bong bóng hiển thị gia tốc. Màu đỏ = Lái xe gắt.</p>`
            },
            {
                title: "💾 Lưu & Công tác",
                content: `
                    <p>Khi dừng lại, chọn:</p>
                    <ul>
                        <li><strong>🏠 Cá nhân (Private):</strong> Xe riêng.</li>
                        <li><strong>💼 Công việc (Work):</strong> Đi công tác.</li>
                    </ul>`
            },
            {
                title: "📝 Báo cáo",
                content: `
                    <p><strong>Sửa:</strong> Nhấn biểu tượng bút chì (✏️).</p>
                    <p><strong>CSV:</strong> Tải file cho Excel.</p>`
            }
        ]
    }
};

// --- LOGIIKKA / LOGIC ---

// Määritellään funktio globaalisti window-objektiin
window.renderHelp = function(lang) {
    const container = document.getElementById('help-view');
    if (!container) {
        console.warn("Help container not found!");
        return;
    }

    // Varmistetaan että data löytyy, fallback 'fi'
    const data = helpData[lang] || helpData['fi'];
    
    // Haetaan versionumero turvallisesti
    const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '5.96';

    // 1. Kielinapit
    const buttons = `
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
            <button onclick="window.renderHelp('fi')" class="action-btn" style="width:auto; padding:5px 15px; background-color:${lang==='fi'?'var(--accent-color)':'#333'};">🇫🇮 Suomi</button>
            <button onclick="window.renderHelp('en')" class="action-btn" style="width:auto; padding:5px 15px; background-color:${lang==='en'?'var(--accent-color)':'#333'};">🇬🇧 English</button>
            <button onclick="window.renderHelp('vi')" class="action-btn" style="width:auto; padding:5px 15px; background-color:${lang==='vi'?'var(--accent-color)':'#333'};">🇻🇳 Tiếng Việt</button>
        </div>
    `;

    // 2. Otsikko
    let contentHtml = buttons + `
        <div style="text-align:center; margin-bottom: 30px;">
            <img src="ajopaivakirja_logo.png" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
            <h2 style="color:var(--accent-color); text-transform: uppercase; letter-spacing: 1px; margin:0;">${data.title}</h2>
            <p style="opacity:0.7; font-size:12px;">Mikkokalevin Ajo Pro v${ver}</p>
        </div>
    `;

    // 3. Osiot
    data.sections.forEach(section => {
        contentHtml += `
            <div class="help-section">
                <h3>${section.title}</h3>
                ${section.content}
            </div>
        `;
    });

    // 4. Footer
    contentHtml += `
        <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
            Designed for drivers.
        </div>
    `;

    // Asetetaan sisältö
    container.innerHTML = contentHtml;
};

// SUORITETAAN HETI (Ei odoteta DOMContentLoaded, koska skripti on bodyn lopussa)
window.renderHelp('fi');

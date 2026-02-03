// =========================================================
// HELP.JS - TRILINGUAL MASTER GUIDE (v6.14 ANIMATED SPEEDOMETER)
// =========================================================

// --- KÄÄNNÖKSET / TRANSLATIONS / BẢN DỊCH ---
const helpData = {
    fi: {
        title: "Käyttöopas",
        version: "Versio",
        sections: [
            {
                title: "🚀 1. Uutta (v6.14, v6.13 & v6.12)",
                content: `
                    <div class="help-step" style="border-left: 4px solid #ff1744; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🎨 UUTTA v6.14: Animoitu Nopeusmittari & Live-Graafit:</strong>
                        <p>Täysin uusi visuaalinen kokemus ajon aikana!</p>
                        <ul>
                            <li><strong>🎯 Animoitu neulanenmittari</strong> - Perinteinen mittari modernilla toteutuksella</li>
                            <li><strong>🎨 Värilliset varoitukset</strong> - Vihreä (0-80km/h), Keltainen (80-120km/h), Punainen (120km/h+)</li>
                            <li><strong>📊 Live-graafit</strong> - Nopeuskäyrä (30s), korkeusgraafi, G-voiman visualisointi</li>
                            <li><strong>⚙️ Asetuksista valittavissa</strong> - Digitaalinen / Neulanenmittari / Molemmat</li>
                            <li><strong>📱 Mobiilioptimoitu</strong> - Akkuystävällinen animaatiot ja GPU-kiihdytys</li>
                            <li><strong>🔴 Tärinäefekti</strong> - Varoitus yli 140km/h nopeuksilla</li>
                            <li><strong>🎯 Mini G-voiman mittari</strong> - Reaaliaikainen kiihtyvyyden näyttö</li>
                        </ul>
                        <p><strong>Käyttö:</strong> Asetuksista voit valita nopeusmittarin tyylin. "Molemmat"-tilassa näytetään neulanenmittari ja kaikki graafit samanaikaisesti!</p>
                    </div>

                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>📍 UUTTA v6.13: Älykkäät Osamatkat (Segments):</strong>
                        <p>Kun käytät "Jatka ajoa" -toimintoa, sovellus luo uuden <strong>osamatkan</strong>. Historiassa näet tarkan erittelyn päivän ajoista.</p>
                    </div>

                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>🛡️ Tietoturvapäivitys (v6.12):</strong>
                        <ul>
                            <li>Sovellus on nyt täysin lukittu kirjautumattomilta käyttäjiltä</li>
                            <li>Uusi raportointi kilometrikorvauksilla</li>
                            <li>Tarkemmat osoitteet</li>
                        </ul>
                    </div>`
            },
            {
                title: "📲 2. Asennus sovellukseksi",
                content: `
                    <p>Jotta GPS toimii vakaasti taustalla, asenna sivu sovellukseksi:</p>
                    <div class="help-step">
                        <strong>🍎 iPhone (Safari):</strong>
                        <ol>
                            <li>Mene sivulle</li>
                            <li>Paina "Jaa" -ikonia</li>
                            <li>Valitse "Lisää kotivalikkoon"</li>
                        </ol>
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Mene sivulle</li>
                            <li>Paina kolmea pistettä oikeassa yläkulmassa</li>
                            <li>Valitse "Lisää aloitusnäyttöön"</li>
                        </ol>
                    </div>`
            },
            {
                title: "🚗 3. Ajoneuvot",
                content: `
                    <p>Lisää ajoneuvot Asetuksista:</p>
                    <ul>
                        <li>Auto, moottoripyörä, polkupyörä</li>
                        <li>Rekisterinumero, käyttövoima, tankin koko</li>
                        <li>Oma ikoni jokaiselle ajoneuvolle</li>
                    </ul>
                    <p><strong>Huom:</strong> Ajoneuvon valinta pakollinen ennen tallennuksen aloitusta!</p>`
            },
            {
                title: "⛽ 4. Tankkaukset",
                content: `
                    <p>Lisää tankkaustiedot:</p>
                    <ul>
                        <li>Paina ⛽-nappia mittaristossa</li>
                        <li>Syötä mittarilukema, litrat ja hinta</li>
                        <li>Sovellus laskee automaattisesti litrahinnan</li>
                    </ul>`
            },
            {
                title: "📊 5. Tilastot",
                content: `
                    <p>Kattavat analyysit ajotiedoistasi:</p>
                    <ul>
                        <li>Kilometrikehitys kuukausittain</li>
                        <li>Ajoneuvojakauma</li>
                        <li>Keskinopeudet</li>
                        <li>Polttoainekulutukset</li>
                    </ul>`
            },
            {
                title: "🗺️ 6. Kartat",
                content: `
                    <p>Reaaliaikainen kartta ajon aikana:</p>
                    <ul>
                        <li>Näytä nykyinen sijainti</li>
                        <li>Reittiviivan piirto</li>
                        <li>Lähtö- ja päätepisteet</li>
                        <li>Karttatyylit (normaali/satelliitti)</li>
                    </ul>`
            },
            {
                title: "📱 7. PWA-toiminnot",
                content: `
                    <p>Sovellus toimii myös offline:</p>
                    <ul>
                        <li>GPS toimii taustalla</li>
                        <li>Tiedot tallentuvat paikallisesti</li>
                        <li>Synkronointi kun yhteys palautuu</li>
                        <li>Pääsy ilman verkkoyhteyttä</li>
                    </ul>`
            },
            {
                title: "🔧 8. Asetukset",
                content: `
                    <p>Personoi sovellusta:</p>
                    <ul>
                        <li>Teeman valinta (vaalea/tumma)</li>
                        <li>Nopeusmittarin tyyli (v6.14)</li>
                        <li>Käyttäjäprofiili</li>
                        <li>Kilometrikorvauksen asetus</li>
                    </ul>`
            },
            {
                title: "📈 9. Raportointi",
                content: `
                    <p>Luo yksityiskohtaisia raportteja:</p>
                    <ul>
                        <li>Suodata ajot kuukauden/auton mukaan</li>
                        <li>Kilometrikorvauslaskuri</li>
                        <li>CSV-vienti Exceliin</li>
                        <li>Veroilmoitukseen sopiva muoto</li>
                    </ul>`
            },
            {
                title: "🔄 10. Synkronointi",
                content: `
                    <p>Cloud-tallennus Firebaseen:</p>
                    <ul>
                        <li>Kaikki tiedot turvassa pilvessä</li>
                        <li>Automaattinen synkronointi</li>
                        <li>Pääsy usealta laitteelta</li>
                        <li>Varmuuskopiointi</li>
                    </ul>`
            },
            {
                title: "🎯 11. Uudet v6.14 ominaisuudet",
                content: `
                    <p><strong>Animoitu nopeusmittari:</strong></p>
                    <ul>
                        <li>Canvas-pohjainen neulanenmittari</li>
                        <li>Värit vaihtuvat nopeuden mukaan</li>
                        <li>Tärinäefekti ylinopeuksilla</li>
                    </ul>
                    <p><strong>Live-graafit:</strong></p>
                    <ul>
                        <li>Nopeuskäyrä (30s historia)</li>
                        <li>Korkeusgraafi</li>
                        <li>G-voiman visualisointi</li>
                        <li>Mini G-mittari</li>
                    </ul>`
            },
            {
                title: "💡 12. Vinkkejä",
                content: `
                    <p><strong>Akun säästäminen:</strong></p>
                    <ul>
                        <li>Käytä "Molemmat" -tilaa vain tarvittaessa</li>
                        <li>Sulje kartta taustalla</li>
                        <li>Käytä tummaa teemaa</li>
                    </ul>
                    <p><strong>Tarkkuuden parantaminen:</strong></p>
                    <ul>
                        <li>Anna GPS:n kalibroitua</li>
                        <li>Vältä rakennusten sisällä ajoa</li>
                        <li>Käytä ulkoista GPS-antennia</li>
                    </ul>`
            }
        ]
    },
    en: {
        title: "User Guide",
        version: "Version",
        sections: [
            {
                title: "🚀 1. New (v6.14, v6.13 & v6.12)",
                content: `
                    <div class="help-step" style="border-left: 4px solid #ff1744; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🎨 NEW in v6.14: Animated Speedometer & Live Graphs:</strong>
                        <p>Completely new visual experience during driving!</p>
                        <ul>
                            <li><strong>🎯 Animated Needle Speedometer</strong> - Traditional speedometer with modern implementation</li>
                            <li><strong>🎨 Color-coded Warnings</strong> - Green (0-80km/h), Yellow (80-120km/h), Red (120km/h+)</li>
                            <li><strong>📊 Live Graphs</strong> - Speed curve (30s), altitude graph, G-force visualization</li>
                            <li><strong>⚙️ Selectable in Settings</strong> - Digital / Needle / Both</li>
                            <li><strong>📱 Mobile Optimized</strong> - Battery-friendly animations and GPU acceleration</li>
                            <li><strong>🔴 Vibration Effect</strong> - Warning at speeds over 140km/h</li>
                            <li><strong>🎯 Mini G-force Gauge</strong> - Real-time acceleration display</li>
                        </ul>
                        <p><strong>Usage:</strong> In Settings, choose speedometer style. "Both" mode shows needle speedometer and all graphs!</p>
                    </div>

                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>📍 NEW in v6.13: Smart Segment Tracking:</strong>
                        <p>When using "Continue Drive", app creates distinct segments. History shows detailed breakdown of day's trips.</p>
                    </div>

                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>🛡️ Security Update (v6.12):</strong>
                        <ul>
                            <li>App fully locked from unauthorized users</li>
                            <li>New reporting with mileage compensation</li>
                            <li>Better address capture</li>
                        </ul>
                    </div>`
            },
            {
                title: "📲 2. Install as App",
                content: `
                    <p>Install as app for reliable GPS background operation:</p>
                    <div class="help-step">
                        <strong>🍎 iPhone (Safari):</strong>
                        <ol>
                            <li>Go to website</li>
                            <li>Tap Share icon</li>
                            <li>Select "Add to Home Screen"</li>
                        </ol>
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Go to website</li>
                            <li>Tap three dots menu</li>
                            <li>Select "Add to Home screen"</li>
                        </ol>
                    </div>`
            },
            {
                title: "🚗 3. Vehicles",
                content: `
                    <p>Add vehicles in Settings:</p>
                    <ul>
                        <li>Car, motorcycle, bicycle</li>
                        <li>License plate, fuel type, tank size</li>
                        <li>Custom icon for each vehicle</li>
                    </ul>
                    <p><strong>Note:</strong> Vehicle selection required before starting recording!</p>`
            },
            {
                title: "⛽ 4. Refueling",
                content: `
                    <p>Add refueling data:</p>
                    <ul>
                        <li>Press ⛽ button on dashboard</li>
                        <li>Enter odometer, liters, price</li>
                        <li>App calculates price per liter automatically</li>
                    </ul>`
            },
            {
                title: "📊 5. Statistics",
                content: `
                    <p>Comprehensive analysis of your driving:</p>
                    <ul>
                        <li>Kilometer development monthly</li>
                        <li>Vehicle distribution</li>
                        <li>Average speeds</li>
                        <li>Fuel consumption</li>
                    </ul>`
            },
            {
                title: "🗺️ 6. Maps",
                content: `
                    <p>Real-time map during driving:</p>
                    <ul>
                        <li>Show current location</li>
                        <li>Route line drawing</li>
                        <li>Start and end points</li>
                        <li>Map styles (normal/satellite)</li>
                    </ul>`
            },
            {
                title: "📱 7. PWA Features",
                content: `
                    <p>App works offline too:</p>
                    <ul>
                        <li>GPS works in background</li>
                        <li>Data saves locally</li>
                        <li>Sync when connection returns</li>
                        <li>Access without network</li>
                    </ul>`
            },
            {
                title: "🔧 8. Settings",
                content: `
                    <p>Personalize the app:</p>
                    <ul>
                        <li>Theme selection (light/dark)</li>
                        <li>Speedometer style (v6.14)</li>
                        <li>User profile</li>
                        <li>Mileage compensation setting</li>
                    </ul>`
            },
            {
                title: "📈 9. Reporting",
                content: `
                    <p>Create detailed reports:</p>
                    <ul>
                        <li>Filter drives by month/car</li>
                        <li>Mileage compensation calculator</li>
                        <li>CSV export to Excel</li>
                        <li>Tax return compatible format</li>
                    </ul>`
            },
            {
                title: "🔄 10. Synchronization",
                content: `
                    <p>Cloud storage with Firebase:</p>
                    <ul>
                        <li>All data secure in cloud</li>
                        <li>Automatic synchronization</li>
                        <li>Access from multiple devices</li>
                        <li>Backup</li>
                    </ul>`
            },
            {
                title: "🎯 11. New v6.14 Features",
                content: `
                    <p><strong>Animated Speedometer:</strong></p>
                    <ul>
                        <li>Canvas-based needle speedometer</li>
                        <li>Colors change by speed</li>
                        <li>Vibration effect at high speeds</li>
                    </ul>
                    <p><strong>Live Graphs:</strong></p>
                    <ul>
                        <li>Speed curve (30s history)</li>
                        <li>Altitude graph</li>
                        <li>G-force visualization</li>
                        <li>Mini G-gauge</li>
                    </ul>`
            },
            {
                title: "💡 12. Tips",
                content: `
                    <p><strong>Battery Saving:</strong></p>
                    <ul>
                        <li>Use "Both" mode only when needed</li>
                        <li>Close map in background</li>
                        <li>Use dark theme</li>
                    </ul>
                    <p><strong>Improving Accuracy:</strong></p>
                    <ul>
                        <li>Let GPS calibrate</li>
                        <li>Avoid driving indoors</li>
                        <li>Use external GPS antenna</li>
                    </ul>`
            }
        ]
    },
    vn: {
        title: "Hướng dẫn sử dụng",
        version: "Phiên bản",
        sections: [
            {
                title: "🚀 1. Mới (v6.14, v6.13 & v6.12)",
                content: `
                    <div class="help-step" style="border-left: 4px solid #ff1744; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🎨 MỚI trong v6.14: Đồng hồ tốc độ động & Đồ thị trực tiếp:</strong>
                        <p>Trải nghiệm hình ảnh hoàn toàn mới khi lái xe!</p>
                        <ul>
                            <li><strong>🎯 Đồng hồ tốc độ kim loại động</strong> - Đồng hồ truyền thống với hiện thực hiện hiện đại</li>
                            <li><strong>🎨 Cảnh báo màu sắc</strong> - Xanh (0-80km/h), Vàng (80-120km/h), Đỏ (120km/h+)</li>
                            <li><strong>📊 Đồ thị trực tiếp</strong> - Đường cong tốc độ (30s), đồ thị độ cao, hình ảnh G-lực</li>
                            <li><strong>⚙️ Có thể chọn trong Cài đặt</strong> - Kỹ thuật số / Kim loại / Cả hai</li>
                            <li><strong>📱 Tối ưu hóa di động</strong> - Hoạt ảnh thân thiện với pin và tăng tốc GPU</li>
                            <li><strong>🔴 Hiệu ứng rung</strong> - Cảnh báo ở tốc độ trên 140km/h</li>
                            <li><strong>🎯 Đồng hồ G-lực mini</strong> - Hiển thị gia tốc thời gian thực</li>
                        </ul>
                        <p><strong>Sử dụng:</strong> Trong Cài đặt, chọn kiểu đồng hồ tốc độ. Chế độ "Cả hai" hiển thị đồng hồ kim loại và tất cả đồ thị!</p>
                    </div>

                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>📍 MỚI trong v6.13: Theo dõi phân khúc thông minh:</strong>
                        <p>Khi sử dụng "Tiếp tục lái xe", ứng dụng tạo các phân khúc riêng biệt. Lịch sử hiển thị phân tích chi tiết các chuyến đi trong ngày.</p>
                    </div>

                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>🛡️ Cập nhật bảo mật (v6.12):</strong>
                        <ul>
                            <li>Ứng dụng hoàn toàn khóa khỏi người dùng không được ủy quyền</li>
                            <li>Báo cáo mới với bồi thường quãng đường</li>
                            <li>Bắt địa chỉ tốt hơn</li>
                        </ul>
                    </div>`
            },
            {
                title: "📲 2. Cài đặt làm ứng dụng",
                content: `
                    <p>Cài đặt làm ứng dụng để GPS hoạt động ổn định nền:</p>
                    <div class="help-step">
                        <strong>🍎 iPhone (Safari):</strong>
                        <ol>
                            <li>Đi đến trang web</li>
                            <li>Nhấn biểu tượng Chia sẻ</li>
                            <li>Chọn "Thêm vào Màn hình chính"</li>
                        </ol>
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Đi đến trang web</li>
                            <li>Nhấn menu ba chấm</li>
                            <li>Chọn "Thêm vào Màn hình chính"</li>
                        </ol>
                    </div>`
            },
            {
                title: "🚗 3. Phương tiện",
                content: `
                    <p>Thêm phương tiện trong Cài đặt:</p>
                    <ul>
                        <li>Xe hơi, xe máy, xe đạp</li>
                        <li>Biển số, loại nhiên liệu, kích thước bình xăng</li>
                        <li>Biểu tượng tùy chỉnh cho mỗi phương tiện</li>
                    </ul>
                    <p><strong>Lưu ý:</strong> Cần chọn phương tiện trước khi bắt đầu ghi!</p>`
            },
            {
                title: "⛽ 4. Nhiên liệu",
                content: `
                    <p>Thêm dữ liệu nhiên liệu:</p>
                    <ul>
                        <li>Nhấn nút ⛽ trên bảng điều khiển</li>
                        <li>Nhập odometer, lít, giá</li>
                        <li>Ứng dụng tính giá mỗi lít tự động</li>
                    </ul>`
            },
            {
                title: "📊 5. Thống kê",
                content: `
                    <p>Phân tích toàn diện về lái xe của bạn:</p>
                    <ul>
                        <li>Phát triển kilomet hàng tháng</li>
                        <li>Phân phối phương tiện</li>
                        <li>Tốc độ trung bình</li>
                        <li>Tiêu thụ nhiên liệu</li>
                    </ul>`
            },
            {
                title: "🗺️ 6. Bản đồ",
                content: `
                    <p>Bản đồ thời gian thực khi lái xe:</p>
                    <ul>
                        <li>Hiển thị vị trí hiện tại</li>
                        <li>Vẽ đường đi</li>
                        <li>Điểm bắt đầu và kết thúc</li>
                        <li>Kiểu bản đồ (thông thường/vệ tinh)</li>
                    </ul>`
            },
            {
                title: "📱 7. Tính năng PWA",
                content: `
                    <p>Ứng dụng hoạt động ngoại tuyến:</p>
                    <ul>
                        <li>GPS hoạt động nền</li>
                        <li>Dữ liệu lưu cục bộ</li>
                        <li>Đồng bộ khi kết nối trở lại</li>
                        <li>Truy cập không cần mạng</li>
                    </ul>`
            },
            {
                title: "🔧 8. Cài đặt",
                content: `
                    <p>Cá nhân hóa ứng dụng:</p>
                    <ul>
                        <li>Lựa chọn chủ đề (sáng/tối)</li>
                        <li>Kiểu đồng hồ tốc độ (v6.14)</li>
                        <li>Hồ sơ người dùng</li>
                        <li>Cài đặt bồi thường quãng đường</li>
                    </ul>`
            },
            {
                title: "📈 9. Báo cáo",
                content: `
                    <p>Tạo báo cáo chi tiết:</p>
                    <ul>
                        <li>Lọc chuyến đi theo tháng/xe</li>
                        <li>Máy tính bồi thường quãng đường</li>
                        <li>Xuất CSV sang Excel</li>
                        <li>Định dạng tương thích khai thuế</li>
                    </ul>`
            },
            {
                title: "🔄 10. Đồng bộ hóa",
                content: `
                    <p>Lưu trữ đám mây với Firebase:</p>
                    <ul>
                        <li>Tất cả dữ liệu an toàn trong đám mây</li>
                        <li>Đồng bộ tự động</li>
                        <li>Truy cập từ nhiều thiết bị</li>
                        <li>Sao lưu</li>
                    </ul>`
            },
            {
                title: "🎯 11. Tính năng mới v6.14",
                content: `
                    <p><strong>Đồng hồ tốc độ động:</strong></p>
                    <ul>
                        <li>Đồng hồ tốc độ kim loại dựa trên Canvas</li>
                        <li>Màu sắc thay đổi theo tốc độ</li>
                        <li>Hiệu ứng rung ở tốc độ cao</li>
                    </ul>
                    <p><strong>Đồ thị trực tiếp:</strong></p>
                    <ul>
                        <li>Đường cong tốc độ (lịch sử 30s)</li>
                        <li>Đồ thị độ cao</li>
                        <li>Hình ảnh G-lực</li>
                        <li>Đồng hồ G mini</li>
                    </ul>`
            },
            {
                title: "💡 12. Mẹo",
                content: `
                    <p><strong>Tiết kiệm pin:</strong></p>
                    <ul>
                        <li>Chỉ sử dụng chế độ "Cả hai" khi cần</li>
                        <li>Đóng bản đồ nền</li>
                        <li>Sử dụng chủ đề tối</li>
                    </ul>
                    <p><strong>Cải thiện độ chính xác:</strong></p>
                    <ul>
                        <li>Để GPS hiệu chuẩn</li>
                        <li>Tránh lái xe trong nhà</li>
                        <li>Sử dụng anten GPS bên ngoài</li>
                    </ul>`
            }
        ]
    }
};

// --- RENDERÖINTI ---
window.renderHelp = function(lang) {
    const helpView = document.getElementById('help-view');
    if (!helpView) return;
    
    const data = helpData[lang] || helpData.fi;
    
    helpView.innerHTML = `
        <div style="padding:20px; max-width:800px; margin:0 auto;">
            <h2 style="text-align:center; color:var(--accent-color); margin-bottom:30px;">
                ${data.title} - ${data.version} v6.14
            </h2>
            
            ${data.sections.map(section => `
                <div class="help-section" style="margin-bottom:30px; padding:20px; background:var(--panel-bg); border-radius:12px; border:1px solid var(--border-color);">
                    <h3 style="color:var(--accent-color); margin-bottom:15px;">${section.title}</h3>
                    <div style="color:var(--text-color); line-height:1.6;">
                        ${section.content}
                    </div>
                </div>
            `).join('')}
            
            <div style="text-align:center; margin-top:30px; padding:20px; background:rgba(255,255,255,0.05); border-radius:8px;">
                <p style="color:var(--subtext-color); font-size:14px;">
                    <strong>Mikkokalevin Ajopäiväkirja Pro v6.14</strong><br>
                    Animated Speedometer & Live Graphs<br>
                    © 2026 Mikkogeokalevi
                </p>
            </div>
            
            <div style="text-align:center; margin-top:20px;">
                <button onclick="window.showLanguageSelector()" class="action-btn" style="width:auto; padding:10px 20px;">🌐 Vaihda kieli / Change Language</button>
            </div>
        </div>
    `;
};

// --- KIELIVALINTA ---
window.showLanguageSelector = function() {
    const helpView = document.getElementById('help-view');
    if (!helpView) return;
    
    helpView.innerHTML = `
        <div style="padding:20px; text-align:center;">
            <h2 style="color:var(--accent-color); margin-bottom:20px;">Valitse kieli / Choose Language / Chọn ngôn ngữ</h2>
            <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                <button onclick="window.renderHelp('fi')" class="action-btn" style="width:auto; padding:10px 20px;">🇫🇮 Suomi</button>
                <button onclick="window.renderHelp('en')" class="action-btn" style="width:auto; padding:10px 20px;">🇬🇧 English</button>
                <button onclick="window.renderHelp('vi')" class="action-btn" style="width:auto; padding:10px 20px;">🇻🇳 Tiếng Việt</button>
            </div>
        </div>
    `;
};

// --- ALUSTUS ---
document.addEventListener('DOMContentLoaded', function() {
    const helpView = document.getElementById('help-view');
    if (helpView) {
        // Näytä kielivalinta
        window.showLanguageSelector();
    }
});

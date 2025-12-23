// =========================================================
// HELP.JS - MONIKIELINEN KÄYTTÖOPAS (v6.01 BIBLE)
// =========================================================

// Nykyinen kieli (oletus: suomi)
let currentHelpLang = 'fi';

// Ohjetekstit eri kielillä
const helpData = {
    // --- SUOMI ---
    fi: `
        <div class="help-section">
            <h3>🚀 1. Käyttöönotto ja Luvat</h3>
            <p>Tämä sovellus on suunniteltu toimimaan suoraan selaimessa, mutta se vaatii tietyt oikeudet toimiakseen "natiivin" sovelluksen tavoin.</p>
            
            <div class="help-step">
                <strong>⚠️ Vaaditut luvat:</strong>
                <ul>
                    <li>📍 <strong>Sijainti (Location):</strong> "Salli aina" tai "Salli käytettäessä". Ilman tätä nopeus ja matka eivät päivity.</li>
                    <li>📱 <strong>Liikeanturit (Motion):</strong> Safari (iOS) vaatii erillisen luvan kiihtyvyysantureille. Tämä mahdollistaa G-voimamittarin ja Eco-analyysin.</li>
                    <li>🔊 <strong>Automaattinen toisto (Audio):</strong> Sovellus soittaa äänetöntä raitaa taustalla pitääkseen GPS:n hengissä näytön ollessa kiinni. Salli äänen toisto, jos selain kysyy.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>📲 Asennus (PWA):</strong>
                Jotta osoitepalkit eivät vie tilaa ja sovellus pysyy paremmin käynnissä:
                <ul>
                    <li><strong>iPhone (Safari):</strong> Paina Jaa-nappia (neliö ja nuoli ylös) -> "Lisää Koti-valikkoon" (Add to Home Screen).</li>
                    <li><strong>Android (Chrome):</strong> Paina kolmea pistettä -> "Asenna sovellus" tai "Lisää aloitusnäytölle".</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>🏎️ 2. Mittaristo (Dashboard)</h3>
            <p>Näkymä mukautuu automaattisesti puhelimen asennon mukaan.</p>
            
            <div class="help-step">
                <strong>📱 Pystynäkymä (Portrait):</strong>
                Järjestys ylhäältä alas:
                <ol>
                    <li><strong>Nopeus:</strong> Iso numero keskellä.</li>
                    <li><strong>Tilastot:</strong> 6 ruudun ristikko (Huippu, Matka, Aika, Ø Nopeus, Suunta, Korkeus).</li>
                    <li><strong>Osoite:</strong> Katuosoite ja koordinaatit näkyvät <em>tilastoruudukon alapuolella</em>.</li>
                    <li><strong>Aika & Sää:</strong> Alimpana kellonaika, päivämäärä ja sääikoni.</li>
                </ol>
            </div>

            <div class="help-step">
                <strong>🔄 Vaakanäkymä (Landscape):</strong>
                Kun käännät puhelimen sivuttain:
                <ul>
                    <li><strong>Vasen reuna:</strong> Iso nopeuslukema.</li>
                    <li><strong>Oikea reuna:</strong> Tilastoruudukko.</li>
                    <li><strong>Oikea alanurkka:</strong> Osoite ja koordinaatit.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>🎯 G-Voimamittari (Bubble):</strong>
                Oikeassa yläkulmassa (pystynäytöllä) tai alhaalla (vaakanäytöllä) oleva "tähtäin".
                <ul>
                    <li><strong>Keskellä:</strong> Taloudellinen ajo.</li>
                    <li><strong>Reunalla:</strong> Voimakas kiihdytys/jarrutus -> "Aggressiivinen".</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>🚗 3. Autotalli ja Valinnat</h3>
            <p>Sovellus tallentaa ajot aina tietylle ajoneuvolle.</p>
            
            <div class="help-step">
                <strong>Valinta ennen ajoa:</strong>
                Yläpalkin alasvetovalikosta valitaan käytettävä auto.
                <br><span style="color:#ff4444; font-weight:bold;">HUOM:</span> Tallennusta ei voi aloittaa, jos valintana on "Kaikki ajoneuvot". Valitse jokin auto listalta.
            </div>

            <div class="help-step">
                <strong>Ajoneuvotyypit:</strong>
                <ul>
                    <li><strong>🚗 Auto:</strong> Kartta loitontaa maantienopeuksissa. Eco-analyysi on päällä.</li>
                    <li><strong>🚲 Pyörä:</strong> Kartta pysyy aina lähikuvassa. Eco-analyysi on pois päältä.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>🗄️ Arkistointi:</strong>
                Jos myyt auton, voit "Arkistoida" sen Asetukset-sivulta.
                <ul>
                    <li>Arkistoitu auto ei näy tankkaus- tai aloituslistoissa.</li>
                    <li>Saat sen historian näkyviin valitsemalla yläpalkista <em>"Kaikki (sis. arkistoidut)"</em>.</li>
                    <li>Voit palauttaa auton käyttöön painamalla ♻️-nappia.</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>⏱️ 4. Ajon tallennus & Työajo</h3>
            
            <div class="help-step">
                <strong>🔇 Tausta-ajo (Silent Audio Hack):</strong>
                Kun käynnistät GPS:n, sovellus alkaa toistaa "hiljaisuutta" taustalla. Tämä huijaa puhelimen pitämään GPS:n päällä taskussa.
            </div>

            <div class="help-step">
                <strong>💾 Tallennus ja Työajo:</strong>
                Kun lopetat tallennuksen (STOP), avautuu ikkuna, jossa voit:
                <ul>
                    <li>Kirjoittaa ajon aiheen (esim. "Kauppareissu").</li>
                    <li>Valita onko kyseessä <strong>🏠 Oma ajo</strong> vai <strong>💼 Työajo</strong>.</li>
                </ul>
                Tämä valinta vaikuttaa siihen, miltä ajo näyttää listassa ja CSV-raportissa.
            </div>
        </div>

        <div class="help-section">
            <h3>📝 5. Historia & Muokkaus</h3>
            <div class="help-step">
                <strong>✏️ Muokkaus (Extended Edit):</strong>
                Jos unohdit käynnistää sovelluksen ajoissa tai GPS näytti väärin, voit korjata tiedot jälkikäteen.
                <br>Paina kynä-ikonia (✏️) haluamasi ajon kohdalla. Voit muuttaa:
                <ul>
                    <li>Päivämäärän ja kellonajan.</li>
                    <li>Ajetun matkan (km).</li>
                    <li>Ajon tyypin (Oma/Työ).</li>
                    <li>Käytetyn ajoneuvon.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>➕ Manuaalinen lisäys:</strong>
                Unohditko koko sovelluksen? Paina historia-sivulla <strong>"+ Manuaalinen lisäys"</strong>.
                <br>Voit syöttää lähtöpaikan, määränpään ja kilometrit käsin.
            </div>

            <div class="help-step">
                <strong>📥 Raportointi (Excel/CSV):</strong>
                Paina <strong>"Lataa CSV"</strong>. Voit esikatsella tietoja ennen latausta. Raportti noudattaa samoja suodattimia (esim. vuosi, auto) kuin historianäkymä.
            </div>
        </div>

        <div class="help-section">
            <h3>⛽ 6. Tankkaukset</h3>
            <div class="help-step">
                <strong>Lisääminen:</strong>
                Paina mittaristossa <strong>⛽</strong>-nappia. Syötä päivä, litrat ja eurot.
            </div>
            <div class="help-step">
                <strong>Huom:</strong> Tankkausta ei voi lisätä polkupyörälle tai arkistoidulle autolle.
            </div>
        </div>

        <div class="help-section">
            <h3>📊 7. Tilastot</h3>
            <div class="help-step">
                <strong>📅 Aikavälin valinta:</strong>
                <ul>
                    <li><strong>7 pv / 30 pv:</strong> Graafit näyttävät datan <strong>päiväkohtaisesti</strong>.</li>
                    <li><strong>Vuosi / Kaikki:</strong> Graafit näyttävät datan <strong>kuukausitasolla</strong>.</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>❓ Ongelmatilanteet (UKK)</h3>
            
            <div class="help-step">
                <strong>K: GPS-viiva on suora ("teleporttaus")?</strong>
                <br>V: Signaali katkesi tai virransäästö iski. Varmista, että äänet ovat päällä selaimessa (Silent Audio).
            </div>

            <div class="help-step">
                <strong>K: En löydä vanhaa autoani listalta?</strong>
                <br>V: Olet todennäköisesti arkistoinut sen. Valitse yläpalkista "Kaikki (sis. arkistoidut)".
            </div>
            
            <div class="help-step">
                <strong>K: Miten saan tumman teeman pois?</strong>
                <br>V: Paina yläpalkin aurinko/kuu -ikonia (☀/☾).
            </div>
        </div>
    `,

    // --- ENGLISH ---
    en: `
        <div class="help-section">
            <h3>🚀 1. Setup & Permissions</h3>
            <p>This app is designed to run in the browser but requires specific permissions to function like a native app.</p>
            
            <div class="help-step">
                <strong>⚠️ Required Permissions:</strong>
                <ul>
                    <li>📍 <strong>Location:</strong> "Always Allow" or "While Using". Without this, speed and distance won't update.</li>
                    <li>📱 <strong>Motion Sensors:</strong> Safari (iOS) requires permission for accelerometers. This enables the G-Force meter and Eco-analysis.</li>
                    <li>🔊 <strong>Audio Auto-Play:</strong> The app plays a silent track in the background to keep the GPS alive when the screen is off. Allow audio if asked.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>📲 Installation (PWA):</strong>
                To remove address bars and keep the app running better:
                <ul>
                    <li><strong>iPhone (Safari):</strong> Tap Share -> "Add to Home Screen".</li>
                    <li><strong>Android (Chrome):</strong> Tap three dots -> "Install App" or "Add to Home Screen".</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>🏎️ 2. Dashboard</h3>
            <p>The view adapts automatically to your phone's orientation.</p>
            
            <div class="help-step">
                <strong>📱 Portrait Mode:</strong>
                Order from top to bottom:
                <ol>
                    <li><strong>Speed:</strong> Large number in the center.</li>
                    <li><strong>Stats:</strong> 6-grid (Max, Dist, Time, Ø Speed, Heading, Alt).</li>
                    <li><strong>Address:</strong> Street address and coordinates appear <em>below the stats grid</em>.</li>
                    <li><strong>Time & Weather:</strong> Clock, date, and weather icon at the bottom.</li>
                </ol>
            </div>

            <div class="help-step">
                <strong>🔄 Landscape Mode:</strong>
                When you turn your phone sideways:
                <ul>
                    <li><strong>Left Side:</strong> Large speed reading.</li>
                    <li><strong>Right Side:</strong> Stats grid.</li>
                    <li><strong>Bottom Right:</strong> Address and coordinates.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>🎯 G-Force Meter (Bubble):</strong>
                A target/bubble indicator.
                <ul>
                    <li><strong>Center:</strong> Economic driving.</li>
                    <li><strong>Edge:</strong> Hard acceleration/braking -> "Aggressive".</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>🚗 3. Garage & Selection</h3>
            <p>Trips are always saved to a specific vehicle.</p>
            
            <div class="help-step">
                <strong>Select Before Driving:</strong>
                Choose the vehicle from the dropdown in the top bar.
                <br><span style="color:#ff4444; font-weight:bold;">NOTE:</span> You cannot start recording if "All Vehicles" is selected. Pick a specific car.
            </div>

            <div class="help-step">
                <strong>Vehicle Types:</strong>
                <ul>
                    <li><strong>🚗 Car:</strong> Map zooms out at highway speeds. Eco-analysis is active.</li>
                    <li><strong>🚲 Bike:</strong> Map stays zoomed in. Eco-analysis is disabled.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>🗄️ Archiving:</strong>
                If you sell a car, you can "Archive" it from Settings.
                <ul>
                    <li>Archived cars don't appear in fueling or start lists.</li>
                    <li>You can view their history by selecting <em>"All (inc. archived)"</em> from the top bar.</li>
                    <li>You can restore a car by tapping the ♻️ button.</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>⏱️ 4. Recording Drives</h3>
            
            <div class="help-step">
                <strong>🔇 Silent Audio Hack:</strong>
                When GPS starts, the app plays "silence" in the background. This tricks the phone into keeping the GPS active in your pocket.
            </div>

            <div class="help-step">
                <strong>💾 Saving & Work Trips:</strong>
                When you stop recording, a modal opens where you can:
                <ul>
                    <li>Enter a subject (e.g., "Grocery run").</li>
                    <li>Select type: <strong>🏠 Private</strong> or <strong>💼 Work</strong>.</li>
                </ul>
                This selection affects how the trip appears in lists and CSV reports.
            </div>
        </div>

        <div class="help-section">
            <h3>📝 5. History & Editing</h3>
            <div class="help-step">
                <strong>✏️ Editing:</strong>
                Forgot to start the app or GPS glitch? You can correct data later.
                <br>Tap the pen icon (✏️) on a trip log. You can change:
                <ul>
                    <li>Date and Time.</li>
                    <li>Distance (km).</li>
                    <li>Trip Type (Private/Work).</li>
                    <li>Vehicle used.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>➕ Manual Entry:</strong>
                Forgot the app entirely? Tap <strong>"+ Manual Entry"</strong> on the history page.
                <br>You can enter start/end addresses and kilometers manually.
            </div>

            <div class="help-step">
                <strong>📥 Reporting (Excel/CSV):</strong>
                Tap <strong>"Download CSV"</strong>. You can preview data before downloading. The report respects the current filters (e.g., Year, Vehicle).
            </div>
        </div>

        <div class="help-section">
            <h3>⛽ 6. Refueling</h3>
            <div class="help-step">
                <strong>Adding:</strong>
                Tap the <strong>⛽</strong> button on the dashboard. Enter date, liters, and euros.
            </div>
            <div class="help-step">
                <strong>Note:</strong> You cannot add fuel to a bicycle or an archived car.
            </div>
        </div>

        <div class="help-section">
            <h3>📊 7. Statistics</h3>
            <div class="help-step">
                <strong>📅 Time Range:</strong>
                <ul>
                    <li><strong>7d / 30d:</strong> Graphs show data <strong>per day</strong>.</li>
                    <li><strong>Year / All:</strong> Graphs show data <strong>per month</strong>.</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>❓ FAQ / Troubleshooting</h3>
            
            <div class="help-step">
                <strong>Q: GPS line is straight ("teleporting")?</strong>
                <br>A: Signal lost or battery saver killed the app. Ensure audio permissions are enabled (Silent Audio).
            </div>

            <div class="help-step">
                <strong>Q: I can't find my old car?</strong>
                <br>A: You probably archived it. Select "All (inc. archived)" from the top bar.
            </div>
            
            <div class="help-step">
                <strong>Q: How do I disable Dark Mode?</strong>
                <br>A: Tap the sun/moon icon (☀/☾) in the top bar.
            </div>
        </div>
    `,

    // --- VIETNAMESE ---
    vi: `
        <div class="help-section">
            <h3>🚀 1. Cài đặt & Quyền truy cập</h3>
            <p>Ứng dụng này chạy trên trình duyệt nhưng cần một số quyền để hoạt động như ứng dụng gốc.</p>
            
            <div class="help-step">
                <strong>⚠️ Quyền bắt buộc:</strong>
                <ul>
                    <li>📍 <strong>Vị trí (Location):</strong> "Luôn cho phép" hoặc "Khi dùng ứng dụng". Nếu không, tốc độ và quãng đường sẽ không cập nhật.</li>
                    <li>📱 <strong>Cảm biến chuyển động (Motion):</strong> Safari (iOS) yêu cầu quyền này cho đồng hồ G-Force và phân tích Eco.</li>
                    <li>🔊 <strong>Âm thanh nền (Audio):</strong> Ứng dụng phát âm thanh im lặng để giữ GPS hoạt động khi tắt màn hình. Hãy cho phép nếu được hỏi.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>📲 Cài đặt (PWA):</strong>
                Để ẩn thanh địa chỉ và chạy mượt mà hơn:
                <ul>
                    <li><strong>iPhone (Safari):</strong> Nhấn Chia sẻ -> "Thêm vào Màn hình chính" (Add to Home Screen).</li>
                    <li><strong>Android (Chrome):</strong> Nhấn menu ba chấm -> "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>🏎️ 2. Bảng điều khiển (Dashboard)</h3>
            <p>Giao diện tự động xoay theo điện thoại.</p>
            
            <div class="help-step">
                <strong>📱 Chế độ Dọc:</strong>
                Thứ tự từ trên xuống:
                <ol>
                    <li><strong>Tốc độ:</strong> Số lớn ở giữa.</li>
                    <li><strong>Thống kê:</strong> Lưới 6 ô (Max, Quãng đường, Thời gian, Ø Tốc độ, Hướng, Độ cao).</li>
                    <li><strong>Địa chỉ:</strong> Địa chỉ và tọa độ nằm <em>dưới lưới thống kê</em>.</li>
                    <li><strong>Thời gian & Thời tiết:</strong> Đồng hồ, ngày và biểu tượng thời tiết ở dưới cùng.</li>
                </ol>
            </div>

            <div class="help-step">
                <strong>🔄 Chế độ Ngang:</strong>
                Khi xoay ngang điện thoại:
                <ul>
                    <li><strong>Bên trái:</strong> Số đo tốc độ lớn.</li>
                    <li><strong>Bên phải:</strong> Lưới thống kê.</li>
                    <li><strong>Góc phải dưới:</strong> Địa chỉ và tọa độ.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>🎯 Đồng hồ G-Force (Bong bóng):</strong>
                Biểu tượng tâm ngắm.
                <ul>
                    <li><strong>Ở giữa:</strong> Lái xe tiết kiệm (Eco).</li>
                    <li><strong>Ở mép:</strong> Tăng tốc/phanh gấp -> "Aggressive".</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>🚗 3. Gara & Chọn xe</h3>
            <p>Mỗi chuyến đi luôn được lưu cho một xe cụ thể.</p>
            
            <div class="help-step">
                <strong>Chọn trước khi lái:</strong>
                Chọn xe từ menu thả xuống ở thanh trên cùng.
                <br><span style="color:#ff4444; font-weight:bold;">LƯU Ý:</span> Bạn không thể bắt đầu ghi nếu đang chọn "Tất cả xe". Hãy chọn một chiếc xe cụ thể.
            </div>

            <div class="help-step">
                <strong>Loại phương tiện:</strong>
                <ul>
                    <li><strong>🚗 Ô tô:</strong> Bản đồ thu nhỏ khi chạy nhanh. Phân tích Eco bật.</li>
                    <li><strong>🚲 Xe đạp:</strong> Bản đồ luôn phóng to. Phân tích Eco tắt.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>🗄️ Lưu trữ (Archive):</strong>
                Nếu bán xe, bạn có thể "Lưu trữ" nó trong Cài đặt.
                <ul>
                    <li>Xe đã lưu trữ sẽ ẩn khỏi danh sách đổ xăng và bắt đầu.</li>
                    <li>Để xem lại, chọn <em>"Tất cả (gồm đã lưu)"</em> từ thanh trên cùng.</li>
                    <li>Có thể khôi phục xe bằng nút ♻️.</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>⏱️ 4. Ghi lại hành trình</h3>
            
            <div class="help-step">
                <strong>🔇 Silent Audio Hack:</strong>
                Khi GPS bật, ứng dụng phát âm thanh tĩnh. Điều này đánh lừa điện thoại để giữ GPS hoạt động khi bỏ túi.
            </div>

            <div class="help-step">
                <strong>💾 Lưu & Công tác:</strong>
                Khi bấm DỪNG (STOP), cửa sổ lưu hiện ra:
                <ul>
                    <li>Nhập chủ đề (vd: "Đi siêu thị").</li>
                    <li>Chọn loại: <strong>🏠 Cá nhân</strong> hoặc <strong>💼 Công việc</strong>.</li>
                </ul>
                Lựa chọn này ảnh hưởng đến báo cáo CSV.
            </div>
        </div>

        <div class="help-section">
            <h3>📝 5. Lịch sử & Chỉnh sửa</h3>
            <div class="help-step">
                <strong>✏️ Chỉnh sửa:</strong>
                Quên bật app hoặc GPS sai? Bạn có thể sửa dữ liệu sau.
                <br>Nhấn biểu tượng bút (✏️) trên chuyến đi. Bạn có thể sửa:
                <ul>
                    <li>Ngày và Giờ.</li>
                    <li>Quãng đường (km).</li>
                    <li>Loại chuyến đi (Cá nhân/Công việc).</li>
                    <li>Xe đã sử dụng.</li>
                </ul>
            </div>

            <div class="help-step">
                <strong>➕ Thêm thủ công:</strong>
                Quên mang điện thoại? Nhấn <strong>"+ Thêm thủ công"</strong> (Manual Entry) trên trang lịch sử.
                <br>Nhập địa chỉ và số km bằng tay.
            </div>

            <div class="help-step">
                <strong>📥 Báo cáo (Excel/CSV):</strong>
                Nhấn <strong>"Tải CSV"</strong>. Bạn có thể xem trước dữ liệu. Báo cáo tuân theo bộ lọc hiện tại (vd: Năm, Xe).
            </div>
        </div>

        <div class="help-section">
            <h3>⛽ 6. Đổ xăng</h3>
            <div class="help-step">
                <strong>Thêm mới:</strong>
                Nhấn nút <strong>⛽</strong> trên bảng điều khiển. Nhập ngày, số lít và số tiền.
            </div>
            <div class="help-step">
                <strong>Lưu ý:</strong> Không thể thêm xăng cho xe đạp hoặc xe đã lưu trữ.
            </div>
        </div>

        <div class="help-section">
            <h3>📊 7. Thống kê</h3>
            <div class="help-step">
                <strong>📅 Khoảng thời gian:</strong>
                <ul>
                    <li><strong>7 ngày / 30 ngày:</strong> Biểu đồ theo <strong>ngày</strong>.</li>
                    <li><strong>Năm / Tất cả:</strong> Biểu đồ theo <strong>tháng</strong>.</li>
                </ul>
            </div>
        </div>

        <div class="help-section">
            <h3>❓ Câu hỏi thường gặp (FAQ)</h3>
            
            <div class="help-step">
                <strong>H: Đường GPS bị thẳng đuột ("dịch chuyển tức thời")?</strong>
                <br>Đ: Mất tín hiệu hoặc chế độ tiết kiệm pin đã tắt app. Hãy chắc chắn đã cho phép phát âm thanh (Silent Audio).
            </div>

            <div class="help-step">
                <strong>H: Tôi không thấy xe cũ của mình?</strong>
                <br>Đ: Có thể bạn đã lưu trữ nó. Chọn "Tất cả (gồm đã lưu)" ở thanh trên cùng.
            </div>
            
            <div class="help-step">
                <strong>H: Tắt chế độ Tối (Dark Mode) thế nào?</strong>
                <br>Đ: Nhấn biểu tượng mặt trời/trăng (☀/☾) ở góc trên.
            </div>
        </div>
    `
};

// --- PÄIVITYSFUNKTIO ---
function updateHelpView() {
    const helpContainer = document.getElementById('help-view');
    if (!helpContainer) return;

    const versionText = typeof APP_VERSION !== 'undefined' ? APP_VERSION : '6.01';

    // 1. Luodaan otsikko ja kielivalikko
    const headerHTML = `
        <div style="text-align:center; margin-bottom: 20px;">
            <img src="ajopaivakirja_logo.png" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
            <h2 style="color:var(--accent-color); text-transform: uppercase; letter-spacing: 1px; margin:0;">
                ${currentHelpLang === 'en' ? 'User Manual' : (currentHelpLang === 'vi' ? 'Hướng dẫn sử dụng' : 'Käyttöopas')}
            </h2>
            <p style="opacity:0.7; font-size:12px;">Mikkokalevin Ajopäiväkirja Pro v${versionText}</p>
            
            <div style="margin-top:15px;">
                <label style="font-size:12px; color:var(--subtext-color); margin-right:5px;">Language / Kieli:</label>
                <select id="help-lang-select" class="subject-input" style="width:auto; display:inline-block; padding:5px 10px; text-align:center;">
                    <option value="fi" ${currentHelpLang === 'fi' ? 'selected' : ''}>🇫🇮 Suomi</option>
                    <option value="en" ${currentHelpLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                    <option value="vi" ${currentHelpLang === 'vi' ? 'selected' : ''}>🇻🇳 Tiếng Việt</option>
                </select>
            </div>
        </div>
    `;

    // 2. Haetaan sisältö valitulla kielellä
    const contentHTML = helpData[currentHelpLang] || helpData['fi'];

    // 3. Alatunniste
    const footerHTML = `
        <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
            Mikkokalevin Ajopäiväkirja Pro v${versionText}<br>
            Kehitetty intohimolla ajamista varten.
        </div>
    `;

    // 4. Renderöidään kaikki
    helpContainer.innerHTML = headerHTML + contentHTML + footerHTML;

    // 5. Lisätään kuuntelija valikolle (koska innerHTML ylikirjoitti edellisen)
    const select = document.getElementById('help-lang-select');
    if (select) {
        select.addEventListener('change', (e) => {
            currentHelpLang = e.target.value;
            updateHelpView(); // Päivitä näkymä uudella kielellä
        });
    }
}

// Alustetaan näkymä kun sivu latautuu
document.addEventListener('DOMContentLoaded', () => {
    updateHelpView();
});

// Varmistetaan päivitys myös kun navigoidaan sivulle (jos SPA-logiikka ei lataa uudestaan)
if (typeof navBtns !== 'undefined' && navBtns.help) {
    navBtns.help.addEventListener('click', updateHelpView);
}

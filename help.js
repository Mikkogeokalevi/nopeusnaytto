// =========================================================
// HELP.JS - TRILINGUAL MASTER GUIDE (v6.01 FULL)
// =========================================================

// --- KÄÄNNÖKSET / TRANSLATIONS / BẢN DỊCH ---
const helpData = {
    fi: {
        title: "Käyttöopas",
        version: "Versio",
        sections: [
            {
                title: "🚀 1. Käyttöönotto ja Luvat",
                content: `
                    <p>Tämä sovellus on PWA (Progressive Web App). Jotta se toimii vakaasti taustalla ja osoitepalkit eivät vie tilaa, seuraa näitä ohjeita.</p>
                    
                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>Uutta versiossa 6.01:</strong>
                        <ul>
                            <li><strong>👁️ Yksinkertaistettu tila:</strong> Paina mittariston silmä-ikonia piilottaaksesi kaiken paitsi nopeuden.</li>
                            <li><strong>🎨 Ulkoasu:</strong> Vaihda teemaväri ja ota käyttöön alapalkki Asetuksista.</li>
                            <li><strong>🚶 Kävely-tila:</strong> Valitse autotallista "Kävely". Ei G-voimamittaria, tarkempi kartta.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>📲 Asennus (Tärkeä!):</strong>
                        <ul>
                            <li><strong>🍎 iPhone (Safari):</strong> Paina alareunan <strong>Jaa-painiketta</strong> (Neliö, josta nuoli ylös <span style="font-size:16px">share</span>). Selaa valikkoa ja valitse <strong>"Lisää Koti-valikkoon"</strong> (Add to Home Screen).</li>
                            <li><strong>🤖 Android (Chrome):</strong> Paina yläkulman kolmea pistettä (⋮) ja valitse <strong>"Asenna sovellus"</strong> tai <strong>"Lisää aloitusnäytölle"</strong>.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>⚠️ Vaaditut luvat:</strong>
                        <ul>
                            <li>📍 <strong>Sijainti (Location):</strong> Valitse "Salli aina" tai "Salli käytettäessä". Ilman tätä nopeusmittari ei toimi.</li>
                            <li>📱 <strong>Liikeanturit (Motion):</strong> (Vain iOS) Safari vaatii erillisen luvan kiihtyvyysantureille. Tämä mahdollistaa G-voimamittarin ja Eco-analyysin.</li>
                            <li>🔊 <strong>Automaattinen toisto (Audio):</strong> Sovellus soittaa äänetöntä raitaa taustalla pitääkseen GPS:n hengissä puhelimen ollessa taskussa. Salli äänen toisto, jos selain kysyy.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🏎️ 2. Mittaristo (Dashboard)",
                content: `
                    <p>Näkymä mukautuu automaattisesti puhelimen asennon mukaan.</p>
                    
                    <div class="help-step">
                        <strong>📱 Pystynäkymä (Portrait):</strong>
                        <ol>
                            <li><strong>Nopeus:</strong> Iso numero keskellä.</li>
                            <li><strong>Tilastot:</strong> 6 ruudun ristikko (Huippu, Matka, Aika, Ø Nopeus, Suunta, Korkeus).</li>
                            <li><strong>Osoite:</strong> Katuosoite ja koordinaatit näkyvät tilastojen alla.</li>
                            <li><strong>Aika & Sää:</strong> Alimpana kellonaika, päivämäärä ja sääikoni.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🔄 Vaakanäkymä (Landscape):</strong>
                        Käännä puhelimen sivuttain saadaksesi laajan näkymän:
                        <ul>
                            <li><strong>Vasen reuna:</strong> Jättimäinen nopeuslukema.</li>
                            <li><strong>Oikea reuna:</strong> Tilastoruudukko.</li>
                            <li><strong>Alareuna:</strong> Osoite ja koordinaatit siirtyvät sivuun.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>👁️ Yksinkertaistettu tila (Minimalist Mode):</strong>
                        Paina vasemman yläkulman silmä-ikonia. Tämä piilottaa kaiken paitsi nopeusmittarin. Hyödyllinen yöajossa tai jos haluat keskittyä ajamiseen.
                    </div>

                    <div class="help-step">
                        <strong>🎯 G-Voimamittari (Bubble):</strong>
                        Pieni "tähtäin" ruudulla.
                        <ul>
                            <li><strong>Keskellä:</strong> Taloudellinen ajo (Eco).</li>
                            <li><strong>Reunalla (Punainen):</strong> Voimakas kiihdytys/jarrutus -> "Aggressiivinen" ajotapa.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🚗 3. Autotalli ja Asetukset",
                content: `
                    <p>Sovellus tallentaa ajot aina tietylle ajoneuvolle.</p>
                    
                    <div class="help-step">
                        <strong>Valinta ennen ajoa:</strong>
                        Yläpalkin valikosta valitaan käytettävä auto.
                        <br><span style="color:#ff4444; font-weight:bold;">HUOM:</span> Tallennusta ei voi aloittaa "Kaikki ajoneuvot" -tilassa. Valitse tietty auto.
                    </div>

                    <div class="help-step">
                        <strong>Ajoneuvotyypit:</strong>
                        <ul>
                            <li><strong>🚗 Auto:</strong> Kartta loitontaa maantienopeuksissa. Eco-analyysi on päällä.</li>
                            <li><strong>🏍️ Moottoripyörä:</strong> Kuin auto, mutta omalla ikonilla. Eco-analyysi päällä.</li>
                            <li><strong>🚲 Pyörä:</strong> Kartta pysyy aina lähikuvassa. Eco-analyysi on pois päältä.</li>
                            <li><strong>🚶 Kävely (Uusi):</strong> Kartta pysyy lähellä, G-voimamittari pois päältä, ei tankkauksia.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎨 Ulkoasuasetukset:</strong>
                        Asetukset-sivulta voit nyt:
                        <ul>
                            <li>Valita korostusvärin (Sininen, Oranssi, Vihreä...).</li>
                            <li>Kytkeä päälle "Tiivistetyn historian" nähdäksesi enemmän rivejä kerralla.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🗄️ Arkistointi:</strong>
                        Jos myyt auton, voit "Arkistoida" sen Asetukset-sivulta (🗄️-nappi).
                        <ul>
                            <li>Arkistoitu auto ei näy listassa oletuksena.</li>
                            <li>Saat historian näkyviin valitsemalla yläpalkista <em>"Kaikki (sis. arkistoidut)"</em>.</li>
                            <li>Palautus onnistuu painamalla ♻️-nappia.</li>
                        </ul>
                    </div>`
            },
            {
                title: "⏱️ 4. Ajon tallennus & Työajo",
                content: `
                    <div class="help-step">
                        <strong>🔇 Tausta-ajo (Silent Audio Hack):</strong>
                        Kun käynnistät GPS:n, sovellus alkaa toistaa "hiljaisuutta". Tämä huijaa puhelimen pitämään GPS:n päällä taskussa. Älä sulje selainta, vaan jätä se taustalle.
                    </div>

                    <div class="help-step">
                        <strong>💾 Tallennus ja Työajo:</strong>
                        Kun lopetat tallennuksen (STOP), avautuu ikkuna:
                        <ul>
                            <li><strong>Aihe:</strong> Kirjoita lyhyt kuvaus (esim. "Asiakaskäynti").</li>
                            <li><strong>Tyyppi:</strong> Valitse <strong>🏠 Oma ajo</strong> tai <strong>💼 Työajo</strong>.</li>
                        </ul>
                        Tämä valinta erottelee ajot raporteissa (verotusta/laskutusta varten).
                    </div>`
            },
            {
                title: "📝 5. Historia & Raportit",
                content: `
                    <div class="help-step">
                        <strong>✏️ Muokkaus (Extended Edit):</strong>
                        Unohditko käynnistää ajoissa? Paina kynä-ikonia (✏️) listassa.
                        Voit muuttaa jälkikäteen: Päivämäärän, Matkan (km), Tyypin ja Auton.
                    </div>

                    <div class="help-step">
                        <strong>➕ Manuaalinen lisäys:</strong>
                        Unohditko koko sovelluksen? Paina historia-sivulla <strong>"+ Manuaalinen lisäys"</strong> lisätäksesi ajon käsin.
                    </div>

                    <div class="help-step">
                        <strong>📥 Raportointi (Excel/CSV):</strong>
                        Paina <strong>"Lataa CSV"</strong>. Saat tiedoston, jonka voi avata Excelissä. Se sisältää sarakkeet: Pvm, Kello, Auto, Tyyppi (Työ/Oma), Matka, Kesto, Reitti ja Selite.
                    </div>`
            },
            {
                title: "⛽ 6. Tankkaukset",
                content: `
                    <p>Paina mittaristossa <strong>⛽</strong>-nappia lisätäksesi tankkauksen.</p>
                    <p><strong>Huom:</strong> Tankkausta ei voi lisätä polkupyörälle, kävelylle tai arkistoidulle autolle. Syötä litrat ja eurot saadaksesi litrahinnan.</p>`
            },
            {
                title: "🆘 7. Crash Recovery (Palautus)",
                content: `
                    <div class="help-step">
                        <strong>Jos sovellus kaatuu tai sammuu:</strong>
                        <br>Esimerkiksi puhelun aikana puhelin voi sammuttaa selaimen taustalta. Kun avaat sovelluksen uudelleen:
                        <ul>
                            <li>Sovellus kysyy: <em>"Ajo keskeytyi! Haluatko palauttaa tilanteen?"</em></li>
                            <li>Vastaa <strong>Kyllä</strong>.</li>
                            <li>Matka, reitti ja kello palautuvat siihen hetkeen mihin ne jäivät.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🕶️ 8. HUD-tila (Yönäkö)",
                content: `
                    <p>Uusi ominaisuus pimeäajoon! HUD (Head-Up Display) kääntää näytön peilikuvaksi ja lisää kontrastia, jolloin se heijastuu tuulilasiin oikein päin.</p>
                    
                    <div class="help-step">
                        <strong>Käyttö:</strong>
                        <ol>
                            <li>Paina yläpalkin <strong>HUD</strong>-nappia.</li>
                            <li>Aseta puhelin kojelaudalle näyttö ylöspäin (säädä kirkkaus täysille).</li>
                            <li>Näet nopeusmittarin heijastuksena tuulilasissa.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>Poistuminen:</strong>
                        Napauta mihin tahansa kohtaan ruutua palataksesi normaaliin tilaan.
                    </div>`
            },
            {
                title: "📡 9. Offline-tila (Ulkomaat)",
                content: `
                    <p>Voit käyttää sovellusta ilman nettiyhteyttä (esim. roaming estetty).</p>
                    
                    <div class="help-step" style="border-left: 4px solid #ffd600; padding-left: 10px;">
                        <strong>⚠️ Tärkeä ensiasennus:</strong>
                        Jotta Offline-tila toimii varmasti, tee näin <strong>ennen matkaa</strong>:
                        <ol>
                            <li>Avaa sovellus puhelimella verkkoyhteyden ollessa päällä.</li>
                            <li><strong>Päivitä sivu</strong> kerran tai kaksi (vedä alas tai paina refresh).</li>
                            <li>Tämä pakottaa sovelluksen tallentamaan uusimman version muistiin.</li>
                            <li>Kokeile laittaa lentokonetila päälle ja avaa sovellus testiksi.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🗺️ Tärkeää kartoista:</strong>
                        <br>Sovellus <strong>EI lataa</strong> koko maan karttoja offline-tilaan (kuten Google Maps).
                        <ul>
                            <li>Jos ajat alueella, jota et ole aiemmin selannut, kartta näkyy <strong>harmaana ruudukkona</strong>.</li>
                            <li><strong>Älä huoli!</strong> Reitti ja kilometrit tallentuvat silti oikein tyhjälle pohjalle.</li>
                            <li>Kun pääset taas nettiin, reitti piirtyy oikean kartan päälle.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>Tallennus ilman nettiä:</strong>
                        Kun tallennat ajon ilman verkkoa, se menee puhelimen välimuistiin.
                        <ul>
                            <li>Ajokortti historiassa saa keltaisen reunan: <em>"⚠️ Odottaa lähetystä"</em>.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>Synkronointi (Sync):</strong>
                        Kun pääset verkkoon (esim. WiFi):
                        <ol>
                            <li>Avaa <strong>Historia</strong>-välilehti.</li>
                            <li>Paina ylhäältä keltaista nappia: <strong>"📡 Lähetä odottavat ajot"</strong>.</li>
                            <li>Ajot siirtyvät pilveen ja muuttuvat pysyviksi.</li>
                        </ol>
                        <br><em>Huom: Offline-ajoja ei voi muokata ennen synkronointia.</em>
                    </div>`
            },
            {
                title: "❓ 10. Ongelmatilanteet (UKK)",
                content: `
                    <div class="help-step">
                        <strong>K: GPS-viiva on suora ("teleporttaus")?</strong>
                        <br>V: Signaali katkesi tai virransäästö iski. Varmista, että "hiljainen ääni" saa soida taustalla.
                    </div>
                    <div class="help-step">
                        <strong>K: En löydä vanhaa autoani listalta?</strong>
                        <br>V: Se on arkistoitu. Valitse yläpalkista "Kaikki (sis. arkistoidut)".
                    </div>
                    <div class="help-step">
                        <strong>K: Miten saan tumman teeman pois?</strong>
                        <br>V: Paina yläpalkin aurinko/kuu -ikonia (☀/☾).
                    </div>`
            }
        ]
    },
    en: {
        title: "User Guide",
        version: "Version",
        sections: [
            {
                title: "🚀 1. Setup and Permissions",
                content: `
                    <p>This is a PWA (Progressive Web App). To make it work reliably in the background and remove address bars, please follow these steps.</p>
                    
                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>New in v6.01:</strong>
                        <ul>
                            <li><strong>👁️ Minimalist Mode:</strong> Tap the eye icon on the dashboard to hide distractions.</li>
                            <li><strong>🎨 Appearance:</strong> Change accent color and toggle Compact History in Settings.</li>
                            <li><strong>🚶 Walking Mode:</strong> Track your walks! No G-force alerts.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>📲 Installation (Important!):</strong>
                        <ul>
                            <li><strong>🍎 iPhone (Safari):</strong> Tap the <strong>Share button</strong> at the bottom (Square with arrow up <span style="font-size:16px">share</span>). Scroll and select <strong>"Add to Home Screen"</strong>.</li>
                            <li><strong>🤖 Android (Chrome):</strong> Tap the three dots (⋮) in the top corner and select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>⚠️ Required Permissions:</strong>
                        <ul>
                            <li>📍 <strong>Location:</strong> Select "Allow Always" or "Allow While Using". Speedometer will not work without this.</li>
                            <li>📱 <strong>Motion Sensors:</strong> (iOS only) Safari requires permission for accelerometers. This enables the G-force meter and Eco-analysis.</li>
                            <li>🔊 <strong>Auto-play (Audio):</strong> The app plays a silent track in the background to keep the GPS alive when phone is in your pocket. Allow audio if asked.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🏎️ 2. Dashboard",
                content: `
                    <p>The view adapts automatically based on phone orientation.</p>
                    
                    <div class="help-step">
                        <strong>📱 Portrait View:</strong>
                        <ol>
                            <li><strong>Speed:</strong> Big number in the center.</li>
                            <li><strong>Stats:</strong> 6-grid (Max, Dist, Time, Ø Speed, Heading, Altitude).</li>
                            <li><strong>Address:</strong> Street address and coordinates below the stats.</li>
                            <li><strong>Time & Weather:</strong> Clock, date, and weather icon at the bottom.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🔄 Landscape View:</strong>
                        Turn phone sideways for a wide view:
                        <ul>
                            <li><strong>Left:</strong> Huge speed reading.</li>
                            <li><strong>Right:</strong> Stats grid.</li>
                            <li><strong>Bottom:</strong> Address and coordinates move to the side.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>👁️ Minimalist Mode:</strong>
                        Tap the eye icon in the top left. This hides everything except the speedometer. Useful for night driving or focus.
                    </div>

                    <div class="help-step">
                        <strong>🎯 G-Force Meter (Bubble):</strong>
                        Small "crosshair" on screen.
                        <ul>
                            <li><strong>Center:</strong> Economic driving (Eco).</li>
                            <li><strong>Edge (Red):</strong> Hard acceleration/braking -> "Aggressive" style.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🚗 3. Garage & Selection",
                content: `
                    <p>Drives are always recorded for a specific vehicle.</p>
                    
                    <div class="help-step">
                        <strong>Selection before driving:</strong>
                        Select the vehicle from the top bar dropdown.
                        <br><span style="color:#ff4444; font-weight:bold;">NOTE:</span> You cannot start recording in "All Vehicles" mode. Select a specific car.
                    </div>

                    <div class="help-step">
                        <strong>Vehicle Types:</strong>
                        <ul>
                            <li><strong>🚗 Car:</strong> Map zooms out at highway speeds. Eco-analysis is ON.</li>
                            <li><strong>🏍️ Motorcycle:</strong> Like a car, but with a specific icon. Eco-analysis ON.</li>
                            <li><strong>🚲 Bike:</strong> Map stays zoomed in. Eco-analysis is OFF.</li>
                            <li><strong>🚶 Walking:</strong> NEW! Map stays close, no G-force meter, no fuel.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎨 Appearance Settings:</strong>
                        From Settings page you can now:
                        <ul>
                            <li>Change the Accent Color.</li>
                            <li>Enable "Compact History" to see more rows at once.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🗄️ Archiving:</strong>
                        If you sell a car, you can "Archive" it in Settings (🗄️ button).
                        <ul>
                            <li>Archived cars are hidden from the list by default.</li>
                            <li>To see history, select <em>"All (inc. archived)"</em> from the top bar.</li>
                            <li>Restore by pressing the ♻️ button.</li>
                        </ul>
                    </div>`
            },
            {
                title: "⏱️ 4. Recording & Work Trips",
                content: `
                    <div class="help-step">
                        <strong>🔇 Background Drive (Silent Audio Hack):</strong>
                        When you start GPS, the app plays "silence". This tricks the phone to keep GPS active in your pocket. Do not close the browser tab.
                    </div>

                    <div class="help-step">
                        <strong>💾 Saving and Work Trips:</strong>
                        When you stop recording (STOP), a window opens:
                        <ul>
                            <li><strong>Subject:</strong> Write a short desc (e.g., "Client meeting").</li>
                            <li><strong>Type:</strong> Choose <strong>🏠 Private</strong> or <strong>💼 Work</strong>.</li>
                        </ul>
                        This selection separates drives in reports (for tax/billing).
                    </div>`
            },
            {
                title: "📝 5. History & Reports",
                content: `
                    <div class="help-step">
                        <strong>✏️ Editing (Extended Edit):</strong>
                        Forgot to start? Tap the pencil icon (✏️) in the list.
                        You can later change: Date, Distance (km), Type, and Car.
                    </div>

                    <div class="help-step">
                        <strong>➕ Manual Entry:</strong>
                        Forgot the app entirely? Tap <strong>"+ Manual Entry"</strong> on the history page to add a drive by hand.
                    </div>

                    <div class="help-step">
                        <strong>📥 Reporting (Excel/CSV):</strong>
                        Tap <strong>"Download CSV"</strong>. You get a file compatible with Excel. Columns: Date, Time, Car, Type (Work/Private), Dist, Duration, Route, Subject.
                    </div>`
            },
            {
                title: "⛽ 6. Refueling",
                content: `
                    <p>Tap the <strong>⛽</strong> button on the dashboard to add a refueling.</p>
                    <p><strong>Note:</strong> Cannot add fuel for bikes, walking or archived cars. Enter liters and euros to get price/liter.</p>`
            },
            {
                title: "🆘 7. Crash Recovery",
                content: `
                    <div class="help-step">
                        <strong>If the app stops unexpectedly:</strong>
                        <br>For example, if a phone call kills the browser process. When you reopen the app:
                        <ul>
                            <li>It will ask: <em>"Drive interrupted! Restore?"</em></li>
                            <li>Tap <strong>Yes</strong>.</li>
                            <li>Distance, route, and timers will be restored to where they left off.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🕶️ 8. HUD Mode (Night Vision)",
                content: `
                    <p>New feature for night driving! HUD (Head-Up Display) mirrors the screen and boosts contrast, reflecting it correctly on the windshield.</p>
                    
                    <div class="help-step">
                        <strong>How to use:</strong>
                        <ol>
                            <li>Tap the <strong>HUD</strong> button in the top bar.</li>
                            <li>Place phone on the dashboard, screen facing up (set brightness to max).</li>
                            <li>The speedometer will reflect on the windshield.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>Exit:</strong>
                        Tap anywhere on the screen to return to normal mode.
                    </div>`
            },
            {
                title: "📡 9. Offline Mode (Roaming)",
                content: `
                    <p>You can use the app without an internet connection.</p>
                    
                    <div class="help-step" style="border-left: 4px solid #ffd600; padding-left: 10px;">
                        <strong>⚠️ Important Setup:</strong>
                        To ensure Offline mode works, do this <strong>before your trip</strong>:
                        <ol>
                            <li>Open the app while you have internet.</li>
                            <li><strong>Refresh the page</strong> once or twice.</li>
                            <li>This forces the app to save the latest version to memory.</li>
                            <li>Test it by switching to Airplane mode.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🗺️ Note on Maps:</strong>
                        <br>The app <strong>does NOT download</strong> full country maps for offline use.
                        <ul>
                            <li>If you drive in a new area without internet, the map will show a <strong>gray grid</strong>.</li>
                            <li><strong>Don't worry!</strong> The route and distance are still recorded correctly on a blank background.</li>
                            <li>When you get back online, the route will appear on the map.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>Saving offline:</strong>
                        Drives are saved to phone memory first.
                        <ul>
                            <li>In History, the drive card gets a yellow border: <em>"⚠️ Pending Sync"</em>.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>Syncing:</strong>
                        When you are online (e.g., WiFi):
                        <ol>
                            <li>Go to <strong>History</strong>.</li>
                            <li>Tap the yellow button: <strong>"📡 Sync pending drives"</strong>.</li>
                            <li>Drives are uploaded to the cloud.</li>
                        </ol>
                        <br><em>Note: Offline drives cannot be edited before syncing.</em>
                    </div>`
            },
            {
                title: "❓ 10. FAQ & Troubleshooting",
                content: `
                    <div class="help-step">
                        <strong>Q: Straight line on map ("teleporting")?</strong>
                        <br>A: Signal lost or battery saver killed the app. Ensure "silent audio" is allowed to play.
                    </div>
                    <div class="help-step">
                        <strong>Q: Can't find my old car?</strong>
                        <br>A: It's archived. Select "All (inc. archived)" from top bar.
                    </div>
                    <div class="help-step">
                        <strong>Q: How to disable dark mode?</strong>
                        <br>A: Tap the sun/moon icon (☀/☾) in the top bar.
                    </div>`
            }
        ]
    },
    vi: {
        title: "Hướng Dẫn Sử Dụng",
        version: "Phiên bản",
        sections: [
            {
                title: "🚀 1. Cài đặt và Quyền truy cập",
                content: `
                    <p>Đây là ứng dụng PWA. Để hoạt động ổn định trong nền và không bị thanh địa chỉ che khuất, hãy làm theo các bước sau.</p>
                    
                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>Mới trong v6.01:</strong>
                        <ul>
                            <li><strong>👁️ Chế độ Tối giản:</strong> Nhấn biểu tượng con mắt để ẩn thông số phụ.</li>
                            <li><strong>🎨 Giao diện:</strong> Đổi màu và dùng lịch sử thu gọn.</li>
                            <li><strong>🚶 Chế độ Đi bộ:</strong> Theo dõi các chuyến đi bộ!</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>📲 Cài đặt (Quan trọng!):</strong>
                        <ul>
                            <li><strong>🍎 iPhone (Safari):</strong> Nhấn nút <strong>Chia sẻ</strong> ở dưới cùng (Hình vuông có mũi tên lên <span style="font-size:16px">share</span>). Cuộn và chọn <strong>"Thêm vào MH chính"</strong> (Add to Home Screen).</li>
                            <li><strong>🤖 Android (Chrome):</strong> Nhấn dấu ba chấm (⋮) ở góc trên và chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào màn hình chính"</strong>.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>⚠️ Quyền bắt buộc:</strong>
                        <ul>
                            <li>📍 <strong>Vị trí (Location):</strong> Chọn "Luôn cho phép" hoặc "Khi dùng ứng dụng". Đồng hồ tốc độ sẽ không chạy nếu thiếu quyền này.</li>
                            <li>📱 <strong>Cảm biến (Motion):</strong> (Chỉ iOS) Safari cần quyền truy cập gia tốc kế. Giúp đo lực G và phân tích Eco.</li>
                            <li>🔊 <strong>Âm thanh (Audio):</strong> Ứng dụng phát âm thanh im lặng để giữ GPS hoạt động khi bỏ điện thoại trong túi. Hãy cho phép nếu được hỏi.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🏎️ 2. Bảng điều khiển (Dashboard)",
                content: `
                    <p>Giao diện tự động thay đổi theo hướng cầm điện thoại.</p>
                    
                    <div class="help-step">
                        <strong>📱 Chế độ Dọc (Portrait):</strong>
                        <ol>
                            <li><strong>Tốc độ:</strong> Số lớn ở giữa.</li>
                            <li><strong>Thống kê:</strong> Lưới 6 ô (Max, Km, Thời gian, Tốc độ TB, Hướng, Độ cao).</li>
                            <li><strong>Địa chỉ:</strong> Tên đường và tọa độ nằm dưới bảng thống kê.</li>
                            <li><strong>Thời gian & Thời tiết:</strong> Đồng hồ, ngày và icon thời tiết ở dưới cùng.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🔄 Chế độ Ngang (Landscape):</strong>
                        Xoay ngang điện thoại để xem màn hình rộng:
                        <ul>
                            <li><strong>Trái:</strong> Số đo tốc độ cực lớn.</li>
                            <li><strong>Phải:</strong> Lưới thống kê.</li>
                            <li><strong>Dưới:</strong> Địa chỉ và tọa độ chuyển sang bên cạnh.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>👁️ Chế độ Tối giản:</strong>
                        Nhấn biểu tượng con mắt ở góc trên bên trái. Chỉ hiện tốc độ. Dùng khi lái xe ban đêm.
                    </div>

                    <div class="help-step">
                        <strong>🎯 Đồng hồ lực G (Bubble):</strong>
                        "Tâm ngắm" nhỏ trên màn hình.
                        <ul>
                            <li><strong>Ở giữa:</strong> Lái xe tiết kiệm (Eco).</li>
                            <li><strong>Ở mép (Đỏ):</strong> Tăng tốc/phanh gấp -> Lái xe "Gắt" (Aggressive).</li>
                        </ul>
                    </div>`
            },
            {
                title: "🚗 3. Gara xe & Lựa chọn",
                content: `
                    <p>Dữ liệu chuyến đi luôn được lưu cho một xe cụ thể.</p>
                    
                    <div class="help-step">
                        <strong>Chọn xe trước khi lái:</strong>
                        Chọn xe từ menu thả xuống ở thanh trên cùng.
                        <br><span style="color:#ff4444; font-weight:bold;">LƯU Ý:</span> Không thể ghi hình ở chế độ "Tất cả xe". Hãy chọn một xe cụ thể.
                    </div>

                    <div class="help-step">
                        <strong>Loại xe:</strong>
                        <ul>
                            <li><strong>🚗 Ô tô (Car):</strong> Bản đồ thu nhỏ khi chạy nhanh. Phân tích Eco BẬT.</li>
                            <li><strong>🏍️ Xe máy (Motorcycle):</strong> Giống ô tô, có icon riêng. Phân tích Eco BẬT.</li>
                            <li><strong>🚲 Xe đạp (Bike):</strong> Bản đồ luôn phóng to. Phân tích Eco TẮT.</li>
                            <li><strong>🚶 Đi bộ (Walking):</strong> MỚI! Bản đồ phóng to, không đo lực G, không đổ xăng.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎨 Cài đặt Giao diện:</strong>
                        Trong trang Cài đặt, bạn có thể:
                        <ul>
                            <li>Đổi màu chủ đạo.</li>
                            <li>Bật "Lịch sử thu gọn" để xem danh sách gọn hơn.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🗄️ Lưu trữ (Archiving):</strong>
                        Nếu bán xe, bạn có thể "Lưu trữ" trong Cài đặt (nút 🗄️).
                        <ul>
                            <li>Xe đã lưu trữ sẽ bị ẩn khỏi danh sách.</li>
                            <li>Để xem lịch sử, chọn <em>"Tất cả (bao gồm đã lưu trữ)"</em> ở thanh trên cùng.</li>
                            <li>Khôi phục bằng cách nhấn nút ♻️.</li>
                        </ul>
                    </div>`
            },
            {
                title: "⏱️ 4. Ghi hình & Công tác",
                content: `
                    <div class="help-step">
                        <strong>🔇 Chạy nền (Silent Audio Hack):</strong>
                        Khi bật GPS, ứng dụng phát "âm thanh im lặng". Điều này đánh lừa điện thoại để giữ GPS hoạt động trong túi. Đừng đóng tab trình duyệt.
                    </div>

                    <div class="help-step">
                        <strong>💾 Lưu và Chuyến đi công tác:</strong>
                        Khi dừng ghi (STOP), cửa sổ hiện ra:
                        <ul>
                            <li><strong>Chủ đề:</strong> Ghi chú ngắn (ví dụ: "Gặp khách hàng").</li>
                            <li><strong>Loại:</strong> Chọn <strong>🏠 Cá nhân (Private)</strong> hoặc <strong>💼 Công việc (Work)</strong>.</li>
                        </ul>
                        Lựa chọn này giúp tách biệt báo cáo (để tính thuế/thanh toán).
                    </div>`
            },
            {
                title: "📝 5. Lịch sử & Báo cáo",
                content: `
                    <div class="help-step">
                        <strong>✏️ Chỉnh sửa (Extended Edit):</strong>
                        Quên bật ứng dụng? Nhấn biểu tượng bút chì (✏️) trong danh sách.
                        Bạn có thể sửa lại: Ngày, Quãng đường (km), Loại chuyến và Xe.
                    </div>

                    <div class="help-step">
                        <strong>➕ Nhập thủ công:</strong>
                        Quên dùng ứng dụng? Nhấn <strong>"+ Nhập thủ công"</strong> ở trang lịch sử để thêm chuyến đi bằng tay.
                    </div>

                    <div class="help-step">
                        <strong>📥 Báo cáo (Excel/CSV):</strong>
                        Nhấn <strong>"Tải xuống CSV"</strong>. Bạn sẽ nhận được file tương thích với Excel. Cột: Ngày, Giờ, Xe, Loại, Km, Thời gian, Tuyến đường, Ghi chú.
                    </div>`
            },
            {
                title: "⛽ 6. Đổ xăng",
                content: `
                    <p>Nhấn nút <strong>⛽</strong> trên bảng điều khiển để thêm lần đổ xăng.</p>
                    <p><strong>Lưu ý:</strong> Không thể thêm xăng cho xe đạp, đi bộ hoặc xe đã lưu trữ. Nhập số lít và số tiền để tính giá/lít.</p>`
            },
            {
                title: "🆘 7. Khôi phục sự cố (Crash Recovery)",
                content: `
                    <div class="help-step">
                        <strong>Nếu ứng dụng tắt đột ngột:</strong>
                        <br>Ví dụ khi có cuộc gọi đến. Khi mở lại:
                        <ul>
                            <li>Ứng dụng hỏi: <em>"Chuyến đi bị gián đoạn! Khôi phục?"</em></li>
                            <li>Chọn <strong>Có (Yes)</strong>.</li>
                            <li>Quãng đường và thời gian sẽ được khôi phục.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🕶️ 8. Chế độ HUD (Ban đêm)",
                content: `
                    <p>Tính năng mới cho lái xe đêm! HUD (Head-Up Display) lật ngược màn hình và tăng độ tương phản để phản chiếu lên kính lái.</p>
                    
                    <div class="help-step">
                        <strong>Cách dùng:</strong>
                        <ol>
                            <li>Nhấn nút <strong>HUD</strong> ở thanh trên cùng.</li>
                            <li>Đặt điện thoại lên taplo, màn hình hướng lên (chỉnh độ sáng tối đa).</li>
                            <li>Đồng hồ tốc độ sẽ phản chiếu lên kính lái đúng chiều.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>Thoát:</strong>
                        Chạm vào bất kỳ đâu trên màn hình để trở lại bình thường.
                    </div>`
            },
            {
                title: "📡 9. Chế độ Offline (Không mạng)",
                content: `
                    <p>Lái xe khi không có internet.</p>
                    
                    <div class="help-step" style="border-left: 4px solid #ffd600; padding-left: 10px;">
                        <strong>⚠️ Cài đặt quan trọng:</strong>
                        Để đảm bảo chế độ Offline hoạt động, hãy làm điều này <strong>trước chuyến đi</strong>:
                        <ol>
                            <li>Mở ứng dụng khi có kết nối mạng.</li>
                            <li><strong>Tải lại trang (Refresh)</strong> một hoặc hai lần.</li>
                            <li>Điều này buộc ứng dụng lưu phiên bản mới nhất vào bộ nhớ.</li>
                            <li>Thử bật chế độ máy bay để kiểm tra.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>Lưu offline:</strong>
                        Dữ liệu được lưu vào bộ nhớ tạm.
                        <ul>
                            <li>Trong Lịch sử, thẻ chuyến đi sẽ có viền vàng: <em>"⚠️ Chờ đồng bộ"</em>.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>Đồng bộ (Sync):</strong>
                        Khi có mạng (WiFi):
                        <ol>
                            <li>Vào <strong>Lịch sử</strong>.</li>
                            <li>Nhấn nút vàng: <strong>"📡 Gửi dữ liệu chờ"</strong>.</li>
                            <li>Dữ liệu sẽ được lưu lên đám mây an toàn.</li>
                        </ol>
                        <br><em>Lưu ý: Không thể sửa chuyến đi offline trước khi đồng bộ.</em>
                    </div>`
            },
            {
                title: "❓ 10. FAQ (Câu hỏi thường gặp)",
                content: `
                    <div class="help-step">
                        <strong>H: Bản đồ hiện đường thẳng tắp ("Dịch chuyển tức thời")?</strong>
                        <br>Đ: Mất tín hiệu hoặc chế độ tiết kiệm pin đã tắt ứng dụng. Hãy đảm bảo "âm thanh im lặng" được phép phát.
                    </div>
                    <div class="help-step">
                        <strong>H: Không thấy xe cũ đâu?</strong>
                        <br>Đ: Xe đã bị lưu trữ. Chọn "Tất cả (bao gồm đã lưu trữ)" ở thanh trên.
                    </div>
                    <div class="help-step">
                        <strong>H: Tắt chế độ tối (Dark mode) thế nào?</strong>
                        <br>Đ: Nhấn biểu tượng mặt trời/trăng (☀/☾) ở thanh trên cùng.
                    </div>`
            }
        ]
    }
};

// --- LOGIIKKA / LOGIC ---

window.renderHelp = function(lang) {
    const container = document.getElementById('help-view');
    if (!container) {
        console.warn("Help container not found!");
        return;
    }

    const data = helpData[lang] || helpData['fi'];
    const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '6.01';

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
            <img src="ajopaivakirja_logo.png?v=6.01" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
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

    container.innerHTML = contentHtml;
};

// SUORITETAAN HETI
window.renderHelp('fi');

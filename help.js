// =========================================================
// HELP.JS - TRILINGUAL MASTER GUIDE (v6.08 INSTALL GUIDE FIX)
// =========================================================

// --- KÄÄNNÖKSET / TRANSLATIONS / BẢN DỊCH ---
const helpData = {
    fi: {
        title: "Käyttöopas",
        version: "Versio",
        sections: [
            {
                title: "🚀 1. Uutta versiossa 6.08",
                content: `
                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>👋 Tervetuloa-opastus:</strong>
                        <ul>
                            <li>Sovellus avaa ohjeet automaattisesti päivityksen jälkeen.</li>
                        </ul>
                        <strong>⏯️ Aloitusnapit (v6.07):</strong>
                        <ul>
                            <li><strong>🔴 ALOITA:</strong> Uusi ajo.</li>
                            <li><strong>⏯ JATKA:</strong> Jatka vanhaa ajoa historiasta.</li>
                        </ul>
                        <strong>🔧 iPhone-korjaus:</strong>
                        <ul>
                            <li>Kirjautumisongelmat korjattu.</li>
                        </ul>
                    </div>`
            },
            {
                title: "📲 2. Asennus sovellukseksi (Tärkeä!)",
                content: `
                    <p>Jotta GPS toimii vakaasti taustalla ja osoitepalkit eivät vie tilaa, asenna sivu sovellukseksi:</p>
                    
                    <div class="help-step">
                        <strong>🍎 iPhone (Safari):</strong>
                        <ol>
                            <li>Paina alareunan <strong>Jaa-painiketta</strong> (Neliö, josta nuoli ylös <span style="font-size:16px">share</span>).</li>
                            <li>Selaa valikkoa alaspäin.</li>
                            <li>Valitse <strong>"Lisää Koti-valikkoon"</strong> (Add to Home Screen).</li>
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
                title: "🏎️ 3. Mittaristo (Dashboard)",
                content: `
                    <p>Näkymä mukautuu automaattisesti puhelimen asennon mukaan.</p>
                    
                    <div class="help-step">
                        <strong>Toiminnot:</strong>
                        <ul>
                            <li><strong>🔴 ALOITA:</strong> Käynnistää uuden tallennuksen.</li>
                            <li><strong>⏯ JATKA:</strong> Oikopolku historiaan vanhan ajon jatkamiseksi.</li>
                            <li><strong>HUD:</strong> Kääntää näytön peilikuvaksi (yöajo).</li>
                            <li><strong>👁️ Silmä-ikoni:</strong> Yksinkertaistettu tila. Piilottaa kaiken paitsi nopeuslukeman.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🚶 Kävely-tilan mittaristo:</strong>
                        Kun valitset autotallista "Kävely", näet:
                        <ul>
                            <li><strong>Askeleet:</strong> Arvioitu matkan perusteella.</li>
                            <li><strong>Tahti:</strong> Nopeus muodossa <em>min/km</em>.</li>
                            <li><strong>Kalorit:</strong> Arvioitu kulutus.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎯 G-Voimamittari (Bubble):</strong>
                        Pieni "tähtäin" ruudulla (ei näy kävely-tilassa).
                        <ul>
                            <li><strong>Keskellä:</strong> Taloudellinen ajo (Eco).</li>
                            <li><strong>Reunalla (Punainen):</strong> Voimakas kiihdytys/jarrutus.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🚗 4. Autotalli ja Valinnat",
                content: `
                    <p>Hallitse kalustoa <strong>Asetukset</strong>-välilehdellä.</p>
                    
                    <div class="help-step">
                        <strong>Valinta ennen ajoa:</strong>
                        Yläpalkin valikosta valitaan käytettävä kulkuneuvo.
                        <br><span style="color:#ff4444; font-weight:bold;">HUOM:</span> Tallennusta ei voi aloittaa "Kaikki ajoneuvot" -tilassa.
                    </div>

                    <div class="help-step">
                        <strong>Ajoneuvotyypit:</strong>
                        <ul>
                            <li><strong>🚗 Auto:</strong> Kartta loitontaa maantienopeuksissa. Eco-analyysi on päällä.</li>
                            <li><strong>🏍️ Moottoripyörä:</strong> Kuin auto, mutta omalla ikonilla. Eco-analyysi päällä.</li>
                            <li><strong>🚲 Pyörä:</strong> Kartta pysyy aina lähikuvassa. Eco-analyysi on pois päältä.</li>
                            <li><strong>🚶 Kävely:</strong> Kartta pysyy lähellä, G-voimamittari pois päältä, ei tankkauksia.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎨 Ulkoasuasetukset:</strong>
                        Asetukset-sivulta voit:
                        <ul>
                            <li>Vaihtaa korostusvärin.</li>
                            <li>Kytkeä päälle "Tiivistetyn historian".</li>
                            <li>Ottaa käyttöön Yksinkertaistetun mittariston.</li>
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
                title: "⏱️ 5. Ajon tallennus & Työajo",
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
                title: "📝 6. Historia & Raportit",
                content: `
                    <div class="help-step">
                        <strong>⏯️ Jatka ajoa:</strong>
                        Voit jatkaa vanhaa ajoa (esim. kätköilypäivä tai usean päivän reissu):
                        <ol>
                            <li>Paina mittaristossa <strong>⏯ JATKA</strong> tai etsi ajo suoraan historiasta.</li>
                            <li>Paina vihreää ⏯️-nappia listassa.</li>
                            <li>Ajo jatkuu siitä mihin jäit. Välissä kulunut aika merkitään tauoksi.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📋 Listan käyttö:</strong>
                        Jos käytät tiivistettyä näkymää, <strong>klikkaa riviä</strong> avataksesi sen. Näet silloin tarkemmat tiedot.
                    </div>

                    <div class="help-step">
                        <strong>✏️ Muokkaus:</strong>
                        Paina kynä-ikonia (✏️) muokataksesi tietoja jälkikäteen.
                    </div>

                    <div class="help-step">
                        <strong>📥 Raportointi (Excel/CSV):</strong>
                        Paina <strong>"Lataa CSV"</strong>. Saat tiedoston, jonka voi avata Excelissä.
                    </div>`
            },
            {
                title: "⛽ 7. Tankkaukset",
                content: `
                    <p>Paina mittaristossa <strong>⛽</strong>-nappia lisätäksesi tankkauksen.</p>
                    
                    <div class="help-step">
                        <strong>📉 Keskikulutus (l/100km):</strong>
                        <br>Sovellus laskee automaattisesti keskikulutuksen ja näyttää sen tankkauskortin alareunassa.
                        <ul>
                            <li><strong>Huom:</strong> Lukema vaatii vähintään kaksi peräkkäistä tankkausta samalle autolle.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🆘 8. Crash Recovery (Palautus)",
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
                title: "🕶️ 9. HUD-tila (Yönäkö)",
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
                title: "📡 10. Offline-tila (Ulkomaat)",
                content: `
                    <p>Voit käyttää sovellusta ilman nettiyhteyttä (esim. roaming estetty).</p>
                    
                    <div class="help-step">
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
                        <br>Sovellus <strong>EI lataa</strong> koko maan karttoja offline-tilaan.
                        <ul>
                            <li>Jos ajat alueella, jota et ole aiemmin selannut, kartta näkyy <strong>harmaana ruudukkona</strong>.</li>
                            <li><strong>Älä huoli!</strong> Reitti ja kilometrit tallentuvat silti oikein tyhjälle pohjalle.</li>
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
                    </div>`
            },
            {
                title: "❓ 11. Ongelmatilanteet (UKK)",
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
                        <br>V: Paina yläpalkin aurinko/kuu -ikonia (☀/☾) tai muuta asetuksista.
                    </div>`
            }
        ]
    },
    en: {
        title: "User Guide",
        version: "Version",
        sections: [
            {
                title: "🚀 1. New in v6.08",
                content: `
                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>👋 Auto-Help:</strong>
                        <ul>
                            <li>The app now automatically shows this guide after an update.</li>
                        </ul>
                        <strong>⏯️ Start Buttons:</strong>
                        <ul>
                            <li><strong>🔴 START:</strong> New Drive.</li>
                            <li><strong>⏯ CONTINUE:</strong> Resume from History.</li>
                        </ul>
                    </div>`
            },
            {
                title: "📲 2. Install as App (Important!)",
                content: `
                    <p>To ensure GPS works in the background and to remove address bars, install as an App:</p>
                    
                    <div class="help-step">
                        <strong>🍎 iPhone (Safari):</strong>
                        <ol>
                            <li>Tap the <strong>Share button</strong> at the bottom (Square with arrow up <span style="font-size:16px">share</span>).</li>
                            <li>Scroll down.</li>
                            <li>Select <strong>"Add to Home Screen"</strong>.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Tap the three dots (⋮) in the top corner.</li>
                            <li>Select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "🏎️ 3. Dashboard",
                content: `
                    <p>The view adapts automatically based on phone orientation.</p>
                    
                    <div class="help-step">
                        <strong>Features:</strong>
                        <ul>
                            <li><strong>🔴 START:</strong> Starts a new drive.</li>
                            <li><strong>⏯ CONTINUE:</strong> Shortcut to History to resume a previous drive.</li>
                            <li><strong>HUD:</strong> Mirrors screen for windshield reflection (Night mode).</li>
                            <li><strong>👁️ Eye Icon:</strong> Toggles Minimalist Mode (Speed only).</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🚶 Walking Mode Metrics:</strong>
                        When "Walking" is selected in Garage:
                        <ul>
                            <li><strong>Steps:</strong> Estimated based on distance.</li>
                            <li><strong>Pace:</strong> Shown as <em>min/km</em>.</li>
                            <li><strong>Calories:</strong> Estimated burn.</li>
                        </ul>
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
                title: "🚗 4. Garage & Selection",
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
                title: "⏱️ 5. Recording & Work Trips",
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
                title: "📝 6. History & Reports",
                content: `
                    <div class="help-step">
                        <strong>⏯️ Continue Drive:</strong>
                        To continue a previous trip (e.g., multi-stop):
                        <ol>
                            <li>Tap <strong>⏯ CONTINUE</strong> on dashboard (or go to History).</li>
                            <li>Find the drive and tap the green ⏯️ button.</li>
                            <li>Recording resumes. Time between drives is counted as pause.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📋 Using the List:</strong>
                        If using Compact Mode, <strong>tap a row</strong> to expand it and see full details (Weather, Avg Speed etc.). Tap again to close.
                    </div>

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
                title: "⛽ 7. Refueling",
                content: `
                    <p>Tap the <strong>⛽</strong> button on the dashboard to add a refueling.</p>
                    
                    <div class="help-step">
                        <strong>📉 Avg Consumption (l/100km):</strong>
                        <br>The app automatically calculates consumption based on mileage.
                        <ul>
                            <li><strong>Note:</strong> Requires at least two refuelings for the same car to calculate distance traveled.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🆘 8. Crash Recovery",
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
                title: "🕶️ 9. HUD Mode (Night Vision)",
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
                title: "📡 10. Offline Mode (Roaming)",
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
                    </div>`
            },
            {
                title: "❓ 11. FAQ & Troubleshooting",
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
                title: "🚀 1. Mới trong v6.08",
                content: `
                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>👋 Trợ giúp tự động:</strong>
                        <ul>
                            <li>Ứng dụng tự mở hướng dẫn sau khi cập nhật.</li>
                        </ul>
                        <strong>⏯️ Nút mới:</strong>
                        <ul>
                            <li><strong>🔴 BẮT ĐẦU:</strong> Chuyến mới.</li>
                            <li><strong>⏯ TIẾP TỤC:</strong> Lái tiếp chuyến cũ.</li>
                        </ul>
                    </div>`
            },
            {
                title: "📲 2. Cài đặt App (Quan trọng!)",
                content: `
                    <p>Để GPS chạy ổn định và toàn màn hình, hãy cài đặt ứng dụng:</p>
                    
                    <div class="help-step">
                        <strong>🍎 iPhone (Safari):</strong>
                        <ol>
                            <li>Nhấn nút <strong>Chia sẻ</strong> (Hình vuông có mũi tên lên <span style="font-size:16px">share</span>).</li>
                            <li>Cuộn xuống dưới.</li>
                            <li>Chọn <strong>"Thêm vào MH chính"</strong> (Add to Home Screen).</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Nhấn dấu ba chấm (⋮) ở góc trên.</li>
                            <li>Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào màn hình chính"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "🏎️ 3. Bảng điều khiển (Dashboard)",
                content: `
                    <p>Giao diện tự động thay đổi theo hướng cầm điện thoại.</p>
                    
                    <div class="help-step">
                        <strong>📱 Chế độ Dọc (Portrait):</strong>
                        <ol>
                            <li><strong>🔴 BẮT ĐẦU:</strong> Chuyến đi mới.</li>
                            <li><strong>⏯ TIẾP TỤC:</strong> Nối tiếp chuyến cũ.</li>
                            <li><strong>Tốc độ:</strong> Số lớn ở giữa.</li>
                            <li><strong>Thống kê:</strong> Lưới 6 ô.</li>
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
                        <strong>🚶 Chế độ Đi bộ:</strong>
                        Khi chọn "Đi bộ", bạn sẽ thấy:
                        <ul>
                            <li><strong>Số bước:</strong> Ước tính theo quãng đường.</li>
                            <li><strong>Tốc độ:</strong> Hiển thị <em>phút/km</em>.</li>
                            <li><strong>Calo:</strong> Ước tính năng lượng tiêu thụ.</li>
                        </ul>
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
                title: "🚗 4. Gara xe & Lựa chọn",
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
                title: "⏱️ 5. Ghi hình & Công tác",
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
                title: "📝 6. Lịch sử & Báo cáo",
                content: `
                    <div class="help-step">
                        <strong>⏯️ Tiếp tục lái:</strong>
                        Để nối tiếp chuyến đi trước:
                        <ol>
                            <li>Nhấn <strong>⏯ TIẾP TỤC</strong> ở màn hình chính.</li>
                            <li>Tìm chuyến đi và nhấn nút ⏯️ màu xanh.</li>
                            <li>Thời gian nghỉ sẽ được tính là tạm dừng.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📋 Lịch sử mở rộng:</strong>
                        Nếu đang dùng chế độ thu gọn, hãy <strong>chạm vào dòng</strong> chuyến đi để mở rộng và xem chi tiết. Chạm lại để đóng.
                    </div>

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
                title: "⛽ 7. Đổ xăng",
                content: `
                    <p>Nhấn nút <strong>⛽</strong> trên bảng điều khiển để thêm lần đổ xăng.</p>
                    
                    <div class="help-step">
                        <strong>📉 Tiêu thụ (l/100km):</strong>
                        <br>Ứng dụng tự động tính mức tiêu thụ.
                        <ul>
                            <li><strong>Lưu ý:</strong> Cần ít nhất 2 lần đổ xăng liên tiếp để tính.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🆘 8. Khôi phục sự cố (Crash Recovery)",
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
                title: "🕶️ 9. Chế độ HUD (Ban đêm)",
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
                title: "📡 10. Chế độ Offline (Không mạng)",
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
                    </div>`
            },
            {
                title: "❓ 11. FAQ (Câu hỏi thường gặp)",
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
    const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '6.08';

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
            <img src="ajopaivakirja_logo.png?v=6.05" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
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
            Designed for drivers & walkers.
        </div>
    `;

    container.innerHTML = contentHtml;
};

// SUORITETAAN HETI
window.renderHelp('fi');

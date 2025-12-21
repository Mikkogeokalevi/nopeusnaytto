// =========================================================
// HELP.JS - KATTAVA KÄYTTÖOPAS JA UKK (v5.9 RAAMATTU)
// =========================================================

const helpContent = `
    <div style="text-align:center; margin-bottom: 30px;">
        <img src="ajopaivakirja_logo.png" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
        <h2 style="color:var(--accent-color); text-transform: uppercase; letter-spacing: 1px; margin:0;">Käyttöopas</h2>
        <p style="opacity:0.7; font-size:12px;">Mikkokalevin Ajopäiväkirja Pro v${typeof APP_VERSION !== 'undefined' ? APP_VERSION : '5.9'}</p>
    </div>
    
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
                <li><strong>Osoite:</strong> Katuosoite ja koordinaatit näkyvät <em>tilastoruudukon alapuolella</em>, mutta kellon yläpuolella.</li>
                <li><strong>Aika & Sää:</strong> Alimpana kellonaika, päivämäärä ja sääikoni.</li>
            </ol>
        </div>

        <div class="help-step">
            <strong>🔄 Vaakanäkymä (Landscape):</strong>
            Kun käännät puhelimen sivuttain:
            <ul>
                <li><strong>Vasen reuna:</strong> Iso nopeuslukema.</li>
                <li><strong>Oikea reuna:</strong> Tilastoruudukko.</li>
                <li><strong>Oikea alanurkka:</strong> Osoite ja koordinaatit siirtyvät <em>tilastoruudukon alle</em>.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>🎯 G-Voimamittari (Bubble):</strong>
            Oikeassa yläkulmassa (pystynäytöllä) oleva "tähtäin".
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
                <li><strong>🚗 Auto:</strong> Kartta loitontaa maantienopeuksissa (Zoom 14-16). Eco-analyysi on päällä.</li>
                <li><strong>🚲 Pyörä:</strong> Kartta pysyy aina lähikuvassa (Zoom 17-19). Eco-analyysi on pois päältä (ettei puhelimen tärinä vääristä tulosta).</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 4. Ajon tallennus</h3>
        
        <div class="help-step">
            <strong>🔇 Tausta-ajo (Silent Audio Hack):</strong>
            Kun käynnistät GPS:n, sovellus alkaa toistaa "hiljaisuutta" taustalla.
            <br><em>Miksi?</em> Useimmat puhelimet tappavat verkkosivun GPS-yhteyden heti, kun näyttö sammuu säästääkseen virtaa. Äänen toistaminen huijaa puhelimen luulemaan, että kuuntelet musiikkia (kuten Spotify), jolloin se pitää sovelluksen ja GPS:n käynnissä myös taskussa.
        </div>

        <div class="help-step">
            <strong>Tauko (Pause):</strong>
            Käytä aina taukoa pysähdyksissä. Jos puhelin on taskussa kaupassa käynnin ajan ilman taukoa, GPS "vaeltaa" ja kerryttää haamukilometrejä.
        </div>
    </div>

    <div class="help-section">
        <h3>⛽ 5. Tankkaukset ja Muokkaus</h3>
        
        <div class="help-step">
            <strong>Lisääminen:</strong>
            Paina mittaristossa <strong>⛽</strong>-nappia (kellon vieressä). Syötä päivä, litrat ja eurot. Sovellus laskee litrahinnan.
        </div>
        
        <div class="help-step">
            <strong>✏️ Muokkaaminen (UUSI):</strong>
            Teitkö virheen? Mene <strong>Historia</strong>-sivulle -> valitse välilehti <strong>Tankkaukset</strong>.
            <br>Paina kynä-ikonia (✏️) haluamasi tankkauksen kohdalla. Voit muuttaa kaikkia tietoja (auto, pvm, litrat, hinta).
        </div>
    </div>

    <div class="help-section">
        <h3>📊 6. Tilastot (UUSI LOGIIKKA)</h3>
        <p>Tilastot-sivulla on nyt dynaaminen aikavälin valinta yläreunassa.</p>

        <div class="help-step">
            <strong>📅 Lyhyet aikavälit (7 pv / 30 pv):</strong>
            Kun valitset nämä, graafien X-akseli muuttuu <strong>päiväkohtaiseksi</strong>.
            <br><em>Esimerkki:</em> Näet pylväsdiagrammissa, että ajoit maanantaina 50km ja tiistaina 0km.
        </div>

        <div class="help-step">
            <strong>📅 Pitkät aikavälit (Vuosi / Kaikki):</strong>
            Kun valitset nämä, graafit niputtavat datan <strong>kuukausitasolle</strong>.
            <br><em>Esimerkki:</em> Tammikuu 1200km, Helmikuu 950km.
        </div>
    </div>

    <div class="help-section">
        <h3>❓ Ongelmatilanteet (UKK)</h3>
        
        <div class="help-step">
            <strong>K: GPS-viiva on suora ("teleporttaus")?</strong>
            <br>V: Signaali katkesi tai virransäästö iski.
            <ul>
                <li>Varmista, että "Tausta-ajo" ääni pyörii (saatat nähdä mediailmoituksen).</li>
                <li>Pidä puhelin latauksessa ajon aikana.</li>
                <li>Tarkista puhelimen asetuksista, ettei selaimella ole "Akun optimointi" päällä.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>K: Nopeusmittari näyttää nollaa vaikka liikun?</strong>
            <br>V: Sijaintilupa on ehkä estetty tai "Salli vain kerran" on vanhentunut. Päivitä sivu ja salli sijainti uudelleen.
        </div>

        <div class="help-step">
            <strong>K: Kartta on harmaa?</strong>
            <br>V: Olet alueella, josta ei ole ladattu karttatiiliä välimuistiin, ja nettiyhteys on heikko.
        </div>
        
        <div class="help-step">
            <strong>K: Miten saan tumman teeman pois?</strong>
            <br>V: Paina yläpalkin aurinko/kuu -ikonia (☀/☾).
        </div>
    </div>

    <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
        Mikkokalevin Ajopäiväkirja Pro v${APP_VERSION}<br>
        Kehitetty intohimolla ajamista varten.
    </div>
`;

// Ladataan sisältö
const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}

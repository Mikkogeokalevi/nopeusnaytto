const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 25px; border-bottom: 2px solid var(--accent-color); padding-bottom: 10px;">Käyttöopas 3.6</h2>
    
    <div class="help-section">
        <h3>🚀 1. Käyttöönotto ja Yksityisyys</h3>
        <div class="help-step">
            <strong>Kirjautuminen:</strong>
            Voit kirjautua sisään kahdella tavalla:
            <br>1. <strong>Google-tili:</strong> Helppo ja nopea kirjautuminen.
            <br>2. <strong>Sähköposti:</strong> Jos käytät Perhekalenteria tai haluat luoda erillisen tunnuksen, käytä sähköpostia ja salasanaa.
            <br><em>Huom:</em> Kaikki tiedot tallentuvat turvallisesti pilveen omaan profiiliisi.
        </div>
        <div class="help-step">
            <strong>Vaaditut Luvat:</strong>
            <ul>
                <li>📍 <strong>Sijainti (GPS):</strong> Pakollinen nopeuden ja matkan mittaukseen.</li>
                <li>📱 <strong>Liikeanturit (Motion):</strong> Tarvitaan "Eco-mittarin" toimintaan autoillessa. Salli tämä kysyttäessä.</li>
            </ul>
        </div>
        <div class="help-step">
            <strong>Asennus (PWA):</strong>
            Lisää sovellus kotivalikkoon (Add to Home Screen) saadaksesi parhaan käyttökokemuksen.
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ 2. Autotalli ja Ajoneuvot</h3>
        <div class="help-step">
            Käy valikon kohdassa <strong>Asetukset (Tallit)</strong> ja luo profiili kulkuneuvoillesi.
        </div>
        <div class="help-step">
            <strong>Autot vs. Polkupyörät:</strong>
            <ul>
                <li>🚗 <strong>Auto:</strong> Eco-mittari on päällä ja analysoi ajotapaasi (vihreä/punainen palkki). Kartta käyttää laajempaa zoomausta.</li>
                <li>🚲 <strong>Polkupyörä:</strong> Eco-mittari on pois päältä. Kartta zoomaa hyvin lähelle (Zoom 19), jotta näet polut tarkasti.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 3. Mittaristo ja Live-tiedot</h3>
        <div class="help-step">
            <strong>Datanäyttö:</strong>
            Näet reaaliajassa nopeuden, huippunopeuden, suunnan, korkeuden ja sään.
        </div>
        <div class="help-step">
            <strong>🏎️ Eco-mittari (Vain autoille):</strong>
            Vihreä palkki = Taloudellinen ajo.
            <br>Punainen palkki = Voimakas kiihdytys/jarrutus.
        </div>
    </div>

    <div class="help-section">
        <h3>🔴 4. Ajon Tallennus</h3>
        <div class="help-step">
            1. Valitse yläpalkista oikea ajoneuvo.
            <br>2. Paina <strong>🔴 ALOITA TALLENNUS</strong>.
        </div>
        <div class="help-step">
            <strong>Ongelmia tausta-ajossa?</strong>
            Jos poistut sovelluksesta (esim. WhatsAppiin) kesken ajon, jotkut puhelimet katkaisevat GPS:n virransäästön vuoksi.
            <br><em>Vinkki:</em> Sovellus yrittää paikata katkokset, mutta tarkin reitti saadaan pitämällä sovellus auki.
        </div>
        <div class="help-step">
            <strong>Lopetus:</strong>
            Paina <strong>⬛ LOPETA</strong>. Täytä ajon tiedot ja tallenna.
        </div>
    </div>

    <div class="help-section">
        <h3>📋 5. Historia</h3>
        <div class="help-step">
            Historia-sivulla näet kaikki ajot. Listassa näkyy nyt myös tarkka <strong>aloitus- ja lopetusaika</strong> (esim. 14:00 - 14:45).
        </div>
        <div class="help-step">
            <strong>Suodatus:</strong>
            Voit rajata listaa ajoneuvon (yläpalkki) tai aikavälin (listan yläpuoli) mukaan.
        </div>
        <div class="help-step">
            <strong>Muokkaus (✏️):</strong>
            Voit jälkikäteen vaihtaa ajon toiselle ajoneuvolle tai muokata sen aihetta painamalla kynä-ikonia.
        </div>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px; padding-bottom: 30px;">
        Ajopäiväkirja Pro v3.6 &copy; 2025
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}

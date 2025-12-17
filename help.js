const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 25px; border-bottom: 2px solid var(--accent-color); padding-bottom: 10px;">Käyttöopas 3.5</h2>
    
    <div class="help-section">
        <h3>🚀 1. Käyttöönotto ja Yksityisyys</h3>
        <div class="help-step">
            <strong>Kirjautuminen:</strong>
            Sovellus vaatii Google-kirjautumisen. Tämä luo sinulle henkilökohtaisen, salatun tilan pilvipalveluun.
            <br><em>Miksi?</em> Jotta ajohistoriasi, autotallisi ja asetuksesi säilyvät, vaikka puhelin katoaisi tai vaihtuisit laitetta. Kukaan muu ei näe ajojasi.
        </div>
        <div class="help-step">
            <strong>Vaaditut Luvat:</strong>
            Jotta sovellus toimii täydellä teholla, se tarvitsee seuraavat oikeudet:
            <ul>
                <li>📍 <strong>Sijainti (GPS):</strong> Pakollinen. Valitse "Salli käytön aikana" ja varmista, että "Tarkka sijainti" on päällä. Ilman tätä nopeus ja matka eivät toimi.</li>
                <li>📱 <strong>Liikeanturit (Motion):</strong> Sovellus käyttää puhelimen kiihtyvyysanturia "Eco-mittarin" toimintaan. iPhone-käyttäjien tulee erikseen sallia tämä kysyttäessä.</li>
            </ul>
        </div>
        <div class="help-step">
            <strong>Asennus (PWA):</strong>
            Lisää sovellus kotivalikkoon saadaksesi parhaan käyttökokemuksen (koko näyttö, ei osoitepalkkeja).
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ 2. Autotalli ja Ajoneuvot</h3>
        <div class="help-step">
            Käy valikon kohdassa <strong>Asetukset (Tallit)</strong> luodaksesi profiilin kulkuneuvoillesi.
        </div>
        <div class="help-step">
            <strong>Autot vs. Polkupyörät:</strong>
            Valitse ajoneuvon tyyppi lisätessäsi sitä.
            <ul>
                <li>🚗 <strong>Auto:</strong> Eco-mittari on päällä ja analysoi ajotapaasi (jarrutukset/kiihdytykset). Kartta käyttää laajempaa zoomausta.</li>
                <li>🚲 <strong>Polkupyörä:</strong> Eco-mittari on pois päältä. Kartta zoomaa lähelle (Zoom 19), paitsi jos vauhti nousee yli 15 km/h, jolloin se loitontaa hieman (Zoom 17).</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 3. Mittaristo ja Live-tiedot</h3>
        <div class="help-step">
            <strong>Datanäyttö:</strong>
            <ul>
                <li><strong>Nopeus:</strong> Reaaliaikainen GPS-nopeus.</li>
                <li><strong>Huippu:</strong> Kyseisen tallennuksen suurin nopeus.</li>
                <li><strong>Suunta:</strong> Kompassisuunta (esim. NE 45°).</li>
                <li><strong>Korkeus:</strong> Korkeus merenpinnasta (m).</li>
                <li><strong>Sää:</strong> Lähin säähavainto haetaan automaattisesti.</li>
            </ul>
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
            Jos poistut sovelluksesta (esim. WhatsAppiin) kesken ajon, jotkut puhelimet saattavat katkaista GPS:n virransäästön vuoksi.
            <br><em>Vinkki:</em> Sovellus yrittää nyt paikata katkokset vetämällä suoran viivan, mutta tarkin reitti saadaan pitämällä sovellus auki.
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

    <div class="help-section">
        <h3>🗺️ 6. Kartta ja Zoom-tasot</h3>
        <div class="help-step">
            Kartta elää nopeutesi mukaan:
        </div>
        <div class="help-step">
            <strong>🚗 Autolla:</strong>
            <ul>
                <li>0-40 km/h: <strong>Zoom 18</strong> (Lähikuva)</li>
                <li>40-70 km/h: <strong>Zoom 17</strong></li>
                <li>70-100 km/h: <strong>Zoom 16</strong></li>
                <li>Yli 100 km/h: <strong>Zoom 14</strong> (Yleiskuva)</li>
            </ul>
        </div>
        <div class="help-step">
            <strong>🚲 Polkupyörällä:</strong>
            <ul>
                <li>0-15 km/h: <strong>Zoom 19</strong> (Tarkka polku-näkymä)</li>
                <li>Yli 15 km/h: <strong>Zoom 17</strong> (Hieman loitompi)</li>
            </ul>
        </div>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px; padding-bottom: 30px;">
        Ajopäiväkirja Pro v3.5 &copy; 2025
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}

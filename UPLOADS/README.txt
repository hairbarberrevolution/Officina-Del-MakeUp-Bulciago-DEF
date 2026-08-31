COME AGGIUNGERE FOTO E VIDEO ALLE NOVITÀ

1. Copia in questa cartella il file foto o video che vuoi usare.
2. Apri data/notizie.js e duplica un oggetto già presente dentro l'array.
3. Compila:
   - nomeNotizia: titolo della notizia
   - descrizione: testo completo della notizia
   - file: nome esatto del file dentro UPLOADS (es. promo-estate.jpg o corso.mp4)
   - tipo: "immagine" oppure "video" (facoltativo: il sito riconosce comunque l'estensione)
4. L'ordine degli oggetti nell'array è l'ordine delle schede sul sito.

Formati immagine consigliati: jpg, jpeg, png, webp, gif, svg.
Formati video consigliati: mp4, webm, ogg, mov, m4v.

Se apri il sito direttamente con un doppio clic sul file HTML, alcuni browser
bloccano la lettura del JSON. Pubblica il sito oppure avvialo con un piccolo
server locale per vedere sempre gli aggiornamenti.
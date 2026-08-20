# filofobia: quando amare fa paura
### Installazione digitale — POST del cuore · Luna Cucchiaro · 2025/26

`index.html` è l'installazione completa: **un solo file**, nessuna dipendenza da
installare, nessun backend. Contiene tutte e 4 le fasi della spec.

---

## 1. Come collegarlo al bottone in Figma

Il prototipo Figma apre un **link esterno**, quindi il file deve stare a un
indirizzo pubblico (http). Un modo qualsiasi va bene:

| Come | Cosa fare |
|---|---|
| **Netlify Drop** (30 secondi, senza account) | vai su `app.netlify.com/drop` e trascina la cartella `LUNA` |
| **GitHub Pages** | carica `index.html` in una repo, Settings → Pages → branch `main` |
| **Vercel** | `vercel deploy` dentro la cartella |

Poi in Figma: seleziona il bottone → pannello **Prototype** → *On click* →
**Open link** → incolla l'URL.

Per provarlo intanto sul tuo computer: doppio clic su `index.html`. Funziona
tutto tranne il salvataggio delle lettere, che su alcuni browser è bloccato
quando il file è aperto in locale (`file://`).

### Più bottoni Figma verso punti diversi
Aggiungendo un parametro all'URL si entra direttamente in una fase:

```
tuo-sito.it/index.html                          → landing (dall'inizio)
tuo-sito.it/index.html?fase=gratta              → direttamente il gratta e vinci
tuo-sito.it/index.html?fase=scelta              → direttamente amore / paura
tuo-sito.it/index.html?fase=archivio&tema=amore → direttamente le lettere d'amore
tuo-sito.it/index.html?fase=archivio&tema=paura → direttamente le lettere sulla paura
tuo-sito.it/index.html?reset=1                  → cancella le lettere salvate su quel device
```

Utile in mostra: se l'installazione girasse su un totem, `?reset=1` la riporta
allo stato iniziale.

---

## 2. Le 4 fasi, come sono state realizzate

**1 · Landing** — wordmark, una riga di microcopy e un solo bottone `ENTRA`.
Header (logo + titolo) e footer (copyright + firma) restano fissi in tutte le
fasi, come coerenza di brand.

**2 · Reveal** — canvas HTML5 con `destination-out`, pennello morbido, pointer
events unificati (funziona con mouse, dito e pennino). Sotto il nero c'è un
manifesto rosso: *QUANDO AMARE FA PAURA* con l'etimologia. La percentuale di
area pulita viene misurata campionando il canvas: **superato il 34% lo strato si
apre da solo** con un'onda che parte dai punti già grattati, poi passa da solo
alla fase 3. C'è un `salta →` che compare dopo 5 secondi (serve anche per chi
non può usare il gesto) e un suono di graffio generato via Web Audio, con
interruttore in alto a destra.

**3 · Scelta del tema** — ricostruita sullo screenshot di riferimento. Al clic il
rettangolo si espande a schermo intero nel suo colore e da lì si entra
nell'archivio. La scelta **è reversibile**: in archivio c'è `← cambia sezione`.

**4 · Archivio** — ibrido dei due riferimenti, con due viste commutabili:

- **MURO** (rif. every:second): le lettere sono fogli impilati in prospettiva,
  con i bordi dei fogli sottostanti che si vedono — più risposte ha una lettera,
  più spesso è il pacchetto. Al passaggio del mouse il foglio si raddrizza e
  viene avanti.
- **SCHEDARIO** (rif. immagine 1): cassetti alfabetici con linguette nere
  `H 003`, voci numerate `001…013`, righe alternate e l'etichetta gialla in
  basso.

A destra le etichette con contatore (stile sidebar di every:second), la
dimensione del testo cresce col numero di lettere. In alto: `scrivi una
lettera`, ordinamento (recenti / risposte / casuale), ricerca a testo libero e
l'orologio al secondo che richiama *every : second*.

---

## 3. Le domande aperte della spec: cosa ho deciso

Sono scelte, non vincoli: si cambiano tutte in poche righe.

| Domanda | Scelta |
|---|---|
| Microcopy prima del bottone? | Sì, tre righe brevi |
| Soglia autocompletamento | 34% dell'area (3 passate su desktop, 4-5 col dito) — variabile `thr` nel codice |
| Cosa c'è sotto il nero | manifesto rosso con l'etimologia di *filofobia* |
| Suono / vibrazione | suono di graffio + campanella all'apertura, vibrazione su mobile; interruttore visibile |
| La scelta del tema è reversibile? | sì, `← cambia sezione` |
| Transizione diversa per tema | il bottone scelto si espande a schermo intero nel suo colore |
| Header/footer fissi | sì, in tutte le fasi |
| Lettere anonime o profilo? | anonime; firma libera facoltativa (default `anonimo`), nessun account |
| Le risposte sono thread pubblici? | sì, pubbliche sotto la lettera |
| Moderazione | pubblicazione immediata (prototipo). Vedi nota sotto |
| Limite caratteri | 1200 per lettera, 600 per risposta, con contatore |
| Amore e paura separate? | separate come archivi, ma si passa da una all'altra quando si vuole |
| Backend o mock? | **prototipo front-end**: le 24 lettere di partenza sono nel file, quelle scritte dal pubblico restano in `localStorage` del device |

### Due cose da valutare prima di una vera messa in mostra

1. **Persistenza.** Ora ogni device vede solo le proprie lettere in aggiunta a
   quelle di partenza: perfetto per la presentazione, ma non è un archivio
   collettivo. Per farlo diventare condiviso servono un database e un endpoint
   (Supabase o Firebase bastano, sono ~40 righe da aggiungere: la struttura dati
   nel file è già quella della spec, `Letter` + `Reply`).
2. **Moderazione.** Nell'archivio "paura" può arrivare materiale delicato. Con
   pubblicazione immediata e senza moderazione, in una mostra pubblica il rischio
   è concreto. Nel form c'è una riga di cura, ma **se il progetto va online
   davvero vale la pena aggiungere il riferimento a un servizio di ascolto reale**
   (es. Telefono Amico) — non l'ho inserito io per non scrivere un numero
   sbagliato: verificalo e mettilo nel testo di `#wCare`.

---

## 4. Cosa cambiare (dove mettere le mani)

Tutto è dentro `index.html`, in sezioni numerate e commentate.

- **Rosso esatto.** In cima al CSS: `--red:#EC1C24`. La spec indicava `#C0392B`
  ma dallo screenshot il rosso è più acceso: ho usato quello. Cambiando quella
  riga cambia tutta l'installazione (l'hex compare 7 volte in tutto il file: CSS, favicon, meta
  theme-color e animazione del bottone — un cerca-e-sostituisci le prende tutte).
- **Archivio della paura invertito.** Ho scelto di ribaltare l'archivio "paura":
  fondo nero, testo chiaro, rosso come unico accento — la stessa installazione a
  due temperature. Se preferisci il fondo bianco anche lì, cancella il blocco CSS
  `body[data-theme="paura"]{…}` (una decina di righe, è segnalato da un commento).
- **Le lettere di partenza.** Sezione `1. DATI` del JS: array `SEEDS`. Le ho
  scritte io come segnaposto — **sostituiscile con testi tuoi o raccolti**, il
  formato è evidente. Le etichette dei due archivi sono nell'oggetto `TAGS`.
- **Font.** `Archivo` (bold da manifesto), `Instrument Serif` italic (sottotitoli
  e firma), `JetBrains Mono` (numeri e micro-etichette), da Google Fonts. Se il
  progetto ha già i suoi font, si sostituisce il `<link>` e le tre variabili
  `--font-*`.
- **Numeri delle lettere.** `001, 002…` assegnati per data di arrivo: la lettera
  numero 1 è la più vecchia dell'archivio, come in uno schedario reale.

## 5. Note tecniche

- Testato in viewport da 360 px a 1280 px, portrait e landscape.
- Tastiera: `Esc` chiude, `←` `→` sfogliano le lettere, tutto raggiungibile con
  `Tab`; i fogli del muro si aprono con `Invio`.
- Rispetta `prefers-reduced-motion`: chi ha le animazioni ridotte nel sistema
  operativo vede il muro senza 3D e senza transizioni lunghe.
- Il testo scritto dal pubblico viene sempre ripulito prima di essere mostrato
  (nessun HTML iniettabile nelle lettere).
- Niente cookie, niente tracciamento, niente chiamate a server esterni: le
  uniche richieste in rete sono i font.

/**
 * POST del cuore — archivio condiviso delle lettere
 * ------------------------------------------------------------------
 * Da incollare in Apps Script (script.google.com), collegato a un
 * Foglio Google con due schede: "lettere" e "risposte".
 * Poi: Distribuisci > Nuova distribuzione > App web
 *      Esegui come: Me   |   Chi ha accesso: Chiunque
 * L'indirizzo che finisce con /exec va incollato in index.html.
 * ------------------------------------------------------------------
 */

/* 1. Incolla qui l'ID del foglio: sta nell'indirizzo del foglio, fra
      /d/ e /edit  ->  docs.google.com/spreadsheets/d/ID_QUI/edit  */
var ID_FOGLIO = 'INCOLLA_QUI_ID_DEL_FOGLIO';

var MAX_CORPO = 1200;
var MAX_RISPOSTA = 600;
var MAX_TITOLO = 60;
var MAX_FIRMA = 24;
var MIN_CORPO = 20;

var COL_LETTERE  = ['id','tema','titolo','corpo','autore','etichetta','creata','visibile'];
var COL_RISPOSTE = ['id','idLettera','corpo','autore','creata','visibile'];

/* ---------- lettura: la pagina chiede tutto l'archivio ---------- */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.openById(ID_FOGLIO);
    var out = { ok: true, lettere: [], risposte: {} };

    leggi(ss, 'lettere', COL_LETTERE).forEach(function (r) {
      if (nascosta(r.visibile) || !r.id || !r.corpo) return;
      out.lettere.push({
        id: String(r.id),
        theme: String(r.tema) === 'paura' ? 'paura' : 'amore',
        title: String(r.titolo || ''),
        body: String(r.corpo),
        author: String(r.autore || 'anonimo'),
        tag: String(r.etichetta || 'senza etichetta'),
        createdAt: quando(r.creata)
      });
    });

    leggi(ss, 'risposte', COL_RISPOSTE).forEach(function (r) {
      if (nascosta(r.visibile) || !r.idLettera || !r.corpo) return;
      var k = String(r.idLettera);
      if (!out.risposte[k]) out.risposte[k] = [];
      out.risposte[k].push({
        id: String(r.id),
        letterId: k,
        body: String(r.corpo),
        author: String(r.autore || 'anonimo'),
        createdAt: quando(r.creata)
      });
    });

    return json(out);
  } catch (err) {
    return json({ ok: false, errore: String(err) });
  }
}

/* ---------- scrittura: la pagina manda una lettera o una risposta ---------- */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(ID_FOGLIO);

    if (d.tipo === 'lettera') {
      var corpo = String(d.body || '').trim().slice(0, MAX_CORPO);
      if (corpo.length < MIN_CORPO) return json({ ok: false, errore: 'lettera troppo corta' });
      var id = 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      foglio(ss, 'lettere', COL_LETTERE).appendRow([
        id,
        String(d.theme) === 'paura' ? 'paura' : 'amore',
        String(d.title || '').trim().slice(0, MAX_TITOLO),
        corpo,
        String(d.author || 'anonimo').trim().slice(0, MAX_FIRMA) || 'anonimo',
        String(d.tag || 'senza etichetta').slice(0, 40),
        new Date().toISOString(),
        true
      ]);
      return json({ ok: true, id: id });
    }

    if (d.tipo === 'risposta') {
      var testo = String(d.body || '').trim().slice(0, MAX_RISPOSTA);
      if (testo.length < 3) return json({ ok: false, errore: 'risposta vuota' });
      if (!d.letterId) return json({ ok: false, errore: 'manca la lettera' });
      var rid = 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      foglio(ss, 'risposte', COL_RISPOSTE).appendRow([
        rid,
        String(d.letterId),
        testo,
        String(d.author || 'anonimo').trim().slice(0, MAX_FIRMA) || 'anonimo',
        new Date().toISOString(),
        true
      ]);
      return json({ ok: true, id: rid });
    }

    return json({ ok: false, errore: 'tipo non riconosciuto' });
  } catch (err) {
    return json({ ok: false, errore: String(err) });
  }
}

/* ---------- utilita ---------- */
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

function foglio(ss, nome, colonne) {
  var sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    sh.appendRow(colonne);
    sh.setFrozenRows(1);
  }
  return sh;
}

function leggi(ss, nome, colonne) {
  var sh = ss.getSheetByName(nome);
  if (!sh) return [];
  var v = sh.getDataRange().getValues();
  if (v.length < 2) return [];
  var testa = v[0].map(function (x) { return String(x).trim(); });
  var righe = [];
  for (var i = 1; i < v.length; i++) {
    var o = {};
    for (var j = 0; j < testa.length; j++) o[testa[j]] = v[i][j];
    righe.push(o);
  }
  return righe;
}

function nascosta(v) {
  if (v === false) return true;
  var t = String(v).trim().toUpperCase();
  return t === 'FALSE' || t === 'NO' || t === 'N';
}

function quando(v) {
  if (v instanceof Date) return v.toISOString();
  var t = String(v || '').trim();
  return t || new Date().toISOString();
}

/* Prova rapida dall'editor: esegui questa funzione e guarda il registro. */
function prova() {
  Logger.log(doGet({}).getContent().slice(0, 400));
}

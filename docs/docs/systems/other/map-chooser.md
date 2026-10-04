---
title: Map Chooser & Rock The Vote (!rtv)
description: Ghidul sistemului democratic de votare si nominalizare a hartilor pe serverele WildFire CS2 — comenzi !rtv, !nominate, !nextmap si reguli.
outline: deep
---

Sistemul **Map Chooser & Rock The Vote (!rtv)** asigura o rotatie variata si 100% democratica a hartilor pe serverul **WildFire.ro**, permitand comunitatii sa nominalizeze si sa voteze in mod direct urmatoarea arena de lupta.

---

> [!NOTE]
> Meniul de vot final se declanseaza automat in ultimele **3 minute** (sau ultimele 2 runde) ale meciului curent, oferind tuturor jucatorilor 30 de secunde pentru a-si exprima optiunea.

---

## 1. Modulele Principale ale Sistemului

Sistemul este alcatuit din 3 componente integrate:

### A. Rock The Vote (`!rtv`)
Daca jucatorii doresc sa schimbe mai devreme harta curenta, comanda `!rtv` permite inregistrarea votului de nemultumire. Odata ce este atins pragul de **60% dintre jucatorii conectati**, serverul declanseaza instantaneu un vot general de schimbare.

### B. Nominalizare Harta (`!nominate`)
Comanda `!nominate` deschide lista completa a hartilor active. Arena aleasa de tine va fi inclusa cu prioritate in lista optiunilor de la votul final.

### C. Meniul Grafic de Vot (End-Match Vote)
Inainte de incheierea meciului, pe ecranul fiecarui jucator apare un meniu numeric cu optiunile nominalizate si harti alese aleatoriu:

![Meniu de Vot Map Chooser](/votemap/mapvote.png)

---

## 2. Tabelul Comenzilor de Vot si Informatii

| Comanda | Sintaxa Oficiala | Descriere & Rol |
| :--- | :--- | :--- |
| `!rtv` | `!rtv` | Adauga votul tau pentru fortarea schimbarii hartii curente |
| `!nominate` | `!nominate` | Deschide lista pentru a propune o harta la urmatorul vot |
| `!nominate` | `!nominate [nume_harta]` | Nominalizeaza direct o harta specifica (ex: `!nominate de_inferno`) |
| `!nextmap` | `!nextmap` | Afiseaza in chat harta stabilita care urmeaza sa se incarce |
| `!timeleft` | `!timeleft` | Afiseaza timpul exact si numarul de runde ramase din harta activa |

---

## 3. Pool-ul de Harti Active

Rotatia oficiala a serverului include atat arenele competitive active din Matchmaking/Premier, cat si harti clasice populare:

* **Competitive Actuale:** `de_mirage`, `de_dust2`, `de_inferno`, `de_nuke`, `de_anubis`, `de_ancient`, `de_vertigo`.
* **Clasice & Comunitate:** `de_cache`, `de_train`, `de_overpass`.

> [!TIP]
> Nu poti nominaliza aceeasi harta daca aceasta a fost jucata recent (sistemul impune o perioada de cooldown de 2 harti pentru a preveni repetitia excesiva a unei singure arene).

---

## Resurse si Sisteme Conexe

<Cards>
  <Card title="Protectie Anti-Rush" href="/docs/systems/other/anti-rush">
    Afla cum sunt protejate zonele critice in primele 30 de secunde pe noile harti.
  </Card>

  <Card title="Echilibrare Automata Echipe" href="/docs/systems/other/teambalance">
    Sistemul de distribuire echitabila a jucatorilor la schimbarea hartii.
  </Card>

  <Card title="Setari Client (!settings)" href="/docs/systems/other/settings">
    Personalizeaza preferintele tale de afisaj si interfata in-game.
  </Card>
</Cards>

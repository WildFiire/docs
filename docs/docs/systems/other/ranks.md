---
title: Sistemul de Rank & ELO Competitiv
description: Ghidul oficial al sistemului de rank-uri CS2 Premier ELO pe serverele WildFire — praguri de punctaj, sezoane lunare, fondul complet de premii si comenzi !rank / !top.
outline: deep
---

Sistemul de **Rank & ELO Competitiv** masoara abilitatea, constanta si performanta fiecarui jucator pe serverul **WildFire.ro**. Folosind un algoritm inspirat din modul oficial CS2 Premier, punctajul tau ELO creste sau scade in functie de contributia directa in meciuri.

Vrem sa rasplatim loialitatea si talentul din comunitatea noastra. In fiecare luna, cei mai buni jucatori sunt recompensati cu premii consistente, atat pentru timpul petrecut pe server, cat si pentru skill-ul demonstrat in lupta.

---

> [!NOTE]
> Punctajul ELO si pozitia ta din clasament se actualizeaza in timp real la finalul fiecarei runde si pot fi inspectate atat in-game, cat si pe [wildfire.ro/dashboard](https://wildfire.ro/dashboard).

---

## 1. Cum se Calculeaza Punctajul ELO

Algoritmul de ranking evalueaza performantele tale dupa urmatorii parametri cheie:

* **Eliminari (Kills) & Headshot-uri:** Castigi puncte ELO pentru fiecare adversar eliminat (cu bonus suplimentar pentru lovituri in cap).
* **Obiective de Meci:** Plantarea sau dezamorsarea bombei C4 aduce un spor important de punctaj.
* **Titluri de MVP:** Desemnarea ca jucatorul rundei ofera cele mai mari bonusuri de ELO.
* **Penalizari:** Decesele repetate fara impact sau actiunile de team-damage pot reduce usor punctajul acumulat.

---

## 2. Ierarhia Gradelor & Pragurile ELO

Iata structura completa a rank-urilor si punctajul Premier necesar pentru fiecare faza de promovare:

| Grad Competitiv | Interval Punctaj ELO | Categorie Skill | Statut Scoreboard |
| :--- | :--- | :--- | :--- |
| **Silver I - IV** | `0 - 4.999 ELO` | Incepator / Baza | Badge Silver |
| **Gold Nova I - Master** | `5.000 - 9.999 ELO` | Mediu / Intermediar | Badge Gold Nova |
| **Master Guardian (MG1 - MGE)** | `10.000 - 17.499 ELO` | Avansat | Badge Master Guardian |
| **Distinguished Master Guardian (DMG)** | `17.500 - 22.499 ELO` | Tactic Superior | Badge DMG |
| **Legendary Eagle (LE / LEM)** | `22.500 - 24.999 ELO` | Elite Competitiv | Badge Eagle |
| **Supreme Master First Class** | `25.000 - 29.999 ELO` | Maestru | Badge Supreme |
| **The Global Elite** | `30.000+ ELO` | Varful Serverului | Badge Global Elite Auriu |

---

## 3. Sezoane Lunare & Premii Oficiale pentru TOP 3

Pentru a asigura o competitie activa si echilibrata, serverul utilizeaza un sistem de **Sezoane Lunare** cu resetare automata in prima zi a fiecarei luni la **ora 00:00**.

### Fondul Oficial de Premii (Clasamentul Lunar pe Skill):

| Pozitie Clasament | Grad VIP Acordat | Recompensa Phoenix Coins | Recompensa Credite In-Game |
| :--- | :--- | :--- | :--- |
| **Locul 1 (Campionul Lunii)** | **VIP Mythic** | **+15.000 PHX Coins** | **+30.000 Credite** |
| **Locul 2 (Vicecampion)** | **VIP Immortal** | **+10.000 PHX Coins** | **+20.000 Credite** |
| **Locul 3** | **VIP Rebirth** | **+5.000 PHX Coins** | **+10.000 Credite** |

---

## 4. Procedura de Revendicare a Premiilor

* **Contactare Staff:** Dupa incheierea lunii, contacteaza un **Server Manager+** pe Discord sau direct pe serverul pe care ai acumulat punctele ELO.
* **Non-Transferabilitate:** Premiile se acorda strict pe serverul pe care a fost inregistrata performanta si nu sunt transferabile catre alte conturi.

> [!WARNING]
> **Redistribuirea Premiilor in Caz de Sanctiune:**  
> Daca un jucator clasat pe primele pozitii refuza premiul, incalca regulamentul sau primeste ban pe server, recompensa este transferata automat catre urmatorul jucator eligibil din clasament (Locul 2 ➔ Locul 3 etc.).

---

## 5. Comenzi Rapide pentru Clasament

* `!rank` — Afiseaza rank-ul tau actual, pozitia in clasament, K/D-ul si punctajul ELO curent.
* `!top` — Deschide meniul grafic cu primii 10 cei mai buni jucatori de pe server.
* `!toptime` — Afiseaza clasamentul jucatorilor cu cele mai multe ore de playtime.
* `!faceitinfo` — Verifica si statisticile tale sincronizate de pe platforma FACEIT.

---

## Resurse si Sisteme Conexe

<Cards>
  <Card title="Integrare FACEIT Badge" href="/docs/systems/other/faceit-badge">
    Afiseaza insigna de nivel FACEIT direct pe tabela de scor din meci.
  </Card>

  <Card title="Sistemul de Misiuni (!missions)" href="/docs/systems/other/missions">
    Indeplineste misiuni zilnice si saptamanale pentru a castiga Phoenix Coins suplimentari.
  </Card>

  <Card title="Pachete si Beneficii VIP" href="/docs/market/vip/rebirth">
    Descopera facilitatile incluse in pachetele acordate ca premiu pentru Top 3.
  </Card>
</Cards>


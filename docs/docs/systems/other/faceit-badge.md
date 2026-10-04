---
title: Integrare FACEIT Badge & Statistici
description: Ghidul oficial al sistemului de afisare a nivelului FACEIT in tabela de scor (TAB) si comenzi de statistici !faceitinfo pe serverele WildFire CS2.
outline: deep
---

Sistemul **FACEIT Badge** recompenseaza jucatorii cu experienta competitiva, sincronizand automat profilul tau oficial de FACEIT si afisand insigna de nivel (Level 1-10) direct in tabela de scor (**TAB**) si in chat-ul serverului **WildFire.ro**.

---

> [!NOTE]
> Sistemul realizeaza interogari automate securizate prin API-ul oficial FACEIT pe baza contului tau de Steam conectat.

---

## 1. Cum Functioneaza Afisarea Insignei in Scoreboard

Sistemul inlocuieste pin-ul clasic de tara (country badge) din dreptul numelui tau cu insigna oficiala a nivelului tau curent de pe platforma FACEIT:

* **Prag Minim de Activare:** Pentru afisarea automata a badge-ului in Scoreboard este necesar un nivel de minim **Level 6 FACEIT** (sau ELO echivalent).
* **Afisare Implicita (Fallback):** Jucatorii care au un nivel sub 6 sau care nu au contul legat vor afisa in continuare steagul tarii de provenienta.
* **Vizibilitate Globala:** Insigna este vizibila pentru toti participantii la meci si spectatori in meniul TAB.

---

## 2. Comenzi Disponibile pe Server

| Comanda | Sintaxa Oficiala | Descriere & Rol |
| :--- | :--- | :--- |
| `!faceitinfo` | `!faceitinfo` | Afiseaza in chat nivelul tau curent, punctajul exact de ELO, K/D-ul si rata de castig |
| `!faceitinfo` | `!faceitinfo [jucator]` | Inspecteaza statisticile de FACEIT ale unui alt jucator conectat |
| `!faceitlevel` | `!faceitlevel` | Activeaza sau dezactiveaza afisarea insignei de FACEIT in TAB (necesita min. Level 6) |

---

## 3. Matricea Nivelurilor si Punctajului ELO FACEIT

Iata corespondenta orientativa a insignei afisate in functie de punctajul tau ELO:

| Nivel FACEIT | Interval ELO | Tip Insigna | Statut Afisare in TAB |
| :--- | :--- | :--- | :--- |
| **Level 10 (Challenger)** | 2.001+ ELO | Badge Rosu Aprins | Activ Automat |
| **Level 9** | 1.751 - 2.000 ELO | Badge Portocaliu Intens | Activ Automat |
| **Level 8** | 1.531 - 1.750 ELO | Badge Portocaliu Deschis | Activ Automat |
| **Level 7** | 1.351 - 1.530 ELO | Badge Galben-Portocaliu | Activ Automat |
| **Level 6** | 1.201 - 1.350 ELO | Badge Galben | Activ Automat (Prag Minim) |
| **Level 1 - 5** | 1 - 1.200 ELO | Badge Standard | Country Pin / Afisare la Cerere |

---

## 4. Cerinte Tehnice pentru Sincronizare

> [!IMPORTANT]
> **Profil Public pe Steam:**  
> Pentru ca serverul sa poata prelua automat nivelul si ELO-ul tau, asigura-te ca profilul tau de Steam este setat pe **Public** si ca ai jucat cel putin un meci oficial pe platforma FACEIT asociat aceluiasi SteamID.

---

## Resurse si Sisteme Conexe

<Cards>
  <Card title="Sistemul de Rank & ELO" href="/docs/systems/other/ranks">
    Descopera si clasamentul intern al serverului de CS2 cu punctaj ELO si comanda !rank.
  </Card>

  <Card title="Statutul Gold Member" href="/docs/systems/other/gold-member">
    Pachetul exclusiv pentru jucatorii dedicati comunitatii noastre.
  </Card>

  <Card title="Setari Client (!settings)" href="/docs/systems/other/settings">
    Configureaza preferintele tale de afisaj si interfata in-game.
  </Card>
</Cards>

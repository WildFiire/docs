---
title: Modulul C4 Planter & Timer HUD
description: Interfata dinamica in-game la amorsarea bombei — afisare jucator planter, cronometru explozie, status bombsite si bara de dezamorsare.
outline: deep
---

Modulul **C4 Planter HUD** este o imbunatatire tactica de interfata dezvoltata pentru serverul **WildFire.ro**, conceputa pentru a oferi ambelor echipe informatii esentiale si precise in momentul in care bomba C4 a fost amorsata.

---

> [!NOTE]
> Interfata vizuala este complet non-intruziva, optimizata pentru a nu bloca campul vizual (crosshair-ul) si este sincronizata milisecunda cu milisecunda cu serverul de joc.

---

## 1. Elementele Interfetei Vizuale HUD

In momentul in care bomba este plantata cu succes, pe ecranul tuturor jucatorilor activi si spectatorilor apare automat panoul dedicat de stare:

![C4 Planted HUD Interface](/c4system/plantbomb.png)

Panoul afiseaza in timp real:

* **Planter:** Nickname-ul jucatorului din echipa Terrorist care a finalizat plantarea.
* **Bombsite Identificat:** Locatia exacta a tintei amorsate (**Site A** sau **Site B**).
* **C4 Countdown Timer:** Numaratoarea inversa dinamica pana la detonarea explozibilului (40 de secunde).
* **Defuse Progress Bar:** In momentul in care un jucator CT incepe dezamorsarea, apare o bara de progres vizuala care indica procentajul completat.

---

## 2. Timpi Critici de Retake & Dezamorsare

Interfata C4 Planter te ajuta sa iei decizii rapide in fazele tensionate de final de runda (Clutch / Retake):

| Situatie de Joc | Timp Necesar | Recomandare Tactică |
| :--- | :--- | :--- |
| **Dezamorsare CU Defuse Kit** | **5.0 Secunde** | Poti incepe defuse-ul chiar daca pe timer au ramas ~6 secunde |
| **Dezamorsare FARA Defuse Kit** | **10.0 Secunde** | Daca timerul scade sub 10 secunde, retake-ul devine imposibil (Save) |
| **Timp Total Armare - Explozie** | **40.0 Secunde** | Fereastra totala acordata echipei CT pentru organizarea retake-ului |

---

## 3. Recompense Economice si Puncte ELO

Actiunile legate de bomba C4 sunt rasplatite atat in economia in-game, cat si in clasamentul competitiv:

* **Plantare Bomba:** Jucatorul care planteaza primeste **+300$ in-game**, **+2 Puncte ELO** in clasamentul `!rank` si un bonus de **Credite**.
* **Dezamorsare Reusita (Defuse):** Jucatorul care dezamorseaza primeste **+300$ in-game**, **+3 Puncte ELO** si titlul de runda.

---

## Resurse si Sisteme Conexe

<Cards>
  <Card title="Sistemul de Rank & ELO" href="/docs/systems/other/ranks">
    Afla cum influenteaza actiunile de meci punctajul tau in clasamentul oficial !top.
  </Card>

  <Card title="Protectie Anti-Rush" href="/docs/systems/other/anti-rush">
    Mecanica defensiva de 30 secunde pentru mentinerea echilibrului la inceput de runda.
  </Card>

  <Card title="Setari Client (!settings)" href="/docs/systems/other/settings">
    Personalizeaza elementele audio si vizuale ale interfetei de joc.
  </Card>
</Cards>

### test
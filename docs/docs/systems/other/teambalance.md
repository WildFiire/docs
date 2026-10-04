---
title: Sistemul de Echilibrare Echipe (Team Balance & Scramble)
description: Mecanica de echilibrare a echipelor pe baza de skill (ELO) si numar de jucatori pe serverul WildFire CS2 — fara half-time, cu sistem inteligent de Scramble.
outline: deep
---

Sistemul de **Team Balance & Scramble** de pe serverul **WildFire.ro** asigura o experienta de joc distractiva, corecta si competitiva pentru toti participantii, prevenind situatiile in care toti jucatorii cu experienta sau ELO ridicat se aduna intr-o singura echipa pentru a domina meciul.

---

> [!IMPORTANT]
> **Fara Inversare de Half-Time:**  
> Spre deosebire de meciurile clasice de Premier sau FACEIT, pe serverul nostru nu se face schimb complet de echipe la jumatatea meciului (half-game). Meciul continua fluid, iar echilibrarea se realizeaza automat prin **Skill Scramble** si **Numeric Auto-Swap**.

---

## 1. Cum Functioneaza Sistemul de Skill Scramble

Pentru a mentine meciurile antrenante si pline de suspans:

* **Analiza Automata de ELO & Scor:** Serverul monitorizeaza constant raportul de forte dintre echipe pe baza punctajelor din clasamentul `!rank` si a performantelor din meciul curent.
* **Redistribuire Echitabila (Scramble):** In cazul in care o echipa domina zdrobitor meciul sau exista o diferenta coplesitoare de skill, sistemul efectueaza un **Scramble inteligent** la inceputul rundei urmatoare, impartind jucatorii de top in mod egal intre echipa Terrorist si Counter-Terrorist.
* **Continuitate:** Economia si statisticile meciului raman conservate pentru o tranzitie lina.

---

## 2. Echilibrarea Numerica Automata (Auto-Swap)

Daca mai multi jucatori parasesc serverul sau se deconecteaza, lasand echipele inegale numeric (de exemplu: `12 CT vs 7 T`):

* **Detectie la Final de Runda:** Serverul calculeaza diferenta de membri activi. Daca diferenta este de **2 sau mai multi jucatori**, sistemul intervine automat.
* **Selectie Corecta:** Ultimul jucator conectat sau jucatorul care nu a fost mutat recent va fi transferat automat in echipa aflata in inferioritate numerica.
* **Notificare pe Ecran:** Jucatorul mutat primeste un mesaj de informare in chat si pe ecran, fiind compensat cu fonduri in-game pentru a-si putea cumpara echipament.

---

## 3. Tabelul Situatiilor de Interventie

| Situatie Detectata | Actiune Automata a Serverului | Momentul Declanșării |
| :--- | :--- | :--- |
| **Diferenta mare de Skill / ELO** | **Skill Scramble:** Rebalansarea jucatorilor cu rank ridicat | La inceputul rundei urmatoare |
| **Diferenta Numerica (>= 2 Jucatori)** | **Numeric Auto-Swap:** Mutarea ultimului jucator conectat | In timpul freezetime-ului |
| **Jucator Nou Conectat** | **Auto-Assign:** Directionare obligatorie in echipa mai mica | La selectarea echipei |

---

## Resurse si Sisteme Conexe

<Cards>
  <Card title="Sistemul de Rank & ELO" href="/docs/systems/other/ranks">
    Afla cum influenteaza performantele individuale punctajul tau si algoritmul de scramble.
  </Card>

  <Card title="Protectie Anti-Rush" href="/docs/systems/other/anti-rush">
    Mecanica de protectie tactica in primele 30 de secunde pe noile harti.
  </Card>

  <Card title="Map Chooser & RTV (!rtv)" href="/docs/systems/other/map-chooser">
    Sistemul democratic de votare a urmatoarei harti de meci.
  </Card>
</Cards>

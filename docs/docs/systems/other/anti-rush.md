---
title: Sistemul Anti-Rush (CT Protection)
description: Mecanica de protectie tactica si bariere temporare de 30 secunde pentru echilibrarea rundelor pe serverele WildFire CS2.
outline: deep
---

Sistemul **Anti-Rush** este un modul de echilibrare tactica dezvoltat pentru serverul **WildFire.ro**, conceput pentru a preveni rush-ul agresiv prematur al echipei Counter-Terrorist (CT) in primele secunde ale rundei si pentru a permite echipei Terrorist (T) sa se pozitioneze strategic pe harta.

---

> [!NOTE]
> Sistemul se activeaza automat in mod dinamic pe server atunci cand numarul de participanti conectati depaseste pragul de **25 de jucatori**.

---

## 1. Cum Functioneaza Protectia Anti-Rush

In primele momente ale fiecarei runde, jocul impune o serie de bariere de delimitare invizibile in punctele critice de trecere:

* **Durata de Protectie:** Barierele raman active timp de exact **30 de secunde** de la inceperea rundei.
* **Bariere Fizice Invizibile:** Jucatorii CT care incearca sa inainteze dincolo de linia defensiva sunt blocati fizic pe loc.
* **Dezactivare Automata:** Dupa scurgerea celor 30 de secunde, barierele dispar instantaneu, permitand avansul si confruntarea libera pe toata suprafata hartii.

---

## 2. Notificari si Avertismente In-Game

Daca un membru al echipei CT se apropie sau atinge o zona restrictionata in timpul perioadei active, serverul genereaza automat mesaje de avertizare:

```text
[Anti-Rush] Protectia este activa! Zonele restrictionate sunt blocate pentru 30 secunde.
[Anti-Rush] Te afli intr-o zona interzisa! Retrage-te imediat!
```

---

## 3. Harti Suportate si Puncte de Protectie

Sistemul este configurat pe toate hartile competitive majore unde rush-ul CT imediat ar putea compromite desfasurarea normala a rundei:

| Harta CS2 | Zone Restrictionate CT (Primele 30s) | Scop Tactic |
| :--- | :--- | :--- |
| **de_mirage** | Apartamente B, Palat A, Rampe Mid | Ofera echipei T timp pentru executarea smoke-urilor pe A |
| **de_dust2** | Tunel B (Upper), Lung A (Pit Cross), Mid Doors | Previne prinderea echipei T inainte de iesirea din baza |
| **de_inferno** | Banana (Car), Boiler, Apartamente | Previne push-ul direct in spawn-ul T |
| **de_anubis** | Canal / Pod B, Mid Main | Asigura controlul initial pe canale |
| **de_ancient** | B Main, Cave, Rampe Mid | Previne preluarea imediata a spatiului de manevra |

---

## 4. Reguli & Sanctiuni pentru Exploatare

> [!WARNING]
> **Interdictie Abuz Double Jump sau Glitch-uri de Skybox:**  
> Este strict interzisa saritura peste barierele de anti-rush folosind beneficiul VIP de Double Jump sau texturile de coliziune ale hartii.  
> * **Prima Abatere:** `SLAY`  
> * **Recidiva:** `WARN VIP` ➔ `REMOVE VIP` / `BAN 120 MIN`.

---

## Resurse si Sisteme Conexe

<Cards>
  <Card title="Regulament Membri VIP" href="/docs/informatii/regulamente/regulament-vip-go">
    Consulta normele oficiale privind utilizarea permisa a beneficiului de Double Jump.
  </Card>

  <Card title="Echilibrare Automata (Team Balance)" href="/docs/systems/other/teambalance">
    Afla cum mentine serverul paritatea numerica si echilibrul intre echipe.
  </Card>

  <Card title="Hide Teammates (!ht)" href="/docs/systems/other/hide-teammates">
    Optimizarea vizibilitatii si a fluiditatii cadrelor la pornirea din spawn.
  </Card>
</Cards>

---
title: Optimizare Hide Teammates (!ht)
description: Ghidul comenzii !ht pentru ascunderea coechipierilor la spawn — crestere de FPS, eliminarea blocajelor vizuale si salvare automata.
outline: deep
---

Modulul **Hide Teammates (`!ht`)** este un instrument avansat de optimizare a performantei dezvoltat pentru serverul **WildFire.ro**. Acesta permite ascunderea dinamica sau transparentizarea modelelor 3D ale coechipierilor aflati in imediata apropiere, oferind o claritate vizuala perfecta si eliminand scaderile de cadre (framerate drops).

---

> [!NOTE]
> Setarea aleasa se salveaza automat in baza de date pe baza SteamID-ului tau si va ramane activa la fiecare reconectare pe server.

---

## 1. Beneficiile Cheie ale Modului `!ht`

Activarea optiunii Hide Teammates aduce avantaje majore atat pentru performanta tehnica a PC-ului, cat si pentru reflexele in-game:

* **FPS Boost Consistent:** Randarea a 10-15 modele de agenti simultan in campul tau vizual la spawn consuma resurse GPU/CPU. `!ht` reduce draw calls-urile si stabilizeaza cadrele pe secunda.
* **Linie de Tragere Fara Obstacole:** Niciun coechipier nu iti mai acopera vizorul (crosshair-ul) sau traiectoria cand tii un unghi strans cu AWP-ul sau arunci un grenade lineup.
* **Fluiditate la Spawn:** Previne situatiile aglomerate in care jucatorii se blocheaza reciproc in usile inguste (ex: Mid Doors pe Dust2 sau Apartamente pe Mirage).

---

## 2. Tabelul Modurilor de Functionare

| Mod de Lucru | Comanda Chat | Comportament Modele Coechipieri | Recomandat Pentru |
| :--- | :--- | :--- | :--- |
| **Hide Teammates Activ** | `!ht` | Modelele coechipierilor din proximitate devin complet invizibile / transparente | Meciuri aglomerate, PC-uri mid/low-end |
| **Hide Teammates Dezactivat** | `!ht` | Toate modelele 3D sunt randate normal la dimensiune completa | Joc casual sau spectator |

---

## 3. Comenzi Rapide

* `!ht` — Comuta instantaneu intre modul activ (ON) si inactiv (OFF).
* `!settings` — Deschide panoul central de preferinte unde poti ajusta si alte optiuni vizuale (hit effects, sound-uri).

> [!TIP]
> Pentru performanta maxima pe CS2, este recomandat sa combini comanda `!ht` cu dezactivarea efectelor audio neesentiale din meniul `!settings`.

---

## Resurse si Sisteme Conexe

<Cards>
  <Card title="Protectie Anti-Rush" href="/docs/systems/other/anti-rush">
    Afla cum functioneaza barierele temporare de siguranta in primele 30 de secunde.
  </Card>

  <Card title="Setari Client (!settings)" href="/docs/systems/other/settings">
    Personalizeaza preferintele tale de afisaj, sunete si notificari.
  </Card>

  <Card title="Hit Effects & Feedback Daune" href="/docs/systems/other/hit-effect">
    Efecte vizuale configurabile pentru confirmarea loviturilor reusite.
  </Card>
</Cards>

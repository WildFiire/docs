---
title: Panoul de Setari Client (!settings)
description: Ghidul complet al panoului de configurare client pe serverele WildFire CS2 — comenzi !settings, preferinte vizuale, control audio si salvare automata.
outline: deep
---

Panoul **Client Settings (`!settings`)** este centrul de control personalizat de pe serverul **WildFire.ro**, conceput pentru a permite fiecarui jucator sa isi configureze in detaliu experienta audio si vizuala in functie de stilul sau de joc si performanta PC-ului.

---

> [!NOTE]
> Toate preferintele modificate in meniul `!settings` se salveaza instantaneu in baza de date pe baza SteamID-ului tau si raman active la fiecare reconectare pe server.

---

## 1. Meniul Principal de Navigare

Tasteaza comanda `!settings` in chat pentru a deschide interfata grafica de configurare:

![Meniul Principal de Setari](/settings/settings1.png)

Meniul este structurat in doua mari categorii de personalizare:
* **Visual Settings:** Elemente de interfata grafica, overlay-uri si efecte vizuale.
* **Audio & Sound Settings:** Volumul si activarea/dezactivarea sunetelor custom.

---

## 2. Optiuni de Configurare Vizuala

In sectiunea de setari vizuale poti personaliza elementele afisate pe ecran in timpul meciului:

![Setari Vizuale In-Game](/settings/settings2.png)

* **HitMarker & Damage UI:** Activeaza sau dezactiveaza pictogramele de confirmare a loviturilor.
* **C4 HUD Overlay:** Activeaza sau ascunde panoul dinamic de amorsare a bombei.
* **Tracers & Smoke Effects:** Controleaza redarea traiectoriilor luminoase ale gloantelor trase de tine sau de alti jucatori.

---

## 3. Optiuni de Configurare Audio & Sunete Custom

Sectiunea sonora iti ofera control granular asupra fiecarui modul audio de pe server:

![Setari Sonore Partea 1](/settings/settings3.png)

![Setari Sonore Partea 2](/settings/settings4.png)

### Tabelul Optiunilor Audio Disponibile:

| Modul Audio | Optiune de Control | Descriere & Rol |
| :--- | :--- | :--- |
| **Master Sound Toggle** | `ON / OFF` | Comutator general pentru toate sunetele custom de pe server |
| **MVP Anthems** | `ON / OFF / Slider Volum` | Activeaza sau opreste melodiile redate la finalul rundei |
| **Private Messages (!pm)** | `ON / OFF` | Semnal sonor discret la primirea unui mesaj privat |
| **Mentions Alerts (@Nume)** | `ON / OFF` | Alerta audio cand un jucator iti tasteaza numele in chat |
| **Casino / Gambling Sounds** | `ON / OFF` | Efectele sonore specifice aparatelor de Ruleta si Slots |
| **Sank Sounds (!sm)** | `ON / OFF` | Sunetele distractive declansate prin comanda `!sm` |

---

## 4. Comenzi Rapide

* `!settings` — Deschide panoul grafic principal de configurare.
* `!ht` — Comanda rapida pentru activarea modului Hide Teammates (Boost FPS).
* `!mvp` — Selectorul direct de melodii MVP Anthem.

> [!TIP]
> Daca joci meciuri competitive tensionate si doresti concentrare maxima pe sunetul pasilor inamicilor, poti trece comutatorul **Master Sound** pe **OFF** cu un singur click.

---

## Resurse si Sisteme Conexe

<Cards>
  <Card title="Hide Teammates (!ht)" href="/docs/systems/other/hide-teammates">
    Ascunde modelele coechipierilor la spawn pentru transparenta totala si FPS crescut.
  </Card>

  <Card title="Melodii MVP Anthem (!mvp)" href="/docs/systems/other/mvp">
    Alege melodia preferata care va rula pentru tot serverul cand castigi runda.
  </Card>

  <Card title="Sistemul de Mentiuni (@Nume)" href="/docs/systems/other/mention-system">
    Afla cum functioneaza notificarile cu tag in caseta de chat.
  </Card>
</Cards>

---
title: Sistemul WeaponSkins & Inventar In-Game (!ws)
description: Ghidul complet al sistemului WeaponSkins CS2 — cumparare skin-uri, cutite, manusi, agenti, stickere, float/StatTrak si deschidere cutii !cases.
outline: deep
---

Modulul **WeaponSkins (`!ws`)** este cel mai avansat sistem de personalizare a arsenalului dezvoltat pentru serverul **WildFire.ro**, oferind jucatorilor acces complet la mii de finisaje de arme, modele de cutite, manusi, agenti T/CT, stickere si brelocuri (keychains) animate direct in motorul grafic din Counter-Strike 2.

---

> [!IMPORTANT]
> **Arhitectura Centralizata !ws:**  
> Pe serverul nostru, toate optiunile de **Cutite**, **Manusi**, **Agenti** si **Weapon Skins** sunt accesate centralizat exclusiv prin comanda principala **`!ws`** si inventarul personal **`!inv`**. Nu exista comenzi separate de tip `!knife` sau `!glove`.

---

## 1. Cum Incepem — Structura Meniului `!ws`

Tasteaza comanda `!ws` in chat pentru a deschide interfata principala. Sistemul este impartit in 3 mari sectiuni intuitive:

* **Shop (Magazin):** Cumperi finisaje de arme, cutite, manusi, agenti, stickere si accesorii folosind Phoenix Coins.
* **My Inventory (Inventar):** Gestionezi colectia personala de iteme deblocate si le echipezi instantaneu pe echipamentul activ.
* **Profile (Statistici):** Verifici balanta curenta, totalul de monede investite si cel mai valoros skin din colectie.

---

## 2. Magazinul Dinamic (Shop & Economie)

Sistemul de shop din `!ws` este conectat la o piata dinamica inspirata din Steam Community Market:

### 2.1 Preturi Dinamice & Oferte Speciale
* **Statut HOT:** Cand un skin sau cutit este cumparat frecvent de multi jucatori, pretul acestuia poate creste usor in functie de cerere.
* **Statut STEAL (Reducere):** Itemele mai putin cautate primesc reduceri semnificative automate, devenind oportunitati excelente de achizitie.
* **Campanii Globale:** Periodic, serverul activeaza reduceri tematice pe categorii intregi (ex: `-10% la toate cutitele`).

### 2.2 Sistemul de Stocuri (Rare & Sold Out)
* **Piese Rare:** Anumite finisaje exclusiviste au stoc limitat (afisat in meniu cu indicatorul `X Left`).
* **Sold Out:** La epuizarea stocului, itemul nu mai poate fi cumparat pana la urmatorul eveniment de restock.
* **Nelimitat:** Finisajele comune raman disponibile permanent.

### 2.3 Confirmarea Securizata a Achizitiei
Inainte de a cheltui monedele, meniul iti afiseaza un ecran detaliat de confirmare: numele exact al skin-ului, pretul final cu reducerile aplicate, stocul ramas si balanta ramasa dupa tranzactie.

---

## 3. Inventarul Personal (`!inv`) & Proprietati Avansate

Dupa achizitie, itemele se echipeaza instantaneu si raman salvate permanent pe contul tau. Poti gestiona inventarul atat in timpul meciului, cat si de pe site:

* **In Joc:** Foloseste `!inv` sau `!ws` pentru a naviga prin colectia de skin-uri si a schimba combinatiile.
* **Pe Site:** Acceseaza [wildfire.ro/skins-market](https://wildfire.ro) ➔ **Inventory** pentru a configura loadout-ul direct din browser.

![Meniul Inventar In-Game](/utility/inventory.png)

![Inventar Complet pe Site](/utility/gif_inventory.gif)

![Configurare Loadout din Browser](/utility/gif_loadout.gif)

### Personalizarea Proprietatilor (Float, Seed & StatTrak™)
Din inventar poti ajusta proprietatile tehnice ale fiecarui skin:
* **Float / Wear:** Alege gradul de uzura dorit (Factory New, Minimal Wear, Field-Tested, Well-Worn, Battle-Scarred).
* **Pattern Seed:** Seteaza pattern-ul numeric specific pentru skin-uri de tip Case Hardened (Blue Gem), Fade sau Doppler.
* **Nametag Custom:** Adauga un nume personalizat gravat pe placutele armelor sau cutitelor.
* **StatTrak™ Counter:** Activeaza contorul dinamic de eliminari pentru urmarirea progresului in meciuri.

---

## 4. Modulele Ecosistemului WeaponSkins

Fiecare categorie majora de cosmetice beneficiaza de un catalog extins si un ghid dedicat:

### 4.1 Modele si Finisaje de Cutite (Knives)
Toate modelele iconice (Karambit, Butterfly Knife, M9 Bayonet, Skeleton, Talon, Huntsman etc.) sunt deblocate si echipabile direct din meniul `!ws`.

![Previzualizare Cutite](/knives/gif_knives_1.gif)

➔ [Consulta Ghidul Complet al Cutitelor](/docs/systems/skins/knives)

### 4.2 Modele si Finisaje de Manusi (Gloves)
Alege combinatia perfecta de manusi Sport, Driver, Specialist, Moto sau Hand Wraps pentru a se asorta cu finisajul cutitului tau.

![Previzualizare Manusi](/gloves/gif_gloves_1.gif)

➔ [Consulta Ghidul Complet al Manusilor](/docs/systems/skins/gloves)

### 4.3 Skin-uri de Agenti (T & CT)
Personalizeaza aspectul caracterului tau pentru ambele echipe alegand din lista completa de agenti speciali CS2.

![Previzualizare Agenti](/agents/gif_agents_1.gif)

➔ [Consulta Ghidul Complet al Agentilor](/docs/systems/skins/agents)

### 4.4 Deschidere Cutii Animate (!cases)
Deschide lazi interactive direct in timpul meciului cu sanse de drop rar de cutite, manusi si skin-uri de elita.

![Previzualizare Cutii](/crates/cases_gif.gif)

➔ [Consulta Ghidul Complet al Cutiilor](/docs/systems/skins/cases)

---

## 5. Tabelul Comenzilor Oficiale

| Comanda | Sintaxa Oficiala | Descriere & Rol |
| :--- | :--- | :--- |
| `!ws` | `!ws` | Deschide interfata centrala WeaponSkins (Arme, Cutite, Manusi, Agenti, Stickere) |
| `!inv` | `!inv` | Deschide inventarul personal in-game cu toate itemele si skin-urile salvate |
| `!cases` | `!cases` | Deschide meniul de lazi animate cu skin-uri si sanse de drop rar |
| `!missions` | `!missions` | Deschide panoul de misiuni active pentru castigarea de Phoenix Coins gratuit |
| `!eco` | `!eco` | Verifica soldul tau curent de Phoenix Coins (PHX) si Credite |
| `!eco pay` | `!eco pay [jucator] [suma] phoenix_coins` | Transfera monede PHX catre un alt jucator de pe server |

---

## Resurse si Ghiduri Conexe

<Cards>
  <Card title="Deschidere Cutii In-Game (!cases)" href="/docs/systems/skins/cases">
    Ghidul complet al lazilor animate, sanselor de drop rar si deschiderilor in timpul meciului.
  </Card>

  <Card title="Modele si Finisaje de Cutite" href="/docs/systems/skins/knives">
    Catalogul complet al cutitelor (Karambit, Butterfly, M9 Bayonet, Skeleton, Talon etc.) accesibile din !ws.
  </Card>

  <Card title="Modele si Finisaje de Manusi" href="/docs/systems/skins/gloves">
    Colectia completa de manusi Sport, Driver, Specialist, Moto si Hand Wraps din meniul !ws.
  </Card>

  <Card title="Skin-uri de Agenti (T & CT)" href="/docs/systems/skins/agents">
    Personalizarea personajelor pentru ambele tabere direct din interfata !ws.
  </Card>

  <Card title="Ghidul Phoenix Coins (PHX)" href="/docs/currency/phoenixcoins">
    Moneda premium dedicata deblocarii permanente a skin-urilor si accesoriilor.
  </Card>
</Cards>

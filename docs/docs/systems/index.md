---
title: Sisteme & Functionalitati de Joc
description: Prezentarea integrala a arhitecturii custom CS2 dezvoltate pentru WildFire.ro — WeaponSkins, Casino, In-Game Shop si Utilitati de Meci.
outline: deep
---

Serverul **WildFire.ro** ruleaza o suita extinsa de module si sisteme custom concepute exclusiv pentru a oferi o experienta de Counter-Strike 2 captivanta, competitiva si complet personalizabila.

---

> [!NOTE]
> Toate sistemele noastre sunt optimizate pentru tickrate stabil si performanta maxima in-game, fara a cauza scaderi de FPS sau intarzieri de retea.

---

## Categoriile Majore de Sisteme

Exploreaza documentatia detaliata pentru fiecare categorie:

<Cards>
  <Card title="Sistemul WeaponSkins (!ws)" href="/docs/systems/skins">
    Meniul central de personalizare: echipeaza orice skin de arma, cutit, manusi, agenti si cutii animate.
  </Card>

  <Card title="Casino & Gambling In-Game" href="/docs/systems/gambling/roulette">
    Mese de pariuri interactive pe Credite si Phoenix Coins: Ruleta (!rl), Slots (!sl) si Barbut (!bb).
  </Card>

  <Card title="Magazin In-Game (!shop)" href="/docs/systems/shop/chat-tags">
    Cosmetice pentru chat: Custom Tags, culori de nume si mesaje, weapon tracers si fumigene colorate.
  </Card>

  <Card title="Utilitati & Modul de Meci" href="/docs/systems/other/ranks">
    Sistemul competitiv de Rank & ELO, MVP Anthems, Hide Teammates (!ht), Rock The Vote (!rtv) si echilibrare.
  </Card>
</Cards>

---

## Tabel Sinoptic al Modulelor si Comenzilor

Iata o sinteza rapida a comenzilor esentiale grupate pe module:

| Modul de Joc | Comenzi Principale | Destinatie & Functionalitate |
| :--- | :--- | :--- |
| **WeaponSkins** | `!ws`, `!inv`, `!cases` | Personalizare arme, cutite, manusi, inspectare inventar si lazi |
| **Casino / Gambling** | `!rl`, `!sl`, `!bb [suma]` | Pariuri la Ruleta, aparate de Slots si meciuri de Barbut 1v1 |
| **Cosmetics Shop** | `!shop`, `!settag` | Magazinul de culori chat, tag-uri personalizate si tracers |
| **Economie & Transfer** | `!eco`, `!eco pay [jucator] [suma] [moneda]` | Verificare balante si transfer securizat de fonduri |
| **Misiuni & Progres** | `!missions`, `!battlepass`, `!rank` | Misiuni zilnice pentru PHX, progresie sezoniera si rank ELO |
| **Optimizare & Sunete** | `!ht`, `!mvp`, `!sm`, `!settings` | Ascundere coechipieri (FPS boost), MVP Anthems, Sank Sounds |
| **Control Meci** | `!rtv`, `!pm [jucator] [mesaj]` | Votare schimbare harta (Rock The Vote) si mesaje private |

---

## Caracteristici de Top ale Serverului

* **Sincronizare Cloud & Inventar Web:** Toate skin-urile si punctele tale se salveaza instant si pot fi inspectate pe [Dashboard](https://wildfire.ro/dashboard).
* **Economie Circulara:** Castiga credite prin simplul fapt ca joci, indeplineste misiuni pentru Phoenix Coins si bucura-te de drop-uri speciale de MVP.
* **Optimizare Competitiva:** Comanda `!ht` (Hide Teammates) iti permite sa ascunzi modelele coechipierilor la spawn pentru transparenta si maximum de FPS in fazele aglomerate.

> [!TIP]
> Pentru a afla cum functioneaza economia duala a serverului si cum poti transfera valuta altor colegi, consulta [Ghidul de Currency](/docs/currency).

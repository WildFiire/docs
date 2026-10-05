---
title: Comenzi Administrative Staff
description: >-
  Lista completa a tuturor comenzilor administrative pe serverul WildFire CS2,
  cu sintaxa exacta si nivelul de acces configurat pe fiecare grad.
outline: deep
gitLastCommitter: Yakuza2377
lastUpdatedBy: Yakuza
author: Yakuza2377
uploadedBy: Yakuza2377
lastUpdated: 1791221788387
---

Aceste comenzi sunt destinate exclusiv membrilor echipei administrative **WildFire.ro**. Utilizarea comenzilor se face strict in scopul mentinerii ordinii si aplicarii regulamentului oficial.

---

> [!IMPORTANT]
> **Motive Clare si Profesionale Obligatorii:**  
> La executarea oricarei comenzi de sanctiune (`!ban`, `!mute`, `!gag`, `!silence`), parametrul `[motiv]` trebuie completat explicit cu fapta comisa (ex: `Limbaj vulgar repetat`, `wallhack/aimhack`, `Spam chat`). Motivele ironice sau la misto atrag sanctionarea administrativa (`WARN STAFF`).

---

## 1. Tabelul Complet al Comenzilor Administrative

Iata lista oficiala si integrala a comenzilor administrative disponibile pe server:

| Comanda | Sintaxa de Executie | Descriere & Rol | Grad Minim |
| :--- | :--- | :--- | :--- |
| `!admin` | `!admin` | Deschide meniul grafic principal de administrare pe ecran | **Helper** |
| `!spec` | `!spec [jucator]` | Muta un jucator direct in modul Spectator (pentru verificari) | **Helper** |
| `!kick` | `!kick [jucator]` | Deconecteaza fortat un jucator de pe server | **Helper** |
| `!gag` | `!gag [jucator] [timp] [motiv]` | Restrictioneaza chat-ul scris al unui jucator (max. 60m) | **Helper** |
| `!ungag` | `!ungag [jucator]` | Elimina restrictia de chat scris a unui jucator | **Helper** |
| `!mute` | `!mute [jucator] [timp] [motiv]` | Blocheaza comunicarea audio prin microfon (max. 60m) | **Helper** |
| `!unmute` | `!unmute [jucator]` | Deblocheaza comunicarea audio a jucatorului | **Helper** |
| `!silence` | `!silence [jucator] [timp] [motiv]` | Restrictioneaza simultan atat chat-ul scris, cat si microfonul (max. 60m) | **Helper** |
| `!unsilence` | `!unsilence [jucator]` | Elimina sanctiunea completa de silence a jucatorului | **Helper** |
| `!slay` | `!slay [jucator]` | Elimina instantaneu un jucator in runda curenta (AFK / Bomb Grief) | **Helper** |
| `!slap` | `!slap [jucator] [dmg]` | Loveste un jucator aplicand daune (pentru deblocare din pereti) | **Helper** |
| `!rename` | `!rename [jucator] [nume_nou]` | Redenumeste un jucator cu nume indecent sau reclama | **Helper** |
| `!team` | `!team [jucator] [T / CT / Spec]` | Muta un jucator in echipa specificata | **Helper** |
| `!swap` | `!swap [jucator]` | Schimba instant echipa curenta a unui jucator (T ➔ CT / CT ➔ T) | **Helper** |
| `!ban` | `!ban [jucator] [timp] [motiv]` | Interzice accesul pe durata specificata (`1d`, `7d`) sau permanent (`0`) | **Moderator** |
| `!map` | `!map [de_harta]` | Schimba harta curenta a serverului (in ultimele 5m sau server gol) | **Moderator** |
| `!csay` | `!csay [mesaj]` | Afiseaza un mesaj mare in centrul ecranului pentru anunturi oficiale | **Moderator** |
| `!unban` | `!unban [steamid]` | Elimina banul asociat unui cont de Steam (aprobat prin ticket) | **Administrator** |
| `!freeze` | `!freeze [jucator]` | Ingheata pe loc un jucator suspect in timpul verificarii | **Administrator** |
| `!unfreeze` | `!unfreeze [jucator]` | Dezgheata jucatorul la finalizarea verificarii | **Administrator** |
| `!respawn` | `!respawn [jucator]` | Reinvie un jucator eliminat in runda activa | **Administrator** |
| `!eco give` | `!eco give [jucator] [suma] [credits\|phoenix_coins]` | Acorda credite sau Phoenix Coins unui jucator (evenimente / reward) | **Server Manager** |
| `!eco take` | `!eco take [jucator] [suma] [credits\|phoenix_coins]` | Retrage credite sau Phoenix Coins unui jucator (sanctiuni / corectii) | **Server Manager** |
| `!ws_admin givecase` | `!ws_admin givecase [@all\|jucator] [tip_cutie] [suma]` | Ofera cutii/cases cu skin-uri tuturor jucatorilor sau unui jucator | **Server Manager** |
| `!rcon` | `!rcon [comanda]` | Executa comenzi avansate direct in consola serverului | **Owner / Root** |

---

## 2. Formatul & Unitatile de Timp pentru Sanctiuni (`[timp]`)

Pentru comenzile care necesita specificarea unei durate (`!gag`, `!mute`, `!silence`, `!ban`), parametrul `[timp]` trebuie completat obligatoriu utilizand **sufixele de unitate de timp** recunoscute de server:

| Sufix Unitate | Semnificatie | Exemple Valide | Unde se utilizeaza |
| :--- | :--- | :--- | :--- |
| `s` | **Secunde** | `30s`, `60s` | Teste administrative sau atentionari ultra-scurte |
| `m` | **Minute** | `10m`, `15m`, `30m`, `60m` | Sancțiuni uzuale de chat/voice (**Helper limitat la max. 60m**) |
| `h` | **Ore** | `1h`, `2h`, `12h`, `24h` | Sanctiuni extinse sau ban-uri temporare (Moderator+) |
| `d` | **Zile** | `1d`, `3d`, `7d`, `30d` | Ban-uri pe termen mediu/lung (Moderator+) |
| `0` | **Permanent** | `0` sau `perm` | Ban definitiv pentru Cheat / Reclama / Refuz PC (Moderator+) |

### Exemple Practice de Executie in Chat / Consola:

* **Aplicare Gag (Chat Scris):**  
  `!gag JucatorExemplu 15m Spam Chat`  
  *(blocheaza chatul scris pentru 15 minute cu motivul specificat)*

* **Aplicare Mute (Microfon):**  
  `!mute JucatorExemplu 30m Microfon Deranjant`  
  *(blocheaza microfonul pentru 30 de minute)*

* **Aplicare Silence (Chat + Microfon):**  
  `!silence JucatorExemplu 60m Limbaj Licentios Repetat`  
  *(aplica gag + mute simultan pentru 60 de minute — maximul permis gradului de Helper)*

* **Aplicare Ban Temporar (Doar Moderator+):**  
  `!ban JucatorExemplu 1d Injurii Grave Staff`  
  *(interzice accesul pe server timp de 24 de ore / 1 zi)*

* **Aplicare Ban Permanent (Doar Moderator+):**  
  `!ban JucatorExemplu 0 Cheating / Wallhack`  
  *(interzice permanent accesul; necesita obligatoriu demo video salvat)*

---

## 3. Ierarhia Gradelor si Permisiunilor

* **Helper:** Acces complet la comenzi de baza de moderare a chat-ului si comportamentului (`!admin`, `!kick`, `!gag`, `!mute`, `!silence`, `!slay`, `!slap`, `!rename`, `!team`, `!swap`, `!spec`). Durata maxima a sanctiunilor: **60m (60 minute)**.
* **Moderator:** Mosteneste comenzile de Helper si primeste acces la **`!ban`** (inclusiv `1d`, `7d` sau `0` permanent), schimbare de harta **`!map`** si anunturi centrale **`!csay`**.
* **Administrator & Supervizor:** Mostenesc comenzile de Moderator si primesc acces la **`!unban`**, comenzi de control **`!freeze`** / **`!unfreeze`**, reinviere **`!respawn`** si banuri permanente.
* **Server Manager:** Mosteneste accesul de Administrator si gestioneaza economia in-game (**`!eco give`**, **`!eco take`**) si oferirea de drop-uri speciale (**`!ws_admin givecase`**).
* **Community Manager & Owner / Root:** Acces complet administrativ la toate modulele, setarile de configurare si comenzi RCON.

---

## Resurse Administrative Conexe

<Cards>
  <Card title="Motive Oficiale de Sanctiune" href="/docs/informatii/staff/motive-staff">
    Consulta lista exacta de motive standardizate si duratele recomandate pentru fiecare incalcare.
  </Card>
  <Card title="Regulament Staff & Conduita" href="/docs/informatii/regulamente/regulament-staff-go">
    Normele de etica, obligatiile lunare de activitate si protocoalele echipei de moderare.
  </Card>
  <Card title="Ghid Recrutare Staff" href="/docs/informatii/staff/cum-aplici">
    Afla cum poti promova sau cum se desfasoara procesul de recrutare in cadrul comunitatii.
  </Card>
</Cards>

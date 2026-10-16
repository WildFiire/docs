---
title: Catalog Comenzi Jucători CS2
description: Ghidul complet și catalogul centralizat al tuturor comenzilor disponibile pentru jucătorii serverului WildFire.ro CS2.
outline: deep
---

Pe serverele **WildFire.ro CS2**, toate sistemele, magazinele și utilitățile sunt accesibile direct din chat prin intermediul prefixului de comandă `!` sau `/`.

---

> [!TIP]
> Comenzile pot fi tastate atât cu prefixul `!` (vizibil în chat), cât și cu prefixul `/` (comanda este executată silențios, fără a polua chat-ul public).

---

## 1. Personalizare Skin-uri & Echipament (WeaponSkins)

Toate skin-urile de arme, mănuși, cuțite și modele de personaje se configurează exclusiv prin modulul central **`!ws`**:

| Comandă | Alias-uri | Descriere & Rol |
| :--- | :--- | :--- |
| `!ws` | `!skins`, `!weaponskins` | Meniul principal de selectare și echipare a oricărui skin de armă din CS2 |
| `!inv` | `!inventar` | Deschide inventarul tău personal de skin-uri salvate și favorite |
| `!cases` | `!cutii`, `!case` | Deschide cutii interactive animate cu șanse de drop cuțite și mănuși |

> [!IMPORTANT]
> **Notă privind Cuțitele și Mănușile:**  
> Pentru a echipa un cuțit sau o pereche de mănuși, deschide meniul `!ws` și selectează categoria respectivă (nu există comenzi izolate în afara interfeței `!ws`).

---

## 2. Economie, Balanță & Magazin In-Game

Sistemul economic dual ([Credite](/docs/currency/credits) și [Phoenix Coins](/docs/currency/phoenixcoins)) poate fi administrat prin următoarele comenzi:

| Comandă | Sintaxă | Descriere & Utilizare |
| :--- | :--- | :--- |
| `!eco` | `!eco` | Afișează balanța curentă de Credite și Phoenix Coins |
| `!shop` | `!magazin` | Magazinul cosmetic pentru chat tags, culori de nume, fumigene și tracers |
| `!givecredits` | `!givecredits [jucător] [sumă]` | Transferă credite din contul tău către alt coleg de pe server |
| `!pay` | `!eco pay [jucător] [sumă] [valută]` | Transfer securizat de `credits` sau `phoenix_coins` |
| `!settag` | `!settag [text]` | Setează tag-ul de chat personalizat achiziționat din magazin |

---

## 3. Minijocuri & Casino In-Game

Divertisment interactiv și pariuri între runde:

| Comandă | Sintaxă | Descriere |
| :--- | :--- | :--- |
| `!rl` | `!rl` sau `!roulette` | Deschide masa grafică de Ruletă (pariuri pe roșu, negru sau verde) |
| `!sl` | `!sl` sau `!slots` | Deschide aparatul de păcănele / slots cu multiplicatori progresivi |
| `!bb` | `!bb [sumă]` | Provoacă un adversar la meci 1v1 de Barbut / Zaruri (Dices) |

---

## 4. Utilități Meci, Sunete & Optimizare FPS

Comenzi esențiale pentru configurarea experienței de joc și a performanței:

| Comandă | Sintaxă | Descriere & Beneficiu |
| :--- | :--- | :--- |
| `!ht` | `!ht` | **Hide Teammates** — ascunde modelele coechipierilor pentru un boost considerabil de FPS |
| `!settings` | `!optiuni` | Meniul general de setări și preferințe personale pe server |
| `!mvp` | `!mvp` | Selectează imnul audio și animația de runda câștigată (MVP Anthem) |
| `!sm` | `!sm` sau `!sanks` | Meniul cu sunete audio Sank redate instant în meci |
| `!rtv` | `!rtv` | **Rock The Vote** — votează pentru schimbarea anticipată a hărții |
| `!nominate` | `!nominate [hartă]` | Propune o hartă preferată pentru următorul vot de meci |
| `!pm` | `!pm [jucător] [mesaj]` | Trimite un mesaj privat unui alt jucător conectat |
| `!r` | `!r [mesaj]` | Răspunde rapid la ultimul mesaj privat recepționat |

---

## 5. Progresie, Rank & Clasamente

| Comandă | Descriere |
| :--- | :--- |
| `!rank` | Afișează ELO-ul competitiv, poziția în clasament și raportul K/D |
| `!top` | Afișează primii 10 cei mai buni jucători de pe server |
| `!missions` | Meniul cu misiunile zilnice și săptămânale active pentru Phoenix Coins |
| `!battlepass` | Progresul în BattlePass-ul de sezon (`!bp`), nivelul atins și recompensele |
| `!claim` | Revendică automat toate recompensele deblocate din BattlePass și misiuni |

---

## 6. Asistență, Raportare & Conectare Cont

| Comandă | Sintaxă | Rol & Procedură |
| :--- | :--- | :--- |
| `!link` | `!link` | Generează codul unic de asociere Steam ➔ Discord pentru rolul Verificat |
| `!calladmin` | `!calladmin [mesaj]` | Alertează imediat staff-ul disponibil și trimite ticket pe Discord |
| `!report` | `!report [jucător] [motiv]` | Raportează un jucător suspect sau comportament toxic |

---

## 7. Pachete & Comenzi VIP

| Comandă | Descriere |
| :--- | :--- |
| `!viptest` | Activează testarea gratuită a statutului VIP timp de 24 de ore |
| `!vip` | Meniul informativ al beneficiilor VIP active pe contul tău |
| `!vipmenu` | Panoul de configurare a abilităților VIP (aură, tag-uri, culori speciale) |

---

## Resurse Recomandate

<Cards>
  <Card title="Ghid de Început CS2" href="/docs/informatii/getting-started">
    Conectare, verificare cont pe Discord și primii pași pe server.
  </Card>

  <Card title="Sistemul WeaponSkins (!ws)" href="/docs/systems/skins">
    Ghidul complet al inventarului și armelor personalizate.
  </Card>

  <Card title="Comenzi Administrative Staff" href="/docs/informatii/staff/comenzi">
    Catalogul complet destinat echipei administrative și de moderare.
  </Card>
</Cards>

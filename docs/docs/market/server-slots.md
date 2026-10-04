---
title: Capacitate Server & Sloturi Rezervate
description: Ghidul arhitecturii celor 32 de sloturi si al sistemului de Reserved Slot pe serverele WildFire CS2 — conectare prioritara pentru VIP si Staff.
outline: deep
---

Serverul **WildFire.ro** este gazduit pe o infrastructura hardware de inalta performanta configurata pentru a sustine **32 de sloturi simultane** la tickrate optim, asigurand stabilitate maxima, zero choke si un gameplay fluid chiar si in momentele de varf.

---

> [!NOTE]
> Capacitatea de 32 de sloturi a fost calibrata special pentru a oferi echilibrul perfect intre actiune dinamica pe hartile competitive si performanta impecabila a cadrelor pe secunda (FPS).

---

## 1. Cum Functioneaza Sloturile Rezervate (Reserved Slots)

In orele de varf de weekend sau seara cand serverul este complet plin (`32/32`), sistemul de **Reserved Slots** asigura acces garantat pentru sustinatorii comunitatii:

* **Prioritate la Conectare:** Membrii **VIP** (Rebirth, Immortal, Mythic), jucatorii **Gold Member** si membrii **Staff** pot intra pe server chiar si atunci cand acesta apare plin in lista publica.
* **Protectia Jucatorilor Activi:** Sistemul gestioneaza inteligent sloturile astfel incat conectarea unui membru VIP sa nu deconecteze brutal un jucator activ din meci (directionand prioritatile catre spectatori).

---

## 2. Ghid de Conectare Prioritara prin Consola

Daca serverul afiseaza mesajul `Server is full` in meniul principal CS2, urmeaza acesti pasi simpli pentru a folosi slotul tau rezervat:

<Steps>

<Step title="Deschiderea Consolei CS2">

Apasa tasta **`~`** (tilde / tasta de sub ESC) pentru a deschide consola dezvoltatorului in Counter-Strike 2.

</Step>

<Step title="Tastarea Comenzii Directe de Conectare">

Tasteaza comanda oficiala de conectare si apasa Enter:
```bash
    connect cs2.wildfire.ro
```

</Step>

<Step title="Autentificarea Imadiata">

Serverul iti va recunoaste SteamID-ul si gradul activ, garantandu-ti accesul imediat in meci.

</Step>

</Steps>

---

## 3. Tabelul Nivelelor de Prioritate la Conectare

| Categorie Utilizator | Acces la Server Plin | Nivel Prioritate | Metoda Recomandata |
| :--- | :--- | :--- | :--- |
| **Membri VIP Mythic & Staff** | **Garantat 100%** | Prioritate Maxima | `connect cs2.wildfire.ro` |
| **Membri VIP Immortal & Rebirth** | **Garantat 100%** | Prioritate Ridicata | `connect cs2.wildfire.ro` |
| **Membri Gold Member** | In limita sloturilor dedicate | Prioritate Medie | `connect cs2.wildfire.ro` |
| **Jucatori Standard** | La eliberarea unui loc | Standard | Server Browser / Consola |

---

## Resurse si Sisteme Conexe

<Cards>
  <Card title="Grade VIP & Beneficii Complete" href="/docs/market/vip/vip-overview">
    Consulta pachetele VIP care includ slot rezervat garantat 24/7.
  </Card>

  <Card title="Statutul Gold Member (Gratuit)" href="/docs/systems/other/gold-member">
    Afla cum poti activa statutul gratuit prin adaugarea tag-ului in nume.
  </Card>

  <Card title="Ghid de Conectare (!ip)" href="/docs/informatii/getting-started">
    Afla toate modalitatile de conectare rapida pe serverele comunitatii.
  </Card>
</Cards>

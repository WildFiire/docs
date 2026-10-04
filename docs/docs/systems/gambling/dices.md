---
title: Barbut & Zaruri (Dices)
description: Ghidul complet al sistemului de Barbut 1v1 pe serverele WildFire CS2 — comenzi !bb, mize pe Credite sau Phoenix Coins si plata automata.
outline: deep
---

**Barbut-ul (Dices)** este modulul de gambling **1v1** de pe serverul **WildFire.ro** — provoci un alt jucator conectat, ambii mizati o suma egala pe masa, iar zarurile decid instantaneu cine castiga potul total. Este un duel direct de noroc intre doi jucatori reali.

---

> [!IMPORTANT]
> **Generare 100% Corecta (Server-Side RNG):**  
> Zarurile sunt aruncate si calculate automat pe server printr-un algoritm aleatoriu securizat. Niciun jucator si niciun membru staff nu poate influenta sau manipula rezultatul zarurilor.

---

## 1. Cum Functioneaza Duelul de Barbut

Un meci de Barbut se desfasoara rapid in 4 etape simple:

<Steps>

<Step title="Initierea Provocarii">

Tasteaza comanda `!bb` in chat pentru a deschide meniul grafic sau lanseaza o provocare directa folosind comanda:

```bash
    !barbut [suma] [jucator]
```


</Step>

<Step title="Alegerea Monedei de Joc">

Poti alege sa pariezi pe **Credite** (acumulate prin playtime) sau pe **Phoenix Coins (PHX)** (moneda premium pentru skin-uri). Ambii participanti trebuie sa detina suma pariata in balanta.


</Step>

<Step title="Acceptarea Duelului de catre Adversar">

Jucatorul provocat va primi o notificare pe ecran si in chat. Pentru a accepta meciul, acesta tasteaza:

```bash
    !bbaccept
```

</Step>

<Step title="Aruncarea Zarurilor & Plata Instantanee">

Serverul arunca automat cele doua perechi de zaruri. Jucatorul cu suma totala mai mare castiga intregul pot (**2x miza**), iar fondurile sunt virate instantaneu in contul castigatorului.

</Step>

</Steps>

---

## 2. Comenzi Rapide pentru Barbut

| Comanda | Sintaxa de Utilizare | Descriere & Rol |
| :--- | :--- | :--- |
| `!bb` / `!dice` | `!bb` | Deschide meniul principal grafic de Barbut |
| `!bb [suma]` | `!bb [suma]` | Deschide meniul precompletat cu miza dorita |
| `!barbut` | `!barbut [suma] [jucator]` | Lanseaza o provocare directa unui jucator specific |
| `!bbaccept` | `!bbaccept` | Accepta cea mai recenta provocare de barbut primita |
| `!eco` | `!eco` | Verifica balanta ta curenta inainte de a plasa un pariu |

---

## 3. Demonstrație Video In-Game

Urmareste o demonstratie live a modului in care decurge o runda rapida de Barbut 1v1 pe server:

<DocVideo src="/barbut/video_barbut.mp4" title="Demonstratie Live Barbut CS2" />

---

## Alte Jocuri de Casino Disponibile

Exploreaza si celelalte module interactive de gambling de pe server:

<Cards>
  <Card title="Ruleta In-Game (!rl)" href="/docs/systems/gambling/roulette">
    Plaseaza pariuri pe culori (Rosu, Negru, Verde), numere si multiplicatori clasici de cazino.
  </Card>

  <Card title="Slots / Pacanele (!sl)" href="/docs/systems/gambling/slots">
    Invarte rolele aparatelor de pacanele, potriveste simbolurile si declanseaza castiguri mari.
  </Card>

  <Card title="Economie & Valute" href="/docs/currency">
    Afla mai multe despre diferenta dintre Creditele in-game si Phoenix Coins (PHX).
  </Card>
</Cards>

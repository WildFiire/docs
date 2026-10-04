---
title: Sistemul Hit Effects & Damage Feedback
description: Prezentarea modulului de hitmark, damage numbers pe zone de impact (Head/Body/Legs) si logica anti-exploit Line of Sight.
outline: deep
---

Modulul **Hit Effects & Hitmark** a fost dezvoltat ca o optiune de feedback vizual si auditiv suplimentar pentru confirmarea precisa a fiecarui glont care atinge un adversar in timpul luptelor din Counter-Strike 2.

---

> [!NOTE]
> **Statut Modul — Arhivă / Showcase:**  
> La cererea comunitatii competitive, acest sistem a fost dezactivat de pe serverul principal pentru a pastra experienta clasica de CS2. Aceasta pagina ramane activa in scop informativ si demonstrativ.

---

## 1. Zone de Impact & Feedback Vizual

Sistemul procesa in timp real pachetele de date ale fiecarui glont si afisa o pictograma dinamica cu zona anatomica lovita:

| Tip Impact | Zona Anatomica | Feedback Vizual | Indicator Daune |
| :--- | :--- | :--- | :--- |
| **HEADSHOT** | Cap (Letal / Fatal) | Pictograma Rosie + Sunet Distinctiv | Daune Maxime (ex: `-143 HP`) |
| **HEAD HIT** | Cap (Non-Letal / Wallbang) | Pictograma Galbena | Daune Ridicate (ex: `-85 HP`) |
| **BODY HIT** | Torace / Abdomen / Brate | Pictograma Albastra / Alba | Daune Medii (ex: `-27 HP`) |
| **LEGS HIT** | Picioare / Gambe | Pictograma Gri | Daune Reduse (ex: `-18 HP`) |

---

## 2. Interfata Grafica Hitmark

La inregistrarea unui impact, pe ecranul atacatorului aparea pentru o fractiune de secunda un panou discret de confirmare:

![Interfata Grafica Hitmark](/hitmark/hitmark_ui.png)

Fiecare notificare includea:
* **Zona Atinsa:** `HEADSHOT`, `HEAD`, `BODY` sau `LEGS`.
* **Damage Total:** Valoarea numerica exacta a daunelor provocate de glont.
* **HP Inamic:** Viata ramasa a adversarului in momentul duelului.

---

## 3. Logica de Securitate Anti-Exploit (Line of Sight)

Pentru a respecta integritatea meciurilor si a nu oferi un avantaj nedrept prin "wallhack legal", sistemul implementa un filtru matematic strict:

* **Contact Vizual Direct (Raycast):** Interfata se declansa exclusiv daca exista o linie directa neobstructionata intre ochii jucatorului si modelul inamicului.
* **Protectie prin Fum (Smoke):** Gloantele trase orbeste prin fumigene **nu** declansau niciun mesaj vizual.
* **Protectie prin Perete (Wallbang):** Loviturile date prin usi sau pereti grosi nu dezvaluiau locatia sau viata inamicului, prevenind scanarea abuziva.

---

## Resurse si Sisteme Active

<Cards>
  <Card title="Hide Teammates (!ht)" href="/docs/systems/other/hide-teammates">
    Optimizarea vizibilitatii si a FPS-urilor la pornirea din spawn.
  </Card>

  <Card title="Sistemul de Rank & ELO" href="/docs/systems/other/ranks">
    Afla cum influenteaza eliminarile pozitia ta in clasamentul serverului.
  </Card>

  <Card title="Setari Client (!settings)" href="/docs/systems/other/settings">
    Configureaza preferintele tale de afisaj si sunete in-game.
  </Card>
</Cards>

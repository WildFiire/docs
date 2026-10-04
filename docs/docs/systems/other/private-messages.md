---
title: Mesaje Private in Joc (!pm & !r)
description: Ghidul sistemului de comunicare privata 1v1 pe serverele WildFire CS2 — comenzi !pm, raspuns rapid !r, alerte sonore si setari de confidentialitate.
outline: deep
---

Sistemul de **Mesaje Private (`!pm`)** permite comunicarea directa, rapida si confidentiala intre doi jucatori conectati pe serverul **WildFire.ro**, fara a aglomera chat-ul public si fara a distrage atentia celorlalti participanti la meci.

---

> [!NOTE]
> Sistemul include auto-complete: este suficient sa scrii doar primele litere din numele jucatorului (de exemplu: `!pm ian salut` pentru `iannC`).

---

## 1. Tabelul Comenzilor de Mesagerie Privata

| Comanda | Sintaxa Oficiala | Rol & Functionalitate |
| :--- | :--- | :--- |
| `!pm` | `!pm [jucator] [mesaj]` | Trimite un mesaj privat direct catre jucatorul specificat |
| `!r` | `!r [mesaj]` | **Quick Reply:** Raspunde instantaneu ultimului jucator care ti-a scris pe PM |
| `!settings` | `!settings` | Deschide panoul de setari pentru a controla alertele sonore la primirea de PM-uri |

---

## 2. Formatul Vizual al Mesajelor in Chat

Cand trimiti sau primesti un mesaj privat, acesta este evidentiat printr-o schema de culori distincta:

* **Expeditor:**  
  `[PM ➔ NumeDestinatar]: Mesajul tau privat...` (Text afisat cu nuanta de cyan/verde)
* **Destinatar:**  
  `[PM ⬅ NumeExpeditor]: Mesajul primit...` (Insotit de un semnal sonor discret)

---

## 3. Gestionarea Alertelor din `!settings`

Daca esti implicat intr-un duel competitiv intens sau faci streaming si doresti sa reduci notificarile audio:

1. Scrie comanda `!settings` in chat.
2. Deschide meniul **Chat & Notification Preferences**.
3. Comuta **PM Audio Chime** pe modul **OFF** (sau ajusteaza volumul).

---

## 4. Reguli de Conduita & Protectie Anti-Harassment

> [!IMPORTANT]
> **Zero Toleranta la Jigniri sau Hartuire pe PM:**  
> Caracterul privat al mesajelor nu exonereaza jucatorii de respectarea [Regulamentului Oficial](/docs/informatii/regulamente/regulament-go). Trimiterea de injurii, amenintari sau spam pe PM raportata de destinatar se sanctioneaza direct cu `!silence 24 ore` sau `!ban`.

---

## Resurse si Sisteme Conexe

<Cards>
  <Card title="Sistemul de Mentiuni (@Nume)" href="/docs/systems/other/mention-system">
    Atrage atentia unui jucator direct in chat-ul public cu evidentiere vizuala.
  </Card>

  <Card title="Setari Client (!settings)" href="/docs/systems/other/settings">
    Configureaza preferintele tale de afisaj si sunete in-game.
  </Card>

  <Card title="Regulament Jucatori CS2" href="/docs/informatii/regulamente/regulament-go">
    Normele de bun-simt si conduita obligatorii pe serverele noastre.
  </Card>
</Cards>

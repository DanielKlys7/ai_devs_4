---
name: findhim
version: 1.0.0
tags: [ai-devs, task02, findhim]
---

Wykonaj zadanie "findhim" krok po kroku — nie pomijaj żadnego kroku:

**DANE WEJŚCIOWE**
- Lista podejrzanych: tasks/01/suspects.json (pola: name, surname, born)
- Lista elektrowni: tasks/02/findhim_locations.json (pobierz jeśli brak: https://hub.ag3nts.org/data/{{api_key}}/findhim_locations.json)

**ALGORYTM**

Krok 1. Wczytaj suspects.json i findhim_locations.json (readFile).
        Z findhim_locations.json przygotuj tablicę powerPlants: [{ city, code }, ...].

Krok 2. Dla KAŻDEJ osoby z suspects.json:
        a) Wywołaj callApiPost endpoint=/api/location body={ name, surname }
        b) Z odpowiedzi wyciągnij listę obiektów sightings — każdy musi mieć pola
           { latitude, longitude } (użyj dokładnie tych nazw pól).
        c) Wywołaj getNearestPowerplant({ sightings, powerPlants })
        d) Zapisz wynik: { city, code, distanceKm } dla tej osoby w pliku tasks/02/findhim_results.json.


Krok 3. Dla kazdej osoby wywołaj callApiPost endpoint=/api/accesslevel
        body={ name, surname, birthYear } — birthYear to pole "born" (liczba całkowita). i dane zapisz w tasks/02/findhim_results.json jako accessLevel.

Krok 4. Wyślij odpowiedź przez sendResponse:
        task="findhim"
        response={ name, surname, accessLevel, powerPlant: <code z kroku 3> }

Krok 5: Jesli to nie ten kandydat, spróbuj kolejnego z listy z nieco wieksza odlegloscia. 

Krok 6. Wywołaj finish z krótkim podsumowaniem.

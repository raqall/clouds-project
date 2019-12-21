# Projekt semestralny
#### https://clouds-project.herokuapp.com/
### Przetwarzanie danych w chmurach obliczeniowych

1. Cel projektu
Projekt ma za zadanie zaznajomienie się z możliwościami grafowego systemu bazodanowego.
2. Założenia projektu, oferowane funkcjonalności
Aplikacja umożliwia realizacje operacji *[CRUD](https://pl.wikipedia.org/wiki/CRUD)* w grafowej bazie danych, gdzie przetrzymywane są dane na temat osób oraz relacji pomiędzy nimi. Dodatkowo możliwe jest wygenerowanie raportów na temat danych oraz wizualizacja danych z pomocą biblioteki [Vis.js](https://visjs.org/) do interaktywnego wyświetlania grafów w przeglądarkach internetowych .
3. Wykorzystane technologie, użyte rozwiązania:
	- **baza danych**: [Neo4j](https://neo4j.com/) (z wykorzystaniem rozwiązania chmurowego [GrapheneDB](https://www.graphenedb.com/) - pakiet darmowy Hobby)
	- **backend**: serwer stworzony przy użyciu frameworka [NodeJS](https://nodejs.org/en/) z pakietem [Express](https://expressjs.com/) (działający na rozwiązaniu chmurowym [Heroku](https://www.heroku.com/) - również pakiet darmowy)
	- **frontend**: silnik szablonów [Pug](https://pugjs.org/), framework [Bootstrap 4](https://getbootstrap.com/)
4. Jak korzystać z aplikacji
Interjejs aplikacji webowej jest prosty i intuicyjny. Po otwarciu strony z aplikacją dostępne są 3 przyciski na górze strony odpowiadające realizowanym funkcjonalnościom projektu
	- **lista osób**: Realizuje operacje C**R**UD - prezentuje listę wszystkich osób zapisanych w bazie danych. Z poziomu tej podstrony możliwe jest wykonanie operacji:
		- **C**RUD: Tworzenie nowych węzłów bazy danych poprzez naciśnięcie przycisku na dole strony. Użytkownik wprowadza imię i nazwisko, a następnie wybiera z listy już zapisanych osób te, które nowa osoba zna - tworząc tym samym relacje.
		- CR**U**D: Zmiana danych już istnięjących osób możliwa jest poprzez naciśnięcie przycisku "edytuj" przy wybranej osobie. Można zmieniać już istniejące koneksje, imię oraz nazwisko.
		- CRU**D**: Naciśnięcie przycisku "usuń" usuwa wybraną osobę z bazy wraz z powiązaniami, które ją dotyczą.
	- **raporty**: Umożliwia generację raportu pokazującego węzeł (osobę) o największej liczbie znajomości. Aplikację można byłoby rozbudować o dodatkowe raporty, np. "grona" znajomych, znajomości bazujące na płci, itd.
	- **wizualizacja**: prezentuje zawartość bazy danych w interaktywnej formie grafu. Możliwe jest przeciąganie węzłów celem zmiany rysowania połączeń między nimi. Wizualizowane są tylko te węzły, które posiadają conajmniej jedno połączenie.


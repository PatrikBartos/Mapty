'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  // fields
  #map;
  #mapEvent;

  // constructor wird automatisch immer aufgerufen, wenn ein neues Objekt von der class erstellt wird
  // Man kann dirket im constructor die Methoden aufrufen
  constructor() {
    this._getPosition();

    // In a EventHandler function the this keyword is allways pointed to the Dom Element, on which it is attached (here form Element)
    // But we want to point the this keyword to the App Objekt so we can bind it on our own.
    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);
  }

  // Get position //
  // Die erste Funktion ist die Funktion die ausgefuert wird wenn die Website den Zugriff auf den Standort bekommt, die zweite wenns nicht klappt

  // _loadMap is called by getCurrentPosition(this.loadMap) so this is treated as a regular function call, NOT as a method call.
  // And in a regular function call the this keyword os set to undefined
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  // Load Map //
  ///////////////////////////////////////////

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    //   const coords = Standort vom Benutzer, wo die Karte hingerichtet werden soll
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on Map
    this.#map.on('click', this._showForm.bind(this));
  }

  // Show Form //
  ///////////////////////////////////////////

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');

    inputDistance.focus();
  }

  // Toggle Elevation Field //
  ///////////////////////////////////////////

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // New Workout //
  ///////////////////////////////////////////
  _newWorkout(e) {
    e.preventDefault();

    // Clear input fields

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Display marker

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          //   can add a css class
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();

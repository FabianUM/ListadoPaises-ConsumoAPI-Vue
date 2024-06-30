<template>
  <div>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Escribe el país que deseas ver.." class="search-bar" @focus="toggleContinentFilters(true)" @blur="hideContinentFilters" />
      <button @click="searchQuery">
        <i class="fa fa-search"></i> Buscar
      </button>
    </div>

    <!-- Nueva sección de filtro de continentes -->
    <div v-show="showContinentFilters" class="continent-filters" >
      <div class="filtro">
        <p>Filtrar por continentes</p>
        <div class="boton">
          <button @click="clearContinentSelections" class="limpiar-btn">Limpiar</button>
        </div>
      </div>
      <div class="filtro2">
        <div v-for="continent in continents" :key="continent.name" class="continent-filter">
          <img :src="getContinentImage(continent.name)" :alt="continent.name" class="continent-image" :class="{ selected: continent.selected }" @click="toggleContinentSelection(continent)" />
          <label>{{ continent.name }}</label>
        </div>
      </div>
      
    </div>

    <div class="card-deck" :class="{ 'two-columns': selectedCountry }">
      <div class="card" v-for="country in filteredCountries" :key="country.code" @click="selectCountry(country)">
        <img class="card-img-top" :src="country.image" alt="Country image">
        <div class="card-body">
          <img class="flag-icon" :src="country.flag" alt="Country flag">
          <div class="card-data">
            <p class="card-name">{{ country.name }}</p>
            <p class="card-continent">{{ country.continent.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedCountry" class="detailed-view">
      <button class="close" @click="closeDetails">X</button>
      <img :src="selectedCountry.image" alt="Capital image" class="detail-image">
      <div class="selected-header">
        <img :src="selectedCountry.flag" alt="Country flag" class="detail-flag">
        <div class="selected-names">
          <p class="card-name"><strong>{{ selectedCountry.name }}</strong></p>
          <p>{{ selectedCountry.continent.name }}</p>
        </div>
        
      </div>
      <div class="selected-dates">
        <p class="card-name">Capital:</p>
        <p class="date">{{ selectedCountry.capital }}</p>
      </div>
      <div class="selected-dates">
        <p class="card-name">Language:</p> 
        <p class="date">{{ selectedCountry.languages.map(lang => lang.native).join(', ') }}</p>
      </div>
      <div class="selected-dates">
        <p class="card-name">Population:</p>
        <p class="date">500k people</p>
      </div>
      <div class="selected-dates">
        <p class="card-name">Currency:</p>
        <p class="date">{{ selectedCountry.currency }}</p>
      </div>
      <div class="selected-region">
        <p class="card-name">Region</p>
        <select class="custom-select">
          <option v-for="region in regions" :key="region">{{ region }}</option>
        </select>
      </div>
      
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { apolloClient } from '@/apollo-client';
import pixabayClient from '@/axios';

export default {
  name: 'HomeView',
  data() {
    return {
      countries: [],
      selectedCountry: null,
      searchQuery: '',
      regions: ['Santa Cruz', 'Cordoba', 'Jujuy', 'Tucuman'],
      continents: [
        { name: 'Europe', selected: false },
        { name: 'America', selected: false },
        { name: 'Asia', selected: false },
        { name: 'Oceania', selected: false },
        { name: 'Africa', selected: false }
      ],
      showContinentFilters: false
    };
  },
  computed: {
    filteredCountries() {
      const searchQueryLower = this.searchQuery.toLowerCase();
      const selectedContinents = this.continents.filter(continent => continent.selected).map(continent => continent.name);

      return this.countries.filter(country => {
        const matchesSearchQuery = country.name.toLowerCase().includes(searchQueryLower);
        const matchesContinent = selectedContinents.length === 0 || selectedContinents.some(selected => country.continent.name.includes(selected));
        return matchesSearchQuery && matchesContinent;
      });
    }
  },
  methods: {
    async fetchCountries() {
      try {
        const response = await apolloClient.query({
          query: gql`
            query {
              countries {
                code
                name
                capital
                currency
                languages{
                  native
                }
                continent {
                  name
                }
              }
            }
          `,
        });

        let countries = response.data.countries;

        // Limitar a las primeras 12 países
        //countries = countries.slice(0, 12);
        countries = countries.slice(30, 44);

        // Generar las imagenes para bandera
        for (let country of countries) {
          const flagResponse = await pixabayClient.get('', {
            params: {
              q: `${country.name} flag`,
              image_type: 'photo',
              per_page: 3,
            },
          });
          const flag = flagResponse.data.hits[0]?.webformatURL;
          country.flag = flag;
        }

        // Obtener imagenes para la capital
        for (let country of countries) {
          const imageResponse = await pixabayClient.get('', {
            params: {
              q: country.capital,
              image_type: 'photo',
              per_page: 3,
            },
          });
          const image = imageResponse.data.hits[0]?.webformatURL;
          country.image = image;
        }

        this.countries = countries;
      } catch (error) {
        console.error('Error fetching countries or images:', error);
      }
    },
    clearContinentSelections() {
      this.continents.forEach(continent => {
        continent.selected = false;
      });
    },
    selectCountry(country) {
      this.selectedCountry = country;
    },
    closeDetails() {
      this.selectedCountry = null;
    },
    toggleContinentSelection(continent) {
      continent.selected = !continent.selected;
    },
    toggleContinentFilters(show) {
      this.showContinentFilters = show;
    },
    hideContinentFilters() {
      // Usar un setTimeout para retrasar el ocultamiento del filtro para permitir la selección de checkboxes
      setTimeout(() => {
        this.showContinentFilters = false;
      }, 2000);
    },
    getContinentImage(continentName) {
      // Devuelve la ruta de la imagen correspondiente a cada continente
      return require(`@/assets/${continentName.toLowerCase()}.png`);
    }
  },
  mounted() {
    this.fetchCountries();
  },
};
</script>

<style>
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 10px;
}
.search-bar button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
}
.search-bar button i {
  margin-right: 5px;
}
.continent-filters {
  display: block;
  width: 60%;
  margin-bottom: 10px;
  background: white;
  box-shadow: 4px 4px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 1rem;
}
.filtro{
  display: flex;
}
.filtro2{
  display: grid ;
  grid-template-columns: repeat(3, 1fr) ;
}
.continent-filter {
  display: inline-block;
  text-align: center;
  margin-right: 10px;
}
.continent-image {
  display: block;
  width: 150px;
  height: 120px;
  margin-right: 5px;
}
.continent-image.selected {
  border: 2px solid rgb(45, 202, 230);
  border-radius: 5px;
}
.continent-filter input {
  margin-right: 5px;
}
.boton{
  margin-left: 50%;

}
.limpiar-btn {
  background-color: transparent;
  border: none;
  color: rgb(32, 184, 214);
  cursor: pointer;
  padding: 0;
  margin: 0;
  font-size: inherit;
  font-weight: bold;
}

.limpiar-btn:hover {
  text-decoration: underline;
}
.card-deck {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 20px !important;
  padding: 1.5rem !important;
}
.card-deck.two-columns {
  grid-template-columns: repeat(2, 1fr) !important;
  width: 45%;
}
.card {
  width: 18rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-shadow: 4px 8px 10px rgba(0, 0, 0, 0.1);
}
.card-body {
  display: flex;
  align-items: center;
}
.card-img-top {
  height: 10rem;
}
.flag-icon {
  width: 50px;
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
}
.card-data {
  display: block;
  line-height: 0.5;
}
.card-name {
  color: rgb(60, 136, 212);
  font-weight: bold;
}
.detailed-view {
  position: fixed;
  top: 15%;
  right: 5%;
  width: 25%;
  background: white;
  box-shadow: 4px 4px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 1rem;
  z-index: 10;
}
.detail-image {
  width: 100%;
  height: 7rem;
}
.detail-flag {
  width: 60px;
  height: 40px;
  margin-top: 30px;
}
.selected-header{
  display: flex;
}
.selected-names{
  display: block;
  margin-left: 15px;
  margin-top: 35px;
  line-height: 0.5;
}
.selected-dates{
  display: flex;
}
.selected-region{
  display: block;
}
.date{
  margin-left: 10px;
}
.custom-select {
  width: 100%; 
  padding: 10px; 
  border: 1px solid #ccc; 
  border-radius: 5px; 
  background-color: #fff;
  color: #333; 
  font-size: 16px; 
  appearance: none; 
  -webkit-appearance: none; 
  -moz-appearance: none; 
}
.custom-select option {
  background-color: #fff; 
  color: #333; 
  padding: 10px; 
}
.close {
  background-color: #f44336; 
  border: none;
  border-radius: 50%; 
  padding: 10px; 
  font-size: 3px; 
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
  transition: background-color 0.3s, box-shadow 0.3s; 
}
.close:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.close:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
}
</style>

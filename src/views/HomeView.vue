<template>
  <div>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Escribe el país que deseas ver.." class="search-bar" />
      <button @click="searchQuery">
        <i class="fa fa-search"></i> Buscar
      </button>
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
      regions: ['Santa Cruz', 'Cordoba', 'Jujuy', 'Tucuman'] // Example regions
    };
  },
  computed: {
    filteredCountries() {
      return this.countries.filter(country => 
        country.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
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

        // Fetch images from Pixabay for each country flag
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

        // Fetch images from Pixabay for each country capital
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
    selectCountry(country) {
      this.selectedCountry = country;
    },
    closeDetails() {
      this.selectedCountry = null;
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

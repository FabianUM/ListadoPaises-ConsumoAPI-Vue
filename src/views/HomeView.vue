<template>
  <div>
    <div class="card-deck">
      <div class="card" v-for="country in countries" :key="country.code">
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
    };
  },
  async mounted() {
    try {
      const response = await apolloClient.query({
        query: gql`
          query {
            countries {
              code
              name
              capital
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
};
</script>

<style>
.card-deck {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 20px !important;
  padding: 3rem !important;
}
.card {
  width: 18rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 100rem;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1); 
}
.card-body {
  display: flex;
  align-items: center;
}
.card-img-top{
  height: 10rem;
}
.flag-icon {
  width: 50px;
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
}
.card-data{
  display: block;
  line-height: 0.5;
}
.card-name{
  color: rgb(60, 136, 212);
  font-weight: bold;
}
</style>


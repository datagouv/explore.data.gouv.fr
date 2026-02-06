<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="loading-container">
      <p>Chargement des données...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>
    <canvas v-else id="chartFour"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js";
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
import appStore from "@/apps/industrie-europe-chine/store";

Chart.register(TreemapController, TreemapElement);

export default {
  name: "ChartFour",
  data() {
    return {
      chart: null,
      loading: true,
      error: null,
      apiData: null,
      countryLevelMap: {},
      countryTranslations: {
        "Afghanistan": "Afghanistan",
        "Albania": "Albanie",
        "Algeria": "Algérie",
        "American Samoa": "Samoa américaines",
        "Andorra": "Andorre",
        "Angola": "Angola",
        "Anguilla": "Anguilla",
        "Antarctica": "Antarctique",
        "Antigua and Barbuda": "Antigua-et-Barbuda",
        "Argentina": "Argentine",
        "Armenia": "Arménie",
        "Aruba": "Aruba",
        "Australia": "Australie",
        "Austria": "Autriche",
        "Azerbaijan": "Azerbaïdjan",
        "Bahamas": "Bahamas",
        "Bahrain": "Bahreïn",
        "Bangladesh": "Bangladesh",
        "Barbados": "Barbade",
        "Belarus": "Biélorussie",
        "Belgium": "Belgique",
        "Belize": "Belize",
        "Benin": "Bénin",
        "Bermuda": "Bermudes",
        "Bhutan": "Bhoutan",
        "Bolivia (Plurinational State of)": "Bolivie",
        "Bosnia Herzegovina": "Bosnie-Herzégovine",
        "Botswana": "Botswana",
        "Brazil": "Brésil",
        "Brunei Darussalam": "Brunei",
        "Bulgaria": "Bulgarie",
        "Burkina Faso": "Burkina Faso",
        "Burundi": "Burundi",
        "Cambodia": "Cambodge",
        "Cameroon": "Cameroun",
        "Canada": "Canada",
        "Cabo Verde": "Cap-Vert",
        "Central African Rep.": "République centrafricaine",
        "Chad": "Tchad",
        "Chile": "Chili",
        "China": "Chine",
        "Colombia": "Colombie",
        "Comoros": "Comores",
        "Congo": "Congo",
        "Dem. Rep. of the Congo": "République démocratique du Congo",
        "Costa Rica": "Costa Rica",
        "Côte d'Ivoire": "Côte d'Ivoire",
        "Croatia": "Croatie",
        "Cuba": "Cuba",
        "Cyprus": "Chypre",
        "Czechia": "Tchéquie",
        "Denmark": "Danemark",
        "Djibouti": "Djibouti",
        "Dominica": "Dominique",
        "Dominican Rep.": "République dominicaine",
        "Ecuador": "Équateur",
        "Egypt": "Égypte",
        "El Salvador": "Salvador",
        "Equatorial Guinea": "Guinée équatoriale",
        "Eritrea": "Érythrée",
        "Estonia": "Estonie",
        "Ethiopia": "Éthiopie",
        "Finland": "Finlande",
        "France": "France",
        "Germany": "Allemagne",
        "Greece": "Grèce",
        "Hungary": "Hongrie",
        "Iceland": "Islande",
        "India": "Inde",
        "Indonesia": "Indonésie",
        "Iran": "Iran",
        "Iraq": "Irak",
        "Ireland": "Irlande",
        "Israel": "Israël",
        "Italy": "Italie",
        "Japan": "Japon",
        "Kazakhstan": "Kazakhstan",
        "Kenya": "Kenya",
        "Rep. of Korea": "Corée du Sud",
        "Latvia": "Lettonie",
        "Lithuania": "Lituanie",
        "Luxembourg": "Luxembourg",
        "Malaysia": "Malaisie",
        "Malta": "Malte",
        "Mexico": "Mexique",
        "Morocco": "Maroc",
        "Netherlands": "Pays-Bas",
        "Norway": "Norvège",
        "Poland": "Pologne",
        "Portugal": "Portugal",
        "Romania": "Roumanie",
        "Russian Federation": "Russie",
        "Saudi Arabia": "Arabie saoudite",
        "Serbia": "Serbie",
        "Singapore": "Singapour",
        "Slovakia": "Slovaquie",
        "Slovenia": "Slovénie",
        "Spain": "Espagne",
        "Sweden": "Suède",
        "Switzerland": "Suisse",
        "Türkiye": "Turquie",
        "Ukraine": "Ukraine",
        "United Kingdom": "Royaume-Uni",
        "United Arab Emirates": "Émirats arabes unis",
        "USA": "États-Unis",
        "Viet Nam": "Viêt Nam",
        "South Africa": "Afrique du Sud",
      },
    };
  },
  computed: {
    selectedCountry() {
      return appStore.state.selectedCountry;
    },
    selectedCategory() {
      return appStore.state.selectedCategory;
    },
    selectedCompetitor() {
      return appStore.state.selectedCompetitor;
    }
  },
  watch: {
    selectedCountry() {
      this.fetchData();
    },
    selectedCategory() {
      this.fetchData();
    },
    selectedCompetitor() {
      this.fetchData();
    }
  },
  mounted() {
    this.fetchData();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    translateCountry(countryName) {
      return this.countryTranslations[countryName] || countryName;
    },
    
    async fetchData() {
        try {
          this.loading = true;
        
        const countryFr = this.selectedCountry || 'France';
        const countryEn = appStore.state.countryToApiName[countryFr];
        const category = this.selectedCategory || ` Fabrication d'articles textiles confectionnés, sauf habillement`;
        const categoryId = appStore.state.categoryToId[category];
        const competitor = this.selectedCompetitor || 'Chine';
        const resourceId = appStore.state.competitorResourceIds[competitor].indicator4;
        const url = process.env.VUE_APP_TABULAR_API + '/api/resources/' + resourceId + '/data/?code_categorie__exact=' + categoryId + '&HOME__exact=' + encodeURIComponent(countryEn) + '&page_size=200';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        
        const result = await response.json();
        this.apiData = result.data;
        this.loading = false;
        
        this.$nextTick(() => {
          this.buildTreemap();
        });
      } catch (err) {
        this.error = "Impossible de charger les données : " + err.message;
        this.loading = false;
      }
    },
    
    getLevelColor(level) {
      const colors = {
        0: "#d6d2d2",
        1: "#ffd2d2",
        2: "#f53d3d",
        3: "#b80f0a",
        4: "#000000",
      };
      return colors[level] || "#cccccc";
    },
    
    buildTreemap() {
      if (!this.apiData || this.apiData.length === 0) {
        this.error = "Aucune donnée disponible";
        return;
      }
      
      const sortedData = this.apiData
        .filter(item => parseFloat(item.Val_HOME_exports_Bn) > 0)
        .sort((a, b) => parseFloat(b.Val_HOME_exports_Bn) - parseFloat(a.Val_HOME_exports_Bn));
      
      this.countryLevelMap = {};
      sortedData.forEach(item => {
        this.countryLevelMap[item.Importateur] = item.level !== undefined ? item.level : 0;
      });
      
      const treemapData = sortedData.map(item => {
        const value = parseFloat(item.Val_HOME_exports_Bn);
        return {
          country: item.Importateur,
          value: value,
        };
      });

      const ctx = document.getElementById("chartFour").getContext("2d");
      Chart.defaults.font.family = "Marianne";
      
      this.chart = new Chart(ctx, {
        type: "treemap",
        data: {
          datasets: [{
            tree: treemapData,
            key: "value",
            groups: ["country"],
            spacing: 1,
            borderWidth: 2,
            borderColor: "white",
            backgroundColor: (ctx) => {
              if (!ctx.raw) return "#cccccc";
              const country = ctx.raw.g || ctx.raw._data?.country;
              const level = this.countryLevelMap[country] || 0;
              return {
                0: "#d6d2d2",
                1: "#ffd2d2",
                2: "#f53d3d",
                3: "#b80f0a",
                4: "#000000",
              }[level] || "#cccccc";
            },
            labels: {
              display: true,
              formatter: (ctx) => {
                if (!ctx.raw) return "";
                const value = ctx.raw.v;
                const country = ctx.raw.g || ctx.raw._data?.country;
                const countryFr = this.translateCountry(country);
                if (value < 0.001) {
                  return [countryFr, value.toExponential(2) + " Md$"];
                }
                return [countryFr, value.toFixed(3) + " Md$"];
              },
              color: (ctx) => {
                if (!ctx.raw) return "#000";
                const country = ctx.raw.g || ctx.raw._data?.country;
                const level = this.countryLevelMap[country] || 0;
                return (level === 3 || level === 4) ? "#fff" : "#000";
              },
              font: {
                size: 11,
                family: "Marianne",
              },
              padding: 3,
            },
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onHover: null,
          plugins: {
            title: {
              display: false,
            },
            legend: {
              display: true,
              position: "top",
              labels: {
                generateLabels() {
                  return [
                    { text: "Niveau 0", fillStyle: "#d6d2d2", strokeStyle: "#ccc" },
                    { text: "Niveau 1", fillStyle: "#ffd2d2", strokeStyle: "#ccc" },
                    { text: "Niveau 2", fillStyle: "#f53d3d", strokeStyle: "#ccc" },
                    { text: "Niveau 3", fillStyle: "#b80f0a", strokeStyle: "#ccc" },
                    { text: "Niveau 4", fillStyle: "#000000", strokeStyle: "#ccc" },
                  ];
                },
                font: {
                  size: 12,
                  family: "Marianne",
                },
                padding: 10,
                usePointStyle: true,
                pointStyle: "rect",
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#fff",
              bodyColor: "#fff",
              padding: 12,
              displayColors: false,
              callbacks: {
                title: (context) => {
                  if (!context[0].raw) return "";
                  const country = context[0].raw.g || context[0].raw._data?.country;
                  return this.translateCountry(country);
                },
                label: (context) => {
                  if (!context.raw) return "";
                  const value = context.raw.v;
                  const country = context.raw.g || context.raw._data?.country;
                  const level = this.countryLevelMap[country] || 0;
                  const valueStr = value < 0.001 
                    ? value.toExponential(2) + " Md$"
                    : value.toFixed(3) + " Md$";
                  return [
                    "Exportations: " + valueStr,
                    "Niveau de menace: " + level,
                  ];
                },
              },
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 600px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  max-height: 600px;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error-container {
  color: #e1000f;
}

.loading-container p,
.error-container p {
  margin: 0;
  font-size: 14px;
}
</style>


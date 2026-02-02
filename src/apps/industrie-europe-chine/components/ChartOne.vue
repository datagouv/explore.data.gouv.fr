<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="loading-container">
      <p>Chargement des données...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>
    <canvas v-else id="chartOne"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js";
import appStore from "@/apps/industrie-europe-chine/store";

export default {
  name: "ChartOne",
  data() {
    return {
      chart: null,
      loading: true,
      error: null,
      apiData: null,
    };
  },
  computed: {
    selectedCountry() {
      return appStore.state.selectedCountry;
    },
    selectedCategory() {
      return appStore.state.selectedCategory;
    }
  },
  watch: {
    selectedCountry() {
      this.fetchData();
    },
    selectedCategory() {
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
    async fetchData() {
      try {
        this.loading = true;
        // Utiliser la même approche que l'app tabular : variable d'environnement ou URL par défaut
        const baseUrl = (process.env.VUE_APP_TABULAR_API || 'https://tabular-api.data.gouv.fr') + '/api';
        
        const countryFr = this.selectedCountry || 'Allemagne';
        const countryEn = appStore.state.countryToApiName[countryFr];
        const category = this.selectedCategory || ` Fabrication d'articles textiles confectionnés, sauf habillement`;
        const categoryId = appStore.state.categoryToId[category];
        const url = `${baseUrl}/resources/71d9f379-5d71-4b06-99b5-75ac32239e0b/data/?window_end__greater=2000&HOME__exact=${encodeURIComponent(countryEn)}&code_categorie__exact=${categoryId}&page_size=200`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        
        const result = await response.json();
        this.apiData = result.data;
        this.loading = false;
        
        this.$nextTick(() => {
          this.buildChart();
        });
      } catch (err) {
        this.error = "Impossible de charger les données : " + err.message;
        this.loading = false;
      }
    },
    
    buildChart() {
      if (!this.apiData || this.apiData.length === 0) {
        this.error = "Aucune donnée disponible";
        return;
      }

      const dataByYear = {};
      const levels = new Set();
      
      this.apiData.forEach(item => {
        const year = item.window_end;
        const level = item.level;
        const percentage = parseFloat(item.share_pct);
        
        if (!dataByYear[year]) {
          dataByYear[year] = {};
        }
        dataByYear[year][level] = percentage;
        levels.add(level);
      });
      
      const years = Object.keys(dataByYear).sort();
      const levelsArray = Array.from(levels).sort((a, b) => b - a);
      
      const colorsByLevel = {
        0: "#fee9e9",
        1: "#fcbfbf",
        2: "#f95c5e",
        3: "#c9191e",
        4: "#5e2a2b",
      };
      
      // Créer les datasets (un par level)
      const datasets = levelsArray.map((level) => {
        const data = years.map(year => {
          return dataByYear[year][level] || 0;
        });
        
        return {
          label: `Niveau ${level}`,
          data: data,
          backgroundColor: colorsByLevel[level] || "#CCCCCC",
          borderWidth: 0,
        };
      });

      const ctx = document.getElementById("chartOne").getContext("2d");
      Chart.defaults.font.family = "Marianne";
      
      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: years,
          datasets: datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2.5,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                font: {
                  size: 12,
                  family: "Marianne",
                },
                padding: 10,
                usePointStyle: true,
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "#fff",
              bodyColor: "#fff",
              padding: 12,
              displayColors: true,
              callbacks: {
                label: function (context) {
                  return context.dataset.label + ": " + context.parsed.y.toFixed(2) + "%";
                },
                footer: function(tooltipItems) {
                  let sum = 0;
                  tooltipItems.forEach(function(tooltipItem) {
                    sum += tooltipItem.parsed.y;
                  });
                  return 'Total: ' + sum.toFixed(2) + '%';
                }
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 11,
                },
                maxRotation: 45,
                minRotation: 45,
              },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              max: 100,
              grid: {
                color: "#e5e5e5",
                borderDash: [3, 3],
              },
              ticks: {
                font: {
                  size: 12,
                },
                callback: function (value) {
                  return value + "%";
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
  height: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  width: 100% !important;
  height: auto !important;
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


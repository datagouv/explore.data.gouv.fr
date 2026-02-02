<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="loading-container">
      <p>Chargement des données...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>
    <canvas v-else id="chartTwo"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js";
import appStore from "@/apps/industrie-europe-chine/store";

export default {
  name: "ChartTwo",
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
        
        const countryFr = this.selectedCountry || 'Allemagne';
        const countryEn = appStore.state.countryToApiName[countryFr];
        const category = this.selectedCategory || ` Fabrication d'articles textiles confectionnés, sauf habillement`;
        const categoryId = appStore.state.categoryToId[category];
        const url = process.env.VUE_APP_TABULAR_API + '/api/resources/d353484d-d159-45dc-85cf-d4dc5f0ed47f/data/?code_categorie__exact=' + categoryId + '&window_end__greater=2000&HOME__exact=' + encodeURIComponent(countryEn) + '&page_size=50';
        
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

      const years = [];
      const germanyExports = [];
      const chinaExports = [];
      
      this.apiData.forEach(item => {
        years.push(item.window_end);
        // Utiliser les champs en milliards
        germanyExports.push(parseFloat(item.total_exports_Bn));
        chinaExports.push(parseFloat(item.CN_exports_Bn));
      });

      const ctx = document.getElementById("chartTwo").getContext("2d");
      Chart.defaults.font.family = "Marianne";
      
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: years,
          datasets: [
            {
              label: "Allemagne",
              data: germanyExports,
              borderColor: "#000091",
              backgroundColor: "rgba(0, 0, 145, 0.1)",
              borderWidth: 3,
              pointRadius: 4,
              pointBackgroundColor: "#000091",
              pointBorderColor: "#000091",
              pointHoverRadius: 6,
              tension: 0.3,
              fill: false,
            },
            {
              label: "Chine",
              data: chinaExports,
              borderColor: "#e1000f",
              backgroundColor: "rgba(225, 0, 15, 0.1)",
              borderWidth: 3,
              pointRadius: 4,
              pointBackgroundColor: "#e1000f",
              pointBorderColor: "#e1000f",
              pointHoverRadius: 6,
              tension: 0.3,
              fill: false,
            },
          ],
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
                  size: 14,
                  family: "Marianne",
                },
                padding: 15,
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
                  return context.dataset.label + ": " + context.parsed.y.toFixed(2) + " Md$";
                },
              },
            },
          },
          scales: {
            x: {
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
              beginAtZero: true,
              grid: {
                color: "#e5e5e5",
                borderDash: [3, 3],
              },
              ticks: {
                font: {
                  size: 12,
                },
                callback: function (value) {
                  return value.toFixed(1) + " Md$";
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


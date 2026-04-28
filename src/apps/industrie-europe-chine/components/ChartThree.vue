<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="loading-container">
      <p>Chargement des données...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>
    <canvas v-else id="chartThree"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js";
import appStore from "@/apps/industrie-europe-chine/store";

export default {
  name: "ChartThree",
  data() {
    return {
      chart: null,
      loading: true,
      error: null,
      apiData: null,
      resizeTimeout: null,
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
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    window.removeEventListener('resize', this.handleResize);
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  },
  methods: {
    handleResize() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        if (this.chart) {
          this.chart.destroy();
        }
        if (this.apiData && this.apiData.length > 0) {
          this.$nextTick(() => {
            this.buildChart();
          });
        }
      }, 250);
    },
    async fetchData() {
        try {
          this.loading = true;
        
        const countryFr = this.selectedCountry || 'France';
        const countryEn = appStore.state.countryToApiName[countryFr];
        const category = this.selectedCategory || ` Fabrication d'articles textiles confectionnés, sauf habillement`;
        const categoryId = appStore.state.categoryToId[category];
        const competitor = this.selectedCompetitor || 'Chine';
        const resourceId = appStore.state.competitorResourceIds[competitor].indicator3;
        const url = process.env.VUE_APP_TABULAR_API + '/api/resources/' + resourceId + '/data/?code_categorie__exact=' + categoryId + '&window_end__greater=2000&HOME__exact=' + encodeURIComponent(countryEn) + '&page_size=50';
        
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
    
    applyRollingAverage(data, windowSize = 5) {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const window = data.slice(start, i + 1);
        const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
        result.push(avg);
      }
      return result;
    },
    
    buildChart() {
      if (!this.apiData || this.apiData.length === 0) {
        this.error = "Aucune donnée disponible";
        return;
      }

      const years = [];
      const data50pct = [];
      const data100pct = [];
      const data150pct = [];
      const data200pct = [];
      
      this.apiData.forEach(item => {
        years.push(item.window_end);
        // Convertir en pourcentage (multiplier par 100)
        data50pct.push(parseFloat(item.cn_ge_50pct_home) * 100);
        data100pct.push(parseFloat(item.cn_ge_100pct_home) * 100);
        data150pct.push(parseFloat(item.cn_ge_150pct_home) * 100);
        data200pct.push(parseFloat(item.cn_ge_200pct_home) * 100);
      });
      
      const smoothed50pct = this.applyRollingAverage(data50pct, 5);
      const smoothed100pct = this.applyRollingAverage(data100pct, 5);
      const smoothed150pct = this.applyRollingAverage(data150pct, 5);
      const smoothed200pct = this.applyRollingAverage(data200pct, 5);

      const ctx = document.getElementById("chartThree").getContext("2d");
      Chart.defaults.font.family = "Marianne";
      
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: years,
          datasets: [
            {
              label: `${this.selectedCompetitor} ≥ 50% ${this.selectedCountry}`,
              data: smoothed50pct,
              borderColor: "#000091",
              backgroundColor: "rgba(0, 0, 145, 0.05)",
              borderWidth: 2.5,
              pointRadius: 3,
              pointBackgroundColor: "#000091",
              pointBorderColor: "#000091",
              pointHoverRadius: 5,
              tension: 0.3,
              fill: false,
            },
            {
              label: `${this.selectedCompetitor} ≥ 100% ${this.selectedCountry}`,
              data: smoothed100pct,
              borderColor: "#6A6AF4",
              backgroundColor: "rgba(106, 106, 244, 0.05)",
              borderWidth: 2.5,
              pointRadius: 3,
              pointBackgroundColor: "#6A6AF4",
              pointBorderColor: "#6A6AF4",
              pointHoverRadius: 5,
              tension: 0.3,
              fill: false,
            },
            {
              label: `${this.selectedCompetitor} ≥ 150% ${this.selectedCountry}`,
              data: smoothed150pct,
              borderColor: "#e1000f",
              backgroundColor: "rgba(225, 0, 15, 0.05)",
              borderWidth: 2.5,
              pointRadius: 3,
              pointBackgroundColor: "#e1000f",
              pointBorderColor: "#e1000f",
              pointHoverRadius: 5,
              tension: 0.3,
              fill: false,
            },
            {
              label: `${this.selectedCompetitor} ≥ 200% ${this.selectedCountry}`,
              data: smoothed200pct,
              borderColor: "#FF6B6B",
              backgroundColor: "rgba(255, 107, 107, 0.05)",
              borderWidth: 2.5,
              pointRadius: 3,
              pointBackgroundColor: "#FF6B6B",
              pointBorderColor: "#FF6B6B",
              pointHoverRadius: 5,
              tension: 0.3,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: window.innerWidth < 768 ? 1.2 : 2.5,
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
                  return context.dataset.label + ": " + context.parsed.y.toFixed(1) + "%";
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

@media screen and (max-width: 767px) {
  .chart-wrapper {
    min-height: 400px;
  }
}
</style>


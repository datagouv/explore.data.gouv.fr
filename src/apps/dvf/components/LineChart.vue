<template>
  <div class="lineChart">
    <canvas v-show="values.length == 60" id="linechart"></canvas>
    <div v-show="values.length != 60">
      <span
        >Il n'y a pas suffisamment de ventes sur cette sélection pour que nous
        puissions faire un graphique pertinent.</span
      >
    </div>
  </div>
</template>

<script>
import appStore from "@/apps/dvf/store";
import { Chart } from "chart.js";

export default {
  name: "LineChart",
  components: {},
  data() {
    return {
      values: [],
      labels: [],
      chart: undefined,
    };
  },
  computed: {
    apiData: function () {
      return appStore.state.apiData;
    },
    activeFilter: function () {
      return appStore.state.activeFilter;
    },
  },
  mounted() {},
  methods: {
    updateValues() {
      var self = this;
      this.values = [];
      this.labels = [];
      this.apiData["data"].forEach(function (d, i) {
        self.labels.push(self.rewriteAnneeMois(d["annee_mois"]));
        if (self.activeFilter == "tous") {
          // This is now false : to change with median below when ready
          //var medAllVentes = Math.round(d["med_prix_m2_appartement"]);
          var medAllVentes = Math.round(
            (d["nb_ventes_appartement"] * d["moy_prix_m2_appartement"] +
              d["nb_ventes_maison"] * d["moy_prix_m2_maison"]) /
              (d["nb_ventes_appartement"] + d["nb_ventes_maison"])
          );
        } else if (self.activeFilter == "appartement") {
          var medAllVentes = Math.round(d["med_prix_m2_appartement"]);
        } else if (self.activeFilter == "maison") {
          var medAllVentes = Math.round(d["med_prix_m2_maison"]);
        } else if (self.activeFilter == "local") {
          var medAllVentes = Math.round(d["med_prix_m2_local"]);
        }
        if (!isNaN(medAllVentes) && medAllVentes != 0) {
          self.values.push(medAllVentes);
        }
      });
    },
    buildChart() {
      var self = this;
      const ctx = document.getElementById("linechart").getContext("2d");
      Chart.defaults.font.family = "Marianne";
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.labels,
          datasets: [
            {
              data: this.values,
              borderWidth: 1,
              pointRadius: 10,
              pointBackgroundColor: "rgba(22, 22, 22, 0)",
              pointBorderColor: "rgba(22, 22, 22, 0)",
              pointHoverBorderColor: "rgba(74, 157, 247, 1)",
              pointHoverBackgroundColor: "rgba(74, 157, 247, 1)",
              borderColor: "rgba(22, 22, 22, 1)",
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(74, 157, 247, 1)",
              bodyColor: "rgba(255, 255, 255, 1)",
              displayColors: false,
              callbacks: {
                label: function (tooltipItems) {
                  return tooltipItems.formattedValue + "€";
                },
                title: function (tooltipItems) {
                  return tooltipItems[0].label;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                callback: function (value, index, ticks) {
                  if (index == 0 || index == self.labels.length - 1) {
                    return self.labels[index];
                  }
                },
              },
            },
            y: {
              beginAtZero: false,
              grid: {
                display: true,
                drawBorder: false,
                color: "#e5e5e5",
                borderDash: [3],
              },
              ticks: {
                callback: function (value, index, ticks) {
                  if (index == 0 || index == ticks.length - 1) {
                    return value + "€";
                  }
                },
              },
            },
          },
        },
      });
    },
    rewriteAnneeMois(anneemois) {
      var annee = anneemois.slice(0, 4);
      var mois = anneemois.slice(5, 8);
      var writeMois = "";
      switch (mois) {
        case "01":
          writeMois = "jan";
          break;
        case "02":
          writeMois = "fev";
          break;
        case "03":
          writeMois = "mar";
          break;
        case "04":
          writeMois = "avr";
          break;
        case "05":
          writeMois = "mai";
          break;
        case "06":
          writeMois = "juin";
          break;
        case "07":
          writeMois = "juil";
          break;
        case "08":
          writeMois = "aou";
          break;
        case "09":
          writeMois = "sep";
          break;
        case "10":
          writeMois = "oct";
          break;
        case "11":
          writeMois = "nov";
          break;
        case "12":
          writeMois = "dec";
          break;
      }
      return writeMois + " " + annee;
    },
  },
  watch: {
    apiData() {
      this.updateValues();
    },
    values() {
      if (this.chart) {
        this.chart.data.datasets[0].data = this.values;
        this.chart.labels = this.labels;
        this.chart.update();
      } else {
        this.buildChart();
      }
    },
    activeFilter() {
      this.updateValues();
    },
  },
};
</script>

<style scoped>
.lineChart {
  width: 100%;
  height: auto;
  max-height: 120px;
  margin-top: 20px;
}

.lineChart canvas {
  width: 100%;
  max-height: 120px;
}

.lineChart div {
  font-size: 12px;
  font-weight: 400;
  background-color: #f6f6f6;
  padding: 5px;
  line-height: 20px !important;
}
</style>
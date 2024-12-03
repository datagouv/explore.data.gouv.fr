<template>
  <div
    class="fr-table"
    :class="infosDgv.resource == undefined ? '' : 'padding'"
  >
    <table ref="table" @scroll="handleScroll($event)">
      <thead id="tabhead">
        <tr>
          <th
            scope="col"
            class="header sticky-bar"
            :class="{ 'header--sorted': field.key === sortBy, 'filter--filled': getFilter(field.key) }"
            v-for="field in fields"
            :key="'header-' + field.key"
          >
            <div
              class="fr-grid-row fr-grid-row--middle no-wrap"
              @mouseover="hoverArrow = true"
              @mouseleave="hoverArrow = false"
            >
              <div 
                class="fr-col-auto"
                v-if="field.key === sortBy"
                @click="sortbyfield(field.key)"
              >

                <span
                  class="fr-icon-arrow-down-line text-label-blue-cumulus"
                  :class="{
                    'fr-icon-arrow-down-line': sortDesc,
                    'fr-icon-arrow-up-line': !sortDesc,
                  }"
                  aria-hidden="true"
                ></span>
                
              </div>
              <div
                @click="sortbyfield(field.key)"
                class="fr-col style-header-col"
                :class="{ 'text-label-blue-cumulus': field.key === sortBy || getFilter(field.key) }"
              >
                {{ field.label }}
              </div>
              <div
                class="style-header-col fr-col-auto filter-icon"
              >
                <button
                  :class="{ 'text-label-blue-cumulus': field.key === sortBy }"
                  data-fr-opened="false"
                  :aria-controls="'fr-modal-' + field.key"
                >
                  <span
                    v-if="columnsInfos && columnsInfos[field.key]"
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.25 2.5V3.5H10.75L8.25 7.25V11.5H5.25V7.25L2.75 3.5H2.25V2.5H11.25ZM3.952 3.5L6.25 6.947V10.5H7.25V6.947L9.548 3.5H3.952Z" fill="#929292"/>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            <FieldModal :id="'fr-modal-' + field.key" :field="field" />
          </th>
        </tr>
        <!-- <tr>
          <th
            scope="col"
            v-for="field in fields"
            :key="'filter-' + field.key"
            class="filter"
            :class="getInputFilterClass(field.key)"
          >
            <Input :field="field" />
          </th>
        </tr> -->
      </thead>
      
      <tbody ref="body" id="body">
        <tr v-for="(row, index) in rows" :key="row[0]">
          <td
            @mouseleave="hideTooltips"
            @mouseenter="loadTooltip(field.key, index)"
            @click="loadTooltip(field.key, index)"
            v-for="field in fields"
            :key="'row-' + index + '-' + field.key"
          >
            <div class="cell">
              <span
                v-if="
                  columnsInfos &&
                  columnsInfos[field.key] &&
                  columnsInfos[field.key]['format'] === 'url'
                "
                :class="getCellColor(field.key, row[field.key])"
              >
                <a :href="row[field.key]">{{ row[field.key] }}</a>
              </span>
              <span v-else :class="getCellColor(field.key, row[field.key])">
                {{ row[field.key] }}
              </span>
            </div>
            <template
              v-if="
                columnsInfos[field.key] &&
                isTooltipActive(field.key, index) &&
                displayTooltip &&
                messageBox != ''
              "
            >
              <Tooltip
                v-if="columnsInfos[field.key]['format'] === 'siren'"
                explanation="Il semblerait que ce champ soit un numéro d'entreprise (numéro Siren)"
                :content="'Entreprise : ' + messageBox"
                link="En savoir plus sur cette entreprise"
                :linkHref="gotoAE('siren', row[field.key])"
              />
              <Tooltip
                v-if="columnsInfos[field.key]['format'] === 'siret'"
                explanation="Il semblerait que ce champ soit un numéro d'entreprise (numéro Siret)"
                :content="'Entreprise : ' + messageBox"
                link="En savoir plus sur cette entreprise"
                :linkHref="gotoAE('siret', row[field.key])"
              />
              <Tooltip
                v-else-if="
                  columnsInfos[field.key]['format'] == 'code_departement'
                "
                explanation="Il semblerait que ce champ soit un code de département"
                :content="'Département : ' + messageBox"
              />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'code_region'"
                explanation="Il semblerait que ce champ soit un code de région"
                :content="'Région : ' + messageBox"
              />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] == 'departement'"
                explanation="Il semblerait que ce champ soit un nom de département"
                :content="'Code Département : ' + messageBox"
              />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'region'"
                explanation="Il semblerait que ce champ soit un nom de région"
                :content="'Code Région : ' + messageBox"
              />
              <Tooltip
                v-else-if="
                  columnsInfos[field.key]['format'] === 'code_commune_insee'
                "
                explanation="Il semblerait que ce champ soit un code commune"
                :content="'Commune : ' + messageBox"
              />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'code_postal'"
                explanation="Il semblerait que ce champ soit un code postal"
                :content="'Commune possibles : ' + messageBox"
              />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'commune'"
                explanation="Il semblerait que ce champ soit une commune"
                :content="'Code commune : ' + messageBox"
              />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'email'"
                explanation="Il semblerait que ce champ soit un email"
                link="Ecrire un mail"
                content=""
                :linkHref="'mailto:' + row[field.key]"
              />
              <Tooltip
                v-else-if="
                  columnsInfos[field.key]['format'] === 'longitude_wgs' ||
                  columnsInfos[field.key]['format'] ===
                    'longitude_wgs_fr_metropole'
                "
                explanation="Il semblerait que ce champ soit une coordonnée de longitude. Nous avons également trouvé une coordonnée de latitude dans le fichier."
                link="Voir sur une carte"
                :content="'La localisation semble être à ' + messageBox"
                :linkHref="banurl"
              />
              <Tooltip
                v-else-if="
                  columnsInfos[field.key]['format'] === 'latitude_wgs' ||
                  columnsInfos[field.key]['format'] ===
                    'latitude_wgs_fr_metropole'
                "
                explanation="Il semblerait que ce champ soit une coordonnée de latitude. Nous avons également trouvé une coordonnée de longitude dans le fichier."
                link="Voir sur une carte"
                :content="'La localisation semble être à ' + messageBox"
                :linkHref="banurl"
              />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'latlon_wgs'"
                explanation="Il semblerait que ce champ contienne des coodonnées géographiques."
                link="Voir sur une carte"
                :content="'La localisation semble être à ' + messageBox"
                :linkHref="banurl"
              />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'adresse'"
                explanation="Il semblerait que ce champ soit une adresse."
                link="Voir sur une carte"
                :content="'Adresse consolidée : ' + messageBox"
                :linkHref="banurl"
              />
            </template>
          </td>
        </tr>
      </tbody>
      <button
        v-if="rows.length >= 10"
        class="fr-tag fr-tag--sm"
        @click="forceUserChangePage()"
      >
        Charger plus de données
      </button>
      <div v-if="rows.length === 0 && filters.left > 0">
        <br />
        <p>
          Basé sur les filtres appliqués, l'explorateur ne trouve aucun résultat
          dans le fichier.
        </p>
      </div>
      <div v-if="rows.length < 10" class="messageNoResults"></div>
    </table>
  </div>
</template>

<script>
import { filtersEnabled } from "@/config";
import Filters from "@/apps/tabular/views/Filters";
import Histogram from "@/apps/tabular/views/Histogram.vue";
import Tooltip from "@/apps/tabular/views/Tooltip.vue";
import Input from "@/apps/tabular/views/Input.vue";
import FieldModal from "@/apps/tabular/views/FieldModal.vue";
import storeTabular from '@/apps/tabular/store/storeTabular'

export default {
  name: "Table",
  components: { Filters, Histogram, Tooltip, Input, FieldModal },
  store: storeTabular,
  data() {
    return {
      filtersEnabled,
      hoverArrow: false,
      timer: undefined,
      filterTextSearch: undefined,
      filter: {
        field: "",
        value: "",
        comp: "",
      },
      categoricalInfos: [],
      topInfos: [],
      numericPlotInfosBins: [],
      numericPlotInfosCounts: [],
      activeTooltips: {},
      messageBox: "",
      displayTooltip: true,
      banurl: "",
      additionalInformations: {
        siren: {},
        siret: {},
        code_departement: {},
        code_region: {},
        code_commune_insee: {},
        code_postal: {},
        commune: {},
        email: {},
        latlonseparate: {},
        adresse: {},
        departement: {},
        region: {},
        url: {},
      },
      lastBiggerScroll: 0,
    };
  },
  computed: {
    dgvInfos() {
      return this.$store.state.dgv_infos;
    },
    rows() {
      return this.$store.state.rows;
    },
    totalRows() {
      return this.$store.state.totalRows;
    },
    fields() {
      return this.$store.getters.fields;
    },
    filters() {
      return this.$store.state.filters;
    },
    pageSize() {
      return this.$store.state.pageSize;
    },
    generalInfos() {
      return this.$store.state.generalInfos;
    },
    columnsInfos() {
      return this.$store.state.columnsInfos;
    },
    colorsCat() {
      return this.$store.state.colorsCat;
    },
    sortDesc() {
      return this.$store.state.sortDesc;
    },
    sortBy() {
      return this.$store.state.sortBy;
    },
    dataEndpoint() {
      return this.$store.state.dataEndpoint;
    },
    infosDgv() {
      return this.$store.state.dgv_infos;
    },
    page: {
      get() {
        return this.$store.state.page;
      },
      set(newValue) {
        this.$store.commit("setPage", newValue);
      },
    },
  },
  methods: {
    getLocalOrFetch(format, value, url) {
      if (!this.additionalInformations[format][value]) {
        this.additionalInformations[format][value] = fetch(url).then(
          (response) => {
            return response.json();
          }
        );
      }
      return this.additionalInformations[format][value];
    },
    getFilter(field) {
      return this.filters.find((filter) => filter.field === field);
    },
    getInputFilterClass(field) {
      const filtered = !!this.getFilter(field);
      return { "filter--filled": filtered };
    },
    isTooltipActive(field, index) {
      return this.activeTooltips[index]
        ? this.activeTooltips[index][field]
        : false;
    },
    loadTooltip(field, index) {
      this.messageBox = "";
      this.displayTooltip = false;
      const val = this.rows[index][field];
      if (this.columnsInfos.hasOwnProperty(field)) {
        if (this.columnsInfos[field]["format"] == "siren" && val != null) {
          this.getLocalOrFetch(
            this.columnsInfos[field]["format"],
            val,
            "https://recherche-entreprises.api.gouv.fr/search?q=" +
              val +
              "&page=1&per_page=1&mtm_campaign=explore-data-gouv-fr"
          )
            .then((data) => {
              this.messageBox = data["results"][0]["nom_complet"];
              this.displayTooltip = true;
            })
            .catch((err) => {
              // Do something for an error here
            });
        }
        if (this.columnsInfos[field]["format"] == "siret" && val != null) {
          this.getLocalOrFetch(
            this.columnsInfos[field]["format"],
            val.replace(" ", ""),
            "https://recherche-entreprises.api.gouv.fr/search?q=" +
              val.replace(" ", "") +
              "&page=1&per_page=1&mtm_campaign=explore-data-gouv-fr"
          )
            .then((data) => {
              this.messageBox = data["results"][0]["nom_complet"];
              this.displayTooltip = true;
            })
            .catch((err) => {
              // Do something for an error here
            });
        }
        if (this.columnsInfos[field]["format"] == "code_departement") {
          this.getLocalOrFetch(
            this.columnsInfos[field]["format"],
            val,
            "https://geo.api.gouv.fr/departements/" + val
          )
            .then((data) => {
              this.messageBox = data["nom"];
              this.displayTooltip = true;
            })
            .catch((err) => {
              // Do something for an error here
            });
        }
        if (this.columnsInfos[field]["format"] == "departement") {
          this.getLocalOrFetch(
            this.columnsInfos[field]["format"],
            val,
            "https://geo.api.gouv.fr/departements?nom=" + val
          )
            .then((data) => {
              if (data[0]["_score"] > 0.75) {
                this.messageBox = data[0]["code"];
                this.displayTooltip = true;
              }
            })
            .catch((err) => {
              // Do something for an error here
            });
        }
        if (this.columnsInfos[field]["format"] == "code_region") {
          this.getLocalOrFetch(
            this.columnsInfos[field]["format"],
            val,
            "https://geo.api.gouv.fr/regions/" + val
          )
            .then((data) => {
              this.messageBox = data["nom"];
              this.displayTooltip = true;
            })
            .catch((err) => {
              // Do something for an error here
            });
        }
        if (this.columnsInfos[field]["format"] == "region") {
          this.getLocalOrFetch(
            this.columnsInfos[field]["format"],
            val,
            "https://geo.api.gouv.fr/regions?nom=" + val
          )
            .then((data) => {
              if (data[0]["_score"] > 0.75) {
                this.messageBox = data[0]["code"];
                this.displayTooltip = true;
              }
            })
            .catch((err) => {
              // Do something for an error here
            });
        }
        if (this.columnsInfos[field]["format"] == "code_commune_insee") {
          this.getLocalOrFetch(
            this.columnsInfos[field]["format"],
            val,
            "https://geo.api.gouv.fr/communes/" + val
          )
            .then((data) => {
              this.messageBox = data["nom"];
              this.displayTooltip = true;
            })
            .catch((err) => {
              // Do something for an error here
            });
        }
        if (this.columnsInfos[field]["format"] == "code_postal") {
          this.getLocalOrFetch(
            this.columnsInfos[field]["format"],
            val,
            "https://geo.api.gouv.fr/communes?codePostal=" + val
          )
            .then((data) => {
              let msg = "";
              data.slice(0, 5).forEach((d) => {
                msg = msg + d["nom"] + ", ";
              });
              msg = msg.slice(0, -2);
              if (data.length > 5) {
                msg = msg + "...";
              }
              this.messageBox = msg;
              this.displayTooltip = true;
            })
            .catch((err) => {
              // Do something for an error here
            });
        }
        if (this.columnsInfos[field]["format"] == "commune") {
          this.getLocalOrFetch(
            this.columnsInfos[field]["format"],
            val,
            "https://geo.api.gouv.fr/communes?nom=" + val
          )
            .then((data) => {
              if (data[0]["_score"] > 0.75) {
                this.messageBox = data[0]["code"];
                this.displayTooltip = true;
              }
            })
            .catch((err) => {
              // Do something for an error here
            });
        }
        if (this.columnsInfos[field]["format"] == "email") {
          this.messageBox = '<href="mailto:' + val + '"></a>';
          this.displayTooltip = true;
        }
        if (
          this.columnsInfos[field]["format"] == "longitude_wgs" ||
          this.columnsInfos[field]["format"] == "longitude_wgs_fr_metropole"
        ) {
          for (let c in this.columnsInfos) {
            if (
              this.columnsInfos[c]["format"] == "latitude_wgs" ||
              this.columnsInfos[c]["format"] == "latitude_wgs_fr_metropole"
            ) {
              this.getLocalOrFetch(
                "latlonseparate",
                this.rows[index][c] + "," + val,
                "https://geo.api.gouv.fr/communes?lon=" +
                  val +
                  "&lat=" +
                  this.rows[index][c]
              )
                .then((data) => {
                  this.messageBox =
                    data[0]["nom"] + " (" + data[0]["code"] + ")";
                  this.banurl =
                    "https://adresse.data.gouv.fr/base-adresse-nationale#15/" +
                    this.rows[index][c] +
                    "/" +
                    val;
                  this.displayTooltip = true;
                })
                .catch((err) => {
                  // Do something for an error here
                });
            }
          }
        }
        if (
          this.columnsInfos[field]["format"] == "latitude_wgs" ||
          this.columnsInfos[field]["format"] == "latitude_wgs_fr_metropole"
        ) {
          for (let c in this.columnsInfos) {
            if (
              this.columnsInfos[c]["format"] == "longitude_wgs" ||
              this.columnsInfos[c]["format"] == "longitude_wgs_fr_metropole"
            ) {
              this.getLocalOrFetch(
                "latlonseparate",
                val + "," + this.rows[index][c],
                "https://geo.api.gouv.fr/communes?lon=" +
                  this.rows[index][c] +
                  "&lat=" +
                  val
              )
                .then((data) => {
                  this.messageBox =
                    data[0]["nom"] + " (" + data[0]["code"] + ")";
                  this.banurl =
                    "https://adresse.data.gouv.fr/base-adresse-nationale#15/" +
                    val +
                    "/" +
                    this.rows[index][c];
                  this.displayTooltip = true;
                })
                .catch((err) => {
                  // Do something for an error here
                });
            }
          }
        }
        if (this.columnsInfos[field]["format"] == "latlon_wgs") {
          if (val && val.split(",").length === 2) {
            let lon = val.split(",")[0].replace("[", "").replace("]", "");
            let lat = val.split(",")[1].replace("[", "").replace("]", "");
            this.getLocalOrFetch(
              "latlonseparate",
              lat + "," + lon,
              "https://geo.api.gouv.fr/communes?lon=" + lon + "&lat=" + lat
            )
              .then((data) => {
                this.messageBox = data[0]["nom"] + " (" + data[0]["code"] + ")";
                this.banurl =
                  "https://adresse.data.gouv.fr/base-adresse-nationale#15/" +
                  lat +
                  "/" +
                  lon;
                this.displayTooltip = true;
              })
              .catch((err) => {
                // Do something for an error here
              });
          }
        }
        if (this.columnsInfos[field]["format"] == "adresse") {
          let cci = "";
          for (let c in this.columnsInfos) {
            if (this.columnsInfos[c]["format"] == "code_commune_insee") {
              cci = "&citycode=" + this.rows[index][c];
            }
          }
          let adr = val + cci;
          cci = "";
          for (let c in this.columnsInfos) {
            if (this.columnsInfos[c]["format"] == "code_postal") {
              cci = "&code_postal=" + this.rows[index][c];
            }
          }
          adr = adr + cci;
          this.getLocalOrFetch(
            "adresse",
            adr,
            "https://api-adresse.data.gouv.fr/search/?q=" + adr
          )
            .then((data) => {
              this.messageBox = data["features"][0]["properties"]["label"];
              this.banurl =
                "https://adresse.data.gouv.fr/base-adresse-nationale/" +
                data["features"][0]["properties"]["id"];
              this.displayTooltip = true;
            })
            .catch((err) => {
              // Do something for an error here
            });
        }
        this.hideTooltips();
        if (!this.activeTooltips[index]) {
          this.$set(this.activeTooltips, index, {});
        }
        this.$set(this.activeTooltips[index], field, true);
        this.$set(this.activeTooltips, index, this.activeTooltips[index]);
      }
    },
    hideTooltips() {
      for (let index in this.activeTooltips) {
        for (let key in this.activeTooltips[index]) {
          this.$set(this.activeTooltips[index], key, false);
          this.$set(this.activeTooltips, index, this.activeTooltips[index]);
        }
      }
    },
    sortbyfield(field) {
      let obj = {};
      if (field == this.sortBy) {
        obj.sortBy = field;
        if (this.sortDesc == true) {
          obj.sortDesc = false;
        } else {
          obj.sortDesc = true;
        }
      } else {
        obj.sortBy = field;
        obj.sortDesc = false;
      }
      this.lastBiggerScroll = 0;
      return this.$store.dispatch("sort", obj);
    },
    changePage() {
      return this.$store.dispatch("changePage");
    },
    getCellColor(col, value) {
      const color = this.$store.getters.color(col, value);
      let classes = "cat" + color;
      if (color > 0) {
        classes += " fr-badge";
      }
      return classes;
    },
    gotoAE(type, id) {
      if (type == "siren") {
        return "https://annuaire-entreprises.data.gouv.fr/entreprise/" + id;
      } else if (type == "siret") {
        return "https://annuaire-entreprises.data.gouv.fr/etablissement/" + id;
      }
    },
    handleScroll(event) {
    const { top, height } = event.target.getBoundingClientRect()
      if (top + event.target.scrollTop > this.lastBiggerScroll) {
        this.lastBiggerScroll = top + event.target.scrollTop + height;
        this.userChangePage();
      }
    },
    forceUserChangePage() {
      this.lastBiggerScroll = 0;
      this.userChangePage();
    },
    userChangePage() {
      this.page = this.page + 1;
      this.changePage();
    },
    exportData() {
      return this.dataEndpoint + "csv/" + document.location.search;
    },
  },
  created() {},
  destroyed() {},
  watch: {
    filters: {
      deep: true,
      immediate: true,
      handler() {
        this.lastBiggerScroll = 0;
      },
    },
  },
};
</script>
<style scoped>
html {
  height: 100%;
  overflow: hidden;
}
.fr-table td {
  padding: 0.5rem 0rem 0.5rem 1.2rem!important;
  border-right: 1px solid #DDDDDD;

}
.fr-table {
  overflow: auto;
  height: 100%;
  margin-bottom: 0;
  border-top: 1px solid black;
  padding-top: 0px;
}
.fr-table table {
  height: 100%;
}
.fr-table thead {
  background-color: white;
  background-image: none;
  position: sticky;
  top: 0;
  z-index: 999;
}
.fr-table tbody {
  height: auto;
}

th {
  vertical-align: middle;
}
th,
td {
  position: relative;
}
.titleColumn:hover {
  cursor: pointer;
}
.fr-table tbody tr:hover {
  background-color: var(--background-alt-blue-cumulus-hover);
}
.fr-table tbody td:hover {
  background-color: var(--background-contrast-blue-cumulus-hover);
}
.header,
.filter {
  border-bottom: 2px solid var(--border-plain-grey);
  border-right: 1px solid #DDDDDD;
}
.header--sorted,
.filter--filled {
  border-color: var(--border-plain-blue-cumulus);
}
.header {
  min-width: 10rem;
  max-width: 17rem;
}
.header.sticky-bar {
  padding: 0.45rem 1rem 0.4rem 1rem;
  font-size: 0.8rem;
}
.header.sticky-bar div {
  max-height: 80px;
  overflow: auto;
  line-height: 17px;
}
.filter {
  border-width: 1px;
}
.cell {
    padding: 0px;
    height: 3rem;
    overflow-y: auto;
    display: block;
    width: 100%;
    font-size: 12px;
    line-height: 20px;
    display: flex;
    align-items: center;
}
.style-header-col {
  cursor: pointer;
  white-space: nowrap;
  font-size: 12px;
}
.messageNoResults {
  min-height: 400px;
}
.filter-icon{
  text-align: right;
}

.fr-badge {
  line-height: 1.2rem;
}

@media (min-width: 48em) {
  .style-header-col {
    white-space: normal;
  }
}
</style>

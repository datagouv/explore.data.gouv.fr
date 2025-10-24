<template>
  <div id="filtersContainer">
    <div
      id="parcelleBox"
      :class="openParcelleFilters ? 'open' : ''"
    >
      <div
        class="filtersHeader"
        @click="openParcelleFilters ? (openParcelleFilters = false) : (openParcelleFilters = true)"
      >
        <div>
          Rechercher par parcelle cadastrale
        </div>
        <div class="filtersIcon">
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.99999 3.78132L8.29999 0.481323L9.24266 1.42399L4.99999 5.66666L0.757324 1.42399L1.69999 0.481323L4.99999 3.78132Z"
              fill="#161616"
            />
          </svg>
        </div>
      </div>
      <div class="filtersBody">
        <div class="parcelle-input-section">
          <label class="filtersTitle">Identifiant complet de la parcelle</label>
          <input
            v-model="parcelleInput"
            type="text"
            placeholder="Ex: 23150000A0001"
            class="parcelle-input"
            @input="onParcelleInputChange"
          />
          <div v-if="parcelleInputError" class="parcelle-error">
            {{ parcelleInputError }}
          </div>
        </div>

        <div class="parcelle-compose-section">
          <div class="filtersTitle">Ou composez-le pas à pas</div>
          <div class="select-group">
            <label>Département</label>
            <select v-model="selectedDepartement" @change="onDepartementChange" class="parcelle-select">
              <option value="">Sélectionner un département</option>
              <option v-for="[code, dept] in sortedDepartements" :key="code" :value="code">
                {{ code }} - {{ dept.nom }}
              </option>
            </select>
          </div>
          <div v-if="selectedDepartement" class="select-group">
            <label>Commune</label>
            <select v-model="selectedCommune" @change="onCommuneChange" class="parcelle-select" :disabled="!communes.length">
              <option value="">Sélectionner une commune</option>
              <option v-for="commune in communes" :key="commune.code" :value="commune.code">
                {{ commune.nom }} ({{ commune.code }})
              </option>
            </select>
          </div>

          <div v-if="selectedCommune === '75056' || selectedCommune === '69123' || selectedCommune === '13055'" class="select-group">
            <label>Arrondissement</label>
            <select v-model="selectedArrondissement" @change="onArrondissementChange" class="parcelle-select">
              <option value="">Sélectionner un arrondissement</option>
              <option v-for="arrondissement in arrondissements" :key="arrondissement.code" :value="arrondissement.code">
                {{ arrondissement.nom }} ({{ arrondissement.code }})
              </option>
            </select>
          </div>

          <div v-if="selectedCommune" class="select-group">
            <label>Section cadastrale</label>
            <select v-model="selectedSection" @change="onSectionChange" class="parcelle-select" :disabled="!sections.length">
              <option value="">Sélectionner une section</option>
              <option v-for="section in sections" :key="section.properties.id.replace(section.properties.commune, '')" :value="section.properties.id.replace(section.properties.commune, '')">
                {{ section.properties.id.replace(section.properties.commune, '') }}{{ section.properties.nom ? ' - ' + section.properties.nom : '' }}
              </option>
            </select>
          </div>
          <div v-if="selectedSection" class="select-group">
            <label>Parcelle ({{ parcelles.length }} trouvées)</label>
            <select v-model="selectedParcelle" @change="onParcelleChange" class="parcelle-select" :disabled="parcelles.length === 0">
              <option value="">Sélectionner une parcelle</option>
              <option v-for="parcelle in parcelles" :key="parcelle.properties.id" :value="parcelle.properties.id">
                {{ parcelle.properties.id }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="userLocation.level != 'section' && userLocation.level != 'parcelle'"
      id="filtersBox"
      :class="openFilters ? 'open' : ''"
    >
      <div
        class="filtersHeader"
        @click="openFilters ? (openFilters = false) : (openFilters = true)"
      >
        <div>
          Type de biens
          <span v-if="activeFilter == 'tous'"> Appartements et maisons </span>
          <span v-if="activeFilter == 'appartement'"> Appartements </span>
          <span v-if="activeFilter == 'maison'"> Maisons </span>
          <span v-if="activeFilter == 'local'"> Locaux </span>
        </div>
        <div class="filtersIcon">
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.99999 3.78132L8.29999 0.481323L9.24266 1.42399L4.99999 5.66666L0.757324 1.42399L1.69999 0.481323L4.99999 3.78132Z"
              fill="#161616"
            />
          </svg>
        </div>
      </div>
      <div class="filtersBody">
        <div
          class="filter"
          :class="activeFilter == 'tous' ? 'selected' : ''"
          @click="updateActiveFilter('tous')"
        >
          <div></div>
          Appartements et maisons
        </div>
        <div
          class="filter"
          :class="activeFilter == 'appartement' ? 'selected' : ''"
          @click="updateActiveFilter('appartement')"
        >
          <div></div>
          Appartements
        </div>
        <div
          class="filter"
          :class="activeFilter == 'maison' ? 'selected' : ''"
          @click="updateActiveFilter('maison')"
        >
          <div></div>
          Maisons
        </div>
        <div
          class="filter"
          :class="activeFilter == 'local' ? 'selected' : ''"
          @click="updateActiveFilter('local')"
        >
          <div></div>
          Locaux commerciaux
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appStore from "@/apps/dvf/store";
import centersDeps from "@/apps/dvf/assets/json/centers_deps.json";

export default {
  name: "FiltersBox",
  components: {},
  data() {
    return {
      openFilters: false,
      openParcelleFilters: false,
      parcelleInput: "",
      selectedDepartement: "",
      selectedCommune: "",
      selectedArrondissement: "",
      selectedSection: "",
      selectedParcelle: "",
      communes: [],
      arrondissements: [],
      sections: [],
      parcelles: [],
      departements: centersDeps,
      parcelleInputError: "",
    };
  },
  computed: {
    activeFilter: function () {
      return appStore.state.activeFilter;
    },
    userLocation: function () {
      return appStore.state.userLocation;
    },
    sortedDepartements: function () {
      return Object.entries(this.departements).sort(([codeA], [codeB]) => {
        return codeA.localeCompare(codeB);
      });
    },
  },
  mounted() {},
  methods: {
    updateActiveFilter(f) {
      appStore.commit("updateActiveFilter", f);
      this.$router
        .push({
          name: 'immobilier',
          params: { lang: this.$route.params.lang },
          query: { ...this.$route.query, filtre: f },
        })
        .catch(() => {});
    },
    
    onParcelleInputChange() {
      this.parcelleInputError = "";
      
      if (this.parcelleInput.length >= 14) {
        this.selectedParcelle = this.parcelleInput;
        this.navigateToParcelle(this.parcelleInput);
      }
    },

    async onDepartementChange() {
      this.selectedCommune = "";
      this.selectedArrondissement = "";
      this.selectedSection = "";
      this.selectedParcelle = "";
      this.communes = [];
      this.arrondissements = [];
      this.sections = [];
      this.parcelles = [];
      
      if (this.selectedDepartement) {
        this.navigateToDepartement(this.selectedDepartement);
        
        try {
          const response = await fetch(`https://geo.api.gouv.fr/departements/${this.selectedDepartement}/communes`);
          this.communes = await response.json();
          
          this.communes.sort((a, b) => {
            return a.nom.localeCompare(b.nom);
          });
        } catch (error) {
          console.error("Erreur lors du chargement des communes:", error);
        }
      }
    },

    async onCommuneChange() {
      this.selectedArrondissement = "";
      this.selectedSection = "";
      this.selectedParcelle = "";
      this.arrondissements = [];
      this.sections = [];
      this.parcelles = [];
      
      if (this.selectedCommune) {
        this.navigateToCommune(this.selectedCommune);
        
        if (this.selectedCommune === "75056") {
          this.arrondissements = [
            { code: "75101", nom: "Paris 1er" },
            { code: "75102", nom: "Paris 2e" },
            { code: "75103", nom: "Paris 3e" },
            { code: "75104", nom: "Paris 4e" },
            { code: "75105", nom: "Paris 5e" },
            { code: "75106", nom: "Paris 6e" },
            { code: "75107", nom: "Paris 7e" },
            { code: "75108", nom: "Paris 8e" },
            { code: "75109", nom: "Paris 9e" },
            { code: "75110", nom: "Paris 10e" },
            { code: "75111", nom: "Paris 11e" },
            { code: "75112", nom: "Paris 12e" },
            { code: "75113", nom: "Paris 13e" },
            { code: "75114", nom: "Paris 14e" },
            { code: "75115", nom: "Paris 15e" },
            { code: "75116", nom: "Paris 16e" },
            { code: "75117", nom: "Paris 17e" },
            { code: "75118", nom: "Paris 18e" },
            { code: "75119", nom: "Paris 19e" },
            { code: "75120", nom: "Paris 20e" }
          ];
        } else if (this.selectedCommune === "69123") {
          this.arrondissements = [
            { code: "69381", nom: "Lyon 1er" },
            { code: "69382", nom: "Lyon 2e" },
            { code: "69383", nom: "Lyon 3e" },
            { code: "69384", nom: "Lyon 4e" },
            { code: "69385", nom: "Lyon 5e" },
            { code: "69386", nom: "Lyon 6e" },
            { code: "69387", nom: "Lyon 7e" },
            { code: "69388", nom: "Lyon 8e" },
            { code: "69389", nom: "Lyon 9e" }
          ];
        } else if (this.selectedCommune === "13055") {
          this.arrondissements = [
            { code: "13201", nom: "Marseille 1er" },
            { code: "13202", nom: "Marseille 2e" },
            { code: "13203", nom: "Marseille 3e" },
            { code: "13204", nom: "Marseille 4e" },
            { code: "13205", nom: "Marseille 5e" },
            { code: "13206", nom: "Marseille 6e" },
            { code: "13207", nom: "Marseille 7e" },
            { code: "13208", nom: "Marseille 8e" },
            { code: "13209", nom: "Marseille 9e" },
            { code: "13210", nom: "Marseille 10e" },
            { code: "13211", nom: "Marseille 11e" },
            { code: "13212", nom: "Marseille 12e" },
            { code: "13213", nom: "Marseille 13e" },
            { code: "13214", nom: "Marseille 14e" },
            { code: "13215", nom: "Marseille 15e" },
            { code: "13216", nom: "Marseille 16e" }
          ];
        } else {
          try {
            const response = await fetch(`https://cadastre.data.gouv.fr/bundler/cadastre-etalab/communes/${this.selectedCommune}/geojson/sections`);
            const data = await response.json();
            this.sections = data.features || [];
          } catch (error) {
            console.error("Erreur lors du chargement des sections:", error);
          }
        }
      }
    },

    async onArrondissementChange() {
      this.selectedSection = "";
      this.selectedParcelle = "";
      this.sections = [];
      this.parcelles = [];
      
      if (this.selectedArrondissement) {
        this.navigateToCommune(this.selectedArrondissement);
        
        try {
          const response = await fetch(`https://cadastre.data.gouv.fr/bundler/cadastre-etalab/communes/${this.selectedArrondissement}/geojson/sections`);
          const data = await response.json();
          this.sections = data.features || [];
        } catch (error) {
          console.error("Erreur lors du chargement des sections:", error);
        }
      }
    },

    async onSectionChange() {
      this.selectedParcelle = "";
      this.parcelles = [];
      
      if (this.selectedSection) {
        this.navigateToSection(this.selectedSection);
        
        let communeCodeForApi;
        if ((this.selectedCommune === "75056" || this.selectedCommune === "69123" || this.selectedCommune === "13055") && this.selectedArrondissement) {
          communeCodeForApi = this.selectedArrondissement;
        } else {
          communeCodeForApi = this.selectedCommune;
        }
        
        try {
          const response = await fetch(`https://cadastre.data.gouv.fr/bundler/cadastre-etalab/communes/${communeCodeForApi}/geojson/parcelles`);
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const communeCode = communeCodeForApi;
            
            this.parcelles = data.features.filter(parcelle => {
              const parcelleId = parcelle.properties.id;
              const matches = parcelleId.startsWith(communeCode + this.selectedSection);
              return matches;
            });
            
            this.parcelles.sort((a, b) => {
              return a.properties.id.localeCompare(b.properties.id);
            });
            
          }
        } catch (error) {
          console.error("Erreur lors du chargement des parcelles:", error);
          this.parcelles = [];
        }
      }
    },

    onParcelleChange() {
      if (this.selectedParcelle) {
        this.navigateToParcelle(this.selectedParcelle);
        this.openParcelleFilters = false;
      }
    },

    navigateToDepartement(departementCode) {
      const departement = this.departements[departementCode];
      if (departement) {
        appStore.commit("changeMouseLocation", {
          level: 'departement',
          dep: departementCode,
          depName: departement.nom,
          com: null,
          comName: null,
          section: null,
          sectionName: null,
          parcelle: null,
          parcelleName: null,
        });
        
        this.$router.push({
          name: 'immobilier',
          params: { lang: this.$route.params.lang },
          query: { 
            ...this.$route.query, 
            level: 'departement',
            code: departementCode
          },
        }).catch(() => {});
      }
    },

    navigateToCommune(communeCode) {
      const commune = this.communes.find(c => c.code === communeCode);
      if (commune) {
        const departementCode = this.getDepartementFromCommune(communeCode);
        const departement = this.departements[departementCode];
        appStore.commit("changeMouseLocation", {
          level: 'commune',
          dep: departementCode,
          depName: departement && departement.nom,
          com: communeCode,
          comName: commune.nom,
          section: null,
          sectionName: null,
          parcelle: null,
          parcelleName: null,
        });
        
        this.$router.push({
          name: 'immobilier',
          params: { lang: this.$route.params.lang },
          query: { 
            ...this.$route.query, 
            level: 'commune',
            code: communeCode
          },
        }).catch(() => {});
      }
    },

    navigateToSection(sectionCode) {
      const commune = this.communes.find(c => c.code === this.selectedCommune);
      if (commune) {
        const departementCode = this.getDepartementFromCommune(this.selectedCommune);
        const departement = this.departements[departementCode];
        appStore.commit("changeMouseLocation", {
          level: 'section',
          dep: departementCode,
          depName: departement && departement.nom,
          com: this.selectedCommune,
          comName: commune.nom,
          section: sectionCode,
          sectionName: sectionCode,
          parcelle: null,
          parcelleName: null,
        });
      }
      
      this.$router.push({
        name: 'immobilier',
        params: { lang: this.$route.params.lang },
        query: { 
          ...this.$route.query, 
          level: 'section',
          code: sectionCode
        },
      }).catch(() => {});
    },

    navigateToParcelle(parcelleId) {
      this.getParcelleCoordinates(parcelleId);
      
      const commune = this.communes.find(c => c.code === this.selectedCommune);
      if (commune) {
        const departementCode = this.getDepartementFromCommune(this.selectedCommune);
        const departement = this.departements[departementCode];
        appStore.commit("changeMouseLocation", {
          level: 'parcelle',
          dep: departementCode,
          depName: departement && departement.nom,
          com: this.selectedCommune,
          comName: commune.nom,
          section: this.selectedSection,
          sectionName: this.selectedSection,
          parcelle: parcelleId,
          parcelleName: parcelleId,
        });
      }
      
      this.$router.push({
        name: 'immobilier',
        params: { lang: this.$route.params.lang },
        query: { 
          ...this.$route.query, 
          level: 'parcelle',
          code: parcelleId
        },
      }).catch(() => {});
    },

    getParcelleCoordinates(parcelleId) {
      fetch(
        "https://data.geopf.fr/geocodage/search?index=parcel&q=" + parcelleId
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.features && data.features.length > 0) {
            const parcelle = data.features[0];
            const coordinates = parcelle.geometry.coordinates;
            
            let obj = {};
            obj["coord"] = coordinates;
            obj["citycode"] = parcelle.properties.departmentcode + parcelle.properties.municipalitycode;
            obj["cityname"] = parcelle.properties.label || "Parcelle " + parcelleId;
            appStore.commit("changeSearchBarCoordinates", obj);
            
            this.$emit('simulate-parcelle-click', parcelleId);
            
            this.parcelleInputError = "";
          } else {
            this.parcelleInputError = "L'identifiant de la parcelle n'est pas valide";
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des coordonnées de la parcelle:", error);
          this.parcelleInputError = "Erreur lors de la recherche de la parcelle";
        });
    },

    selectParcelleOnMap(parcelleId) {
      this.$emit('select-parcelle', parcelleId);
    },

    getDepartementFromCommune(communeCode) {
      if (parseInt(communeCode.substring(0, 2)) >= 97) {
        return communeCode.substring(0, 3);
      } else {
        return communeCode.substring(0, 2);
      }
    },
  },
  watch: {},
};
</script>

<style scoped>
#filtersContainer {
  position: absolute;
  top: 50px;
  right: 45px;
  z-index: 9;
}

#filtersBox {
  width: 305px;
  height: 40px;
  background-color: white;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  margin-bottom: 10px;
}

#filtersBox.open {
  height: 170px;
}

#parcelleBox {
  width: 305px;
  height: 40px;
  background-color: white;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}

#parcelleBox.open {
  height: auto;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 8px;
}

.filtersHeader {
  width: 100%;
  height: 40px;
  position: relative;
  cursor: pointer;
  padding-left: 16px;
  border-bottom: 1px solid #e5e5e5;
}

.filtersHeader div {
  display: block;
  position: absolute;
  font-size: 14px;
  font-weight: 700;
  top: 50%;
  transform: translate(0, -50%);
}

.filtersHeader div span {
  color: #355ba2;
  font-size: 12px;
  display: inline-block;
  transform: translate(3px, -1px);
}

.filtersIcon {
  display: block;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translate(0, -50%);
  transition: all 0.2s ease-in-out;
}

#filtersBox.open .filtersIcon,
#parcelleBox.open .filtersIcon {
  transform: translate(0, -50%) rotate(180deg);
}

.filtersBody {
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 5px;
}

.filtersTitle {
  font-size: 12px;
  font-weight: 700;
  margin-top: 5px;
  margin-bottom: 5px;
  display: block;
}

.filter {
  font-size: 14px;
  font-weight: 400;
  display: block;
  cursor: pointer;
}

.filter div {
  width: 20px;
  height: 20px;
  border: 1px solid black;
  display: inline-block;
  border-radius: 50%;
  margin-right: 5px;
  transform: translate(0, 5px);
  position: relative;
}

.filter.selected div:before {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  background-color: #3558a2;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.parcelle-input-section {
  margin-bottom: 15px;
}

.parcelle-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 5px;
}

.parcelle-error {
  color: #d7221f;
  font-size: 12px;
  margin-top: 5px;
  font-style: italic;
}

.parcelle-compose-section {
  margin-top: 15px;
}

.select-group {
  margin-bottom: 10px;
}

.select-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.parcelle-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.parcelle-select:disabled {
  background-color: #f5f5f5;
  color: #999;
}

.loading-message {
  font-size: 12px;
  color: #666;
  font-style: italic;
  margin-top: 5px;
}

@media screen and (max-width: 767px) {
  #filtersContainer {
    right: auto;
    left: 50%;
    transform: translate(-55%, 0);
  }
}
</style>
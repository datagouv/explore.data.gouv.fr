<template>
  <div class="fr-container--fluid">
    <header-apps
      :formHref="formHref"
      :appName="appName"
      :appLink="appLink"
      :betaApp="true"
      :displayBanner="true"
    ></header-apps>
    
    <div class="industrie_container">
      <div class="industrie_header">
        <h1>L'industrie européenne face au rouleau compresseur chinois - une analyse comparative</h1>
        <div class="intro">
          <p>
            Cette page propose, à travers quatre cartes, une analyse comparative de la menace chinoise pour l’industrie européenne. Ces cartes détaillent successivement, pour l’ensemble des pays de l’Union européenne, la part des exportations menacée, la part de la production européenne exposée à une forte pression des importations chinoises, la part des avantages comparatifs de chaque pays qui est menacée, ainsi que les investissements chinois annoncés au sein des pays de l’Union européenne.
          </p>
          <br />
          <p>
            Une seconde page, spécifiquement dédiée aux exportations, permet de visualiser pour chaque pays européen et chaque secteur d’exportation, l’évolution de la menace au fil des années.
          </p>
          <br />
          <p>
            Ce tableau de bord a été réalisé dans le cadre de la note du Haut-commissariat à la Stratégie et au Plan "L'industrie européenne face au rouleau compresseur chinois". Les données brutes ont par ailleurs été publiées sur data.gouv.fr.
          </p>
        </div>
      </div>

      <div class="panel_container">
        <div
          class="panel"
          :class="activeTab === 'cartes' ? 'active' : ''"
          @click="setActiveTab('cartes')"
        >
          <span>Cartes</span>
        </div>
        <div
          class="panel"
          :class="activeTab === 'exports' ? 'active' : ''"
          @click="setActiveTab('exports')"
        >
          <span>Focus exportations</span>
        </div>
      </div>

      <div class="tab_content_wrapper">
        <div v-if="activeTab === 'cartes'" class="tab-content">
          <div class="maps-intro">
            <h2>Cartes de la menace chinoise sur l'industrie européenne</h2>
            <p>
              Les quatre cartes ci-dessous présentent différentes facettes de l'exposition de l'industrie européenne à la concurrence chinoise. 
              Chaque carte utilise une méthodologie spécifique pour quantifier cette menace, qu'il s'agisse des exportations, du marché intérieur, 
              des avantages comparatifs ou des investissements directs. L'intensité de la couleur reflète le niveau d'exposition de chaque pays.
            </p>
          </div>
          
          <div class="maps-grid">
            <!-- Carte 1 : Exportations -->
            <div class="map-card">
              <map-europe
                :api-url="map1Config.apiUrl"
                :data-field="map1Config.dataField"
                :map-title="map1Config.title"
                :map-note="map1Config.note"
                :map-note-below="map1Config.note_below"
                :legend-config="map1Config.legendConfig"
                :color-scale="map1Config.colorScale"
                :popup-config="map1Config.popupConfig"
              ></map-europe>
            </div>

            <!-- Carte 2 : Marché intérieur -->
            <div class="map-card">
              <map-europe
                :api-url="map2Config.apiUrl"
                :data-field="map2Config.dataField"
                :map-title="map2Config.title"
                :map-note="map2Config.note"
                :map-note-below="map2Config.note_below"
                :legend-config="map2Config.legendConfig"
                :color-scale="map2Config.colorScale"
                :popup-config="map2Config.popupConfig"
              ></map-europe>
            </div>

            <!-- Carte 3 : ACR -->
            <div class="map-card">
              <map-europe
                :api-url="map3Config.apiUrl"
                :data-field="map3Config.dataField"
                :map-title="map3Config.title"
                :map-note="map3Config.note"
                :map-note-below="map3Config.note_below"
                :legend-config="map3Config.legendConfig"
                :color-scale="map3Config.colorScale"
                :popup-config="map3Config.popupConfig"
              ></map-europe>
            </div>

            <!-- Carte 4 : Investissements -->
            <div class="map-card">
              <map-europe
                :api-url="map4Config.apiUrl"
                :data-field="map4Config.dataField"
                :map-title="map4Config.title"
                :map-note="map4Config.note"
                :map-note-below="map4Config.note_below"
                :legend-config="map4Config.legendConfig"
                :color-scale="map4Config.colorScale"
                :popup-config="map4Config.popupConfig"
              ></map-europe>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'exports'">
          <div class="selectors-container">
          <div class="selector-wrapper">
            <label class="fr-label" for="country-select">
              Sélectionner un pays :
            </label>
            <select 
              id="country-select" 
              class="fr-select"
              v-model="selectedCountry"
              @change="onSelectionChange"
            >
              <option 
                v-for="country in availableCountries" 
                :key="country" 
                :value="country"
              >
                {{ country }}
              </option>
            </select>
          </div>
          
          <div class="selector-wrapper">
            <label class="fr-label" for="competitor-select">
              Sélectionner un compétiteur :
            </label>
            <select 
              id="competitor-select" 
              class="fr-select"
              v-model="selectedCompetitor"
              @change="onSelectionChange"
            >
              <option 
                v-for="competitor in competitors" 
                :key="competitor" 
                :value="competitor"
              >
                {{ competitor }}
              </option>
            </select>
          </div>
          
          <div class="selector-wrapper">
            <label class="fr-label" for="category-select">
              Sélectionner une catégorie :
            </label>
            <select 
              id="category-select" 
              class="fr-select"
              v-model="selectedCategory"
              @change="onSelectionChange"
            >
              <option 
                v-for="category in categories" 
                :key="category" 
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="maj_date_container">
          Dernière mise à jour des données : janvier 2026
        </div>

      <div class="indicator_section">
        <h2 class="indicator_title">Part des exportations menacée par le pays <b>{{ selectedCompetitor }}</b> pour le pays <b>{{ selectedCountry }}</b></h2>
        <div class="indicator_description">
          <p>
            Ce graphique présente l'évolution de la part des exportations menacée par le pays <b>{{ selectedCompetitor }}</b> pour le secteur <b>{{ selectedCategory }}</b> dans le pays <b>{{ selectedCountry }}</b> par niveau de menace (1 à 4). Les données sont exprimées en pourcentage du total des exportations du secteur pour chaque année depuis 2000.
          </p>
        </div>
        <div class="chart_container">
          <chart-one></chart-one>
        </div>
      </div>

      <!-- <div class="indicator_section">
        <h2 class="indicator_title">Comparaison des exportations {{ selectedCountry }}-{{ selectedCompetitor }}</h2>
        <div class="indicator_description">
          <p>
            Ce graphique compare l'évolution des exportations totales du secteur "{{ selectedCategory }}" entre le pays <b>{{ selectedCountry }}</b> et <b>{{ selectedCompetitor }}</b> depuis 2000. Les valeurs sont exprimées en milliards de dollars (Md$).
          </p>
        </div>
        <div class="chart_container">
          <chart-two></chart-two>
        </div>
      </div> -->

      <div class="indicator_section">
        <h2 class="indicator_title">Part des marchés dominés par {{ selectedCompetitor }}</h2>
        <div class="indicator_description">
          <p>
            Ce graphique présente l'évolution de la part des marchés du secteur <b>{{ selectedCategory }}</b> où les exportations du pays <b>{{ selectedCompetitor }}</b> dépassent celles du pays <b>{{ selectedCountry }}</b> selon différents seuils (≥50%, ≥100%, ≥150%, ≥200%). 
            Chaque courbe montre le pourcentage de marchés où le pays <b>{{ selectedCompetitor }}</b> atteint ou dépasse le seuil indiqué par rapport au pays <b>{{ selectedCountry }}</b>. Une valeur de 100% signifie que sur tous les marchés, le pays <b>{{ selectedCompetitor }}</b> dépasse le pays <b>{{ selectedCountry }}</b> selon ce seuil.
          </p>
        </div>
        <div class="chart_container">
          <chart-three></chart-three>
        </div>
      </div>

      <div class="indicator_section">
        <h2 class="indicator_title">Niveau de menace des exportations du pays <b>{{ selectedCountry }}</b> par marché d'exportation (2023)</h2>
        <div class="indicator_description">
          <p>
            Ce treemap visualise la répartition des exportations du pays <b>{{ selectedCountry }}</b> dans le secteur <b>{{ selectedCategory }}</b> en 2023 par pays de destination. La taille de chaque rectangle est proportionnelle au volume d'exportations (en milliards de dollars), et la couleur indique le niveau de menace concurrentielle du pays <b>{{ selectedCompetitor }}</b> (du niveau 0 en gris clair au niveau 4 en noir).
          </p>
        </div>
        <div class="chart_container" style="min-height: 500px;">
          <chart-four></chart-four>
        </div>
      </div>
        </div>
      </div>

      <div class="info-accordion">
        <div class="fr-accordions-group">
          <section class="fr-accordion">
            <h3 class="fr-accordion__title">
              <button 
                class="fr-accordion__btn" 
                aria-expanded="false" 
                aria-controls="accordion-origin"
              >
                Qui est à l'origine de ce tableau de bord ?
              </button>
            </h3>
            <div class="fr-collapse" id="accordion-origin">
              <div class="accordion-content">
                <p>
                  Ce tableau de bord a été développé dans le cadre des travaux du <strong><a href="https://www.strategie-plan.gouv.fr/" target="_blank">Haut-Commissariat à la Stratégie et au Plan</a></strong>, institution chargée d'animer et de coordonner les travaux de planification et de réflexion prospective conduits  pour le compte de l'État et d'éclairer les choix des pouvoirs publics au regard des enjeux démographiques, économiques, sociaux, environnementaux, sanitaires, technologiques et culturels.
                </p>
                <p>
                  L'objectif de ce tableau de bord est de fournir une vision claire et actualisée des dynamiques industrielles comparées entre les différents pays européens et la Chine, afin d'éclairer les décisions stratégiques en matière de politique industrielle et commerciale.
                </p>
                <p>Ce tableau a été réalisé dans le cadre de la note suivante.</p>
              </div>
            </div>
          </section>

          <section class="fr-accordion">
            <h3 class="fr-accordion__title">
              <button 
                class="fr-accordion__btn" 
                aria-expanded="false" 
                aria-controls="accordion-sources"
              >
                Où trouver les sources de données sous-jacentes ?
              </button>
            </h3>
            <div class="fr-collapse" id="accordion-sources">
              <div class="accordion-content">
                <p>
                  Les données utilisées dans ce tableau de bord sont disponibles en open data sur la plateforme data.gouv.fr :
                </p>
                <!-- <dataset-embed dataset="697c9aa7d6bc970fff176361"></dataset-embed> -->
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <footer-apps scrollable="scrollable" display="display"></footer-apps>
  </div>
</template>

<script>
import appStore from "@/apps/industrie-europe-chine/store";
import HeaderApps from "@/views/HeaderApps";
import FooterApps from "@/views/FooterApps";
import ChartOne from "@/apps/industrie-europe-chine/components/ChartOne";
import ChartTwo from "@/apps/industrie-europe-chine/components/ChartTwo";
import ChartThree from "@/apps/industrie-europe-chine/components/ChartThree";
import ChartFour from "@/apps/industrie-europe-chine/components/ChartFour";
import DatasetEmbed from "@/components/DatasetEmbed";
import MapEurope from "@/apps/industrie-europe-chine/components/MapEurope";

export default {
  name: "AppIndustrieEuropeChine",
  components: {
    HeaderApps,
    FooterApps,
    ChartOne,
    ChartTwo,
    ChartThree,
    ChartFour,
    DatasetEmbed,
    MapEurope,
  },
  metaInfo: {
    title: "Industrie Europe-Chine - Analyse comparative",
    meta: [
      {
        name: "description",
        content: "Analyse comparative de l'industrie européenne et chinoise à travers 4 indicateurs clés.",
      },
    ],
  },
  data() {
    return {
      formHref: "https://tally.so/r/m6L5jo",
      appName: "Industrie Europe-Chine",
      pageName: "industrie-europe-chine",
      activeTab: 'cartes', // 'cartes' ou 'exports'
      
      // Configuration Carte 1 : Exportations
      map1Config: {
        apiUrl: 'https://tabular-api.data.gouv.fr/api/resources/c212711b-a9ba-4076-a872-c0a53f131ccd/data/?page_size=200',
        dataField: 'part_menacee',
        title: 'Part des exportations européennes menacées par la concurrence chinoise (en pourcentage)',
        note: 'Les menaces sectorielles détaillées dans le « Focus exportations » sont agrégées par pays. <a href="?onglet=exports"; text-decoration: underline;">Voir le détail par secteur et pays</a>',
        note_below: 'Sources : BACII, calculs des auteurs',
        colorScale: {
          type: 'interpolate',
          field: 'part_menacee',
          stops: [
            { value: 0, color: '#fee5d9' },
            { value: 0.1, color: '#fcae91' },
            { value: 0.2, color: '#fb6a4a' },
            { value: 0.3, color: '#de2d26' },
            { value: 0.45, color: '#a50f15' }
          ]
        },
        legendConfig: {
          title: 'Part des exports menacée',
          items: [
            { color: '#fee5d9', label: '0% - 10%' },
            { color: '#fcae91', label: '10% - 20%' },
            { color: '#fb6a4a', label: '20% - 30%' },
            { color: '#de2d26', label: '30% - 45%' },
            { color: '#a50f15', label: '> 45%' }
          ]
        },
        popupConfig: {
          fields: [
            { key: 'exports_menaces_kusd', label: 'Exports menacés (milliers d\'euros) ', },
            { key: 'exports_totaux_kusd', label: 'Exports totaux (milliers d\'euros) ', },
            { key: 'part_menacee', label: 'Part menacée ', format: 'percentage_raw', highlight: true }
          ]
        }
      },
      
      map2Config: {
        apiUrl: 'https://tabular-api.data.gouv.fr/api/resources/fad5dc77-853b-4a28-934b-e222f0a1b5fb/data/?page_size=200',
        dataField: 'share_risk_ge2_pct',
        title: 'Part de la production manufacturière potentiellement menacée à l\'import, par pays européen',
        note: 'Les menaces sectorielles sont agrégées au niveau de chaque pays.',
        note_below: 'Sources : Eurostat, BACI, calculs des auteurs',
        colorScale: {
          type: 'interpolate',
          field: 'share_risk_ge2_pct',
          stops: [
            { value: 0, color: '#fee5d9' },
            { value: 20, color: '#fcbba1' },
            { value: 40, color: '#fc9272' },
            { value: 60, color: '#fb6a4a' },
            { value: 80, color: '#de2d26' }
          ]
        },
        legendConfig: {
          title: 'Production menacée (%)',
          items: [
            { color: '#fee5d9', label: '0% - 20%' },
            { color: '#fcbba1', label: '20% - 40%' },
            { color: '#fc9272', label: '40% - 60%' },
            { color: '#fb6a4a', label: '60% - 80%' },
            { color: '#de2d26', label: '> 80%' }
          ]
        },
        popupConfig: {
          fields: [
            { key: 'prod_total', label: 'Production totale ', format: 'euro' },
            { key: 'prod_risk_ge2', label: 'Production menacée ', format: 'euro' },
            { key: 'share_risk_ge2_pct', label: 'Part menacée ', format: 'percentage', highlight: true }
          ]
        }
      },
      
      // Configuration Carte 3 : ACR
      map3Config: {
        apiUrl: 'https://tabular-api.data.gouv.fr/api/resources/e8a1b6b3-8924-45f1-8f73-4bc244eca5eb/data/?page_size=200',
        dataField: 'pct_threat_among_acr',
        title: 'Part des avantages comparatifs menacée, par pays européen',
        note: 'La carte représente, pour chaque pays européen, la part des avantages comparatifs révélés (ACR) exposée à une concurrence chinoise forte, telle qu’identifiée à partir de l’approche fondée sur le marché intérieur. Cette part est mesurée par le pourcentage de la production manufacturière correspondant aux dix principaux avantages comparatifs révélés du pays. La définition des ACR prise est celle utilisée par le CEPII',
        note_below: 'Sources : Eurostat, BACI, calculs des auteurs',
        colorScale: {
          type: 'interpolate',
          field: 'pct_threat_among_acr',
          stops: [
            { value: 0, color: '#fee5d9' },
            { value: 25, color: '#fcbba1' },
            { value: 50, color: '#fc9272' },
            { value: 75, color: '#fb6a4a' },
            { value: 100, color: '#a50f15' }
          ]
        },
        legendConfig: {
          title: 'Part ACR menacée (%)',
          items: [
            { color: '#fee5d9', label: '0% - 25%' },
            { color: '#fcbba1', label: '25% - 50%' },
            { color: '#fc9272', label: '50% - 75%' },
            { color: '#fb6a4a', label: '75% - 100%' },
            { color: '#a50f15', label: '100%' }
          ]
        },
        popupConfig: {
          fields: [
            { key: 'acr_total_pct', label: 'Part des 10 principaux ACR du pays dans la production manufacturière totale ', format: 'percentage' },
            { key: 'acr_threat_pct', label: 'Part de la production du pays menacée et  correspondant à l’un des 10 principaux ACR ', format: 'percentage' },
            { key: 'pct_threat_among_acr', label: 'Part des 10 principaux ACR menacée ', format: 'percentage', highlight: true }
          ]
        }
      },
      
      // Configuration Carte 4 : Investissements
      map4Config: {
        apiUrl: 'https://tabular-api.data.gouv.fr/api/resources/03f015f5-1f48-443f-8512-05ca2c499405/data/?page_size=200',
        dataField: 'classe',
        title: 'Une géographie inégale des investissements chinois en Europe (2016-2024)',
        note: 'Le ratio entre le montant des investissement chinois et la production est calculé pour chaque pays, puis reparti en quartiles.',
        note_below: 'Source : Trendeo, Eurostat, calculs des auteurs',
        colorScale: {
          type: 'categorical',
          field: 'classe',
          stops: [
            { value: 'Quartile 1', color: '#a50f15' },
            { value: 'Quartile 2', color: '#fb6a4a' },
            { value: 'Quartile 3', color: '#dffee6' },
            { value: 'Quartile 4', color: '#18753c' }
          ]
        },
        legendConfig: {
          title: 'Investissements/Production',
          items: [
            { color: '#a50f15', label: 'Quartile 1 (faible)' },
            { color: '#fb6a4a', label: 'Quartile 2' },
            { color: '#dffee6', label: 'Quartile 3' },
            { color: '#18753c', label: 'Quartile 4 (élevé)' }
          ]
        },
        popupConfig: {
          fields: [
            { key: 'classe', label: 'Classe ', format: 'text', highlight: true }
          ]
        }
      }
    };
  },
  mounted() {
    if (this.$route.query.onglet) {
      this.activeTab = this.$route.query.onglet;
    } else {
      this.activeTab = 'cartes';
    }

    this.$nextTick(() => {
      const accordionButtons = document.querySelectorAll('.fr-accordion__btn');
      accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
          const isExpanded = this.getAttribute('aria-expanded') === 'true';
          const targetId = this.getAttribute('aria-controls');
          const targetContent = document.getElementById(targetId);
          
          if (targetContent) {
            this.setAttribute('aria-expanded', !isExpanded);
            if (isExpanded) {
              targetContent.classList.remove('fr-collapse--expanded');
            } else {
              targetContent.classList.add('fr-collapse--expanded');
            }
          }
        });
      });
    });
  },
  computed: {
    countries() {
      return Object.keys(appStore.state.countryToApiName).sort((a, b) => 
        a.localeCompare(b, 'fr', { sensitivity: 'base' })
      );
    },
    availableCountries() {
      const allCountries = this.countries;
      if (appStore.state.selectedCompetitor === 'Allemagne') {
        return allCountries.filter(country => country !== 'Allemagne');
      }
      return allCountries;
    },
    competitors() {
      return appStore.state.competitors;
    },
    categories() {
      return Object.keys(appStore.state.categoryToId).sort((a, b) => 
        a.localeCompare(b, 'fr', { sensitivity: 'base' })
      );
    },
    selectedCountry: {
      get() {
        return appStore.state.selectedCountry;
      },
      set(value) {
        appStore.commit('setSelectedCountry', value);
      }
    },
    selectedCategory: {
      get() {
        return appStore.state.selectedCategory;
      },
      set(value) {
        appStore.commit('setSelectedCategory', value);
      }
    },
    selectedCompetitor: {
      get() {
        return appStore.state.selectedCompetitor;
      },
      set(value) {
        appStore.commit('setSelectedCompetitor', value);
      }
    },
    appLink: function () {
      return window.location.origin + '/' + this.$route.params.lang + "/industrie-europe-chine";
    },
  },
  watch: {
    '$route.query.onglet': {
      handler(newTab) {
        if (newTab && newTab !== this.activeTab) {
          this.activeTab = newTab;
        }
      },
      immediate: false
    }
  },
  methods: {
    onSelectionChange() {
      this.$forceUpdate();
    },
    setActiveTab(tab) {
      this.activeTab = tab;
      this.$router.push({
        name: this.pageName,
        params: { lang: this.$route.params.lang },
        query: { ...this.$route.query, onglet: tab },
      }).catch(() => {});
    }
  },
};
</script>

<style scoped>
* {
  box-sizing: inherit;
}

.industrie_container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.industrie_header {
  padding: 30px 20px;
  position: relative;
  margin-bottom: 20px;
}

.industrie_header h1 {
  font-size: 32px;
  margin-bottom: 20px;
  line-height: 40px;
  color: #161616;
}

.industrie_header .intro {
  font-size: 16px;
  line-height: 24px;
  color: #3a3a3a;
}

.industrie_header .intro p {
  margin: 0;
}

.selectors-container {
  margin-top: 30px;
  margin-bottom: 20px;
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.selector-wrapper {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}

.selector-wrapper .fr-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 16px;
  color: #161616;
}

.selector-wrapper .fr-select {
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  background-color: #fff;
  font-family: "Marianne", sans-serif;
}

.selector-wrapper .fr-select:focus {
  outline: 2px solid #000091;
  outline-offset: 2px;
}

.maj_date_container {
  margin-top: 20px;
  font-size: 14px;
  font-weight: 700;
  color: #666;
}

.indicator_section {
  margin-bottom: 60px;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.indicator_title {
  font-size: 24px;
  font-weight: 700;
  color: #000091;
  margin-bottom: 15px;
  line-height: 32px;
}

.indicator_description {
  font-size: 15px;
  line-height: 22px;
  color: #3a3a3a;
  margin-bottom: 25px;
}

.indicator_description p {
  margin: 0;
}

.chart_container {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Accordéon d'informations */
.info-accordion {
  margin-top: 60px;
  margin-bottom: 40px;
}

.fr-accordions-group {
  list-style: none;
  padding: 0;
  margin: 0;
}

.fr-accordion {
  border: 1px solid #e5e5e5;
  margin-bottom: 0;
}

.fr-accordion + .fr-accordion {
  border-top: none;
}

.fr-accordion__title {
  margin: 0;
}

.fr-accordion__btn {
  width: 100%;
  padding: 16px 20px;
  text-align: left;
  font-size: 18px;
  font-weight: 700;
  color: #161616;
  background-color: #f6f6f6;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.fr-accordion__btn:hover {
  background-color: #ebebeb;
}

.fr-accordion__btn::after {
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 5px 0 5px;
  border-color: #161616 transparent transparent transparent;
  margin-left: auto;
  transition: transform 0.3s;
}

.fr-accordion__btn[aria-expanded="true"]::after {
  transform: rotate(180deg);
}

.fr-collapse {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.fr-collapse--expanded {
  max-height: 2000px;
  transition: max-height 0.5s ease-in;
}

.accordion-content {
  padding: 20px;
  background-color: white;
  line-height: 1.6;
}

.accordion-content p {
  margin-bottom: 15px;
  color: #3a3a3a;
}

.accordion-content p:last-child {
  margin-bottom: 0;
}

.accordion-content strong {
  color: #000091;
  font-weight: 700;
}

.panel_container {
  display: flex;
  padding-left: 15px;
  padding-right: 15px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 30px;
}

.panel {
  width: 50%;
  height: 40px;
  background-color: #e6eefe;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  margin: 0 5px 0 5px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: row;
  border-top: 2px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
  transform: translate(-1px, 1px);
  overflow: hidden;
}

.panel span {
  transform: translate(0, 6px);
}

.panel.active {
  background-color: white;
  border-top: 2px solid #3558a2;
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  border-bottom: 1px solid #ffffff;
  cursor: default;
  color: #3558a2;
}

.tab_content_wrapper {
  margin-top: 20px;
}

.tab-content {
  padding: 20px;
}

.tab-content h2 {
  font-size: 24px;
  color: #161616;
  margin-bottom: 16px;
}

.tab-content p {
  font-size: 16px;
  line-height: 24px;
  color: #3a3a3a;
}

.maps-intro {
  background-color: #f6f6f6;
  padding: 24px;
  border-radius: 4px;
  margin-bottom: 32px;
}

.maps-intro h2 {
  margin-top: 0;
  margin-bottom: 12px;
}

.maps-intro p {
  margin-bottom: 0;
}

.maps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.map-card {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

@media screen and (max-width: 1279px) {
  .maj_date_container {
    position: relative;
    right: auto;
    top: auto;
    margin-top: 20px;
  }
}

@media screen and (max-width: 767px) {
  .industrie_container {
    padding: 10px;
  }

  .industrie_header {
    padding: 20px 10px;
  }

  .industrie_header h1 {
    font-size: 24px;
    line-height: 32px;
  }

  .industrie_header .intro {
    font-size: 14px;
    line-height: 20px;
  }

  .indicator_section {
    padding: 20px 15px;
    margin-bottom: 30px;
  }

  .indicator_title {
    font-size: 20px;
    line-height: 28px;
  }

  .indicator_description {
    font-size: 14px;
    line-height: 20px;
  }

  .chart_container {
    padding: 15px;
    min-height: 250px;
  }

  .fr-accordion__btn {
    font-size: 16px;
    padding: 14px 16px;
  }

  .accordion-content {
    padding: 15px;
    font-size: 14px;
  }

  .panel {
    font-size: 14px;
    height: 35px;
  }

  .panel span {
    transform: translate(0, 4px);
  }

  .maps-grid {
    grid-template-columns: 1fr;
  }

  .maps-intro {
    padding: 16px;
  }
}
</style>


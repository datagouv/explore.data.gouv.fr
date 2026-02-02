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
        <h1>Industrie Europe-Chine : Analyse comparative</h1>
        <div class="intro">
          <p>
            Cette page présente une analyse comparative de l'industrie européenne et chinoise à travers 4 indicateurs clés. Les données brutes  pour ont par ailleurs publiées sur data.gouv.fr. Ce tableau de bord permet d'offrir une vision claire des dynamiques industrielles entre ces deux zones économiques majeures.
          </p>
        </div>
        
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
                v-for="country in countries" 
                :key="country" 
                :value="country"
              >
                {{ country }}
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
      </div>

      <div class="indicator_section">
        <h2 class="indicator_title">Indicateur 1 : Part des exportations par niveau technologique - {{ selectedCountry }}</h2>
        <div class="indicator_description">
          <p>
            Ce graphique présente l'évolution de la part des exportations du secteur 
            "{{ selectedCategory }}" en {{ selectedCountry }}, répartie par niveau technologique 
            (de 0 à 4). Les données sont exprimées en pourcentage du total des exportations 
            du secteur pour chaque année depuis 2000.
          </p>
        </div>
        <div class="chart_container">
          <chart-one></chart-one>
        </div>
      </div>

      <div class="indicator_section">
        <h2 class="indicator_title">Indicateur 2 : Comparaison des exportations {{ selectedCountry }}-Chine</h2>
        <div class="indicator_description">
          <p>
            Ce graphique compare l'évolution des exportations totales du secteur 
            "{{ selectedCategory }}" entre {{ selectedCountry }} et la Chine depuis 2000. 
            Les valeurs sont exprimées en milliards de dollars (Md$). Cette visualisation permet 
            d'observer la croissance significative des exportations chinoises par rapport aux exportations de {{ selectedCountry }}.
          </p>
        </div>
        <div class="chart_container">
          <chart-two></chart-two>
        </div>
      </div>

      <div class="indicator_section">
        <h2 class="indicator_title">Indicateur 3 : Part des marchés dominés par la Chine</h2>
        <div class="indicator_description">
          <p>
            Ce graphique présente l'évolution de la part des marchés où les exportations chinoises 
            dépassent celles de {{ selectedCountry }} selon différents seuils (≥50%, ≥100%, ≥150%, ≥200%). 
            Chaque courbe montre le pourcentage de marchés où la Chine atteint ou dépasse le seuil 
            indiqué par rapport à {{ selectedCountry }}. Une valeur de 100% signifie que sur tous les marchés, 
            la Chine dépasse {{ selectedCountry }} selon ce seuil.
          </p>
        </div>
        <div class="chart_container">
          <chart-three></chart-three>
        </div>
      </div>

      <div class="indicator_section">
        <h2 class="indicator_title">Indicateur 4 : Répartition des exportations de {{ selectedCountry }} par pays importateur (2023)</h2>
        <div class="indicator_description">
          <p>
            Ce treemap visualise la répartition des exportations de {{ selectedCountry }} dans le secteur 
            "{{ selectedCategory }}" en 2023 par pays importateur. La taille de chaque rectangle est 
            proportionnelle au volume d'exportations (en milliards de dollars), et la couleur indique 
            le niveau de menace concurrentielle de la Chine (du niveau 0 en gris clair au niveau 4 en noir).
          </p>
        </div>
        <div class="chart_container" style="min-height: 500px;">
          <chart-four></chart-four>
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
                  Ce tableau de bord a été développé dans le cadre des travaux du 
                  <strong>Haut-Commissariat au Plan</strong>, institution chargée d'animer et de 
                  coordonner les travaux de planification et de réflexion prospective conduits 
                  pour le compte de l'État et d'éclairer les choix des pouvoirs publics au regard 
                  des enjeux démographiques, économiques, sociaux, environnementaux, sanitaires, 
                  technologiques et culturels.
                </p>
                <p>
                  L'objectif de ce tableau de bord est de fournir une vision claire et actualisée 
                  des dynamiques industrielles comparées entre l'Europe et la Chine, permettant 
                  d'éclairer les décisions stratégiques en matière de politique industrielle et commerciale.
                </p>
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
                  Les données utilisées dans ce tableau de bord sont disponibles en open data 
                  sur la plateforme data.gouv.fr :
                </p>
                <dataset-embed dataset="5c34c4d1634f4173183a64f1"></dataset-embed>
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
    };
  },
  computed: {
    countries() {
      return Object.keys(appStore.state.countryToApiName).sort((a, b) => 
        a.localeCompare(b, 'fr', { sensitivity: 'base' })
      );
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
    appLink: function () {
      return window.location.origin + '/' + this.$route.params.lang + "/industrie-europe-chine";
    },
  },
  methods: {
    onSelectionChange() {
      this.$forceUpdate();
    }
  },
  mounted() {
    
    this.$nextTick(() => {
      const accordionButtons = document.querySelectorAll('.fr-accordion__btn');
      accordionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const isExpanded = button.getAttribute('aria-expanded') === 'true';
          const targetId = button.getAttribute('aria-controls');
          const targetContent = document.getElementById(targetId);
          
          if (targetContent) {
            button.setAttribute('aria-expanded', !isExpanded);
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
  padding-bottom: 100px;
}

.industrie_header {
  padding: 30px 20px;
  position: relative;
  border-bottom: 2px solid #e5e5e5;
  margin-bottom: 40px;
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
  max-width: 900px;
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
  min-width: 300px;
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
}
</style>


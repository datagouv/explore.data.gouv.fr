<template>
  <div class="mainView" id="sourcesView">
    <div id="content">
      <h4>Jeux de données utilisés</h4>
      <span class="chapo"
        >Les données utilisées pour construire cette application sont
        disponibles en open data sur data.gouv.fr</span
      >

      <dataset-embed
        class="datasetembed"
        :dataset="'5c4ae55a634f4117716d5656'"
      ></dataset-embed>
      <dataset-embed
        class="datasetembed"
        :dataset="'5cc1b94a634f4165e96436c1'"
      ></dataset-embed>
      <dataset-embed
        class="datasetembed"
        :dataset="'59b0020ec751df07d5f13bcf'"
      ></dataset-embed>
      <dataset-embed
        class="datasetembed"
        :dataset="'5530fbacc751df5ff937dddb'"
      ></dataset-embed>
      <dataset-embed
        class="datasetembed"
        :dataset="'61dc7157488f8cdb4283e3c3'"
      ></dataset-embed>
      <dataset-embed
        class="datasetembed"
        :dataset="'62da71c068871f4c54258c7c'"
      ></dataset-embed>


      <h4 class="second_title">Applications recommandées</h4>
      <span class="chapo"
        >Pour aller plus loin, nous vous invitons à visiter les applications du service public suivantes :</span
      >


      <div id="git_container">
        <span id="git_title">Couverture des réseaux par l'ARCEP</span>
        <a id="git_link" href="https://maconnexioninternet.arcep.fr/"
          >https://maconnexioninternet.arcep.fr/</a
        >
      </div>
      <br />
      <div id="git_container">
        <span id="git_title">Lieux d'accessibilité par Accès Libre</span>
        <a id="git_link" href="https://acceslibre.beta.gouv.fr/"
          >https://acceslibre.beta.gouv.fr/</a
        >
      </div>
      <br />
      <div id="git_container">
        <span id="git_title">Risques encourus sur une zone géographique du BRGM</span>
        <a id="git_link" href="https://www.georisques.gouv.fr/"
          >https://www.georisques.gouv.fr/</a
        >
      </div>
      <br />
      <div id="git_container">
        <span id="git_title">Données d'urbanisme par l'IGN</span>
        <a id="git_link" href="https://www.geoportail-urbanisme.gouv.fr/"
          >https://www.geoportail-urbanisme.gouv.fr/</a
        >
      </div>
      <br />
      <div id="git_container">
        <span id="git_title">Performance énergétique par le CSTB</span>
        <a id="git_link" href="https://particulier.gorenove.fr/"
          >https://particulier.gorenove.fr/</a
        >
      </div>
      <br />
      <div id="git_container">
        <span id="git_title">Evolution du prix de l'immobilier par le CEREMA</span>
        <a id="git_link" href="https://datafoncier.cerema.fr/"
          >https://datafoncier.cerema.fr/</a
        >
      </div>

      <h4 class="second_title">Code source</h4>
      <span class="chapo"
        >Le code source de cette application est disponible sur Github</span
      >

      <div id="git_container">
        <span id="git_title">Exploration DVF</span>
        <svg
          id="git_logo"
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.92207 11.4353C2.72207 11.302 2.55007 11.132 2.34873 10.8913C2.24423 10.7634 2.14067 10.6347 2.03807 10.5053C1.7294 10.122 1.53473 9.94531 1.3334 9.87264C1.16693 9.81288 1.03102 9.68944 0.955573 9.52947C0.88012 9.3695 0.871306 9.18611 0.931068 9.01964C0.99083 8.85317 1.11427 8.71726 1.27424 8.64181C1.43421 8.56636 1.6176 8.55755 1.78407 8.61731C2.2854 8.79731 2.62473 9.10731 3.08207 9.67597C3.0194 9.59797 3.30873 9.96064 3.37073 10.0353C3.4974 10.1866 3.59073 10.2786 3.66407 10.3273C3.80007 10.4186 4.0554 10.458 4.43073 10.4206C4.44607 10.166 4.4934 9.91864 4.5654 9.69064C2.58673 9.20664 1.46673 7.93064 1.46673 5.42664C1.46673 4.59997 1.7134 3.85597 2.17207 3.23197C2.02673 2.63597 2.04873 1.91531 2.3734 1.10397C2.41025 1.0122 2.46705 0.929769 2.53969 0.86266C2.61233 0.795552 2.699 0.745446 2.7934 0.715975C2.8474 0.699975 2.87807 0.692641 2.93207 0.684641C3.4674 0.602641 4.2234 0.797975 5.20873 1.41531C5.79593 1.27803 6.39704 1.20913 7.00007 1.20997C7.60807 1.20997 8.21207 1.27931 8.7894 1.41531C9.77407 0.793308 10.5314 0.597975 11.0707 0.684641C11.1274 0.693308 11.1754 0.704641 11.2161 0.717975C11.3086 0.748492 11.3934 0.79893 11.4643 0.865736C11.5353 0.932543 11.5907 1.01409 11.6267 1.10464C11.9514 1.91531 11.9734 2.63597 11.8281 3.23131C12.2887 3.85531 12.5334 4.59464 12.5334 5.42664C12.5334 7.93131 11.4174 9.20331 9.43873 9.68797C9.52207 9.96464 9.5654 10.274 9.5654 10.608C9.56546 11.2115 9.5628 11.8151 9.5574 12.4186C9.70712 12.4513 9.84101 12.5345 9.93655 12.6544C10.0321 12.7742 10.0834 12.9232 10.0819 13.0765C10.0805 13.2297 10.0262 13.3777 9.92839 13.4957C9.83054 13.6136 9.69506 13.6942 9.54473 13.724C8.7854 13.876 8.22273 13.3693 8.22273 12.7073L8.22407 12.41L8.2274 11.94C8.23073 11.468 8.23207 11.048 8.23207 10.608C8.23207 10.1433 8.11007 9.83997 7.94873 9.70131C7.50807 9.32131 7.7314 8.59797 8.30873 8.53331C10.2867 8.31131 11.2001 7.54531 11.2001 5.42664C11.2001 4.78997 10.9921 4.26397 10.5914 3.82397C10.507 3.73147 10.4503 3.61706 10.4279 3.49385C10.4055 3.37064 10.4183 3.24361 10.4647 3.12731C10.5754 2.85131 10.6227 2.48931 10.5287 2.05131L10.5221 2.05331C10.1947 2.14597 9.78207 2.34664 9.2834 2.68597C9.20299 2.74054 9.11162 2.77688 9.01569 2.79242C8.91976 2.80797 8.8216 2.80235 8.72807 2.77597C8.16533 2.62017 7.58397 2.54189 7.00007 2.54331C6.40673 2.54331 5.81873 2.62264 5.27207 2.77664C5.17888 2.80281 5.08111 2.80838 4.98556 2.79295C4.89 2.77752 4.79895 2.74147 4.71873 2.68731C4.2174 2.34931 3.80273 2.14931 3.4734 2.05597C3.3774 2.49131 3.42473 2.85197 3.53473 3.12731C3.58127 3.24355 3.59414 3.37054 3.57185 3.49375C3.54957 3.61696 3.49304 3.7314 3.40873 3.82397C3.01073 4.25997 2.80007 4.79597 2.80007 5.42664C2.80007 7.54131 3.71407 8.31197 5.6814 8.53331C6.25807 8.59797 6.48207 9.31797 6.04407 9.69864C5.91607 9.81064 5.75807 10.1866 5.75807 10.608V12.708C5.75807 13.3653 5.2014 13.858 4.4514 13.7266C4.29924 13.6999 4.16109 13.6212 4.06055 13.5039C3.96 13.3866 3.90331 13.2381 3.90016 13.0836C3.89701 12.9292 3.9476 12.7784 4.04328 12.6571C4.13896 12.5358 4.27379 12.4515 4.42473 12.4186V11.7586C3.81807 11.7993 3.31673 11.7 2.92207 11.4353V11.4353Z"
            fill="#3558A2"
          />
        </svg>
        <a id="git_link" href="https://github.com/etalab/explore.data.gouv.fr"
          >https://github.com/etalab/explore.data.gouv.fr</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import appStore from "@/apps/dvf/store";
import DatasetEmbed from "@/components/DatasetEmbed";

export default {
  name: "SourcesView",
  components: { DatasetEmbed },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
  watch: {},
};
</script>

<style scoped>
#content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 25px;
}

.chapo {
  display: block;
  max-width: 810px;
  font-size: 14px;
  margin-bottom: 30px;
}

.second_title {
  margin-top: 50px;
}

.datasetembed {
  margin-bottom: 20px;
}

#git_container {
  width: 100%;
  padding: 24px;
  border: 1px solid #e5e5e5;
}

#git_title {
  display: block;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 5px;
}

#git_logo {
  margin-right: 3px;
}

#git_link {
  font-weight: 400;
  font-size: 14px;
  background-image: none;
  color: #3558a2;
}
</style>
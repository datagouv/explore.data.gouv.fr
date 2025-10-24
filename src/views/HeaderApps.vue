<template>
  <div v-if="displayBanner" class="headerapps fr-grid-row fr-grid-row--middle">
    <div class="main-title">
    <div class="fr-enlarge-link">
      <div class="fr-enlarge-link">
        <a :href="home"><img
          src="/explore-light.svg"
          alt="explore.data.gouv.fr"
          class="logotype"
          width="200"
          height="18"
        /></a>
    </div>
    </div>
    <div class="fr-enlarge-link" style="float: left;">

      <a :href="appLink"
        ><div class="appName" v-if="appName != ''">
          <span>|</span> {{ appName }} <span v-if="betaApp" style="padding: 3px; background-color: #E8EDFE; color: #0163CB;">BETA</span>
        </div></a
      >
    </div>
    </div>

    <div>
      <!-- <div class="headerlink">
                <a :href="aproposHref" class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-information-line">
                    A propos de cette application
                </a>
            </div> -->
      <div class="headerlink">
        <a
          :href="formHref"
          class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-lightbulb-line"
        >
          Donnez-nous votre avis
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderApps",
  computed: {
    aproposHref() {
      return "https://data.gouv.fr";
    },
    home() {
      return window.location.origin;
    },
  },
  props: {
    formHref: String,
    appName: String,
    appLink: String,
    betaApp: Boolean,
    displayBanner: Boolean,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.headerapps {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: white;
  justify-content: space-between;
  width: 100%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.fr-enlarge-link {
  background-color: transparent;
  --hover: transparent;
}

.subtitle {
  font-family: "Spectral";
  font-style: italic;
  font-weight: 400;
  font-size: 18px;
  line-height: 18px;
  cursor: pointer;
  display: inline-block;
}

.logotype {
  vertical-align: middle;
}

.fr-badge {
  font-size: 0.75rem;
}

.appName {
  display: inline-block;
  margin-left: 10px;
  font-size: 14px;
  font-weight: 800;
  color: #3558a2;
}

.appName span {
  color: #e5e5e5;
}

.headerlink {
  display: inline-block;
}

.headerlink a {
  color: black;
}

@media screen and (max-width: 767px) {
  .headerapps {
    box-shadow: none;
  }

  .headerlink {
    display: none;
  }
}
.main-title{
  display: flex;
  flex-direction: row;
}
</style>

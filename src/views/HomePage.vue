<template>
  <div>
    <header-app></header-app>
    <div class="lineaire-simple">
        <h1 class="main-title">Valoriser et exploiter les données publiques au service de toutes et tous.</h1>
    </div>


    <div class="fr-mt-4w fr-container">
        <h3>Exploration de données</h3>
        <p class="text-home">Les équipes de <a class="link-text" href="https://www.data.gouv.fr">data.gouv.fr</a> et de la <a class="link-text" href="https://www.numerique.gouv.fr/dinum/">Direction Interministérielle du Numérique (DINUM)</a> proposent des explorations de données ouvertes pour faciliter leur appropriation et leurs réutilisations.</p>
        <p class="text-home">Découvrez ici certaines de ces explorations.</p>
        <div v-if="own__reuses" class="flex-container">
            <div class="flex-child"  v-for="item in own__reuses" v-bind:key="item.titleReuse">
                <reuse-star 
                    :typeReuse="item.typeReuse"
                    :titleReuse="item.titleReuse"
                    :descriptionReuse="item.descriptionReuse"
                    :link="item.link"
                    :linkImgReuse="item.linkImgReuse"
                ></reuse-star>
            </div>
        </div>

        <div class="propal-div">
            <div>
                <b>Proposez une exploration</b>
                <br />
                <i style="font-size: 14px;">Vous avez une idée d'exploration des données publiques qui pourrait être utile ?</i>
            </div>
            <div style="margin-left: auto;">
                <button @click="goToIdea()" class="button-idea">
                    Soumettre une idée
                </button>
            </div>
        </div>

        <h3>Réutilisations de la communauté</h3>
        <p class="text-home">La force de l'Open Data, c'est sa communauté. Découvrez notre sélection de réutilisations de données réalisées par d'autres administrations, entreprises, associations ou citoyens.</p>
        <p>Choisissez une thématique : </p>
        <div class="flex-container">
            <div 
                @click="selectThematique(item)"
                v-for="item in reuses" v-bind:key="item.thematique"
                :class="item.thematique === thematique ? 'flex-child2-selected' : 'flex-child2'">
                {{ item.thematique }}
            </div>
        </div>
        <br /><br />
        <div>
            <div 
                v-for="item in reuses" v-bind:key="item.thematique + '-reuses'">
                    <div v-if="item.thematique == thematique" class="flex-container">
                        <div v-for="reuse in item.reuses" v-bind:key="reuse" class="flex-child3 reuse">
                            <reuse-embed
                                :reuse="reuse">
                            </reuse-embed>
                        </div>
                    </div>
            </div>
        </div>
    </div>

    <footer-apps scrollable="scrollable" display="display"></footer-apps>
  </div>
</template>

<script>
import HeaderApp from './HeaderApp.vue'
import configSite from '@/config'
import ReuseStar from '../components/ReuseStar.vue'
import FooterApps from './FooterApps.vue'
import DatasetEmbed from '../components/DatasetEmbed.vue'
import ReuseEmbed from '../components/ReuseEmbed.vue'

export default {
  name: 'HomePage',
  components: {HeaderApp, ReuseStar, FooterApps, DatasetEmbed, ReuseEmbed},
  data() {
    return {
        own__reuses: configSite.homepage.own__reuses,
        reuses: configSite.homepage.reuses,
        thematique: "Economie et Entreprise",
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    selectThematique(item) {
        this.thematique = item.thematique
    },
    goToIdea(){
        window.location.href= "https://tally.so/r/n0eQVA"
    }
  },
  watch: {
  }
}
</script>

<style scoped>

@media screen  {

    .main-title {
        width: 60%;
        padding-top: 60px;
        font-size: 60px;
        line-height: 70px;
    }

    .text-home {
        font-size: 20px;
        line-height: 25px;
    }
}

@media screen and (max-width: 1300px) {
    .main-title {
        width: 90%;
        padding-top: 60px;
        font-size: 45px;
        line-height: 50px;
    }

    .text-home {
        font-size: 20px;
        line-height: 25px;
    }
}

@media screen and (max-width: 800px) {
    .main-title {
        width: 90%;
        padding-top: 60px;
        font-size: 30px;
        line-height: 35px;
    }

    .text-home {
        font-size: 16px;
        line-height: 18px;
    }
}

.main-title {
    margin: auto;
    text-align: center;
    font-family: Marianne;
    color: #3558A2;

}

.lineaire-simple {
  width: 100%;
  min-height: 15%;
  background: linear-gradient(#E5EEFD, white);
}

.flex-container {
    display: flex;
    flex-flow:row wrap;  
    /* margin: 0;
    align-items: center;
    justify-content: center; */
}

.flex-child {
    margin-right: 30px;
    margin-bottom: 30px;
    min-width: 400px;
}


.flex-child2 {
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #DAE7FD;
    color: #3558A2;
    border-radius: 20px;
    min-width: 50px;
    cursor: pointer;
}

.flex-child2-selected {
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #3558A2;
    color: white;
    border-radius: 20px;
    min-width: 50px;
    cursor: pointer;
}

.button-idea {
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #3558A2;
    color: white;
    border-radius: 20px;
    min-width: 50px;
    cursor: pointer;
}

.button-idea:hover {
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #3558A2;
    color: white;
    border-radius: 20px;
    min-width: 50px;
    cursor: pointer;
}

.flex-child3 {
    margin-right: 30px;
    margin-bottom: 30px;
    min-width: 200px;
}

.reuse {
    min-width: 200px;
    max-width: 350px;
}

.link-text{
    text-decoration: none;
    color: #3558A2;
}

.propal-div {
    padding: 20px;
    background-color: #DAE7FD;
    border-radius: 7px;
    margin-bottom: 30px;
    color: #3558A2;
    display: flex;
    flex-direction: row;
}

</style>
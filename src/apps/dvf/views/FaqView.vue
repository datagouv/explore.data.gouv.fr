<template>
    <div class="mainView" id="faqView">
      <div id="content">
        <h4>À propos de cette application</h4>

        <span id="chapo">Cette application est proposée par l’équipe de data.gouv.fr, et permet de visualiser les données de demandes de valeurs foncières (DVF) publiée et produites par la direction générale des finances publiques.<br>
        Ces données sont issues des actes notariés et des informations cadastrales et permettent de connaître les transactions immobilières intervenues au cours des cinq dernières années sur le territoire métropolitain et les DOM-TOM, <b>à l’exception de l’Alsace, de la Moselle et de Mayotte.</b><br>
        Vous pouvez télécharger et exploiter les données brutes selon les conditions d’utilisations disponibles sur <a href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/">cette page</a>.</span>

        <h4>Questions fréquentes</h4>

        <div class="question_box" data-question="1" :class="(question1)?'open':''" @click="(question1)?question1=false:question1=true">
          <span class="title">A quoi correspond le prix affiché ?</span>
          <span class="reponse">Les valeurs restituées dans les fichiers DVF portent uniquement sur les éléments immobiliers enregistrés lors de la mutation. Par exemple, il n’est pas tenu compte des éléments de nature mobilière inclus dans la transaction et dont la valeur est stipulée dans l’acte de mutation. Par ailleurs, les frais d’agence ne sont pas inclus dans les valeurs foncières sauf si, dans l’acte de mutation, ils sont stipulés être à la charge du vendeur.</span>
        </div>

        <div class="question_box"  data-question="2" :class="(question2)?'open':''" @click="(question2)?question2=false:question2=true">
          <span class="title">A quoi correspond la surface affichée ?</span>
          <span class="reponse">La surface affichée correspond à la surface réelle bâtie et non à la surface carrez (présente cependant dans le fichier, mais remplie sporadiquement et sans valeur légale).<br><br>
          La surface indiquée pour un bien correspond à la dernière surface déclarée pour ce bien auprès des services fonciers et connue à la date de vente.<br><br>
          Si cette surface ne correspond plus à la réalité, vous devez souscrire une déclaration foncière, dont le formulaire est disponible sur le site <a href="http://www.impots.gouv.fr/">www.impots.gouv.fr</a>, et la transmettre au service foncier du lieu de situation de ce bien dont les coordonnées sont également disponibles sur le site. Sur la base de cette déclaration, le service foncier procédera à la mise à jour de la surface et aux ajustements éventuels qui en découlent pour l’assiette des impôts directs locaux. Les mutations postérieures tiendront compte de la dernière surface déclarée.</span>
        </div>

        <div class="question_box"  data-question="3" :class="(question3)?'open':''" @click="(question3)?question3=false:question3=true">
          <span class="title">Pourquoi manque-t-il l’Alsace, la Moselle et Mayotte ?</span>
          <span class="reponse">La direction générale des Finances publiques, qui produit les données DVF, ne dispose pas des mutations des départements du Bas-Rhin, Haut-Rhin, Moselle et Mayotte. <br><br>
          Pour l'ancienne Alsace-Moselle, les données sont dans le Livre Foncier en raison de l'application du droit local, et ne sont actuellement pas ouvertes.</span>
        </div>

        <div class="question_box"  data-question="4" :class="(question4)?'open':''" @click="(question4)?question4=false:question4=true">
          <span class="title">Quand aura lieu la prochaine mise à jour ?</span>
          <span class="reponse">Les <a href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/">données brutes</a> font l’objet d’une mise à jour semestrielle par la DGFiP, fin avril et fin octobre. La mise à jour d'avril permet d'ajouter des données allant jusqu'à fin décembre de l'année passée et celle d'octobre des données allant jusqu'à fin juin de l'année en cours. Lors de chaque mise à jour, de nouvelles transactions sont susceptibles d’être ajoutées dans tous les millésimes en fonction de la date de mutation.
          <br><br>Pour toute information sur l’enregistrement d’une mutation, vous pouvez également vous adresser à votre service de publicité foncière de proximité, qui a pour mission de porter à la connaissance de tout usager qui en fait la demande les renseignements concernant la situation juridique des immeubles.</span>
        </div>

        <div class="question_box"  data-question="5" :class="(question5)?'open':''" @click="(question5)?question5=false:question5=true">
          <span class="title">Comment faire opposition à l’affichage d’une transaction ?</span>
          <span class="reponse">La mise a disposition des données est rendu possible par la <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000037307624">loi du 10 août 2018 pour un Etat au service d’une société de confiance</a>. La mesure prévoyant la diffusion de la Base est désormais codifié à <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037309458">l’article L. 112-A du livre des procédures fiscales</a>.<br><br>
          Elle est justifiée par un motif d’intérêt général tenant à la connaissance du prix de l’immobilier par toute personne intéressée par ce marché. Elle doit ainsi permettre d’améliorer la transparence des marchés immobiliers et fonciers.<br><br>
          <b>Dans la mesure où la diffusion de la Base répond à une obligation légale, il n’est pas possible, aux personnes concernées, de s’opposer à cette diffusion par data.gouv.fr ou au traitement par la DGFiP de données les concernant.</b>Il n’est pas possible de les effacer.<br><br>
          Les personnes conservent néanmoins un droit d’accès, de rectification et de limitation des données les concernant.<br><br>
          Pour rappel, la réglementation impose au demandeur de justifier "de son identité par tout moyen" (<a href="https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000038528420&categorieLien=id">article 77 du Décret n° 2019-536 du 29 mai 2019</a> pris pour l'application de la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés). Afin de vérifier que la demande émane bien de la personne concernée, il nous est nécessaire d'obtenir la copie de votre carte nationale d'identité, de votre passeport ou de votre permis de conduire.<br><br>
          Pour plus d’informations sur les points précités, vous pouvez consulter <a href="https://static.data.gouv.fr/resources/demandes-de-valeurs-foncieres/20201026-172636/information-des-personnes-concernees-par-le-traitement-informatique-20201016.pdf">l’Information des personnes concernées par le traitement informatique mis en œuvre</a>.</span>
        </div>

        <div class="question_box"  data-question="6" :class="(question6)?'open':''" @click="(question6)?question6=false:question6=true">
          <span class="title">J’ai constaté une erreur</span>
          <span class="reponse">Pour toute demande d’information ou toute erreur détectée dans les données vous pouvez écrire aux producteurs des données sur <a href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/">la page dédiée</a> ou contacter le bureau CL2A de la DGFIP à l’adresse suivante : bureau.cl2a-dvf@dgfip.finances.gouv.fr</span>
        </div>

        <div class="question_box"  data-question="7" :class="(question7)?'open':''" @click="(question7)?question7=false:question7=true">
          <span class="title">J’ai constaté un manque</span>
          <span class="reponse">Plusieurs explications sont possibles<br>
          <ul>
          <li>La remontée des données DVF peut être lente : ainsi, il manque encore une partie des données de l'année passée (n-1) et vraisemblablement quelques transactions des années n-2, n-3, n-4</li>
          <li>Le cadastre n'est pas vectorisé</li>
          <li>La commune a fusionné avec une autre commune et nous n'avons pas encore intégré ce changement.</li>
          </ul>
          Pour toute information sur l’enregistrement d’une mutation, vous pouvez vous adresser à votre service de publicité foncière de proximité, qui a pour mission de porter à la connaissance de tout usager qui en fait la demande les renseignements concernant la situation juridique des immeubles.</span>
        </div>

         <div class="question_box"  data-question="8" :class="(question8)?'open':''" @click="(question8)?question8=false:question8=true">
          <span class="title">Autres services utiles</span>
          <span class="reponse">Cette application permet de visualiser les données de demandes de valeurs foncières (DVF), ainsi que d'autres données publiques telles que les diagnostics de performance énergétique et les copropriétés.<br>
          De nombreux autres services sont construits à partir des données ouvertes autour de la thématique du logement, notamment :<br>
          <ul>
            <li>La couverture des réseaux sur <a href="https://maconnexioninternet.arcep.fr/">maconnexioninternet.arcep.fr</a> de l'ARCEP</li>
            <li>L'accessibilité sur  <a href="https://acceslibre.beta.gouv.fr/">acceslibre.beta.gouv.fr</a></li>
            <li>Les risques sur  <a href="https://www.georisques.gouv.fr/">georisques.gouv.fr</a> du BRGM</li>
            <li>Les informations d'urbanisme sur  <a href="https://www.geoportail-urbanisme.gouv.fr/">geoportail-urbanisme.gouv.fr</a> de l'IGN</li>
            <li>Les diagnostics de performance énergétique sur  <a href="https://particulier.gorenove.fr/">gorenove.fr</a> du CSTB</li>
            <li>La visualisation de l'évolution du prix de l'immobilier sur <a href="https://datafoncier.cerema.fr/">Dynmark</a> du CEREMA</li>
          </ul></span>
        </div>

        <div class="question_box"  data-question="9" :class="(question9)?'open':''" @click="(question9)?question9=false:question9=true">
          <span class="title">J’ai une autre question</span>
          <span class="reponse">Pour toute demande d’information ou toute erreur détectée dans les données vous pouvez écrire aux producteurs des données sur <a href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres-geolocalisees/">la page dédiée</a> ou contacter le bureau CL2A de la DGFIP à l’adresse suivante : <b>bureau.cl2a-dvf@dgfip.finances.gouv.fr</b><br><br>
          Si votre question porte plus spécifiquement sur l’application, vous pouvez <a href="https://support.data.gouv.fr/">écrire à l’équipe data.gouv.fr</a>.</span>
        </div>


      </div>
    </div>

</template>

<script>

import appStore from '@/apps/dvf/store'

export default {
  name: 'FaqView',
  components: {},
  data() {
    return {
      question1:false,
      question2:false,
      question3:false,
      question4:false,
      question5:false,
      question6:false,
      question7:false,
      question8:false,
      question9:false
    }
  },
  computed: {
  },
  mounted() {

  },
  methods: {
  },
  watch: {
  }
}

</script>

<style scoped>

  #content{
    width: 100%;
    max-width: 1200px;
    margin:0 auto;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 25px;
  }

  #chapo{
    display: block;
    max-width: 810px;
    font-size: 14px;
    margin-bottom: 30px;
  }

  .question_box{
    border-bottom: 1px solid #e5e5e5;
    padding:10px;
    overflow: hidden;
    height: 50px;
    cursor: pointer;
    position: relative;
  }

  .question_box:after{
    content: "+";
    position: absolute;
    font-family: "Marianne";
    font-size: 25px;
    font-weight: 400px;
    top:10px;
    right: 10px;
  }

  .title{
    display: block;
    font-size: 16px;
    margin-bottom: 15px;
  }

  .reponse{
    font-size: 14px;
    line-height: 18px;
  }

  .question_box.open{
    height: auto;
  }

  .question_box.open:after{
    content: "-";
  }

  .question_box.open .title{
    font-weight: 700;
  }
</style>

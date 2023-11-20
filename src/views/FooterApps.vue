<template>
    <div class="footerapps fr-grid-row fr-grid-row--middle" :class="[(scrollable=='scrollable')?'scrollable':'',(display=='display')?'display':'']">
        <div class="fr-footer__brand fr-enlarge-link">
            <a href="/" title="Retour à l’accueil">
                <p class="fr-logo" title="république française">
                    république
                    <br>française
                </p>
            </a>
        </div>

        <div class="footer_links_container">
            <div class="footer_signature">Ce site est proposé par <a href="https://www.data.gouv.fr/">data.gouv.fr</a></div>
            <div class="footer_links">
                <a target="_blank" href="https://data.gouv.fr/">data.gouv.fr</a>
                <a target="_blank" href="https://www.gouvernement.fr/">gouvernement.fr</a>
                <a target="_blank" href="https://www.legifrance.gouv.fr/">legifrance.fr</a>
                <a target="_blank" href="https://www.service-public.fr/">service-public.fr</a>
            </div>
        </div>

    </div>
</template>

<script>

export default {
    name: 'FooterApps',
    props:{
        scrollable:String,
        display:String
    },
    computed: {
    }
}
</script>

<style scoped>

.footerapps{
    width: 100%;
    height: 130px;
    position: absolute;
    bottom: -130px;
    border-top:2px solid #000091;
    display: none;
}

.footerapps.scrollable{
    position: relative;
    bottom:auto;
    margin-top: 100px;
}

.footerapps.display{
    display: flex;
}


.fr-footer__brand{
    transform:scale(0.6);
}

.footer_links_container{
    position: absolute;
    right: 35px;
}

.footer_signature{
    font-size: 14px;
}

.footer_links a{
    background-image:none;
    font-size: 14px;
    font-weight: 700;
    margin-right: 15px;
}

@media screen and (max-width: 767px){

    .footerapps.display{
        display: none;
    }
}



</style>
<template>
    <div
        @click="goToExplore()" 
        class="fr-container fr-mt-2w card"
    >
        <div class="fr-card fr-row">
            <div class="fr-card__body cardDetail">
                <div class="logoCard">
                    <img :src="logo" width="100" alt=""/>
                </div>
                <div class="titleCard">
                    <h3 class="fr-card__title">
                        {{ dataset.title }}
                    </h3>
                    <p class="fr-card__desc">
                        {{ resource.title }}
                    </p>
                    <br />
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'CardLink',
    props: ['did', 'rid'],
    data() {
      return {
        dataset: {},
        resource: {},
        logo: '',
      }
    },
    methods: {
        goToExplore(){
            window.location.href = window.location.origin + '/?url=https://www.data.gouv.fr/fr/datasets/r/' + this.rid
        }
    },
    async created() {
        this.dataset = await fetch('https://www.data.gouv.fr/api/1/datasets/' + this.did)
        .then((response) => {
            return response.json()
        })
        this.resource = await fetch('https://www.data.gouv.fr/api/2/datasets/resources/' + this.rid)
        .then((response) => {
            return response.json()
        })
        this.resource = this.resource['resource']
        if(this.dataset.owner) {
            this.logo = this.dataset.owner.avatar
        } else {
            this.logo = this.dataset.organization.logo
        }
    },
}
</script>

<style>

.card{
    cursor: pointer
}

.cardDetail{
    width: 100%;
    display: -webkit-box;
    padding: 10px;
}

.logoCard{
    line-height: 100%;
    margin-top: auto;
    margin-bottom: auto;
}

.titleCard{
    margin-left: 20px;
    margin-top: auto;
    margin-bottom: auto;
}

</style>

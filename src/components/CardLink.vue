<template>
    <div
        class="fr-container fr-mt-2w"
    >
        <div class="fr-card fr-enlarge-link fr-card--horizontal">
            <div class="fr-card__body">
                <div class="fr-card__content">
                    <h3 class="fr-card__title">
                        <a :href="href">{{ dataset.title }}</a>
                    </h3>
                    <p class="fr-card__desc">{{ resource.title }}</p>
                </div>
            </div>
            <div class="fr-card__header">
                <div class="fr-card__img">
                    <img class="fr-responsive-img" width="100"  :src="logo" alt="" />
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
    computed: {
        href() {
            return window.location.origin + '/?url=https://www.data.gouv.fr/fr/datasets/r/' + this.rid
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

<style scoped>
.fr-card--horizontal .fr-card__header {
    width: 200px;
    flex: 0 0 200px;
}

.fr-card--horizontal .fr-card__img img {
    object-fit: contain;
}
</style>

<template>
    <div class="fr-container fr-mt-2w">
        <div class="fr-card">
            <div class="fr-card__body">
                <div class="fr-card__content">
                    <h3 class="fr-card__title">
                        Détails de l'erreur
                    </h3>
                    <p class="fr-card__desc">
                        {{ error.error }}
                        <span v-if="error.details"> {{ error.details }}</span>
                    </p>
                    <div class="fr-card__start">
                        <p class="fr-card__detail fr-icon-warning-fill" v-if="error.id" >Identifiant de l'erreur : {{ error.id }}</p>
                    </div>
                </div>
                <div class="fr-card__footer">
                    <ul class="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                        <li>
                            <button class="fr-btn fr-btn--secondary" @click="openIssue">
                                Signaler cette erreur sur Github
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error',
    props: ['error'],
    methods: {
        openIssue() {
            const title = `Impossible de convertir le fichier`
            const body = `
Impossible de convertir le fichier situé ici : ${this.csvUrl}%0A%0A
${this.error.error} ${this.error.details || ''}%0A%0A
Identifiant : ${this.error.id || ''}
`
            const githubLink = `https://github.com/etalab/csvapi/issues/new?labels=live-feedback&title=${title}&body=${body}`
            window.open(githubLink, '_blank')
        }
    }
}
</script>

<style>

</style>

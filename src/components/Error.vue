<template>
    <div class="m-4">
        <b-card
            header-bg-variant="danger"
            border-variant="danger"
            header="🤕 Nous n'avons pas pu convertir ce fichier"
            header-border-variant="danger"
            header-text-variant="white"
            align="center"
        >
            <b-card-text>
                <dl>
                    <dt>Détails de l'erreur</dt>
                    <dd>
                        {{ error.error }}
                        <span v-if="error.details"> {{ error.details }}</span>
                    </dd>
                    <dt v-if="error.id">Identifiant de l'erreur</dt>
                    <dd v-if="error.id">{{ error.id }}</dd>
                </dl>
                <b-button @click="openIssue" variant="outline-danger" size="lg">Signaler cette erreur sur Github</b-button>
            </b-card-text>
        </b-card>
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

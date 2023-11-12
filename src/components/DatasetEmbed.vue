<template>
  <div>
    <div v-if="this.slug" class="containerDataset" @click="goToDataset()">
      <div class="logoDataset">
        <img :src="logo" width="70"/>
      </div>
      <div class="infoDataset">
        <b>{{ this.nom }} {{ this.acronym }}</b><br />Par <a :href="dataGouvUrl + 'fr/organizations/' + this.organization_slug" >{{ this.organization }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DatasetEmbed",
  data() {
    return {
      logo: null,
      nom: null,
      slug: null,
      organization: null,
      organization_slug: null,
      acronym: "",
      dataGouvUrl: "https://www.data.gouv.fr/"
    };
  },
  props: {
    dataset: String,
  },
  computed: {},
  methods: {
    goToDataset(){
      window.location.href = this.dataGouvUrl + "fr/datasets/" + this.slug
    }
  },
  created() {
    fetch(this.dataGouvUrl + "api/1/datasets/" + this.dataset)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data)
        this.logo = data.organization.logo_thumbnail
        this.nom = data.title
        this.slug = data.slug
        this.organization = data.organization.name
        this.organization_slug = data.organization.slug
        if (data.acronym) {
          this.acronym = "(" + data.acronym + ")"
        }
      })

    console.log(dataGouvUrlApi)
  },
};
</script>

<style scoped lang="scss">
.containerDataset {
  border: 1px solid #CCCCCC;
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  padding: 20px;
  cursor: pointer;
}
.containerDataset:hover {
  background-color: #ebebeb;
}
.infoDataset{
  margin-left: 15px;
  padding-top: 20px;
}
.infoDataset a{
  color: #3558A2;
}
.logoDataset {
  border: 1px solid #CCCCCC;
  padding: 10px;
}
</style>
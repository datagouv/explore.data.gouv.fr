<template>
    <div @click="goToApp()" class="own-explore">
        <div >
            <img style="width: 100%;" :src="linkImgReuse" />
        </div>
        <div class="infos-own-explore">
            <span v-if="typeReuse === 'proto'" class="etiquette-pink">PROTOTYPE DISPONIBLE</span>
            <span v-if="typeReuse === 'produit'" class="etiquette-blue">PRODUIT</span>
            <br /><br />
            <p class="title-explore">{{ titleReuse }}</p>
            <p>{{ descriptionReuse }}</p>

        </div>
    </div>
</template>

<script>
export default {
  name: "ReuseEmbed",
  data() {
    return {};
  },
  props: {
    typeReuse: String,
    titleReuse: String,
    descriptionReuse: String,
    link: String,
    linkImgReuse: String,
  },
  computed: {},
  methods: {
    goToApp(){
        if (this.link.startsWith("http")){
            window.open(this.link);
        } else {
            this.$router.push(this.link) 
        }
    }
  },
  created() {},
};
</script>

<style scoped lang="scss">

.own-explore {
    max-width: 500px;
    border: 1px solid #ebebeb;
    cursor: pointer;
}

.infos-own-explore {    
    width: 90%;
    font-size: 14px;
    padding-top: 0px;
    margin: 5%;

}
.etiquette-pink {
    background-color: #FDE8FC;
    border-radius: 5px;
    padding-left: 5px;
    padding-right: 5px;
    color: #6E455A;
    font-weight: bold;
}

.etiquette-blue {
    background-color: #E5EEFD;
    border-radius: 5px;
    padding-left: 5px;
    padding-right: 5px;
    color: #3558A2;
    font-weight: bold;
}

.title-explore {
    font-size: 16px;
    font-weight: bold;
}
</style>
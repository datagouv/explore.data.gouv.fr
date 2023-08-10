<template>
  <!-- url field if no url provided -->
  <div>
    <header-app></header-app>
    <infos-resource></infos-resource>
    <Table class="fr-pt-0"></Table>
  </div>
</template>

<script>
import HeaderApp from "@/views/HeaderApp";
import InfosResource from "@/views/InfosResource";
import Table from "@/components/Table";

export default {
  name: "TableView",
  components: { HeaderApp, InfosResource, Table },
  data() {
    return {
      rid: null,
    };
  },
  computed: {
    dgvInfos() {
      return this.$store.state.dgv_infos;
    },
    rows() {
      return this.$store.state.rows;
    },
    profile() {
      return this.$store.state.profile;
    },
    fields() {
      return this.$store.getters.fields;
    },
    totalRows() {
      return this.$store.state.totalRows;
    },
    columnsInfos() {
      return this.$store.state.columnsInfos;
    },
  },
  created() {
    const params = new URLSearchParams(document.location.search);
    // set filters from query string (before setting url and fetching data)
    this.setFiltersFromQueryString(params);
    this.rid = this.$route.params.id;
    if (this.rid) {
      console.log("dgvinfos");
      this.getDataGouvInfos();
      console.log(this.dgvInfos);
      console.log("rows");
    }
  },
  methods: {
    getDataGouvInfos() {
      fetch(
        "https://www.data.gouv.fr/api/2/datasets/resources/" + this.rid + "/"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let obj = {};
          obj.resource = data.resource;
          fetch("https://www.data.gouv.fr/api/1/datasets/" + data["dataset_id"])
            .then((response2) => {
              return response2.json();
            })
            .then((data2) => {
              obj.dataset_id = data2.id;
              obj.dataset_title = data2.title;
              if (data2.organization) {
                obj.organization_id = data2.organization.id;
                obj.organization_name = data2.organization.name;
              }
              let other_resources = [];
              data2.resources.forEach((res) => {
                if (res.id != this.rid) {
                  other_resources.push({
                    resource_id: res.id,
                    resource_title: res.title,
                    preview_url: res.preview_url,
                    format: res.format,
                  });
                }
              });
              obj.other_resources = other_resources;
              console.log(obj);
              this.$store.dispatch("manageDgvInfos", obj);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProfile() {
      fetch(
        "https://api-tabular.preprod.data.gouv.fr/api/resources/" +
          this.rid +
          "/profile/"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.$store.commit(
            "setColumns",
            data.profile.header.map((c) => {
              return c.replaceAll('"', "");
            })
          );
          let obj = {};
          obj = {};
          for (const [key, value] of Object.entries(data.profile.columns)) {
            let subobj = {};
            subobj = { ...value, ...data.profile.profile[key] };
            obj[key] = subobj;
          }
          this.$store.commit("setColumnsInfos", obj);
        });
    },
    setFiltersFromQueryString(params) {
      [...params.entries()]
        .filter(([k, v]) => {
          return k.indexOf("__") !== -1 && k.indexOf("_") !== 0;
        })
        .forEach(([k, v]) => {
          this.$store.commit("addFilter", {
            field: k.split("__")[0],
            value: v,
            comp: k.split("__")[1],
          });
        });
    },
  },
  watch: {},
};
</script>
<template>
  <div :class="showLabel ? 'cardFilter' : ''">
    <div v-if="showLabel" class="removeFilter">
      <button
        class="fr-btn fr-btn--sm fr-btn--primary fr-btn--icon-left fr-icon-close-circle-fill buttonRemoveFilter"
        @click="removeFilter()"
      >
        Supprimer
      </button>
    </div>
    <div
      v-if="field"
      @mouseenter="getInfos('div', $event)"
      @mouseleave="hideBox"
      @keyup.esc="hideBox"
      class="fr-input-group"
    >
      <label v-if="showLabel" class="fr-label" :for="field.key">{{
        field.label
      }}</label>
      <div
        ref="wrap"
        class="fr-input-wrap fr-input-wrap--icon-left relative"
        :class="inputWrapClass"
      >
        <input
          @focus="getInfos('input', inputValue)"
          @input="filterText($event, columnInfos.python_type)"
          type="search"
          class="fr-input"
          :class="inputClass"
          :value="inputValue"
          :id="field.key"
          placeholder="Filtrer la colonne"
        />
        <div v-if="columnInfos" style="margin-top: 10px;">
          <div>
            <div v-if="!columnInfos.hasOwnProperty('min')">
              <div v-if="columnInfos['tops'].length > 0">
                <b>
                  Valeurs les plus fréquentes
                </b>
                <div
                  class="catFilter fr-my-1v"
                  v-for="cat in columnInfos['tops']"
                  :key="cat.value"
                >
                  <button
                    @click="filterTextCat(cat.value)"
                    :class="
                      'fr-tag fr-tag--sm cat' + getColor(field.key, cat.value)
                    "
                  >
                    {{ cat.value }}
                  
                  </button>
                    <span v-if="filters.length === 0"
                      >&nbsp;{{ cat.count }}</span
                    >
                </div>
              </div>
            </div>
            <div
              v-if="columnInfos.hasOwnProperty('min') && intervalFilter"
            >
              <h3 class="fr-mb-1w fr-text--sm fr-text--regular">
                Intervalle :
              </h3>
              <p class="fr-mb-1w fr-text--sm fr-text--regular">
                Entre {{ intervalFilter[0] }} et {{ intervalFilter[1] }}
              </p>
              <vue-slider
                v-model="intervalFilter"
                process-style="{ backgroundColor:  'green'  }"
                :min="Math.floor(columnInfos.min)"
                :interval="interval"
                :max="Math.floor(columnInfos.max) + 1"
                @change="sliderChange($event)"
              ></vue-slider>
            </div>
          </div>
        </div>
      </div>
      <div
        class="fr-mb-1w fr-text--sm fr-text--regular"
        v-if="showLabel && columnInfos.type == 'Numeric' && intervalFilter"
      >
        Entre {{ intervalFilter[0] }} et {{ intervalFilter[1] }}
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
import storeTabular from '@/apps/tabular/store/storeTabular'

export default {
  components: { VueSlider },
  store: storeTabular,
  props: {
    field: {
      type: Object,
      required: false,
    },
    showLabel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeFilterBox: false,
      timer: null,
      intervalFilter: null,
      interval: 1,
      listener: null,
    };
  },
  mounted() {
    if (this.field && this.filterLess && this.filterGreater) {
      this.intervalFilter = [this.filterLess.value, this.filterGreater.value];
    }
    if (
      this.columnInfos &&
      this.columnInfos.format && (
        this.columnInfos.format == "int" ||
        this.columnInfos.format == "float"
      )
    ) {
      let intfil = [this.columnInfos.min, this.columnInfos.max];
      if (this.filterGreater) {
        intfil[0] = this.filterGreater.value;
      }
      if (this.filterLess) {
        intfil[1] = this.filterLess.value;
      }
      this.intervalFilter = intfil;
      if (this.columnInfos && this.columnInfos.format && this.columnInfos.format == "int") {
        this.interval = 1;
      } else {
        this.interval =
          1 /
          Math.pow(
            10,
            Math.max(
              this.getInterval(this.columnInfos.min),
              this.getInterval(this.columnInfos.max)
            )
          );
      }
    }

  },
  beforeDestroy() {
    if (this.listener) {
      document.removeEventListener("resize", this.listener);
    }
  },
  watch: {
    activeFilterBox(value) {
      if (this.listener) {
        document.removeEventListener("resize", this.listener);
      }
      if (value) {
        this.$nextTick(function () {
          this.moveTooltipIfRequired();
        });
        this.listener = document.addEventListener(
          "resize",
          this.moveTooltipIfRequired
        );
      }
    },
  },
  computed: {
    categoricalInfos() {
      return this.columnInfos["categorical_infos"]
        ? this.columnInfos["categorical_infos"]
        : [];
    },
    columnInfos() {
      if (this.field && this.field.key) {
        return this.columnsInfos[this.field.key]
          ? this.columnsInfos[this.field.key]
          : {};
      }
    },
    columnsInfos() {
      return this.$store.state.columnsInfos;
    },
    filterLess() {
      return this.filters.find(
        (filter) => filter.field === this.field.key && filter.comp != "less"
      );
    },
    filterGreater() {
      return this.filters.find(
        (filter) => filter.field === this.field.key && filter.comp != "greater"
      );
    },
    filter() {
      return this.filters.find(
        (filter) =>
          filter.field === this.field.key &&
          filter.comp != "less" &&
          filter.comp != "greater"
      );
    },
    filters() {
      return this.$store.state.filters;
    },
    inputClass() {
      return {
        "fr-input--filled": this.isFieldFiltered,
        "fr-input--empty": !this.isFieldFiltered,
        ["inputTextFilter-" + this.field.key]: true,
      };
    },
    inputValue() {
      return this.filter ? this.filter.value : "";
    },
    inputWrapClass() {
      return this.isFieldFiltered
        ? "fr-input-wrap--filled"
        : "fr-input-wrap--empty";
    },
    isFieldFiltered() {
      return !!this.filter;
    },
    topInfos() {
      return this.columnInfos["top_infos"] ? this.columnInfos["top_infos"] : [];
    },
  },
  methods: {

    removeFromQueryString(paramKey) {
      // Clone the current route's query parameters
      let queryParams = { ...this.$route.query };

      // Check if the parameter to remove exists
      if (queryParams.hasOwnProperty(paramKey)) {
        // Remove the parameter
        delete queryParams[paramKey];

        // Update the route with the new query parameters
        this.$router.push({ query: queryParams, hash: this.$route.hash }).catch(err => {
          // Catch the navigation duplicated error when trying to push the same route
          if (err.name !== 'NavigationDuplicated') {
            throw err;
          }
        });
      }
    },
    addToQueryString(key, value) {
      if (value) {
        this.$router.push({ path: this.$route.path, query: { ...this.$route.query, [key]: value }, hash: this.$route.hash  });
      }
    },
    filterText(e, type) {
      this.getInfos("function", e.target.value);
      if (e.target.value != "") {
        let filter = {};
        if (type == "int" || type == "float" || type == "date") {
          filter = {
            field: this.field.key,
            value: e.target.value,
            comp: "exact",
          };
        } else {
          filter = {
            field: this.field.key,
            value: e.target.value,
            comp: "contains",
          };
        }
        this.removeFromQueryString(`${filter.field}__contains`);
        this.removeFromQueryString(`${filter.field}__exact`);
        this.removeFromQueryString(`${filter.field}__greater`);
        this.removeFromQueryString(`${filter.field}__less`);
        this.$store.commit("deleteAllFiltersWithField", filter.field);
        this.$store.commit("addFilter", filter);
        this.addToQueryString(`${filter.field}__${filter.comp}`, filter.value);
        this.$store.dispatch("filterPage");
      } else {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.removeFilter();
        }, 650);
      }
    },
    removeFilter() {
      let filter = {
        field: this.field.key,
        value: "",
        comp: "contains",
      };
      this.removeFromQueryString(`${filter.field}__contains`);
      this.removeFromQueryString(`${filter.field}__exact`);
      this.removeFromQueryString(`${filter.field}__greater`);
      this.removeFromQueryString(`${filter.field}__less`);
      this.$store.commit("deleteAllFiltersWithField", filter.field);
      this.$store.dispatch("filterPage");
    },
    filterTextCat(value) {
      let filter = {
        field: this.field.key,
        value: value,
        comp: "exact",
      };
      this.removeFromQueryString(`${filter.field}__contains`);
      this.removeFromQueryString(`${filter.field}__exact`);
      this.$store.commit("deleteAllFiltersWithField", filter.field);
      this.$store.commit("addFilter", filter);
      this.addToQueryString(`${filter.field}__${filter.comp}`, filter.value);
      this.activeFilterBox = false;
      this.$store.dispatch("filterPage");
      let obj = document.getElementsByClassName(
        "inputTextFilter-" + this.field.key
      );
      obj[0].value = value;
    },
    getColor(key, value) {
      return this.$store.getters.color(key, value);
    },
    getInterval(val) {
      let numStr = String(val);
      if (numStr.includes(".")) {
        if (numStr.split(".")[1].length > 3) {
          return 3;
        } else {
          return numStr.split(".")[1].length;
        }
      } else {
        return 1;
      }
    },
    getInfos(el, val) {
      if (
        this.columnInfos.format == "int" ||
        this.columnInfos.format == "float"
      ) {
        let intfil = [this.columnInfos.min, this.columnInfos.max];
        if (this.filterGreater) {
          intfil[0] = this.filterGreater.value;
        }
        if (this.filterLess) {
          intfil[1] = this.filterLess.value;
        }
        this.intervalFilter = intfil;
        if (this.columnInfos.format == "int") {
          this.interval = 1;
        } else {
          this.interval =
            1 /
            Math.pow(
              10,
              Math.max(
                this.getInterval(this.columnInfos.min),
                this.getInterval(this.columnInfos.max)
              )
            );
        }
      } else if (this.columnInfos.format == "date") {
        // do something
      } else {
      }
      if (el == "div") {
        val = "";
        this.activeFilterBox = false;
        if (val == "") {
          const key = this.field.key;
          if (
            this.columnsInfos[key] &&
            this.columnsInfos[key]["tops"] &&
            Array.isArray(this.columnsInfos[key]["tops"])
          ) {
            this.activeFilterBox = true;
          }
          // if (
          //   this.columnsInfos[key] &&
          //   this.columnsInfos[key]["numeric_plot_infos"]
          // ) {
          //   this.activeFilterBox = true;
          // }
        }
      }
    },
    getSearchParams() {
      return new URLSearchParams(document.location.search);
    },
    hideBox() {
      this.activeFilterBox = false;
    },
    sliderChange(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let filter_less = {
          field: this.field.key,
          value: this.intervalFilter[1],
          comp: "less",
        };
        let filter_greater = {
          field: this.field.key,
          value: this.intervalFilter[0],
          comp: "greater",
        };
        this.removeFromQueryString(`${filter_greater.field}__greater`);
        this.removeFromQueryString(`${filter_less.field}__less`);
        this.$store.commit("deleteAllFiltersWithField", filter_less.field);
        this.$store.commit("addFilter", filter_less);
        this.$store.commit("addFilter", filter_greater);
        this.addToQueryString(
          `${filter_less.field}__${filter_less.comp}`,
          filter_less.value
        );
        this.addToQueryString(
          `${filter_greater.field}__${filter_greater.comp}`,
          filter_greater.value
        );
        this.$store.dispatch("filterPage");
      }, 1000);
    },
    moveTooltipIfRequired() {
      // const rect = this.$refs.tooltip.getBoundingClientRect();
      // if (rect.right > document.documentElement.clientWidth) {
      //   this.$refs.tooltip.style.left = `-${
      //     rect.right - document.documentElement.clientWidth
      //   }px`;
      // } else {
      //   this.$refs.tooltip.style.left = `0px`;
      // }
    },
  },
};
</script>
<style>
.topInfo {
  background-color: var(--background-contrast-grey);
  cursor: pointer;
}
.catFilter {
  max-height: 7.5rem;
  overflow: hidden;
}
.vue-slider-process {
  background-color: var(--background-contrast-blue-cumulus-hover);
  border-radius: 15px;
  transition: background-color 0.3s;
}
.vue-slider:hover .vue-slider-process {
  background-color: var(--text-label-blue-cumulus);
}
.vue-slider-dot-handle {
  cursor: pointer;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid var(--background-contrast-blue-cumulus-hover);
  box-sizing: border-box;
  transition: box-shadow 0.3s, border-color 0.3s;
}
.vue-slider-dot-handle:hover {
  border: 2px solid green;
}
.vue-slider:hover .vue-slider-dot-handle:hover {
  border-color: var(--text-label-blue-cumulus);
}
.vue-slider:hover .vue-slider-dot-handle {
  border-color: var(--text-label-blue-cumulus);
}
.cardFilter {
  background-color: #f5f5fe;
  padding: 10px;
  border-radius: 2px;
}
.removeFilter {
  width: 100%;
  height: 35px;
}
.buttonRemoveFilter {
  float: right;
}

</style>
<template>
  <div class="leftCol" :class="leftColOpening">
    <div class="leftColOpener" @click="changeLeftColOpening()">
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.99999 2.21917L1.69999 5.51916L0.757324 4.5765L4.99999 0.333832L9.24266 4.5765L8.29999 5.51916L4.99999 2.21917Z"
          fill="#161616"
        />
      </svg>
    </div>

      <div class="header_container" v-if="level === 'fra'">
        <h2 class="intro_title">Bonjour !<br />Bienvenue</h2>
        <span class="intro_text"
          >Suivez l'évolution des prix de l'immobilier et trouver le prix des
          ventes immobilières sur les 5 dernières années.</span
        >
      </div>
      <div class="header_container" v-if="level != 'fra'">
        <div class="ariane_container">
          <div><span>France</span></div>
          <div v-if="userLocation.depName">
            <span>{{ userLocation.depName }} ({{ userLocation.dep }})</span>
          </div>
          <div v-if="userLocation.comName">
            <span>{{ userLocation.comName }} ({{ userLocation.com }})</span>
          </div>
          <div v-if="userLocation.sectionName">
            <span>Section {{ userLocation.sectionName }}</span>
          </div>
          <div v-if="userLocation.parcelleName">
            <span>Parcelle {{ userLocation.parcelleName }}</span>
          </div>
        </div>

        <div class="location_container">
          <div v-if="level === 'fra'">
            <div><span class="location_title">PAYS</span></div>
            <div><span class="location_label">France entière</span></div>
          </div>

          <div v-if="level === 'departement'">
            <div><span class="location_title">DÉPARTEMENT</span></div>
            <div>
              <span class="location_label"
                >{{ userLocation.depName }} ({{ userLocation.dep }})</span
              >
            </div>
          </div>

          <div v-if="level === 'commune'">
            <div><span class="location_title">COMMUNE</span></div>
            <div>
              <span class="location_label"
                >{{ userLocation.comName }} ({{ userLocation.com }})</span
              >
            </div>
          </div>

        <div v-if="level === 'section' && userLocation.section">
          <div><span class="location_title">SECTION CADASTRALE</span></div>
          <div>
            <span class="location_label">{{ userLocation.section }}</span>
          </div>
        </div>

          <div v-if="level === 'parcelle'">
            <div><span class="location_title">PARCELLE CADASTRALE</span></div>
            <div>
              <span class="location_label">{{ userLocation.parcelle }}</span>
            </div>
          </div>
        </div>
      </div>


    <div class="stats_container" v-if="level != 'parcelle' && level != 'section' && nodata == false">
      <div class="global_numbers_container">
        <div class="global_number_wrapper">
          <div class="global_number_title">
            Nombre total de ventes
            <div
              class="info_btn"
              @mouseover="hoveredInfo = 'ventes'"
              @mouseleave="hoveredInfo = ''"
            >
              <div>?</div>
            </div>
          </div>

            <div class="info_bulle" v-if="hoveredInfo == 'ventes'">
              Nombre total de ventes immobilières pendant les 5 dernières années
            </div>

            <div class="global_number_value">
              {{ clientData["totalVentes"] }}
            </div>
          </div>
          <div class="global_number_wrapper">
            <div class="global_number_title">
              Prix de vente médian au m²
              <div
                class="info_btn"
                @mouseover="hoveredInfo = 'prix'"
                @mouseleave="hoveredInfo = ''"
              >
                <div>?</div>
              </div>
            </div>
            <div class="info_bulle" v-if="hoveredInfo == 'prix'">
              Prix médian du m² de l'ensemble des ventes immobilières des 5
              dernières années
            </div>
            <div class="global_number_value">
              {{ clientData["totalAverage"] }}
            </div>
          </div>
        </div>

        <div class="tab_container">
          <table>
            <tr>
              <th></th>
              <th
                :class="
                  activeFilter == 'maison' || activeFilter == 'local'
                    ? 'hide'
                    : ''
                "
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M22 21H2V19H3V4C3 3.44772 3.44772 3 4 3H18C18.5523 3 19 3.44772 19 4V9H21V19H22V21ZM17 19H19V11H13V19H15V13H17V19ZM17 9V5H5V19H11V9H17ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM7 7H9V9H7V7Z"
                  ></path>
                </svg>
                Appt.
              </th>
              <th
                :class="
                  activeFilter == 'appartement' || activeFilter == 'local'
                    ? 'hide'
                    : ''
                "
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M19 21.0001H5C4.44772 21.0001 4 20.5524 4 20.0001V11.0001L1 11.0001L11.3273 1.61162C11.7087 1.26488 12.2913 1.26488 12.6727 1.61162L23 11.0001L20 11.0001V20.0001C20 20.5524 19.5523 21.0001 19 21.0001ZM13 19.0001H18V9.15757L12 3.70302L6 9.15757V19.0001H11V13.0001H13V19.0001Z"
                  ></path>
                </svg>
                Maisons
              </th>
              <th :class="activeFilter != 'local' ? 'hide' : ''">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M21 13.2422V20H22V22H2V20H3V13.2422C1.79401 12.435 1 11.0602 1 9.5C1 8.67286 1.22443 7.87621 1.63322 7.19746L4.3453 2.5C4.52393 2.1906 4.85406 2 5.21132 2H18.7887C19.1459 2 19.4761 2.1906 19.6547 2.5L22.3575 7.18172C22.7756 7.87621 23 8.67286 23 9.5C23 11.0602 22.206 12.435 21 13.2422ZM19 13.9725C18.8358 13.9907 18.669 14 18.5 14C17.2409 14 16.0789 13.478 15.25 12.6132C14.4211 13.478 13.2591 14 12 14C10.7409 14 9.5789 13.478 8.75 12.6132C7.9211 13.478 6.75911 14 5.5 14C5.331 14 5.16417 13.9907 5 13.9725V20H19V13.9725ZM5.78865 4L3.35598 8.21321C3.12409 8.59843 3 9.0389 3 9.5C3 10.8807 4.11929 12 5.5 12C6.53096 12 7.44467 11.3703 7.82179 10.4295C8.1574 9.59223 9.3426 9.59223 9.67821 10.4295C10.0553 11.3703 10.969 12 12 12C13.031 12 13.9447 11.3703 14.3218 10.4295C14.6574 9.59223 15.8426 9.59223 16.1782 10.4295C16.5553 11.3703 17.469 12 18.5 12C19.8807 12 21 10.8807 21 9.5C21 9.0389 20.8759 8.59843 20.6347 8.19746L18.2113 4H5.78865Z"
                  ></path>
                </svg>
                Locaux
              </th>
            </tr>
            <tr>
              <th class="left">Ventes :</th>
              <td
                :class="
                  activeFilter == 'maison' || activeFilter == 'local'
                    ? 'hide'
                    : ''
                "
              >
                {{ clientData["appVentes"] }}
              </td>
              <td
                :class="
                  activeFilter == 'appartement' || activeFilter == 'local'
                    ? 'hide'
                    : ''
                "
              >
                {{ clientData["houseVentes"] }}
              </td>
              <td :class="activeFilter != 'local' ? 'hide' : ''">
                {{ clientData["localVentes"] }}
              </td>
            </tr>
            <tr>
              <th class="left">Prix median m² :</th>
              <td
                :class="
                  activeFilter == 'maison' || activeFilter == 'local'
                    ? 'hide'
                    : ''
                "
              >
                {{ clientData["appPrice"] }}
              </td>
              <td
                :class="
                  activeFilter == 'appartement' || activeFilter == 'local'
                    ? 'hide'
                    : ''
                "
              >
                {{ clientData["housePrice"] }}
              </td>
              <td :class="activeFilter != 'local' ? 'hide' : ''">
                {{ clientData["localPrice"] }}
              </td>
            </tr>
          </table>
        </div>

      <div class="chart_container" v-if="this.apiLevel != 'section' && this.apiLevel != 'parcelle'">
        <span class="chart_title">Evolution du prix de vente median au m²</span>
        <span class="chart_geo">{{ chartGeoLabel }}</span>
        <div
          class="chart_info_btn line_chart_info"
          @mouseover="hoveredBulle = 'line'"
          @mouseleave="hoveredBulle = ''"
        >
          <div>?</div>
        </div>
        <div class="chart_info_bulle" v-if="hoveredBulle == 'line'">
          Ce graphique indique l'évolution du prix au m² pour le type de biens
          sélectionné et l'échelle sélectionnée. Les prix au m² sont obtenus en
          divisant la valeur foncière du bien par sa surface au sol.
        </div>
        <line-chart></line-chart>
      </div>

      <div class="chart_container" v-if="this.level != 'section' && this.level != 'parcelle'">
        <span class="chart_title">Distribution du prix de vente au m²</span>
        <span class="chart_geo">{{ chartGeoLabel }}</span>
        <div
          class="chart_info_btn bar_chart_info"
          @mouseover="hoveredBulle = 'bar'"
          @mouseleave="hoveredBulle = ''"
        >
          <div>?</div>
        </div>
        <div class="chart_info_bulle" v-if="hoveredBulle == 'bar'">
          Ce graphique montre la répartition des prix des ventes à l'échelle
          sélectionnée, pour le type de biens sélectionné. En survolant chaque
          barre, vous pouvez voir combien de ventes se sont faites à un montant
          compris dans la tranche de prix affichée.
        </div>
        <bar-chart></bar-chart>
      </div>
      <br />
    </div>

    <div
      class="links_container"
      v-if="level != 'fra'"
      :data-open="openLinks ? 'open' : ''"
    >
      <div class="links_title" @click="toggleLinks()">
        Liens utiles
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.99999 2.21917L1.69999 5.51916L0.757324 4.5765L4.99999 0.333832L9.24266 4.5765L8.29999 5.51916L4.99999 2.21917Z"
            fill="#161616"
          />
        </svg>
      </div>
      <div class="cardPartner" @click="goToPartner('arcep')">
        <div class="textPartner">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z"
              fill="#3558A2"
            />
          </svg>
          Voir la couverture réseaux sur maconnexioninternet.arcep.fr
        </div>
      </div>
      <div
        class="cardPartner"
        @click="goToPartner('brgm')"
        v-if="this.userLocation.level != 'departement'"
      >
        <div class="textPartner">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z"
              fill="#3558A2"
            />
          </svg>
          Voir les risques sur georisques.gouv.fr
        </div>
      </div>
      <div class="cardPartner" @click="goToPartner('acceslibre')" v-if="userLocation && userLocation.comName">
        <div class="textPartner">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z"
              fill="#3558A2"
            />
          </svg>
          Voir l’accessibilité sur acceslibre.beta.gouv.fr
        </div>
      </div>
      <div class="cardPartner" @click="goToPartner('ign')">
        <div class="textPartner">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z"
              fill="#3558A2"
            />
          </svg>
          Voir les informations d’urbanisme sur geoportail-urbanisme.gouv.fr
        </div>
        </div>
        <div
          class="cardPartner"
          @click="goToPartner('dynmark')"
          v-if="
            this.userLocation.level == 'commune' ||
            this.userLocation.level == 'departement'
          "
        >
          <div class="textPartner">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z"
                fill="#3558A2"
              />
            </svg>
            Voir les indicateurs de prix de l’immobilier du Cerema sur
            l’application Dynmark
          </div>
      </div>
    </div>
      <div
        class="links_container"
        v-if="level != 'fra' && parcellesDpeNb > 0"
        :data-open="openDpe ? 'open' : ''"
      >
        <div class="links_title" @click="toggleDpe()">
          Diagnostics de Performance Energétique (DPE)
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.99999 2.21917L1.69999 5.51916L0.757324 4.5765L4.99999 0.333832L9.24266 4.5765L8.29999 5.51916L4.99999 2.21917Z"
              fill="#161616"
            />
          </svg>
        </div>
        <div class="content-dpe">
          <span v-if="parcellesDpeNb > 1">
            Il semble qu'il y ait plusieurs bâtiments sur cette parcelle. Il y a
            donc plusieurs résultats DPE.<br />
          </span>
          <div
            v-for="item in parcellesDpe"
            v-bind:key="item['batiment_groupe_id']"
          >
            <span v-if="item['classe_bilan_dpe'] != null">
              <div class="etiquette-dpe">
                <div>
                  <span v-if="item['classe_bilan_dpe'] == 'A'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-a">
                      A
                    </div>
                  </span>
                  <span v-if="item['classe_bilan_dpe'] == 'B'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-b">
                      B
                    </div>
                  </span>
                  <span v-if="item['classe_bilan_dpe'] == 'C'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-c">
                      C
                    </div>
                  </span>
                  <span v-if="item['classe_bilan_dpe'] == 'D'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-d">
                      D
                    </div>
                  </span>
                  <span v-if="item['classe_bilan_dpe'] == 'E'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-e">
                      E
                    </div>
                  </span>
                  <span v-if="item['classe_bilan_dpe'] == 'F'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-f">
                      F
                    </div>
                  </span>
                  <span v-if="item['classe_bilan_dpe'] == 'G'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-g">
                      G
                    </div>
                  </span>
                </div>
                <div class="title-etiquette"><b>Consommation d'énergie</b></div>
              </div>
              <div class="etiquette-dpe">
                <div>
                  <span v-if="item['classe_emission_ges'] == 'A'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-a">
                      A
                    </div>
                  </span>
                  <span v-if="item['classe_emission_ges'] == 'B'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-b">
                      B
                    </div>
                  </span>
                  <span v-if="item['classe_emission_ges'] == 'C'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-c">
                      C
                    </div>
                  </span>
                  <span v-if="item['classe_emission_ges'] == 'D'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-d">
                      D
                    </div>
                  </span>
                  <span v-if="item['classe_emission_ges'] == 'E'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-e">
                      E
                    </div>
                  </span>
                  <span v-if="item['classe_emission_ges'] == 'F'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-f">
                      F
                    </div>
                  </span>
                  <span v-if="item['classe_emission_ges'] == 'G'">
                    <div _ngcontent-lto-c101="" class="dpe-tag dpe-color-g">
                      G
                    </div>
                  </span>
                </div>
                <div class="title-etiquette">
                  <b>Emission de gaz à effet de serre</b>
                </div>
              </div>
              <div v-if="item['periode_construction_dpe'] != null">
                Période de construction :
                <b>{{ item["periode_construction_dpe"] }}</b>
              </div>
              <div v-if="item['nombre_niveau_immeuble'] != null">
                Immeuble sur <b>{{ item["nombre_niveau_immeuble"] }}</b> niveaux
              </div>
              <div v-if="item['surface_habitable_immeuble'] != null">
                Immeuble d'une superficie de
                <b>{{ item["surface_habitable_immeuble"] }}</b> m2
              </div>
            </span>
            <div class="one-dpe"></div>
          </div>
          <div class="textPartner dpe-final" @click="goToPartner('cstb')">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z"
                fill="#3558A2"
              /></svg
            >Voir des infos complémentaires autour de la rénovation
          </div>
          <div>
            Sources :
            <span class="textPartner" @click="goToPartner('bdnb')">BDNB</span>
          </div>
        </div>
      </div>

      <div
        class="links_container"
        v-if="level != 'fra' && parcellesCoproNb > 0"
        :data-open="openCopro ? 'open' : ''"
      >
        <div class="links_title" @click="toggleCopro()">
          Informations sur la Copropriété
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.99999 2.21917L1.69999 5.51916L0.757324 4.5765L4.99999 0.333832L9.24266 4.5765L8.29999 5.51916L4.99999 2.21917Z"
              fill="#161616"
            />
          </svg>
        </div>
        <div class="content-copro">
          <span v-if="parcellesCoproNb > 1">
            Il semble qu'il y ait plusieurs copropriétés référencés sur cette
            parcelle.
          </span>
          <div
            v-for="item in parcellesCopro"
            v-bind:key="item['numero_immatriculation']"
          >
            <div
              v-if="
                item['syndicat_principal_ou_secondaire'] != null &&
                parcellesCoproNb > 1
              "
            >
              Syndicat principal :
              <b>{{ item["syndicat_principal_ou_secondaire"] }}</b>
            </div>
            <div v-if="item['syndicat_cooperatif'] != null">
              Syndicat coopératif : <b>{{ item["syndicat_cooperatif"] }}</b>
            </div>
            <div v-if="item['identification_representant_legal'] != null">
              Représentant légal :
              <span
                class="textPartner dpe-final"
                v-if="item['siret_representant_legal'] != null"
                @click="
                  goToPartner('annuaire', item['siret_representant_legal'])
                "
              >
                {{ item["identification_representant_legal"] }}
              </span>
              <span v-else>
                <b>{{ item["identification_representant_legal"] }}</b>
              </span>
            </div>
            <div v-if="item['nom_usage_copropriete'] != null">
              Nom d'usage de la copropriété :
              <b>{{ item["nom_usage_copropriete"] }}</b>
            </div>
            <div v-if="item['numero_immatriculation'] != null">
              Numéro d'immatriculation de la copropriété :
              <b>{{ item["numero_immatriculation"] }}</b>
            </div>
            <div v-if="item['nombre_total_lots'] != null">
              Nombre total de lots : <b>{{ item["nombre_total_lots"] }}</b>
            </div>
            <div v-if="item['nombre_lots_usage_habitation'] != null">
              Nombre de lots à usage d'habitation :
              <b>{{ item["nombre_lots_usage_habitation"] }}</b>
            </div>
            <div v-if="item['nombre_lots_stationnement'] != null">
              Nombre de lots de stationnement :
              <b>{{ item["nombre_lots_stationnement"] }}</b>
            </div>
            <div v-if="item['mandat_en_cours_copropriete'] != null">
              Mandat sur la propriété :
              <b>{{ item["mandat_en_cours_copropriete"] }}</b>
            </div>
            <div
              v-if="item['nombre_arretes_code_sante_publique_en_cours'] != null"
            >
              Arrêtés relevant du code de la santé publique en cours :
              <b>{{ item["nombre_arretes_code_sante_publique_en_cours"] }}</b>
            </div>
            <div
              v-if="
                item['nombre_arretes_peril_parties_communes_en_cours'] != null
              "
            >
              Arrêtés de péril sur les parties communes en cours :
              <b>{{
                item["nombre_arretes_peril_parties_communes_en_cours"]
              }}</b>
            </div>
            <div
              v-if="item['nombre_arretes_equipements_communs_en_cours'] != null"
            >
              Arrêtés sur les équipements communs en cours :
              <b>{{ item["nombre_arretes_equipements_communs_en_cours"] }}</b>
            </div>
            <div class="one-copro"></div>
          </div>
          <div class="textPartner dpe-final" @click="goToPartner('anah')">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z"
                fill="#3558A2"
              /></svg
            >Consulter l'annuaire des copropriétés
          </div>
          <div>
            Sources :
            <span class="textPartner" @click="goToPartner('copro')"
              >Registre d'Immatriculation des Copropriétés</span
            >
          </div>
        </div>
      </div>


    <div class="chart_container" v-if="this.level == 'section'">
      <div class="cta-parcelle">Sélectionnez une parcelle</div>
    </div>
    

    <div class="mutations_container" v-if="level === 'parcelle'">
      <div class="title_mutations">Liste des mutations immobilières</div>
      <div class="mutations_total" v-if="parcellesMutations && Object.keys(parcellesMutations).length">
        {{ Object.keys(parcellesMutations).length }} mutations
      </div>
      <div
        class="mutation_box"
        v-bind:key="p['id']"
        v-for="p in parcellesMutations"
      >
        <div class="content">
          <div class="nature">{{ p["nature_mutation"] }}</div>
          <span class="price">{{ p["price"] }}</span>
          <div class="infos">
            <span class="topinfo adresse" v-if="p['adresse_nom_voie'] != null">
              <img src="../assets/images/pin.svg" />
              {{ p["adresse_numero"] }}
              {{ p["adresse_nom_voie"].toLowerCase() }}
            </span>
            <span class="topinfo id" v-if="p['id'] != null"
              ><img src="../assets/images/id.svg" /> {{ p["id"] }}</span
            >
            <span class="topinfo date" v-if="p['date'] != null"
              ><img src="../assets/images/date.svg" /> {{ p["date"] }}</span
            >

              <span v-for="item in p['assets']" class="infos_item">
                <span class="title" v-if="item['type'] != null">
                  <img
                    v-if="item['type'].substring(0, 4) === 'Dépe'"
                    src="../assets/images/dependance.svg"
                  />
                  <img
                    v-if="item['type'].substring(0, 4) === 'Mais'"
                    src="../assets/images/maison.svg"
                  />
                  <img
                    v-if="item['type'].substring(0, 4) === 'Loca'"
                    src="../assets/images/local.svg"
                  />
                  <img
                    v-if="item['type'].substring(0, 4) === 'Appa'"
                    src="../assets/images/appartement.svg"
                  />
                  <img
                    v-if="
                      item['type'].substring(0, 4) != 'Dépe' &&
                      item['type'].substring(0, 4) != 'Mais' &&
                      item['type'].substring(0, 4) != 'Loca' &&
                      item['type'].substring(0, 4) != 'Appa'
                    "
                    src="../assets/images/terrain.svg"
                  />
                  {{ item["type"] }}
                </span>
                <div class="filet" v-if="item['surface']"></div>
                <span class="value" v-if="item['surface'] != null">{{
                  item["surface"]
                }}</span>
              </span>

              <span
                class="complInfo"
                v-if="
                  parcellesAdjacentes &&
                  parcellesAdjacentes.hasOwnProperty(p['id']) &&
                  parcellesAdjacentes[p['id']].length != 0
                "
              >
                Cette vente s'est effectuée sur plusieurs parcelles.<br />
                Liste des parcelles complémentaires :<br />
                {{ parcellesAdjacentes[p["id"]].join(", ") }}
              </span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import appStore from "@/apps/dvf/store";
import LineChart from "@/apps/dvf/components/LineChart";
import BarChart from "@/apps/dvf/components/BarChart";
import CenterDeps from "@/apps/dvf/assets/json/centers_deps.json";

export default {
  name: "LeftCol",
  components: { LineChart, BarChart },
  data() {
    return {
      apiLevel: null,
      apiResult: null,
      apiCode: null,
      clientData: {
        totalVentes: 0,
        totalAverage: 0,
        appVentes: 0,
        appPrice: 0,
        houseVentes: 0,
        housePrice: 0,
        localVentes: 0,
        localPrice: 0,
      },
      rollingData: {
        nb_ventes_appartement: 0,
        nb_ventes_local: 0,
        nb_ventes_maison: 0,
        med_prix_m2_whole_appartement: 0,
        med_prix_m2_whole_local: 0,
        med_prix_m2_whole_maison: 0,
      },
      parcellesMutations: null,
      parcellesCopro: null,
      parcellesCoproNb: null,
      parcellesDpe: null,
      parcellesDpeNb: 0,
      parcellesDpeId: null,
      leftColOpening: "semiopen",
      hoveredInfo: "",
      hoveredBulle: "",
      openLinks: false,
      openDpe: false,
      openCopro: false,
      nodata: false,
    };
  },
  computed: {
    leftColOpen: function () {
      return appStore.state.leftColOpen;
    },
    parcellesAdjacentes: function () {
      return appStore.state.parcellesAdjacentes;
    },
    saveApiUrl: function () {
      return appStore.state.saveApiUrl;
    },
    saveApiResponse: function () {
      return appStore.state.saveApiResponse;
    },
    zoomLevel: function () {
      return appStore.state.map.zoomLevel;
    },
    dep: function () {
      return appStore.state.userLocation.dep;
    },
    com: function () {
      return appStore.state.userLocation.com;
    },
    section: function () {
      return appStore.state.userLocation.section;
    },
    parcelle: function () {
      return appStore.state.userLocation.parcelle;
    },
    level: function () {
      return appStore.state.userLocation.level;
    },
    depLabel: function () {
      return appStore.state.locationLabels.dep;
    },
    comLabel: function () {
      return appStore.state.locationLabels.com;
    },
    activeFilter: function () {
      return appStore.state.activeFilter;
    },
    userLocation: function () {
      return appStore.state.userLocation;
    },
    mapProperties: function () {
      return appStore.state.mapProperties;
    },
    chartGeoLabel: function () {
      var label = this.getGeoLabel();
      return label;
    },
  },
  mounted() {
    let url = process.env.VUE_APP_DVF_API + "/nation/mois";
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.sendApiResultToStore(url, data);
        this.apiResult = data;
        this.apiLevel = "nation";
        if (this.$route.query.filtre) {
          if (this.$route.query.filtre != this.activeFilter) {
            this.updateActiveFilter(this.$route.query.filtre);
          }
        } else {
          this.updateActiveFilter("tous");
        }
      });
  },
  methods: {
    toggleSidebar() {
      appStore.commit("updateLeftColOpen");
    },
    fetchHistoricalData(level) {
      if (level != "parcelle") {
        let url = null;
        let code = null;
        let data = null;
        if (level == "fra") {
          code = "nation";
          url = process.env.VUE_APP_DVF_API + "/nation/mois";
        }
        if (level === "departement") {
          code = this.dep;
          url = process.env.VUE_APP_DVF_API + "/departement/" + code;
        }
        if (level === "commune") {
          code = this.com;
          url = process.env.VUE_APP_DVF_API + "/commune/" + code;
        }
        if (level === "section") {
          code = this.section;
          url = process.env.VUE_APP_DVF_API + "/section/" + code;
        }
        if (this.saveApiUrl.includes(url)) {
          data = this.saveApiResponse[url];
          if (data) {
            this.sendApiResultToStore(url, data);
            this.apiResult = data;
            this.apiLevel = level;
            this.apiCode = code;
          }
        } else {
          if (url) {
            fetch(url)
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                this.sendApiResultToStore(url, data);
                this.apiResult = data;
                this.apiLevel = level;
                this.apiCode = code;
              });
          }
        }
      }
    },
    storeApiData() {
      appStore.commit("updateApiData", this.apiResult);
      appStore.commit("updateApiLevel", this.apiLevel);
      appStore.commit("updateApiCode", this.apiCode);
    },
    buildClientData() {
      var url;
      if (this.apiLevel == "commune") {
        url =
          process.env.VUE_APP_DVF_API +
          "/departement/" +
          this.dep +
          "/communes";
      } else if (this.apiLevel == "section") {
        url =
          process.env.VUE_APP_DVF_API + "/commune/" + this.com + "/sections";
      } else if (this.apiLevel == "fra") {
        url = process.env.VUE_APP_DVF_API + "/nation";
      } else {
        url = process.env.VUE_APP_DVF_API + "/" + this.apiLevel;
      }
      if (this.saveApiUrl.includes(url)) {
        this.manageClientData(this.saveApiResponse[url]);
      } else {
        fetch(url)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.sendApiResultToStore(url, data);
            this.manageClientData(data);
          });
      }
    },
    exceptNullValue(val){
      if (val) {
        return val.toLocaleString()
      } else {
        return null
      }
    },

    manageClientData(data) {
      var levelData;
        if (
          this.apiLevel == "nation" || (
            this.apiCode &&
            this.apiCode != 57 &&
            this.apiCode != 67 &&
            this.apiCode != 68 &&
            this.apiCode.slice(0, 2) != 57 &&
            this.apiCode.slice(0, 2) != 67 &&
            this.apiCode.slice(0, 2) != 68
          )
        ) {
          this.nodata = false;
          if (this.apiLevel == "nation") {
            levelData = data["data"][0];
          } else {
            levelData = data["data"].find((obj) => {
              return obj.c === this.apiCode;
            });
          }
          if (levelData) {
          if (this.activeFilter === "tous") {
            this.clientData.totalVentes = this.exceptNullValue(levelData["am"])
            this.clientData.totalAverage = this.exceptNullValue(Math.round(levelData["m_am"])) + "€";
          } else if (this.activeFilter === "maison") {
            this.clientData.totalVentes = this.exceptNullValue(levelData["m"]);
            this.clientData.totalAverage = this.exceptNullValue(Math.round(levelData["m_m"])) + "€";
          } else if (this.activeFilter === "appartement") {
            this.clientData.totalVentes = this.exceptNullValue(levelData["a"]);
            this.clientData.totalAverage = this.exceptNullValue(Math.round(levelData["m_a"])) + "€";
          } else if (this.activeFilter === "local") {
            this.clientData.totalVentes = this.exceptNullValue(levelData["l"]);
            this.clientData.totalAverage = this.exceptNullValue(Math.round(levelData["m_l"])) + "€";
          }
          this.clientData.appVentes =
            this.exceptNullValue(levelData["a"])

          if (levelData["m_a"] === null) {
            this.clientData.appPrice = "indisponible";
          } else {
            this.clientData.appPrice =
              this.exceptNullValue(Math.round(
                levelData["m_a"]
              )) + "€";
          }

          this.clientData.houseVentes =
            this.exceptNullValue(levelData["m"]);

          if (levelData["m_m"] === null) {
            this.clientData.housePrice = "indisponible";
          } else {
            this.clientData.housePrice =
              this.exceptNullValue(Math.round(
                levelData["m_m"]
              )) + "€";
          }

          this.clientData.localVentes =
            this.exceptNullValue(levelData["l"]);

          if (levelData["m_l"] === null) {
            this.clientData.localPrice = "indisponible";
          } else {
            this.clientData.localPrice =
              this.exceptNullValue(Math.round(
                levelData["m_l"]
              )) + "€";
          }
        }
        } else {
          this.nodata = true;
        }
    },
    manageCoproDpeData(data) {
      if (data) {
        //this.parcellesDpe = data[]
        this.parcellesDpe = data["data"]["dpe"];
        let cpt = 0;
        this.parcellesDpe.forEach((obj) => {
          if (obj.classe_bilan_dpe != null) {
            cpt = cpt + 1;
            this.parcellesDpeId = obj.batiment_groupe_id;
          }
        });
        this.parcellesDpeNb = cpt;
        this.parcellesCopro = data["data"]["copro"];
        cpt = 0;
        this.parcellesCopro.forEach((obj) => {
          cpt = cpt + 1;
        });
        this.parcellesCoproNb = cpt;
      }
    },
    manageMutationsData(data) {
      if (data) {
        let mutationsId = [];
        let mutationsParcelles = {};
        let mutationsObj = {};
        this.parcellesMutations = [];
        data["data"].forEach((obj) => {
          if (obj.id_parcelle == this.userLocation.parcelle) {
            if (!mutationsId.includes(obj.id_mutation)) {
              mutationsId.push(obj.id_mutation);
              mutationsObj[obj.id_mutation] = {};
              mutationsObj[obj.id_mutation]["id"] = obj.id_mutation;
              mutationsObj[obj.id_mutation]["nature_mutation"] =
                obj.nature_mutation;
              mutationsObj[obj.id_mutation]["adresse_nom_voie"] =
                obj.adresse_nom_voie;
              mutationsObj[obj.id_mutation]["adresse_numero"] =
                obj.adresse_numero;
              mutationsObj[obj.id_mutation]["date"] = this.formatDate(
                obj.date_mutation
              );
              mutationsObj[obj.id_mutation]["price"] = this.formatPrice(
                obj.valeur_fonciere
              );
              mutationsObj[obj.id_mutation]["assets"] = [];
            }
            if (obj.type_local) {
              let asset = {};
              let complement_type = "";
              if (obj.nombre_pieces_principales) {
                complement_type = " / " + obj.nombre_pieces_principales + "p";
              }
              asset["type"] = obj.type_local + complement_type;
              asset["surface"] = this.formatSurface(obj.surface_reelle_bati);
              mutationsObj[obj.id_mutation]["assets"].push(asset);
            }
            if (obj.nature_culture) {
              let asset = {};
              asset["type"] = obj.nature_culture;
              asset["surface"] = this.formatSurface(obj.surface_terrain);
              mutationsObj[obj.id_mutation]["assets"].push(asset);
            }
            mutationsObj[obj.id_mutation]["assets"] = mutationsObj[
              obj.id_mutation
            ]["assets"].reduce((unique, o) => {
              if (
                !unique.some(
                  (subobj) =>
                    subobj.type === o.type && subobj.surface === o.surface
                )
              ) {
                unique.push(o);
              }
              return unique;
            }, []);
            let sorter = (a, b) => {
              if (a.type.includes("Appartement")) {
                return -1;
              }
              if (b.type.includes("Appartement")) {
                return 1;
              }
              return a.name < b.name ? -1 : 1;
            };
            mutationsObj[obj.id_mutation]["assets"].sort(sorter);
            sorter = (a, b) => {
              if (a.type.includes("Maison")) {
                return -1;
              }
              if (b.type.includes("Maison")) {
                return 1;
              }
              return a.name < b.name ? -1 : 1;
            };
            mutationsObj[obj.id_mutation]["assets"].sort(sorter);
            this.parcellesMutations = mutationsObj;
          }
        });
        data["data"].forEach((obj) => {
          if (mutationsId.includes(obj.id_mutation)) {
            if (!mutationsParcelles.hasOwnProperty(obj.id_mutation)) {
              mutationsParcelles[obj.id_mutation] = [];
            }
            if (
              !mutationsParcelles[obj.id_mutation].includes(obj.id_parcelle) &&
              obj.id_parcelle != this.userLocation.parcelle
            ) {
              mutationsParcelles[obj.id_mutation].push(obj.id_parcelle);
            }
          }
        });
        appStore.commit("changeParcellesAdjacentes", mutationsParcelles);
      }
    },
    fetchDpeCoproData() {
      if (this.userLocation.parcelle) {
        var self = this;
        let data = null;
        var url =
          process.env.VUE_APP_DVF_API +
          "/dpe-copro/" +
          this.userLocation.parcelle;
        if (this.saveApiUrl.includes(url)) {
          data = this.saveApiResponse[url];
          this.manageCoproDpeData(data);
        } else {
          fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              this.sendApiResultToStore(url, data);
              this.manageCoproDpeData(data);
            });
        }
      }
    },
    fetchMutationsData() {
      if (this.userLocation.parcelle) {
        var self = this;
        let data = null;
        var url =
          process.env.VUE_APP_DVF_API +
          "/mutations/" +
          this.userLocation.parcelle.substring(0, 5) +
          "/" +
          this.userLocation.parcelle.substring(5, 10);
        if (this.saveApiUrl.includes(url)) {
          data = this.saveApiResponse[url];
          this.manageMutationsData(data);
        } else {
          fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              this.sendApiResultToStore(url, data);
              this.manageMutationsData(data);
            });
        }
      }
    },

    updateActiveFilter(f) {
      appStore.commit("updateActiveFilter", f);
      this.$router
        .push({
          path: this.$route.path,
          query: { ...this.$route.query, filtre: f },
        })
        .catch(() => {});
    },

    formatDate(date) {
      var d = new Date(date);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return d.toLocaleDateString("fr-Fr", options);
    },

    formatPrice(price) {
      if (price) {
        var p = parseInt(price).toLocaleString() + " €";
        return p;
      } else {
        return "Non renseigné";
      }
    },

    formatSurface(surface) {
      if (surface) {
        var s = parseInt(surface).toLocaleString() + " m²";
        return s;
      } else {
        return null;
      }
    },

    sendApiResultToStore(url, data) {
      let obj = {};
      obj.url = url;
      obj.data = data;
      appStore.commit("addApiResult", obj);
    },
    goToPartner(partner, compl) {
      if (partner == "cstb") {
        window.open(
          "https://particulier.gorenove.fr/map?bnb_id=" + this.parcellesDpeId
        );
      }
      if (partner == "copro") {
        window.open(
          "https://www.data.gouv.fr/fr/datasets/registre-national-dimmatriculation-des-coproprietes/"
        );
      }
      if (partner == "anah") {
        window.open("https://www.registre-coproprietes.gouv.fr/annuaire");
      }
      if (partner == "annuaire") {
        window.open(
          "https://annuaire-entreprises.data.gouv.fr/etablissement/" + compl
        );
      }
      if (partner == "bdnb") {
        window.open(
          "https://www.data.gouv.fr/fr/datasets/base-de-donnees-nationale-des-batiments/"
        );
      }
      if (this.userLocation.level == "departement") {
        if (partner == "arcep") {
          window.open(
            "https://maconnexioninternet.arcep.fr/?lat=" +
              CenterDeps[this.userLocation.dep]["coordinates"][1] +
              "&lng=" +
              CenterDeps[this.userLocation.dep]["coordinates"][0] +
              "&zoom=" +
              this.mapProperties.zoomLevel +
              "&mode=normal"
          );
        }
        if (partner == "acceslibre") {
          window.open(
            "https://acceslibre.beta.gouv.fr/recherche/?what=&where=" +
              this.userLocation.depName +
              "&lat=" +
              CenterDeps[this.userLocation.dep]["coordinates"][1] +
              "&lon=" +
              CenterDeps[this.userLocation.dep]["coordinates"][0] +
              "&code=" +
              this.userLocation.dep +
              "&search_type=municipality"
          );
        }
        if (partner == "ign") {
          window.open(
            "https://www.geoportail-urbanisme.gouv.fr/map/#tile=1&zoom=" +
              this.mapProperties.zoomLevel +
              "&lon=" +
              CenterDeps[this.userLocation.dep]["coordinates"][0] +
              "&lat=" +
              CenterDeps[this.userLocation.dep]["coordinates"][1]
          );
        }
      } else {
        let com = this.userLocation.com
        if (com && com.startsWith("751")) {
          com = "75056"
        }
        if (com && com.startsWith("693")) {
          com = "69123"
        }
        if (com && com.startsWith("132")) {
          com = "13055"
        }
        let url =
          "https://geo.api.gouv.fr/communes?code=" +
          com +
          "&fields=centre";
        fetch(url)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (partner == "arcep") {
              window.open(
                "https://maconnexioninternet.arcep.fr/?lat=" +
                  data[0]["centre"]["coordinates"][1] +
                  "&lng=" +
                  data[0]["centre"]["coordinates"][0] +
                  "&zoom=" +
                  this.mapProperties.zoomLevel +
                  "&mode=normal"
              );
            }
            if (partner == "brgm") {
              window.open(
                "https://www.georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi/rapport2?form-adresse=true&isCadastre=false&city=" +
                  this.userLocation.comName +
                  "&type=housenumber&typeForm=commune&codeInsee=" +
                  this.userLocation.com +
                  "&lon=" +
                  data[0]["centre"]["coordinates"][0] +
                  "&lat=" +
                  data[0]["centre"]["coordinates"][1] +
                  "&go_back=%2F"
              );
            }
            if (partner == "acceslibre") {
              window.open(
                "https://acceslibre.beta.gouv.fr/recherche/?what=&where=" +
                  this.userLocation.comName + " (" + this.userLocation.dep + ")" +
                  "&lat=" +
                  data[0]["centre"]["coordinates"][1] +
                  "&lon=" +
                  data[0]["centre"]["coordinates"][0] +
                  "&code=" +
                  this.userLocation.com +
                  "&search_type=municipality"
              );
            }
            if (partner == "ign") {
              window.open(
                "https://www.geoportail-urbanisme.gouv.fr/map/#tile=1&zoom=" +
                  this.mapProperties.zoomLevel +
                  "&lon=" +
                  data[0]["centre"]["coordinates"][0] +
                  "&lat=" +
                  data[0]["centre"]["coordinates"][1] +
                  "&mlon=" +
                  data[0]["centre"]["coordinates"][0] +
                  "&mlat=" +
                  data[0]["centre"]["coordinates"][1]
              );
            }
            if (partner == "dynmark") {
              if (this.userLocation.level == "commune") {
                window.open(
                  "https://dataviz.cerema.fr/dynmark/?perimetre=comm&codeinsee=" +
                    this.userLocation.com
                );
              } else if (this.userLocation.level == "departement") {
                window.open(
                  "https://dataviz.cerema.fr/dynmark/?perimetre=dep&codeinsee=" +
                    this.userLocation.dep
                );
              }
            }
          });
      }
    },
    getGeoLabel() {
      var label = "";

      if (this.level === "fra") {
        label = "";
      } else if (this.level === "departement") {
        label = " (" + this.userLocation.depName + ")";
      } else if (this.level === "commune") {
        label = " (" + this.userLocation.comName + ")";
      } else if (this.level === "section") {
        label = " (" + this.userLocation.section + ")";
      } else if (this.level === "parcelle") {
        label = " (" + this.userLocation.parcelle + ")";
      }

      return label;
    },

    getMutationPicto() {
      return "../assets/images/appartement.svg";
    },

    changeLeftColOpening() {
      if (this.leftColOpening == "close" || this.leftColOpening == "semiopen") {
        this.leftColOpening = "open";
      } else {
        this.leftColOpening = "close";
      }
    },

    toggleLinks() {
      if (this.openLinks == false) {
        this.openLinks = true;
        this.openDpe = false;
        this.openCopro = false;
      } else {
        this.openLinks = false;
      }
    },

    toggleDpe() {
      if (this.openDpe == false) {
        this.openDpe = true;
        this.openLinks = false;
        this.openCopro = false;
      } else {
        this.openDpe = false;
      }
    },

    toggleCopro() {
      if (this.openCopro == false) {
        this.openCopro = true;
        this.openLinks = false;
        this.openDpe = false;
      } else {
        this.openCopro = false;
      }
    },
  },
  watch: {
    level() {
      this.fetchHistoricalData(this.level);
      if (this.leftColOpening == "close") {
        this.leftColOpening = "semiopen";
      }
    },
    dep() {
      this.fetchHistoricalData(this.level);
    },
    com() {
      this.fetchHistoricalData(this.level);
    },
    section() {
      this.fetchHistoricalData(this.level);
    },
    parcelle() {
      this.openLinks = false;
      this.openDpe = false;
      this.openCopro = false;
      this.parcellesMutations = null;
      this.parcellesCopro = null;
      this.parcellesCoproNb = 0;
      this.parcellesDpe = null;
      this.parcellesDpeId = null;
      this.parcellesDpeNb = 0;
      this.fetchMutationsData(this.parcelle);
      this.fetchDpeCoproData(this.parcelle);
    },
    apiResult() {
      this.buildClientData();
      this.storeApiData();
    },
    activeFilter() {
      this.buildClientData();
    },
  },
};
</script>

<style scoped>
.leftCol {
  position: relative;
  display: inline-block;
  float: left;
  padding-left: 20px;
  padding-right: 20px;
  height: 100%;
  overflow: scroll;
  width: 30%;
}

.leftColOpener {
  display: none;
}

.header_container {
  padding-bottom: 10px;
}

.intro_title {
  font-size: 28px;
  line-height: 38px;
  margin-bottom: 5px;
  margin-top: 10px;
}

.intro_text {
  font-size: 14px;
  line-height: 24px;
}

.ariane_container {
  width: 100%;
  margin-top: 20px;
}

.ariane_container div {
  display: inline-block;
  font-size: 12px;
  color: #666666;
}

.ariane_container div span {
  text-decoration: underline;
}

.ariane_container div:before {
  content: ">";
  margin: 0 5px 0 5px;
  text-decoration: none;
}

.ariane_container div:first-child:before {
  display: none;
}

.location_container {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
}

.location_title {
  font-weight: 700;
  font-size: 12px;
  color: #3a3a3a;
}

.location_label {
  font-weight: 800;
  font-size: 28px;
  color: #161616;
}

.global_numbers_container {
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
  border-top: 1px solid #e5e5e5;
}

.global_number_wrapper {
  width: 50%;
  display: inline-block;
  position: relative;
}

.global_number_title {
  font-weight: 700;
  font-size: 12px;
  color: #3a3a3a;
  line-height: 16px;
  position: relative;
}

.global_number_title .info_btn {
  display: inline-block;
  margin-left: 5px;
  position: relative;
  top: 0px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #e6eefe;
  cursor: pointer;
  padding-left: 4px;
}

.info_bulle {
  position: absolute;
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  background-color: white;
  left: 50%;
  top: 18px;
  transform: translate(-50%, 0);
  padding: 10px;
  line-height: 16px;
  border-radius: 5px;
  display: block;
  z-index: 999;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.16),
    0px 1px 0px -2px rgba(0, 0, 0, 0.16), 0px 1px 4px rgba(0, 0, 0, 0.23);
}

.global_number_value {
  font-weight: 800;
  font-size: 24px;
  color: #161616;
}

.tab_container {
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}

.tab_container table {
  width: 100%;
  text-align: center;
  margin: 0 auto;
}

.tab_container table th {
  font-size: 12px;
  font-weight: 400;
}

.tab_container table th svg {
  width: 12px;
  height: 12px;
  transform: translate(0, 1px);
}

.tab_container table th.hide {
  opacity: 0.3;
}

.tab_container table th.left {
  text-align: left;
}

.tab_container table td {
  font-size: 12px;
  font-weight: 700;
}

.tab_container table td.hide {
  opacity: 0.3;
}

.chart_container {
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
  position: relative;
}

.links_container {
  padding-top: 0px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e5e5e5;
  height: 35px;
  overflow: hidden;
  position: relative;
  margin-bottom: 15px;
}

.links_container[data-open="open"] {
  height: auto;
}

.links_title {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 20px;
  position: relative;
  left: 10px;
  cursor: pointer;
}

.links_title svg {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translate(0, -50%) rotate(180deg);
}

.links_container[data-open="open"] .links_title {
  font-weight: 700;
}

.links_container[data-open="open"] .links_title svg {
  transform: translate(0, -50%) rotate(0deg);
}

.chart_title {
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
}

.chart_geo {
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
}

.chart_info_btn {
  display: inline-block;
  margin-left: 5px;
  position: relative;
  top: 3px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #e6eefe;
  cursor: pointer;
}

.chart_info_bulle {
  position: absolute;
  width: 80%;
  font-size: 12px;
  font-weight: 400;
  background-color: white;
  left: 50%;
  top: 50px;
  transform: translate(-50%, 0);
  padding: 10px;
  line-height: 16px;
  border-radius: 5px;
  display: block;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.16),
    0px 1px 0px -2px rgba(0, 0, 0, 0.16), 0px 1px 4px rgba(0, 0, 0, 0.23);
}

.chart_info_btn div {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 700;
}

.mutations_container {
  margin-top: 30px;
}

.title_mutations {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
}

.mutations_total {
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  margin-bottom: 25px;
}

.mutation_box {
  width: 100%;
  /*max-width: 450px;*/
  min-height: 50px;
  margin: 0 auto 35px;
}

.mutation_box .content {
  border: 1px solid #eeeeee;
  padding: 20px;
  position: relative;
}

.mutation_box .content .nature {
  position: absolute;
  top: 0;
  font-size: 12px;
  font-weight: 700;
  color: #666666;
  background-color: white;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  padding: 0 6px 0 6px;
  text-transform: uppercase;
  transform: translate(0, -50%);
}

.mutation_box .content .price {
  font-size: 18px;
  font-weight: 800;
  display: block;
  color: #161616;
}

.mutation_box .content .infos {
  padding: 0 10px 0;
}

.mutation_box .content .topinfo {
  font-size: 12px;
  color: #666666;
  font-weight: 400;
  display: block;
  height: 20px;
}

.mutation_box .content .complInfo {
  font-size: 11px;
  color: #666666;
  font-weight: 400;
  display: block;
}

.mutation_box .content .topinfo img {
  vertical-align: middle;
}

.mutation_box .content .date {
  margin-bottom: 10px;
}

.infos_item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}

.infos_item .title {
  font-size: 12px;
  font-weight: 400;
  color: #161616;
}

.infos_item .title img {
  vertical-align: middle;
}

.infos_item .filet {
  width: auto;
  height: 1px;
  background-color: #eeeeee;
  flex-grow: 10;
  margin-left: 10px;
  margin-right: 10px;
}

.infos_item .value {
  font-size: 12px;
  font-weight: 700;
  color: #161616;
}

.cardPartner {
  padding-bottom: 10px;
  display: flex;
  cursor: pointer;
}

.textPartner {
  color: #3558a2;
  font-size: 12px;
  font-weight: 700;
  line-height: 12px;
  cursor: pointer;
}

.textPartner:hover {
  text-decoration: underline;
}

.dpe-tag {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  width: 64px;
  height: 32px;
  line-height: 32px;
  padding-right: 12px;
  text-align: center;
  clip-path: polygon(0 0, 75% 0, 75% 0, 99% 50%, 75% 99%, 75% 99%, 0 99%);
}

.content-dpe {
  font-size: 12px;
}

.content-copro {
  font-size: 12px;
}

.dpe-final {
  margin-top: 10px;
}

.copro-final {
  margin-top: 10px;
}

.one-dpe {
  margin-left: 40px;
  margin-right: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ebebeb;
}

.one-copro {
  margin-left: 40px;
  margin-right: 40px;
  margin-top: 10px;
  border: 1px solid #ebebeb;
}

.etiquette-dpe {
  display: flex;
  flex-direction: row;
  height: 40px;
}

.title-etiquette {
  margin-left: 15px;
  line-height: 30px;
}

.dpe-color-a {
  background-color: #009c6d;
}
.dpe-color-b {
  background-color: #52b153;
}
.dpe-color-c {
  background-color: #78bd76;
}
.dpe-color-d {
  background-color: #f4e70f;
}
.dpe-color-e {
  background-color: #f0b50f;
}
.dpe-color-f {
  background-color: #eb8235;
}
.dpe-color-g {
  background-color: #d7221f;
}

.cta-parcelle{
  padding: 20px;
  font-size: 14px;
  margin: auto;
  text-align: center;
  border: 1px solid #ebebeb;
}

@media screen and (max-width: 1279px) {
  .leftCol {
    width: 40%;
  }
}

@media screen and (max-width: 767px) {
  .leftCol {
    position: absolute;
    width: 95%;
    left: 50%;
    top: 70%;
    transform: translate(-50%, -40px);
    z-index: 99;
    background-color: white;
    padding-top: 25px;
    padding-bottom: 50px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }

  .leftCol.close {
    top: 100%;
  }

  .leftCol.open {
    top: 10%;
    overflow: scroll;
  }

  .leftCol.semiopen {
    top: 70%;
  }

  .leftColOpener {
    display: block;
    height: 40px;
    position: absolute;
    padding-top: 10px;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100%;
    text-align: center;
  }

  .leftColOpener svg {
    position: relative;
    top: 0;
  }

  .leftCol.open .leftColOpener {
    transform: translate(-50%, 0) rotate(180deg);
  }


}
</style>
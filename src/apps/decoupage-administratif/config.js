export const API_BASE = 'http://localhost:8000';
export const COMMUNE_FIELDS = 'contour,centre,aom,intercommunalites,departement,region,population,codesPostaux,siren';
export const COMMUNE_SEARCH_FIELDS = 'siren,population,codeDepartement';
export const COMMUNE_LIST_FIELDS = 'siren,population,codesPostaux,codeDepartement';
export const GROUPEMENT_FIELDS = 'contour,centre';
export const AOM_FIELDS = 'contour,centre,nbCommunes,codesDepartements,codesRegions';

export const GEOJSON_BASE = process.env.VUE_APP_APIGEO_DATA_BASE || '/apigeo-data';

export function sirenEntrepriseUrl(siren) {
  return `https://annuaire-entreprises.data.gouv.fr/entreprise/${siren}`;
}

export function isSirenField(key) {
  const normalized = String(key).toLowerCase();
  return normalized === 'siren' || normalized === 'nn_siren' || normalized.endsWith('_siren');
}

export const NATIONAL_LAYERS = {
  regions: {
    id: 'regions',
    file: 'regions_1000m.geojson',
    label: 'Régions',
    description: 'Collectivité territoriale de niveau le plus élevé en France métropolitaine et outre-mer, regroupant plusieurs départements.',
  },
  departements: {
    id: 'departements',
    file: 'departements_1000m.geojson',
    label: 'Départements',
    description: 'Collectivité territoriale intermédiaire entre la région et la commune, compétente notamment en action sociale et en routes départementales.',
  },
  aom: {
    id: 'aom',
    file: 'aom_1000m.geojson',
    label: 'AOM',
    description: 'Autorité organisatrice de la mobilité : compétente pour organiser les transports publics sur son territoire (bus, cars, etc.).',
  },
};

export const INTERCO_LAYERS = {
  ca: {
    id: 'ca',
    file: 'intercommunalites_ca_1000m.geojson',
    label: 'CA',
    description: "Communauté d'agglomération : EPCI à fiscalité propre regroupant plusieurs communes autour d'un pôle urbain.",
  },
  cc: {
    id: 'cc',
    file: 'intercommunalites_cc_1000m.geojson',
    label: 'CC',
    description: 'Communauté de communes : EPCI à fiscalité propre regroupant des communes pour exercer des compétences communes.',
  },
  cu: {
    id: 'cu',
    file: 'intercommunalites_cu_1000m.geojson',
    label: 'CU',
    description: "Communauté urbaine : EPCI à fiscalité propre regroupant une agglomération de taille importante.",
  },
  ept: {
    id: 'ept',
    file: 'intercommunalites_ept_1000m.geojson',
    label: 'EPT',
    description: 'Établissement public territorial : structure intercommunale spécifique, notamment en Île-de-France (ex. métropole du Grand Paris).',
  },
  smo: {
    id: 'smo',
    file: 'intercommunalites_smo_1000m.geojson',
    label: 'SMO',
    description: 'Syndicat mixte ouvert : regroupement de collectivités et d\'établissements publics pour exercer des compétences en commun, ouvert à de nouveaux membres.',
  },
  smf: {
    id: 'smf',
    file: 'intercommunalites_smf_1000m.geojson',
    label: 'SMF',
    description: 'Syndicat mixte fermé : regroupement de collectivités pour des compétences communes, dont la composition est figée.',
  },
  sivu: {
    id: 'sivu',
    file: 'intercommunalites_sivu_1000m.geojson',
    label: 'SIVU',
    description: 'Syndicat intercommunal à vocation unique : regroupement de communes pour une seule compétence (eau, assainissement, etc.).',
  },
  sivom: {
    id: 'sivom',
    file: 'intercommunalites_sivom_1000m.geojson',
    label: 'SIVOM',
    description: 'Syndicat intercommunal à vocation multiple : regroupement de communes pour exercer plusieurs compétences liées.',
  },
  petr: {
    id: 'petr',
    file: 'intercommunalites_petr_1000m.geojson',
    label: 'PETR',
    description: 'Pôle d\'équilibre territorial et rural : outil de coopération pour les territoires ruraux et périurbains.',
  },
  metropole: {
    id: 'metropole',
    file: 'intercommunalites_metro_1000m.geojson',
    label: 'Métropole',
    description: 'Établissement public de coopération intercommunale à fiscalité propre regroupant une grande agglomération et ses compétences élargies.',
  },
};

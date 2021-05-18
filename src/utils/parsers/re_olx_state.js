module.exports = function stateParser(state) {
  if (state) {
    state = state.toLowerCase().trim();
  } else {
    return null;
  }

  if (state.includes('doln')) {
    return 'dolnoslaskie';
  } else if (state.includes('śląsk') || state.includes('slask')) {
    return 'slaskie';
  } else if (state.includes('kujaw')) {
    return 'kujawsko-pomorskie';
  } else if (state.includes('lubel')) {
    return 'lubelskie';
  } else if (state.includes('lubu')) {
    return 'lubuskie';
  } else if (state.includes('mazow')) {
    return 'mazowieckie';
  } else if (state.includes('podkar')) {
    return 'podkarpackie';
  } else if (state.includes('podlas')) {
    return 'podlaskie';
  } else if (state.includes('zachod')) {
    return 'zachodniopomorskie';
  } else if (state.includes('pomor')) {
    return 'pomorskie';
  } else if (state.includes('wielko')) {
    return 'wielkopolskie';
  } else if (state.includes('warmi')) {
    return 'warminsko-mazurskie';
  } else if (state.includes('krzysk')) {
    return 'swietokrzyskie';
  } else if (state.includes('dzkie')) {
    return 'lodzkie';
  } else if (state.includes('małopol') || state.includes('malopol')) {
    return 'malopolskie';
  } else if (state.includes('opol')) {
    return 'opolskie';
  } else {
    return null;
  }
};

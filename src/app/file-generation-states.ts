export enum FileGenerationStates {
  LOADING = "Carregando",
  ASSET_NUMBER_CAPTURE = "Obtendo foto da placa de patrimônio",
  REVIEWING_MAIN_PHOTO = "Revisando foto principal da placa de patrimônio",
  REVIEWING_ASSET_NUMBER = "Revisando número de patrimônio",
  ASSET_NUMBER_NOT_FOUND = "Não foi possível obter o número de patrimônio",
  ASSET_NOT_FOUND_ASSET_NUMBER = "Não foi possível encontrar um bem com esse número de patrimônio",
  CANT_ADD_ASSET = "Não foi possível adicionar esse bem",
  PHOTO_CAPTURE = "Obtendo foto do bem",
  REVIEWING_ASSET_PHOTO = "Revisando foto do bem",
  SELECTING_NEXT_ACTION = "Selecionando próxima ação",
}

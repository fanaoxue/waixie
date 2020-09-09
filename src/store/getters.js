const getters = {
  isLoading: state => state.loading.isLoading,
  cityDataArray: state => state.cityData.cityDataArray,
  permission: state => state.permission.data,
  permissionType: state => state.permission.type,
  waybill_information: state => state.buildWaybill.waybill_information,
  write_car_information: state => state.buildWaybill.write_car_information,
  should_pay_freight: state => state.buildWaybill.should_pay_freight,
  chooseOilCardItem: state => state.oilCard.chooseOilCardItem,
  write_receive_information: state =>
    state.buildWaybill.write_receive_information,
};
export default getters;

const QueryBuilder = (filter) => {
  const query = {};

  if (filter.Baseprice) {
    query.Baseprice = {
      $gte: filter.Baseprice.lower,
      $lte: filter.Baseprice.upper,
    };
  }
  if (filter.Ratehourly) {
    query.Ratehourly = {
      $gte: filter.Ratehourly.lower,
      $lte: filter.Ratehourly.upper,
    };
  }

  if (filter.SecurityAmount) {
    query.SecurityAmount = {
      $gte: filter.SecurityAmount.lower,
      $lte: filter.SecurityAmount.upper,
    };
  }

  if (filter.time) {
    query.fromTime = {
      $gte: filter.time.lower,
    };
    query.endTime = {
      $lte: filter.time.upper,
    };
  }

  if (filter.brand) {
    query.Model = filter.brand.Model;
    query.Manufacturer = filter.brand.Manufacturer;
  }

  return query;
};

module.exports = QueryBuilder;

// TODO: Check time information w/ timezones
export async function fetchDataInDateRange(
  startDate: Date,
  endDate: Date,
  dataTypes: string[],
) {
  // TODO: "names" is a bad name for this parameter
  const queryString = `startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&names=${dataTypes.join(",")}`;

  const response = await fetch(`/api/searchDataByDateType?${queryString}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// TODO: Check time information w/ timezones
export async function fetchSingularDataTypeInDateRange(
  startDate: Date,
  endDate: Date,
  data: string,
) {
  // TODO: "names" is a bad name for this parameter
  const queryString = `startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&names=${data}`;

  const response = await fetch(`/api/searchDataByDateType?${queryString}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

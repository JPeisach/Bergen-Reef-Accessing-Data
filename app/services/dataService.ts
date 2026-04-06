// Elements
export async function fetchLatestData(tankName?: string) {
  if (!tankName) {
    tankName = "CoralLab380";
  }

  const response = await fetch(
    `/api/getMostRecentElements?tankName=${tankName}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to get recent elements: ${response.status}`);
  }

  return response.json();
}

// TODO: Check time information w/ timezones
export async function fetchDataInDateRange(
  startDate: Date,
  endDate: Date,
  dataTypes: string[],
  tankName?: string,
) {
  if (!tankName) {
    tankName = "CoralLab380";
  }

  // TODO: "names" is a bad name for this parameter
  const queryString = `startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&names=${dataTypes.join(",")}&tankName=${tankName}`;

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
  tankName?: string,
) {
  if (!tankName) {
    tankName = "CoralLab380";
  }

  // TODO: "names" is a bad name for this parameter
  const queryString = `startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&names=${data}&tankName=${tankName}`;

  const response = await fetch(`/api/searchDataByDateType?${queryString}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

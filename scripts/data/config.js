// CSV parser configuration
// See: https://csv.js.org/parse
module.exports = {
  relax_column_count: true,
  from_line: 4,
  delimiter: ';',
  cast,
  columns: [
    null,
    'buildingId',
    'floor',
    'realEstateNumber',
    'roomId',
    'roomName',
    null,
    null,
    null,
    null,
    'studyPlaces',
    'tables',
    null,
    'adjustableChairs',
    null,
    null,
    null,
    'studyType',
    'quietness',
    'bookable',
    'daylit',
    'powerOutlets',
    'ethernet',
    'stationaryPC',
    null,
    'otherFacilities',
    'whiteBoard',
    'smartBoard',
    'presentationScreen',
    'nearCoffeeMachine',
    'nearPrinter',
    'nearBathroom',
    'claimedByGroup',
    null,
    null,
    null,
    'id'
  ]
}

function cast(value, context) {
  const { column } = context
  switch (column) {
    // conversion to integers
    case 'id':
    case 'studyPlaces':
    case 'tables':
    case 'otherSeats':
    case 'individualStudySeats':
      return parseInt(value, 10)
    // conversion to booleans
    case 'bookable':
    case 'daylit':
    case 'ethernet':
    case 'whiteBoard':
    case 'smartBoard':
    case 'presentationScreen':
    case 'claimedByGroup':
    case 'stationaryPC':
      return maybeDutchBoolean(value)
    case 'nearCoffeeMachine':
    case 'nearPrinter':
    case 'nearBathroom':
      return distanceToBoolean(value)
    // list values
    case 'otherFacilities':
      return getFacilities(value)
    // noise level
    case 'quietness':
      return quietness(value)
    // power outlets
    case 'powerOutlets':
      return powerOutlets(value)
    case 'adjustableChairs':
      return value !== '0'
    case 'studyType':
      return studyType(value)
    default:
      return value
  }
}

function studyType(value) {
  if (value === '1') {
    return 'self'
  } else if (value === '2') {
    return 'group'
  } else {
    return value
  }
}

function distanceToBoolean(value) {
  if (value === '0-25m') {
    return true
  } else if (value === '>25m') {
    return false
  } else {
    return value
  }
}

function maybeDutchBoolean(value) {
  if (value === 'ja') {
    return true
  } else if (value === 'nee') {
    return false
  } else {
    return value
  }
}

function getFacilities(value = '') {
  return !value ? [] : value
    .trim()
    .split(' ')
    .filter(val => !!val)
    .map(val => val.toLowerCase().replace(',', ''))
}

function powerOutlets(value) {
  switch (value) {
    case 'ja (<1 pp)':
    case 'ja (>/= 1 pp)':
      return true
    case 'nee':
      return false
    default:
      return value
  }
}

function quietness(value) {
  switch (value) {
    case 'stil':
      return 'silent'
    case 'rustig':
      return 'quiet'
    case 'rumoerig':
      return 'noisy'
    default:
      return value
  }
}

export const mapDictToOptions = (dict, intl) => {
  return Object.keys(dict).map(value => ({
    value,
    label: typeof dict[value] === 'object' ? intl.formatMessage(dict[value]) : dict[value],
  }))
}

export const mapArrayToOptions = (array, intl) => {
  return array.map(value => ({
    value: typeof value === 'object' ? intl.formatMessage(value) : value,
  }))
}

export const selectValue = (value, props) => {
  const {
    multi,
    values,
    clearable,
    onChange,
  } = props
  const newValues = values.filter(v => v !== value)
  if (values.length === newValues.length) {
    if (multi) {
      onChange([...values, value])
    } else {
      onChange([value])
    }
  } else if (!newValues.length && !clearable) {
    onChange([value])
  } else {
    onChange(newValues)
  }
}

const SELECT_DROPDOWN = 'dropdown'
const SELECT_FILTER_DROPDOWN = 'filterDropdown'
const SELECT_TILE = 'tile'
const SELECT_LIST = 'list'
const SELECT_RATING = 'rating'

export const SELECT_TYPES = {
  [SELECT_DROPDOWN]: SELECT_DROPDOWN,
  [SELECT_FILTER_DROPDOWN]: SELECT_FILTER_DROPDOWN,
  [SELECT_TILE]: SELECT_TILE,
  [SELECT_LIST]: SELECT_LIST,
  [SELECT_RATING]: SELECT_RATING,
}

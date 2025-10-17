
const getDateRangeWitToORFrom = (input) => input.type == "date-range-start" ? `from ${input.value}` : `to ${input.value}`;


export {
    getDateRangeWitToORFrom
}


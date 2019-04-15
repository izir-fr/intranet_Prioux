var weekSearch = (championnatDate) => {
  var date = []
  var weekStartSuperieurWeekEnd = Number(championnatDate.week_start) > Number(championnatDate.week_end)

  if (weekStartSuperieurWeekEnd) {
    for (var i = Number(championnatDate.week_start); i <= 53; i++) {
      date.push({week: i , year: Number(championnatDate.year_start)})
    }
    for (var i = 1; i <= Number(championnatDate.week_end); i++) {
      date.push({week: i , year: Number(championnatDate.year_end)})
    }
  } else {
    for (var i = Number(championnatDate.week_start); i <= Number(championnatDate.week_end); i++) {
      date.push({week: i , year: Number(championnatDate.year_end)})
    }
  }
  return date
}

module.exports = weekSearch

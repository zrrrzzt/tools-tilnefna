module.exports = data => {
  return {
    name: data.Forslagsstiller,
    mobile: data.replyToNumber,
    nomineeName: data.Navn,
    nomineeMobile: data.Mobil,
    replyToNumber: data.replyToNumber
  }
}

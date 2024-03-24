function capitalizeWords (phrase) {
  // Split the phrase into words
  const words = phrase.toLowerCase().split(' ');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words back into a phrase
  return capitalizedWords.join(' ');
}

module.exports = { capitalizeWords };
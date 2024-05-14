const { uniqueUsernameGenerator, Config, adjectives, nouns } = require ('unique-username-generator');

const positiveAdjective = [
    'Adventurous',
    'Ambitious',
    'Amiable',
    'Brave',
    'Bright',
    'Calm',
    'Cheerful',
    'Confident',
    'Courageous',
    'Determined',
    'Energetic',
    'Faithful',
    'Fearless',
    'Gentle',
    'Humble',
    'Intelligent',
    'Optimistic',
    'Spectacular',
    'Thoughtful',
    'Wholesome',
    'Youthful',
    'Strong',



];

const config = {
    dictionaries: [positiveAdjective],
    separator: '',
    style: 'capital',
    randomDigits: 3
}


const generateUsername = ()=>{
   return uniqueUsernameGenerator(config);
}

module.exports =  generateUsername;
